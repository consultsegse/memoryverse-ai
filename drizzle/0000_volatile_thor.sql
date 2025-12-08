CREATE TABLE "affiliateCommissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"affiliateId" integer NOT NULL,
	"referralId" integer NOT NULL,
	"orderId" varchar(255),
	"type" varchar(20) NOT NULL,
	"amount" integer NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"paidAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "affiliateReferrals" (
	"id" serial PRIMARY KEY NOT NULL,
	"affiliateId" integer NOT NULL,
	"referredUserId" integer NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"firstPurchaseAt" timestamp,
	"lastPurchaseAt" timestamp,
	"totalSpent" integer DEFAULT 0 NOT NULL,
	"totalCommission" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "affiliates" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"code" varchar(32) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"tier" varchar(20) DEFAULT 'standard' NOT NULL,
	"commissionRate" integer DEFAULT 30 NOT NULL,
	"recurringCommissionRate" integer DEFAULT 10 NOT NULL,
	"totalEarnings" integer DEFAULT 0 NOT NULL,
	"pendingEarnings" integer DEFAULT 0 NOT NULL,
	"paidEarnings" integer DEFAULT 0 NOT NULL,
	"totalReferrals" integer DEFAULT 0 NOT NULL,
	"activeReferrals" integer DEFAULT 0 NOT NULL,
	"pixKey" varchar(255),
	"lastPayoutAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "affiliates_userId_unique" UNIQUE("userId"),
	CONSTRAINT "affiliates_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "creditPurchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"credits" integer NOT NULL,
	"amount" integer NOT NULL,
	"paymentMethod" varchar(50),
	"stripePaymentIntentId" varchar(255),
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loyaltyPoints" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"points" integer NOT NULL,
	"type" varchar(20) NOT NULL,
	"reason" varchar(255) NOT NULL,
	"referenceId" integer,
	"expiresAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memories" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"story" text NOT NULL,
	"format" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'processing' NOT NULL,
	"isPublic" boolean DEFAULT false NOT NULL,
	"videoUrl" text,
	"musicUrl" text,
	"bookUrl" text,
	"podcastUrl" text,
	"animationUrl" text,
	"nftUrl" text,
	"thumbnailUrl" text,
	"views" integer DEFAULT 0 NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"shares" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notificationPreferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"emailMemoryCompleted" boolean DEFAULT true NOT NULL,
	"emailNewLike" boolean DEFAULT false NOT NULL,
	"emailNewComment" boolean DEFAULT true NOT NULL,
	"emailPayment" boolean DEFAULT true NOT NULL,
	"pushMemoryCompleted" boolean DEFAULT true NOT NULL,
	"pushNewLike" boolean DEFAULT false NOT NULL,
	"pushNewComment" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notificationPreferences_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"link" varchar(500),
	"imageUrl" text,
	"actionUrl" varchar(500),
	"actionLabel" varchar(100),
	"priority" varchar(20) DEFAULT 'normal' NOT NULL,
	"isRead" boolean DEFAULT false NOT NULL,
	"readAt" timestamp,
	"scheduledFor" timestamp,
	"sentAt" timestamp,
	"emailSent" boolean DEFAULT false NOT NULL,
	"emailSentAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "premiumTemplates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(50) NOT NULL,
	"price" integer NOT NULL,
	"thumbnailUrl" text,
	"previewUrl" text,
	"config" text,
	"isActive" boolean DEFAULT true NOT NULL,
	"salesCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" serial PRIMARY KEY NOT NULL,
	"referrerId" integer NOT NULL,
	"referredUserId" integer NOT NULL,
	"code" varchar(32) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"rewardType" varchar(20),
	"rewardAmount" integer,
	"rewardedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "templatePurchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"templateId" integer NOT NULL,
	"amount" integer NOT NULL,
	"stripePaymentIntentId" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"password" varchar(255),
	"loginMethod" varchar(64),
	"role" varchar(20) DEFAULT 'user' NOT NULL,
	"plan" varchar(20) DEFAULT 'free' NOT NULL,
	"planInterval" varchar(20) DEFAULT 'monthly',
	"subscriptionId" varchar(255),
	"subscriptionStatus" varchar(20),
	"currentPeriodEnd" timestamp,
	"creditsRemaining" integer DEFAULT 3 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
