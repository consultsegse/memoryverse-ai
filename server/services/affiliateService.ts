/**
 * Serviço de Afiliados - MemoryVerse AI
 * 
 * Gerencia todo o sistema de afiliados, comissões e pagamentos
 */

import { getDb } from "../db";
import { affiliates, affiliateReferrals, affiliateCommissions, users } from "../../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";

/**
 * Gera código único de afiliado
 */
function generateAffiliateCode(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .substring(0, 10);
  
  const random = Math.random().toString(36).substring(2, 8);
  return `${slug}-${random}`.toUpperCase();
}

/**
 * Criar novo afiliado
 */
export async function createAffiliate(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verificar se já é afiliado
  const [existing] = await db.select().from(affiliates).where(eq(affiliates.userId, userId));
  if (existing) {
    return existing;
  }
  
  // Buscar nome do usuário
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) throw new Error("User not found");
  
  // Gerar código único
  let code = generateAffiliateCode(user.name || "user");
  let attempts = 0;
  
  while (attempts < 10) {
    const [existingCode] = await db.select().from(affiliates).where(eq(affiliates.code, code));
    if (!existingCode) break;
    
    code = generateAffiliateCode(user.name || "user");
    attempts++;
  }
  
  // Criar afiliado
  const [affiliate] = await db.insert(affiliates).values({
    userId,
    code,
    status: "active", // Aprovar automaticamente
    tier: "standard",
    commissionRate: 30,
    recurringCommissionRate: 10,
  });
  
  return affiliate;
}

/**
 * Registrar referência de afiliado
 */
export async function trackAffiliateReferral(affiliateCode: string, referredUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Buscar afiliado pelo código
  const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.code, affiliateCode));
  if (!affiliate) {
    throw new Error("Affiliate not found");
  }
  
  if (affiliate.status !== "active") {
    throw new Error("Affiliate is not active");
  }
  
  // Verificar se usuário já foi referenciado
  const [existing] = await db
    .select()
    .from(affiliateReferrals)
    .where(eq(affiliateReferrals.referredUserId, referredUserId));
  
  if (existing) {
    return existing; // Já foi referenciado
  }
  
  // Criar referência
  const [referral] = await db.insert(affiliateReferrals).values({
    affiliateId: affiliate.id,
    referredUserId,
    status: "pending",
  });
  
  // Atualizar contador de referências
  await db
    .update(affiliates)
    .set({ 
      totalReferrals: sql`${affiliates.totalReferrals} + 1`,
    })
    .where(eq(affiliates.id, affiliate.id));
  
  return referral;
}

/**
 * Processar comissão de primeira venda
 */
export async function processFirstSaleCommission(
  referredUserId: number,
  orderId: string,
  amount: number // Em centavos
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Buscar referência
  const [referral] = await db
    .select()
    .from(affiliateReferrals)
    .where(eq(affiliateReferrals.referredUserId, referredUserId));
  
  if (!referral) {
    return null; // Não foi referenciado por afiliado
  }
  
  // Buscar afiliado
  const [affiliate] = await db
    .select()
    .from(affiliates)
    .where(eq(affiliates.id, referral.affiliateId));
  
  if (!affiliate || affiliate.status !== "active") {
    return null;
  }
  
  // Calcular comissão
  const commissionAmount = Math.floor((amount * affiliate.commissionRate) / 100);
  
  // Criar comissão
  await db.insert(affiliateCommissions).values({
    affiliateId: affiliate.id,
    referralId: referral.id,
    orderId,
    type: "first_sale",
    amount: commissionAmount,
    status: "pending",
  });
  
  // Atualizar referência
  await db
    .update(affiliateReferrals)
    .set({
      status: "converted",
      firstPurchaseAt: new Date(),
      lastPurchaseAt: new Date(),
      totalSpent: sql`${affiliateReferrals.totalSpent} + ${amount}`,
      totalCommission: sql`${affiliateReferrals.totalCommission} + ${commissionAmount}`,
    })
    .where(eq(affiliateReferrals.id, referral.id));
  
  // Atualizar afiliado
  await db
    .update(affiliates)
    .set({
      activeReferrals: sql`${affiliates.activeReferrals} + 1`,
      totalEarnings: sql`${affiliates.totalEarnings} + ${commissionAmount}`,
      pendingEarnings: sql`${affiliates.pendingEarnings} + ${commissionAmount}`,
    })
    .where(eq(affiliates.id, affiliate.id));
  
  return { commissionAmount, affiliate };
}

/**
 * Processar comissão recorrente
 */
export async function processRecurringCommission(
  referredUserId: number,
  orderId: string,
  amount: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Buscar referência
  const [referral] = await db
    .select()
    .from(affiliateReferrals)
    .where(
      and(
        eq(affiliateReferrals.referredUserId, referredUserId),
        eq(affiliateReferrals.status, "converted")
      )
    );
  
  if (!referral) {
    return null;
  }
  
  // Buscar afiliado
  const [affiliate] = await db
    .select()
    .from(affiliates)
    .where(eq(affiliates.id, referral.affiliateId));
  
  if (!affiliate || affiliate.status !== "active") {
    return null;
  }
  
  // Calcular comissão recorrente
  const commissionAmount = Math.floor((amount * affiliate.recurringCommissionRate) / 100);
  
  // Criar comissão
  await db.insert(affiliateCommissions).values({
    affiliateId: affiliate.id,
    referralId: referral.id,
    orderId,
    type: "recurring",
    amount: commissionAmount,
    status: "pending",
  });
  
  // Atualizar referência
  await db
    .update(affiliateReferrals)
    .set({
      lastPurchaseAt: new Date(),
      totalSpent: sql`${affiliateReferrals.totalSpent} + ${amount}`,
      totalCommission: sql`${affiliateReferrals.totalCommission} + ${commissionAmount}`,
    })
    .where(eq(affiliateReferrals.id, referral.id));
  
  // Atualizar afiliado
  await db
    .update(affiliates)
    .set({
      totalEarnings: sql`${affiliates.totalEarnings} + ${commissionAmount}`,
      pendingEarnings: sql`${affiliates.pendingEarnings} + ${commissionAmount}`,
    })
    .where(eq(affiliates.id, affiliate.id));
  
  return { commissionAmount, affiliate };
}

/**
 * Aprovar comissão para pagamento
 */
export async function approveCommission(commissionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(affiliateCommissions)
    .set({ status: "approved" })
    .where(eq(affiliateCommissions.id, commissionId));
}

/**
 * Processar pagamento de comissões
 */
export async function payoutCommissions(affiliateId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Buscar comissões aprovadas
  const approvedCommissions = await db
    .select()
    .from(affiliateCommissions)
    .where(
      and(
        eq(affiliateCommissions.affiliateId, affiliateId),
        eq(affiliateCommissions.status, "approved")
      )
    );
  
  if (approvedCommissions.length === 0) {
    throw new Error("No approved commissions to pay");
  }
  
  const totalAmount = approvedCommissions.reduce((sum, c) => sum + c.amount, 0);
  
  // TODO: Integrar com sistema de pagamento PIX
  // Por enquanto, apenas marcar como pago
  
  const commissionIds = approvedCommissions.map(c => c.id);
  
  // Marcar comissões como pagas
  for (const id of commissionIds) {
    await db
      .update(affiliateCommissions)
      .set({ 
        status: "paid",
        paidAt: new Date(),
      })
      .where(eq(affiliateCommissions.id, id));
  }
  
  // Atualizar afiliado
  const [affiliate] = await db
    .select()
    .from(affiliates)
    .where(eq(affiliates.id, affiliateId));
  
  if (affiliate) {
    await db
      .update(affiliates)
      .set({
        pendingEarnings: sql`${affiliates.pendingEarnings} - ${totalAmount}`,
        paidEarnings: sql`${affiliates.paidEarnings} + ${totalAmount}`,
        lastPayoutAt: new Date(),
      })
      .where(eq(affiliates.id, affiliateId));
  }
  
  return { totalAmount, commissionCount: commissionIds.length };
}

/**
 * Obter estatísticas do afiliado
 */
export async function getAffiliateStats(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [affiliate] = await db
    .select()
    .from(affiliates)
    .where(eq(affiliates.userId, userId));
  
  if (!affiliate) {
    return null;
  }
  
  // Buscar referências
  const referralsData = await db
    .select()
    .from(affiliateReferrals)
    .where(eq(affiliateReferrals.affiliateId, affiliate.id));
  
  // Buscar comissões
  const commissionsData = await db
    .select()
    .from(affiliateCommissions)
    .where(eq(affiliateCommissions.affiliateId, affiliate.id));
  
  // Calcular métricas
  const pendingReferrals = referralsData.filter(r => r.status === "pending").length;
  const convertedReferrals = referralsData.filter(r => r.status === "converted").length;
  
  const pendingCommissions = commissionsData
    .filter(c => c.status === "pending")
    .reduce((sum, c) => sum + c.amount, 0);
  
  const approvedCommissions = commissionsData
    .filter(c => c.status === "approved")
    .reduce((sum, c) => sum + c.amount, 0);
  
  const paidCommissions = commissionsData
    .filter(c => c.status === "paid")
    .reduce((sum, c) => sum + c.amount, 0);
  
  return {
    affiliate,
    stats: {
      totalReferrals: referralsData.length,
      pendingReferrals,
      convertedReferrals,
      conversionRate: referralsData.length > 0 
        ? Math.round((convertedReferrals / referralsData.length) * 100) 
        : 0,
      totalEarnings: affiliate.totalEarnings,
      pendingEarnings: pendingCommissions,
      approvedEarnings: approvedCommissions,
      paidEarnings: paidCommissions,
      totalCommissions: commissionsData.length,
    },
    referrals: referralsData,
    commissions: commissionsData,
  };
}

/**
 * Atualizar tier do afiliado baseado em performance
 */
export async function updateAffiliateTier(affiliateId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [affiliate] = await db
    .select()
    .from(affiliates)
    .where(eq(affiliates.id, affiliateId));
  
  if (!affiliate) return;
  
  // Lógica de tier baseada em referências ativas
  let newTier: "standard" | "silver" | "gold" | "platinum" = "standard";
  let newRecurringRate = 10;
  
  if (affiliate.activeReferrals >= 100) {
    newTier = "platinum";
    newRecurringRate = 20;
  } else if (affiliate.activeReferrals >= 50) {
    newTier = "gold";
    newRecurringRate = 15;
  } else if (affiliate.activeReferrals >= 10) {
    newTier = "silver";
    newRecurringRate = 12;
  }
  
  if (newTier !== affiliate.tier) {
    await db
      .update(affiliates)
      .set({ 
        tier: newTier,
        recurringCommissionRate: newRecurringRate,
      })
      .where(eq(affiliates.id, affiliateId));
    
    return { upgraded: true, newTier, newRecurringRate };
  }
  
  return { upgraded: false };
}
