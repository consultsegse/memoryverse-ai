import { integer, pgTable, text, timestamp, varchar, boolean, serial } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }),
    password: varchar("password", { length: 255 }), // Added for standalone auth
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: varchar("role", { length: 20 }).default("user").notNull(),
    plan: varchar("plan", { length: 20 }).default("free").notNull(),
    planInterval: varchar("planInterval", { length: 20 }).default("monthly"),
    subscriptionId: varchar("subscriptionId", { length: 255 }), // Stripe subscription ID
    subscriptionStatus: varchar("subscriptionStatus", { length: 20 }),
    currentPeriodEnd: timestamp("currentPeriodEnd"),
    creditsRemaining: integer("creditsRemaining").default(3).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const memories = pgTable("memories", {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    story: text("story").notNull(),
    format: varchar("format", { length: 20 }).notNull(),
    status: varchar("status", { length: 20 }).default("processing").notNull(),
    isPublic: boolean("isPublic").default(false).notNull(),
    videoUrl: text("videoUrl"),
    musicUrl: text("musicUrl"),
    bookUrl: text("bookUrl"),
    podcastUrl: text("podcastUrl"),
    animationUrl: text("animationUrl"),
    nftUrl: text("nftUrl"),
    thumbnailUrl: text("thumbnailUrl"),
    views: integer("views").default(0).notNull(),
    likes: integer("likes").default(0).notNull(),
    shares: integer("shares").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Memory = typeof memories.$inferSelect;
export type InsertMemory = typeof memories.$inferInsert;

export const notifications = pgTable("notifications", {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    link: varchar("link", { length: 500 }),
    imageUrl: text("imageUrl"),
    actionUrl: varchar("actionUrl", { length: 500 }),
    actionLabel: varchar("actionLabel", { length: 100 }),
    priority: varchar("priority", { length: 20 }).default("normal").notNull(),
    isRead: boolean("isRead").default(false).notNull(),
    readAt: timestamp("readAt"),
    scheduledFor: timestamp("scheduledFor"),
    sentAt: timestamp("sentAt"),
    emailSent: boolean("emailSent").default(false).notNull(),
    emailSentAt: timestamp("emailSentAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

export const notificationPreferences = pgTable("notificationPreferences", {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull().unique(),
    emailMemoryCompleted: boolean("emailMemoryCompleted").default(true).notNull(),
    emailNewLike: boolean("emailNewLike").default(false).notNull(),
    emailNewComment: boolean("emailNewComment").default(true).notNull(),
    emailPayment: boolean("emailPayment").default(true).notNull(),
    pushMemoryCompleted: boolean("pushMemoryCompleted").default(true).notNull(),
    pushNewLike: boolean("pushNewLike").default(false).notNull(),
    pushNewComment: boolean("pushNewComment").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreference = typeof notificationPreferences.$inferInsert;

// Sistema de Afiliados
export const affiliates = pgTable("affiliates", {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull().unique(),
    code: varchar("code", { length: 32 }).notNull().unique(),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    tier: varchar("tier", { length: 20 }).default("standard").notNull(),
    commissionRate: integer("commissionRate").default(30).notNull(), // Porcentagem
    recurringCommissionRate: integer("recurringCommissionRate").default(10).notNull(),
    totalEarnings: integer("totalEarnings").default(0).notNull(), // Em centavos
    pendingEarnings: integer("pendingEarnings").default(0).notNull(),
    paidEarnings: integer("paidEarnings").default(0).notNull(),
    totalReferrals: integer("totalReferrals").default(0).notNull(),
    activeReferrals: integer("activeReferrals").default(0).notNull(),
    pixKey: varchar("pixKey", { length: 255 }),
    lastPayoutAt: timestamp("lastPayoutAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Affiliate = typeof affiliates.$inferSelect;
export type InsertAffiliate = typeof affiliates.$inferInsert;

// Referências de Afiliados
export const affiliateReferrals = pgTable("affiliateReferrals", {
    id: serial("id").primaryKey(),
    affiliateId: integer("affiliateId").notNull(),
    referredUserId: integer("referredUserId").notNull(),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    firstPurchaseAt: timestamp("firstPurchaseAt"),
    lastPurchaseAt: timestamp("lastPurchaseAt"),
    totalSpent: integer("totalSpent").default(0).notNull(), // Em centavos
    totalCommission: integer("totalCommission").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type AffiliateReferral = typeof affiliateReferrals.$inferSelect;
export type InsertAffiliateReferral = typeof affiliateReferrals.$inferInsert;

// Comissões de Afiliados
export const affiliateCommissions = pgTable("affiliateCommissions", {
    id: serial("id").primaryKey(),
    affiliateId: integer("affiliateId").notNull(),
    referralId: integer("referralId").notNull(),
    orderId: varchar("orderId", { length: 255 }),
    type: varchar("type", { length: 20 }).notNull(),
    amount: integer("amount").notNull(), // Em centavos
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    paidAt: timestamp("paidAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type AffiliateCommission = typeof affiliateCommissions.$inferSelect;
export type InsertAffiliateCommission = typeof affiliateCommissions.$inferInsert;

// Programa de Referral (usuários comuns)
export const referrals = pgTable("referrals", {
    id: serial("id").primaryKey(),
    referrerId: integer("referrerId").notNull(),
    referredUserId: integer("referredUserId").notNull(),
    code: varchar("code", { length: 32 }).notNull(),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    rewardType: varchar("rewardType", { length: 20 }),
    rewardAmount: integer("rewardAmount"),
    rewardedAt: timestamp("rewardedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

// Créditos Avulsos (Pay-per-memory)
export const creditPurchases = pgTable("creditPurchases", {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull(),
    credits: integer("credits").notNull(),
    amount: integer("amount").notNull(), // Em centavos
    paymentMethod: varchar("paymentMethod", { length: 50 }),
    stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type CreditPurchase = typeof creditPurchases.$inferSelect;
export type InsertCreditPurchase = typeof creditPurchases.$inferInsert;

// Marketplace de Templates Premium
export const premiumTemplates = pgTable("premiumTemplates", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    category: varchar("category", { length: 50 }).notNull(),
    price: integer("price").notNull(), // Em centavos
    thumbnailUrl: text("thumbnailUrl"),
    previewUrl: text("previewUrl"),
    config: text("config"), // JSON com configurações
    isActive: boolean("isActive").default(true).notNull(),
    salesCount: integer("salesCount").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type PremiumTemplate = typeof premiumTemplates.$inferSelect;
export type InsertPremiumTemplate = typeof premiumTemplates.$inferInsert;

// Compras de Templates
export const templatePurchases = pgTable("templatePurchases", {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull(),
    templateId: integer("templateId").notNull(),
    amount: integer("amount").notNull(), // Em centavos
    stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TemplatePurchase = typeof templatePurchases.$inferSelect;
export type InsertTemplatePurchase = typeof templatePurchases.$inferInsert;

// Pontos de Fidelidade
export const loyaltyPoints = pgTable("loyaltyPoints", {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull(),
    points: integer("points").notNull(),
    type: varchar("type", { length: 20 }).notNull(),
    reason: varchar("reason", { length: 255 }).notNull(),
    referenceId: integer("referenceId"), // ID da memória, referral, etc
    expiresAt: timestamp("expiresAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LoyaltyPoint = typeof loyaltyPoints.$inferSelect;
export type InsertLoyaltyPoint = typeof loyaltyPoints.$inferInsert;
