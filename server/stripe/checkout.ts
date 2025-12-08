import Stripe from "stripe";
import { PLANS } from "./products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

interface CreateCheckoutSessionParams {
  planId: string;
  interval: "month" | "year";
  userId: number;
  userEmail: string;
  userName?: string;
  origin: string;
}

/**
 * Cria sessão de checkout do Stripe
 */
export async function createCheckoutSession(params: CreateCheckoutSessionParams): Promise<string> {
  const { planId, interval, userId, userEmail, userName, origin } = params;
  
  const plan = PLANS[planId];
  if (!plan) {
    throw new Error(`Plano inválido: ${planId}`);
  }
  
  // Preço baseado no intervalo
  const price = interval === "year" ? plan.priceYearly : plan.priceMonthly;
  
  // Criar sessão de checkout
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: `MemoryVerse AI - Plano ${plan.name}`,
            description: plan.description,
            images: ["https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop"],
          },
          recurring: {
            interval,
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    customer_email: userEmail,
    client_reference_id: userId.toString(),
    metadata: {
      user_id: userId.toString(),
      customer_email: userEmail,
      customer_name: userName || "",
      plan_id: planId,
      interval,
    },
    allow_promotion_codes: true,
    success_url: `${origin}/dashboard?payment=success`,
    cancel_url: `${origin}/pricing?payment=cancelled`,
    subscription_data: {
      metadata: {
        user_id: userId.toString(),
        plan_id: planId,
      },
    },
  });
  
  if (!session.url) {
    throw new Error("Falha ao criar sessão de checkout");
  }
  
  return session.url;
}

/**
 * Cria portal do cliente para gerenciar assinatura
 */
export async function createCustomerPortalSession(
  stripeCustomerId: string,
  origin: string
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${origin}/dashboard`,
  });
  
  return session.url;
}

/**
 * Cancela assinatura
 */
export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Retoma assinatura cancelada
 */
export async function resumeSubscription(subscriptionId: string): Promise<void> {
  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

/**
 * Busca assinatura ativa do cliente
 */
export async function getActiveSubscription(stripeCustomerId: string): Promise<Stripe.Subscription | null> {
  const subscriptions = await stripe.subscriptions.list({
    customer: stripeCustomerId,
    status: "active",
    limit: 1,
  });
  
  return subscriptions.data[0] || null;
}
