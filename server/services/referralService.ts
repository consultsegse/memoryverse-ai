/**
 * Serviço de Referral - MemoryVerse AI
 * 
 * Programa de indicação para usuários comuns (não-afiliados)
 */

import { getDb } from "../db";
import { referrals, users } from "../../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";

/**
 * Gera código único de referral
 */
function generateReferralCode(userId: number): string {
  const random = Math.random().toString(36).substring(2, 10);
  return `REF-${userId}-${random}`.toUpperCase();
}

/**
 * Obter ou criar código de referral do usuário
 */
export async function getUserReferralCode(userId: number): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verificar se já tem código (buscar qualquer referral deste usuário)
  const [existingReferral] = await db
    .select()
    .from(referrals)
    .where(eq(referrals.referrerId, userId))
    .limit(1);
  
  if (existingReferral) {
    return existingReferral.code;
  }
  
  // Gerar novo código
  return generateReferralCode(userId);
}

/**
 * Processar indicação
 */
export async function processReferral(referralCode: string, referredUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Extrair ID do referenciador do código
  const match = referralCode.match(/REF-(\d+)-/);
  if (!match) {
    throw new Error("Invalid referral code");
  }
  
  const referrerId = parseInt(match[1]);
  
  // Verificar se usuário não está se auto-referenciando
  if (referrerId === referredUserId) {
    throw new Error("Cannot refer yourself");
  }
  
  // Verificar se referenciador existe
  const [referrer] = await db.select().from(users).where(eq(users.id, referrerId));
  if (!referrer) {
    throw new Error("Referrer not found");
  }
  
  // Verificar se já foi referenciado
  const [existing] = await db
    .select()
    .from(referrals)
    .where(eq(referrals.referredUserId, referredUserId));
  
  if (existing) {
    return existing; // Já foi referenciado
  }
  
  // Criar referral
  const [referral] = await db.insert(referrals).values({
    referrerId,
    referredUserId,
    code: referralCode,
    status: "pending",
  });
  
  // Dar bônus imediato: 3 créditos para ambos
  await db
    .update(users)
    .set({ 
      creditsRemaining: sql`${users.creditsRemaining} + 3`,
    })
    .where(eq(users.id, referrerId));
  
  await db
    .update(users)
    .set({ 
      creditsRemaining: sql`${users.creditsRemaining} + 3`,
    })
    .where(eq(users.id, referredUserId));
  
  return referral;
}

/**
 * Completar referral quando indicado faz primeira compra
 */
export async function completeReferral(referredUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Buscar referral pendente
  const [referral] = await db
    .select()
    .from(referrals)
    .where(
      and(
        eq(referrals.referredUserId, referredUserId),
        eq(referrals.status, "pending")
      )
    );
  
  if (!referral) {
    return null; // Não foi referenciado
  }
  
  // Marcar como completo
  await db
    .update(referrals)
    .set({ status: "completed" })
    .where(eq(referrals.id, referral.id));
  
  return referral;
}

/**
 * Recompensar referral após compra
 */
export async function rewardReferral(referredUserId: number, planType: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Buscar referral completo mas não recompensado
  const [referral] = await db
    .select()
    .from(referrals)
    .where(
      and(
        eq(referrals.referredUserId, referredUserId),
        eq(referrals.status, "completed")
      )
    );
  
  if (!referral) {
    return null;
  }
  
  // Definir recompensa baseada no plano
  let rewardType: "credits" | "discount" | "free_month" = "credits";
  let rewardAmount = 10;
  
  if (planType === "pro") {
    rewardType = "free_month";
    rewardAmount = 1;
  } else if (planType === "creator") {
    rewardType = "credits";
    rewardAmount = 20;
  }
  
  // Dar recompensa ao referenciador
  if (rewardType === "credits") {
    await db
      .update(users)
      .set({ 
        creditsRemaining: sql`${users.creditsRemaining} + ${rewardAmount}`,
      })
      .where(eq(users.id, referral.referrerId));
  }
  // TODO: Implementar free_month e discount
  
  // Marcar como recompensado
  await db
    .update(referrals)
    .set({ 
      status: "rewarded",
      rewardType,
      rewardAmount,
      rewardedAt: new Date(),
    })
    .where(eq(referrals.id, referral.id));
  
  return { rewardType, rewardAmount };
}

/**
 * Obter estatísticas de referral do usuário
 */
export async function getReferralStats(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Buscar todos os referrals do usuário
  const referralsData = await db
    .select()
    .from(referrals)
    .where(eq(referrals.referrerId, userId));
  
  const pending = referralsData.filter(r => r.status === "pending").length;
  const completed = referralsData.filter(r => r.status === "completed").length;
  const rewarded = referralsData.filter(r => r.status === "rewarded").length;
  
  const totalCreditsEarned = referralsData
    .filter(r => r.rewardType === "credits")
    .reduce((sum, r) => sum + (r.rewardAmount || 0), 0);
  
  // Calcular próxima recompensa
  let nextReward = null;
  const milestones = [
    { count: 1, reward: "+3 créditos" },
    { count: 3, reward: "+10 créditos" },
    { count: 5, reward: "+1 mês Pro grátis" },
    { count: 10, reward: "+3 meses Pro grátis" },
    { count: 25, reward: "+1 ano Pro grátis" },
  ];
  
  for (const milestone of milestones) {
    if (rewarded < milestone.count) {
      nextReward = {
        remaining: milestone.count - rewarded,
        reward: milestone.reward,
      };
      break;
    }
  }
  
  return {
    code: await getUserReferralCode(userId),
    total: referralsData.length,
    pending,
    completed,
    rewarded,
    totalCreditsEarned,
    nextReward,
    referrals: referralsData,
  };
}

/**
 * Verificar e aplicar bônus por milestones
 */
export async function checkReferralMilestones(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const stats = await getReferralStats(userId);
  
  const milestones = [
    { count: 5, credits: 30, message: "5 indicações bem-sucedidas!" },
    { count: 10, credits: 100, message: "10 indicações bem-sucedidas!" },
    { count: 25, credits: 300, message: "25 indicações bem-sucedidas!" },
    { count: 50, credits: 1000, message: "50 indicações bem-sucedidas!" },
  ];
  
  const appliedBonuses: Array<{ count: number; credits: number }> = [];
  
  for (const milestone of milestones) {
    if (stats.rewarded >= milestone.count) {
      // Verificar se já aplicou este bônus
      // TODO: Criar tabela de milestones aplicados para não duplicar
      
      // Por enquanto, apenas retornar quais bônus são elegíveis
      appliedBonuses.push({
        count: milestone.count,
        credits: milestone.credits,
      });
    }
  }
  
  return appliedBonuses;
}
