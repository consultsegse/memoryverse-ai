/**
 * Produtos e preços do MemoryVerse AI
 * Centraliza definições de produtos para consistência
 */

export interface PlanConfig {
  id: string;
  name: string;
  description: string;
  priceMonthly: number; // em centavos
  priceYearly: number; // em centavos
  stripePriceIdMonthly?: string; // Será preenchido após criar no Stripe
  stripePriceIdYearly?: string;
  features: string[];
  creditsPerMonth: number;
  maxMemoriesPerMonth: number;
}

export const PLANS: Record<string, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    description: "Perfeito para começar",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "3 memórias grátis",
      "Todos os formatos (vídeo, música, livro, podcast)",
      "Qualidade padrão",
      "Marca d'água MemoryVerse",
    ],
    creditsPerMonth: 3,
    maxMemoriesPerMonth: 3,
  },
  
  creator: {
    id: "creator",
    name: "Creator",
    description: "Para criadores de conteúdo",
    priceMonthly: 9700, // R$ 97,00
    priceYearly: 97000, // R$ 970,00 (2 meses grátis)
    features: [
      "30 memórias por mês",
      "Todos os formatos em alta qualidade",
      "Sem marca d'água",
      "Download ilimitado",
      "Suporte prioritário",
      "Acesso antecipado a novos recursos",
    ],
    creditsPerMonth: 30,
    maxMemoriesPerMonth: 30,
  },
  
  pro: {
    id: "pro",
    name: "Pro",
    description: "Para profissionais e empresas",
    priceMonthly: 29700, // R$ 297,00
    priceYearly: 297000, // R$ 2.970,00 (2 meses grátis)
    features: [
      "Memórias ilimitadas",
      "Qualidade premium 4K",
      "API de integração",
      "Customização de marca",
      "Suporte dedicado 24/7",
      "Treinamento personalizado de IA",
      "Exportação em massa",
      "Analytics avançado",
    ],
    creditsPerMonth: -1, // Ilimitado
    maxMemoriesPerMonth: -1, // Ilimitado
  },
};

/**
 * Retorna configuração do plano
 */
export function getPlanConfig(planId: string): PlanConfig | null {
  return PLANS[planId] || null;
}

/**
 * Retorna todos os planos disponíveis para compra
 */
export function getAvailablePlans(): PlanConfig[] {
  return Object.values(PLANS).filter(plan => plan.id !== "free");
}

/**
 * Calcula créditos baseado no plano
 */
export function getCreditsForPlan(planId: string): number {
  const plan = getPlanConfig(planId);
  return plan ? plan.creditsPerMonth : 3; // Default: 3 créditos (free)
}

/**
 * Verifica se usuário pode criar memória baseado no plano
 */
export function canCreateMemory(plan: string, currentMonthMemories: number): boolean {
  const planConfig = getPlanConfig(plan);
  if (!planConfig) return false;
  
  // Plano ilimitado
  if (planConfig.maxMemoriesPerMonth === -1) return true;
  
  // Verificar limite mensal
  return currentMonthMemories < planConfig.maxMemoriesPerMonth;
}
