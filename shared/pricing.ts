/**
 * Configuração de Planos e Preços - MemoryVerse AI
 * 
 * Centraliza toda a configuração de planos, preços e features
 */

export interface PlanFeatures {
  credits: number | "unlimited";
  quality: string;
  watermark: boolean;
  support: string;
  apiAccess: boolean;
  whiteLabel: boolean;
  customDomain: boolean;
  priorityProcessing: boolean;
  dedicatedAccount: boolean;
  customIntegrations: boolean;
  sla: string | null;
}

export interface PlanConfig {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number; // Em centavos
    annual: number; // Em centavos
  };
  stripePriceId: {
    monthly: string;
    annual: string;
  };
  features: PlanFeatures;
  popular?: boolean;
  cta: string;
  targetAudience: string;
}

export const PLANS: Record<string, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    description: "Experimente o MemoryVerse gratuitamente",
    price: {
      monthly: 0,
      annual: 0,
    },
    stripePriceId: {
      monthly: "",
      annual: "",
    },
    features: {
      credits: 3,
      quality: "Padrão (720p, 128kbps)",
      watermark: true,
      support: "Email (48h)",
      apiAccess: false,
      whiteLabel: false,
      customDomain: false,
      priorityProcessing: false,
      dedicatedAccount: false,
      customIntegrations: false,
      sla: null,
    },
    cta: "Começar Grátis",
    targetAudience: "Usuários casuais que querem testar",
  },
  
  starter: {
    id: "starter",
    name: "Starter",
    description: "Ideal para uso pessoal",
    price: {
      monthly: 4700, // R$ 47
      annual: 45100, // R$ 451 (20% desconto)
    },
    stripePriceId: {
      monthly: "price_starter_monthly",
      annual: "price_starter_annual",
    },
    features: {
      credits: 5,
      quality: "HD (1080p, 192kbps)",
      watermark: false,
      support: "Email (24h)",
      apiAccess: false,
      whiteLabel: false,
      customDomain: false,
      priorityProcessing: false,
      dedicatedAccount: false,
      customIntegrations: false,
      sla: null,
    },
    cta: "Assinar Starter",
    targetAudience: "Usuários casuais",
  },
  
  creator: {
    id: "creator",
    name: "Creator",
    description: "Para criadores de conteúdo",
    price: {
      monthly: 9700, // R$ 97
      annual: 93100, // R$ 931 (20% desconto)
    },
    stripePriceId: {
      monthly: "price_creator_monthly",
      annual: "price_creator_annual",
    },
    features: {
      credits: 20,
      quality: "Full HD (1080p, 320kbps)",
      watermark: false,
      support: "Email prioritário (12h)",
      apiAccess: false,
      whiteLabel: false,
      customDomain: false,
      priorityProcessing: true,
      dedicatedAccount: false,
      customIntegrations: false,
      sla: null,
    },
    popular: true,
    cta: "Assinar Creator",
    targetAudience: "Criadores de conteúdo",
  },
  
  pro: {
    id: "pro",
    name: "Pro",
    description: "Para profissionais exigentes",
    price: {
      monthly: 29700, // R$ 297
      annual: 285100, // R$ 2.851 (20% desconto)
    },
    stripePriceId: {
      monthly: "price_pro_monthly",
      annual: "price_pro_annual",
    },
    features: {
      credits: 50,
      quality: "4K (2160p, 320kbps)",
      watermark: false,
      support: "Chat + Email (4h)",
      apiAccess: true,
      whiteLabel: false,
      customDomain: false,
      priorityProcessing: true,
      dedicatedAccount: false,
      customIntegrations: false,
      sla: "99% uptime",
    },
    cta: "Assinar Pro",
    targetAudience: "Profissionais",
  },
  
  business: {
    id: "business",
    name: "Business",
    description: "Para pequenas empresas",
    price: {
      monthly: 69700, // R$ 697
      annual: 669100, // R$ 6.691 (20% desconto)
    },
    stripePriceId: {
      monthly: "price_business_monthly",
      annual: "price_business_annual",
    },
    features: {
      credits: 150,
      quality: "4K (2160p, 320kbps)",
      watermark: false,
      support: "Chat + Telefone (2h)",
      apiAccess: true,
      whiteLabel: false,
      customDomain: true,
      priorityProcessing: true,
      dedicatedAccount: true,
      customIntegrations: false,
      sla: "99.5% uptime",
    },
    cta: "Assinar Business",
    targetAudience: "Pequenas empresas",
  },
  
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    description: "Para grandes empresas",
    price: {
      monthly: 299700, // R$ 2.997
      annual: 2877100, // R$ 28.771 (20% desconto)
    },
    stripePriceId: {
      monthly: "price_enterprise_monthly",
      annual: "price_enterprise_annual",
    },
    features: {
      credits: "unlimited",
      quality: "8K (4320p, 320kbps)",
      watermark: false,
      support: "Gerente dedicado (1h)",
      apiAccess: true,
      whiteLabel: true,
      customDomain: true,
      priorityProcessing: true,
      dedicatedAccount: true,
      customIntegrations: true,
      sla: "99.9% uptime + SLA",
    },
    cta: "Falar com Vendas",
    targetAudience: "Grandes empresas",
  },
  
  agency: {
    id: "agency",
    name: "Agency",
    description: "Para agências e revendedores",
    price: {
      monthly: 499700, // R$ 4.997
      annual: 4797100, // R$ 47.971 (20% desconto)
    },
    stripePriceId: {
      monthly: "price_agency_monthly",
      annual: "price_agency_annual",
    },
    features: {
      credits: "unlimited",
      quality: "8K (4320p, 320kbps)",
      watermark: false,
      support: "Gerente dedicado (30min)",
      apiAccess: true,
      whiteLabel: true,
      customDomain: true,
      priorityProcessing: true,
      dedicatedAccount: true,
      customIntegrations: true,
      sla: "99.95% uptime + SLA",
    },
    cta: "Falar com Vendas",
    targetAudience: "Agências e revendedores",
  },
};

/**
 * Pacotes de créditos avulsos
 */
export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number; // Em centavos
  pricePerCredit: number;
  discount: number; // Porcentagem
  popular?: boolean;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "mini",
    name: "Mini",
    credits: 3,
    price: 3900, // R$ 39
    pricePerCredit: 1300,
    discount: 0,
  },
  {
    id: "basic",
    name: "Básico",
    credits: 10,
    price: 11700, // R$ 117
    pricePerCredit: 1170,
    discount: 10,
  },
  {
    id: "plus",
    name: "Plus",
    credits: 25,
    price: 26700, // R$ 267
    pricePerCredit: 1068,
    discount: 18,
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    credits: 50,
    price: 49700, // R$ 497
    pricePerCredit: 994,
    discount: 24,
  },
  {
    id: "mega",
    name: "Mega",
    credits: 100,
    price: 89700, // R$ 897
    pricePerCredit: 897,
    discount: 31,
  },
];

/**
 * Obter configuração do plano
 */
export function getPlanConfig(planId: string): PlanConfig | null {
  return PLANS[planId] || null;
}

/**
 * Obter créditos mensais do plano
 */
export function getPlanCredits(planId: string): number {
  const plan = getPlanConfig(planId);
  if (!plan) return 0;
  
  if (plan.features.credits === "unlimited") {
    return 999999; // Número grande para representar ilimitado
  }
  
  return plan.features.credits;
}

/**
 * Verificar se plano tem feature
 */
export function planHasFeature(planId: string, feature: keyof PlanFeatures): boolean {
  const plan = getPlanConfig(planId);
  if (!plan) return false;
  
  return !!plan.features[feature];
}

/**
 * Calcular economia do plano anual
 */
export function getAnnualSavings(planId: string): number {
  const plan = getPlanConfig(planId);
  if (!plan) return 0;
  
  const monthlyTotal = plan.price.monthly * 12;
  const annualPrice = plan.price.annual;
  
  return monthlyTotal - annualPrice;
}

/**
 * Formatar preço em reais
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

/**
 * Obter lista de planos ordenada
 */
export function getPlansOrdered(): PlanConfig[] {
  return [
    PLANS.free,
    PLANS.starter,
    PLANS.creator,
    PLANS.pro,
    PLANS.business,
    PLANS.enterprise,
    PLANS.agency,
  ];
}
