import { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Handler do webhook do Stripe
 * IMPORTANTE: Deve ser registrado com express.raw() antes de express.json()
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];
  
  if (!sig) {
    console.error("[Stripe Webhook] Missing signature");
    return res.status(400).send("Missing signature");
  }
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`[Stripe Webhook] Signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // CRÍTICO: Detectar eventos de teste e retornar verificação
  if (event.id.startsWith("evt_test_")) {
    console.log("[Stripe Webhook] Test event detected, returning verification response");
    return res.json({
      verified: true,
    });
  }
  
  console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);
  
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error: any) {
    console.error(`[Stripe Webhook] Error processing event:`, error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * Checkout concluído - primeira assinatura
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log(`[Stripe] Checkout completed: ${session.id}`);
  
  const userId = session.metadata?.user_id;
  const planId = session.metadata?.plan_id;
  
  if (!userId || !planId) {
    console.error("[Stripe] Missing metadata in checkout session");
    return;
  }
  
  const { getDb } = await import("../db");
  const db = await getDb();
  if (!db) {
    console.error("[Stripe] Database not available");
    return;
  }
  
  const { users } = await import("../../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  const { getCreditsForPlan } = await import("./products");
  
  // Atualizar usuário com plano e créditos
  await db.update(users)
    .set({
      plan: planId as "free" | "creator" | "pro",
      creditsRemaining: getCreditsForPlan(planId),
    })
    .where(eq(users.id, parseInt(userId)));
  
  // Criar notificação de sucesso
  const { createNotification } = await import("../db");
  await createNotification({
    userId: parseInt(userId),
    type: "payment_success",
    title: "🎉 Pagamento confirmado!",
    message: `Seu pagamento foi processado com sucesso! Bem-vindo ao plano ${planId}.`,
    link: "/dashboard",
    actionUrl: "/dashboard",
    actionLabel: "Ir para Dashboard",
    priority: "high",
    isRead: false,
  });
  
  console.log(`[Stripe] User ${userId} upgraded to ${planId}`);
}

/**
 * Assinatura criada
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log(`[Stripe] Subscription created: ${subscription.id}`);
  
  const userId = subscription.metadata?.user_id;
  if (!userId) return;
  
  // TODO: Salvar subscription_id se necessário para cancelamento futuro
}

/**
 * Assinatura atualizada
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log(`[Stripe] Subscription updated: ${subscription.id}`);
  
  const userId = subscription.metadata?.user_id;
  const planId = subscription.metadata?.plan_id;
  
  if (!userId || !planId) return;
  
  const { getDb } = await import("../db");
  const db = await getDb();
  if (!db) return;
  
  const { users } = await import("../../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  const { getCreditsForPlan } = await import("./products");
  
  // Se assinatura foi cancelada
  if (subscription.cancel_at_period_end) {
    const { createNotification } = await import("../db");
    await createNotification({
      userId: parseInt(userId),
      type: "system",
      title: "⚠️ Assinatura cancelada",
      message: "Sua assinatura foi cancelada e expirará no final do período atual.",
      link: "/dashboard/billing",
      priority: "normal",
      isRead: false,
    });
  }
}

/**
 * Assinatura deletada/expirada
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`[Stripe] Subscription deleted: ${subscription.id}`);
  
  const userId = subscription.metadata?.user_id;
  if (!userId) return;
  
  const { getDb } = await import("../db");
  const db = await getDb();
  if (!db) return;
  
  const { users } = await import("../../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  // Downgrade para plano free
  await db.update(users)
    .set({
      plan: "free",
      creditsRemaining: 3,
    })
    .where(eq(users.id, parseInt(userId)));
  
  const { createNotification } = await import("../db");
  await createNotification({
    userId: parseInt(userId),
    type: "system",
    title: "Assinatura expirada",
    message: "Sua assinatura expirou. Você foi movido para o plano gratuito.",
    link: "/pricing",
    actionUrl: "/pricing",
    actionLabel: "Ver Planos",
    priority: "normal",
    isRead: false,
  });
}

/**
 * Fatura paga - renovação mensal
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log(`[Stripe] Invoice paid: ${invoice.id}`);
  
  const subscription = (invoice as any).subscription;
  if (!subscription || typeof subscription !== "string") return;
  
  // Buscar subscription para pegar metadata
  const sub = await stripe.subscriptions.retrieve(subscription);
  const userId = sub.metadata?.user_id;
  const planId = sub.metadata?.plan_id;
  
  if (!userId || !planId) return;
  
  const { getDb } = await import("../db");
  const db = await getDb();
  if (!db) return;
  
  const { users } = await import("../../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  const { getCreditsForPlan } = await import("./products");
  
  // Renovar créditos
  await db.update(users)
    .set({
      creditsRemaining: getCreditsForPlan(planId),
    })
    .where(eq(users.id, parseInt(userId)));
  
  const { createNotification } = await import("../db");
  await createNotification({
    userId: parseInt(userId),
    type: "payment_success",
    title: "✅ Assinatura renovada",
    message: `Sua assinatura foi renovada com sucesso! Seus créditos foram recarregados.`,
    link: "/dashboard",
    priority: "normal",
    isRead: false,
  });
}

/**
 * Falha no pagamento da fatura
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`[Stripe] Invoice payment failed: ${invoice.id}`);
  
  const subscription = (invoice as any).subscription;
  if (!subscription || typeof subscription !== "string") return;
  
  const sub = await stripe.subscriptions.retrieve(subscription);
  const userId = sub.metadata?.user_id;
  
  if (!userId) return;
  
  const { createNotification } = await import("../db");
  await createNotification({
    userId: parseInt(userId),
    type: "payment_failed",
    title: "❌ Falha no pagamento",
    message: "Não conseguimos processar seu pagamento. Por favor, atualize seu método de pagamento.",
    link: "/dashboard/billing",
    actionUrl: "/dashboard/billing",
    actionLabel: "Atualizar Pagamento",
    priority: "urgent",
    isRead: false,
  });
}
