import type { InsertNotification } from "../drizzle/schema";

export type NotificationTemplate = Omit<InsertNotification, "id" | "userId" | "createdAt">;

export type NotificationType = 
  | "memory_completed"
  | "memory_failed"
  | "new_like"
  | "new_comment"
  | "payment_success"
  | "payment_failed"
  | "system"
  | "welcome"
  | "milestone"
  | "promotion";

export type NotificationPriority = "low" | "normal" | "high" | "urgent";

interface TemplateContext {
  userName?: string;
  memoryTitle?: string;
  memoryId?: number;
  memoryFormat?: string;
  likeCount?: number;
  commentAuthor?: string;
  commentText?: string;
  amount?: string;
  milestoneType?: string;
  milestoneValue?: number;
  promotionTitle?: string;
  promotionDiscount?: string;
  [key: string]: any;
}

/**
 * Sistema de templates de notificação
 * Permite criar notificações personalizadas com contexto dinâmico
 */
export const notificationTemplates: Record<
  NotificationType,
  (context: TemplateContext) => NotificationTemplate
> = {
  memory_completed: (ctx) => ({
    type: "memory_completed",
    title: "✨ Sua memória está pronta!",
    message: `Sua memória "${ctx.memoryTitle}" foi transformada em ${ctx.memoryFormat} com sucesso! Clique para visualizar.`,
    link: `/my-memories/${ctx.memoryId}`,
    imageUrl: ctx.thumbnailUrl,
    actionUrl: `/my-memories/${ctx.memoryId}`,
    actionLabel: "Ver Memória",
    priority: "high",
    isRead: false,
    emailSent: false,
  }),

  memory_failed: (ctx) => ({
    type: "memory_failed",
    title: "⚠️ Erro ao processar memória",
    message: `Houve um problema ao processar sua memória "${ctx.memoryTitle}". Nossa equipe foi notificada e estamos trabalhando para resolver.`,
    link: `/dashboard`,
    actionUrl: `/dashboard`,
    actionLabel: "Tentar Novamente",
    priority: "urgent",
    isRead: false,
    emailSent: false,
  }),

  new_like: (ctx) => ({
    type: "new_like",
    title: "❤️ Nova curtida!",
    message: `Sua memória "${ctx.memoryTitle}" recebeu uma nova curtida! Total: ${ctx.likeCount} curtidas.`,
    link: `/my-memories/${ctx.memoryId}`,
    imageUrl: ctx.thumbnailUrl,
    priority: "low",
    isRead: false,
    emailSent: false,
  }),

  new_comment: (ctx) => ({
    type: "new_comment",
    title: "💬 Novo comentário",
    message: `${ctx.commentAuthor} comentou em sua memória: "${ctx.commentText?.substring(0, 100)}..."`,
    link: `/my-memories/${ctx.memoryId}#comments`,
    imageUrl: ctx.thumbnailUrl,
    actionUrl: `/my-memories/${ctx.memoryId}#comments`,
    actionLabel: "Ver Comentário",
    priority: "normal",
    isRead: false,
    emailSent: false,
  }),

  payment_success: (ctx) => ({
    type: "payment_success",
    title: "✅ Pagamento confirmado",
    message: `Seu pagamento de ${ctx.amount} foi processado com sucesso! Aproveite seus novos recursos.`,
    link: `/dashboard`,
    actionUrl: `/dashboard`,
    actionLabel: "Ver Dashboard",
    priority: "high",
    isRead: false,
    emailSent: false,
  }),

  payment_failed: (ctx) => ({
    type: "payment_failed",
    title: "❌ Falha no pagamento",
    message: `Não conseguimos processar seu pagamento de ${ctx.amount}. Por favor, verifique seus dados de pagamento.`,
    link: `/settings/billing`,
    actionUrl: `/settings/billing`,
    actionLabel: "Atualizar Pagamento",
    priority: "urgent",
    isRead: false,
    emailSent: false,
  }),

  system: (ctx) => ({
    type: "system",
    title: ctx.title || "📢 Atualização do sistema",
    message: ctx.message || "Temos novidades para você!",
    link: ctx.link,
    imageUrl: ctx.imageUrl,
    actionUrl: ctx.actionUrl,
    actionLabel: ctx.actionLabel,
    priority: (ctx.priority as NotificationPriority) || "normal",
    isRead: false,
    emailSent: false,
  }),

  welcome: (ctx) => ({
    type: "welcome",
    title: `🎉 Bem-vindo ao MemoryVerse AI, ${ctx.userName}!`,
    message: "Transforme suas memórias em arte com inteligência artificial. Você tem 3 memórias grátis para começar!",
    link: "/dashboard",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop",
    actionUrl: "/dashboard",
    actionLabel: "Criar Primeira Memória",
    priority: "high",
    isRead: false,
    emailSent: false,
  }),

  milestone: (ctx) => ({
    type: "milestone",
    title: `🏆 Parabéns! Você alcançou ${ctx.milestoneValue} ${ctx.milestoneType}!`,
    message: `Você atingiu um marco importante! Continue criando memórias incríveis.`,
    link: `/my-memories`,
    imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=400&fit=crop",
    actionUrl: `/my-memories`,
    actionLabel: "Ver Suas Memórias",
    priority: "normal",
    isRead: false,
    emailSent: false,
  }),

  promotion: (ctx) => ({
    type: "promotion",
    title: `🎁 ${ctx.promotionTitle}`,
    message: `Aproveite ${ctx.promotionDiscount} de desconto em todos os planos! Oferta por tempo limitado.`,
    link: `/pricing`,
    imageUrl: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&h=400&fit=crop",
    actionUrl: `/pricing`,
    actionLabel: "Ver Planos",
    priority: "normal",
    scheduledFor: ctx.scheduledFor,
    isRead: false,
    emailSent: false,
  }),
};

/**
 * Cria uma notificação a partir de um template
 */
export function createNotificationFromTemplate(
  type: NotificationType,
  userId: number,
  context: TemplateContext = {}
): InsertNotification {
  const template = notificationTemplates[type](context);
  
  return {
    userId,
    ...template,
  };
}

/**
 * Valida se uma notificação pode ser enviada baseado nas preferências do usuário
 */
export function shouldSendNotification(
  type: NotificationType,
  preferences: any
): { inApp: boolean; email: boolean } {
  const mapping: Record<NotificationType, { emailPref?: string; pushPref?: string }> = {
    memory_completed: { emailPref: "emailMemoryCompleted", pushPref: "pushMemoryCompleted" },
    memory_failed: { emailPref: "emailMemoryCompleted", pushPref: "pushMemoryCompleted" },
    new_like: { emailPref: "emailNewLike", pushPref: "pushNewLike" },
    new_comment: { emailPref: "emailNewComment", pushPref: "pushNewComment" },
    payment_success: { emailPref: "emailPayment" },
    payment_failed: { emailPref: "emailPayment" },
    system: {},
    welcome: {},
    milestone: {},
    promotion: {},
  };

  const config = mapping[type];
  
  return {
    inApp: config.pushPref ? preferences[config.pushPref] !== false : true,
    email: config.emailPref ? preferences[config.emailPref] === true : false,
  };
}
