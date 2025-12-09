import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { ENV } from "./_core/env";

import { hashPassword, comparePassword } from "./services/authService";
import { nanoid } from "nanoid";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  // Standalone Auth System
  auth: router({
    // Get current user session
    me: publicProcedure.query(async (opts) => {
      // Logic handled by context in normal flow, but let's double check DB if session exists
      return opts.ctx.user;
    }),

    // Login with Email/Password
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const { users } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");

        const [user] = await db.select().from(users).where(eq(users.email, input.email));
        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await comparePassword(user.password, input.password);
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        // Create Session Token (simple JWT-like or opaque token stored in separate table?
        // For simplicity reusing 'openId' as a stable ID or generating a session token.
        // The current structure relies on 'COOKIE_NAME' containing a token.
        // Let's assume we use a simple signed JWT or just user ID if context handles it.
        // Checking oauth.ts, it uses `sdk.createSessionToken`. We need to replace that.
        // We will generate a token here and set cookie.

        // REPLACEMENT: Use jose to sign a JWT
        const { SignJWT } = await import("jose");
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        const token = await new SignJWT({ sub: user.id.toString(), email: user.email })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime("1y")
          .sign(secret);

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 31536000000 }); // 1 year

        return { success: true };
      }),

    // Register with Email/Password
    register: publicProcedure
      .input(z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const { users } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");

        // Check if exists
        const [existing] = await db.select().from(users).where(eq(users.email, input.email));
        if (existing) {
          throw new Error("Email already registered");
        }

        const hashedPassword = await hashPassword(input.password);
        const openId = nanoid(); // Generate a unique ID for openId compatibility

        await db.insert(users).values({
          name: input.name,
          email: input.email,
          password: hashedPassword,
          openId: openId,
          loginMethod: "email",
          role: "user",
          plan: "free",
          creditsRemaining: 3
        });

        // Auto-login after register
        const [newUser] = await db.select().from(users).where(eq(users.email, input.email));

        const { SignJWT } = await import("jose");
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        const token = await new SignJWT({ sub: newUser.id.toString(), email: newUser.email })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime("1y")
          .sign(secret);

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 31536000000 });

        // Trigger n8n webhook for email marketing automation (non-blocking)
        import("./integrations/n8nClient").then(({ triggerUserRegistered }) => {
          const userName = newUser.name ?? newUser.email ?? "User";
          triggerUserRegistered(newUser.id, newUser.email ?? "", userName).catch(err => {
            console.error("[Router] Failed to trigger user registration webhook:", err);
          });
        });

        return { success: true };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    }),
  }),
  system: systemRouter,

  // Sistema de Afiliados
  affiliates: router({
    create: protectedProcedure.mutation(async ({ ctx }) => {
      const { createAffiliate } = await import("./services/affiliateService");
      const affiliate = await createAffiliate(ctx.user.id);
      return affiliate;
    }),

    stats: protectedProcedure.query(async ({ ctx }) => {
      const { getAffiliateStats } = await import("./services/affiliateService");
      const stats = await getAffiliateStats(ctx.user.id);
      return stats;
    }),

    requestPayout: protectedProcedure.mutation(async ({ ctx }) => {
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { affiliates } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");

      const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.userId, ctx.user.id));
      if (!affiliate) throw new Error("Not an affiliate");

      if (affiliate.pendingEarnings < 5000) { // Mínimo R$ 50
        throw new Error("Saldo mínimo para saque: R$ 50,00");
      }

      if (!affiliate.pixKey) {
        throw new Error("Configure sua chave PIX primeiro");
      }

      // TODO: Integrar com sistema de pagamento
      return { success: true, message: "Solicitação de saque enviada!" };
    }),

    updatePixKey: protectedProcedure
      .input(z.object({ pixKey: z.string().min(5) }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const { affiliates } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");

        await db.update(affiliates)
          .set({ pixKey: input.pixKey })
          .where(eq(affiliates.userId, ctx.user.id));

        return { success: true };
      }),
  }),

  // Programa de Referral
  referral: router({
    getCode: protectedProcedure.query(async ({ ctx }) => {
      const { getUserReferralCode } = await import("./services/referralService");
      const code = await getUserReferralCode(ctx.user.id);
      return { code };
    }),

    stats: protectedProcedure.query(async ({ ctx }) => {
      const { getReferralStats } = await import("./services/referralService");
      const stats = await getReferralStats(ctx.user.id);
      return stats;
    }),

    applyCode: publicProcedure
      .input(z.object({ code: z.string() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("Must be logged in");

        const { processReferral } = await import("./services/referralService");
        const referral = await processReferral(input.code, ctx.user.id);

        return { success: true, message: "Você e seu amigo ganharam 3 créditos grátis!" };
      }),
  }),

  // REMOVED OLD AUTH


  memories: router({
    create: protectedProcedure
      .input(z.object({
        story: z.string().min(10),
        formats: z.array(z.enum(["video", "music", "book", "podcast"])),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const { users, memories } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");

        // Check user credits
        const [user] = await db.select().from(users).where(eq(users.id, ctx.user.id));
        if (!user) throw new Error("User not found");

        const creditsNeeded = input.formats.length;
        if (user.creditsRemaining < creditsNeeded) {
          throw new Error(`Créditos insuficientes. Você precisa de ${creditsNeeded} créditos mas tem apenas ${user.creditsRemaining}. Faça upgrade do seu plano!`);
        }

        // Create memory records (one for each format)
        const memoryRecords = input.formats.map(format => ({
          userId: ctx.user.id,
          title: input.story.substring(0, 100) + "...",
          story: input.story,
          format: format as "video" | "music" | "book" | "podcast",
          status: "processing" as const,
        }));

        const results = await db.insert(memories).values(memoryRecords);

        // Decrement credits
        await db.update(users)
          .set({ creditsRemaining: user.creditsRemaining - creditsNeeded })
          .where(eq(users.id, ctx.user.id));

        // Queue AI processing job
        const insertResult = results as any;
        const insertedIds = insertResult.insertId ?
          Array.from({ length: creditsNeeded }, (_, i) => insertResult.insertId + i) :
          [];

        // Import n8n client
        const { triggerMemoryProcessing } = await import("./integrations/n8nClient");

        // Process each memory
        const processingResults = [];
        for (let i = 0; i < input.formats.length; i++) {
          const memoryId = insertedIds[i];
          const format = input.formats[i];

          if (memoryId) {
            // Try n8n webhook with automatic retry and fallback
            const result = await triggerMemoryProcessing({
              memoryId,
              userId: ctx.user.id,
              story: input.story,
              format,
              title: input.story.substring(0, 50) + "...",
            });

            processingResults.push({
              memoryId,
              format,
              n8nSuccess: result.success,
              usedFallback: result.usedFallback,
            });

            // If n8n failed, use local fallback
            if (result.usedFallback) {
              const { queueMemoryProcessing } = await import("./ai/memoryProcessor");
              queueMemoryProcessing(memoryId, input.story, format as "video" | "music" | "book" | "podcast");

              console.log(`[Router] Using local fallback for memory ${memoryId}`);
            }
          }
        }

        // Log processing summary
        const n8nSuccessCount = processingResults.filter(r => r.n8nSuccess).length;
        const fallbackCount = processingResults.filter(r => r.usedFallback).length;

        console.log(`[Router] Memory creation summary:`, {
          total: input.formats.length,
          n8nSuccess: n8nSuccessCount,
          fallback: fallbackCount,
          userId: ctx.user.id,
        });

        // Create notification
        const { createNotification } = await import("./db");
        await createNotification({
          userId: ctx.user.id,
          type: "memory_completed",
          title: "Memória em processamento",
          message: `${input.formats.length === 1 ? 'Sua memória está' : `Suas ${input.formats.length} memórias estão`} sendo criada${input.formats.length === 1 ? '' : 's'}. Você será notificado quando estiver${input.formats.length === 1 ? '' : 'em'} pronta${input.formats.length === 1 ? '' : 's'}!`,
          isRead: false,
        });

        return {
          success: true,
          count: input.formats.length,
          creditsRemaining: user.creditsRemaining - creditsNeeded,
          n8nSuccess: n8nSuccessCount,
          fallbackUsed: fallbackCount,
        };
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const { memories } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");

        const [memory] = await db.select()
          .from(memories)
          .where(and(eq(memories.id, input.id), eq(memories.userId, ctx.user.id)));

        if (!memory) throw new Error("Memory not found");
        return memory;
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) return [];

      const { memories } = await import("../drizzle/schema");
      const { eq, desc } = await import("drizzle-orm");

      const userMemories = await db.select()
        .from(memories)
        .where(eq(memories.userId, ctx.user.id))
        .orderBy(desc(memories.createdAt));

      return userMemories;
    }),

    // Endpoint for n8n workflows to update memory status
    updateStatus: publicProcedure
      .input(z.object({
        memoryId: z.number(),
        status: z.enum(["processing", "completed", "failed"]),
        videoUrl: z.string().optional(),
        musicUrl: z.string().optional(),
        bookUrl: z.string().optional(),
        podcastUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        error: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const { memories } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");

        console.log(`[updateStatus] Updating memory ${input.memoryId} to status: ${input.status}`);

        await db.update(memories)
          .set({
            status: input.status,
            videoUrl: input.videoUrl,
            musicUrl: input.musicUrl,
            bookUrl: input.bookUrl,
            podcastUrl: input.podcastUrl,
            thumbnailUrl: input.thumbnailUrl,
            updatedAt: new Date(),
          })
          .where(eq(memories.id, input.memoryId));

        console.log(`[updateStatus] Memory ${input.memoryId} updated successfully`);

        return { success: true };
      }),
  }),

  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserNotifications } = await import("./db");
      return getUserNotifications(ctx.user.id);
    }),

    unreadCount: protectedProcedure.query(async ({ ctx }) => {
      const { getUnreadNotificationsCount } = await import("./db");
      return getUnreadNotificationsCount(ctx.user.id);
    }),

    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { markNotificationAsRead } = await import("./db");
        await markNotificationAsRead(input.notificationId, ctx.user.id);
        return { success: true };
      }),

    markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
      const { markAllNotificationsAsRead } = await import("./db");
      await markAllNotificationsAsRead(ctx.user.id);
      return { success: true };
    }),

    delete: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { deleteNotification } = await import("./db");
        await deleteNotification(input.notificationId, ctx.user.id);
        return { success: true };
      }),

    getPreferences: protectedProcedure.query(async ({ ctx }) => {
      const { getNotificationPreferences } = await import("./db");
      return getNotificationPreferences(ctx.user.id);
    }),

    updatePreferences: protectedProcedure
      .input(z.object({
        emailMemoryCompleted: z.boolean().optional(),
        emailNewLike: z.boolean().optional(),
        emailNewComment: z.boolean().optional(),
        emailPayment: z.boolean().optional(),
        pushMemoryCompleted: z.boolean().optional(),
        pushNewLike: z.boolean().optional(),
        pushNewComment: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { upsertNotificationPreferences } = await import("./db");
        await upsertNotificationPreferences(ctx.user.id, input);
        return { success: true };
      }),

    // Endpoint for n8n workflows to create custom notifications
    createCustom: publicProcedure
      .input(z.object({
        userId: z.number(),
        type: z.string(),
        context: z.any().optional(),
      }))
      .mutation(async ({ input }) => {
        const { createNotification } = await import("./db");

        // Map notification types to templates
        const templates: Record<string, any> = {
          memory_completed: {
            title: "Memória Pronta!",
            message: `Sua memória "${input.context?.memoryTitle || 'sem título'}" está pronta!`,
            link: `/my-memories/${input.context?.memoryId}`,
            imageUrl: input.context?.thumbnailUrl,
            actionUrl: `/my-memories/${input.context?.memoryId}`,
            actionLabel: "Ver Memória",
            priority: "high",
          },
          memory_failed: {
            title: "Erro no Processamento",
            message: "Houve um erro ao processar sua memória. Seus créditos foram devolvidos.",
            link: "/dashboard",
            priority: "high",
          },
          payment_success: {
            title: "Pagamento Confirmado!",
            message: `Bem-vindo ao plano ${input.context?.plan || 'Premium'}!`,
            link: "/dashboard",
            priority: "high",
          },
          subscription_cancelled: {
            title: "Assinatura Cancelada",
            message: "Sua assinatura foi cancelada. Você pode reativar a qualquer momento.",
            link: "/pricing",
            priority: "normal",
          },
        };

        const template = templates[input.type] || {
          title: "Notificação",
          message: input.context?.message || "Você tem uma nova notificação",
          link: "/",
          priority: "normal",
        };

        await createNotification({
          userId: input.userId,
          type: input.type,
          ...template,
        });

        console.log(`[createCustom] Notification created for user ${input.userId}, type: ${input.type}`);

        return { success: true };
      }),

    getByPriority: protectedProcedure
      .input(z.object({
        priority: z.enum(["low", "normal", "high", "urgent"]),
      }))
      .query(async ({ ctx, input }) => {
        const { getNotificationsByPriority } = await import("./db");
        return getNotificationsByPriority(ctx.user.id, input.priority);
      }),

    markAsReadWithTimestamp: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { markNotificationAsReadWithTimestamp } = await import("./db");
        await markNotificationAsReadWithTimestamp(input.notificationId, ctx.user.id);
        return { success: true };
      }),
  }),

  stripe: router({
    createCheckout: protectedProcedure
      .input(z.object({
        planId: z.enum(["creator", "pro"]),
        interval: z.enum(["month", "year"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createCheckoutSession } = await import("./stripe/checkout");

        const origin = ctx.req.headers.origin || "http://localhost:3000";

        const checkoutUrl = await createCheckoutSession({
          planId: input.planId,
          interval: input.interval,
          userId: ctx.user.id,
          userEmail: ctx.user.email || "",
          userName: ctx.user.name || undefined,
          origin,
        });

        return { checkoutUrl };
      }),

    getPlans: publicProcedure.query(async () => {
      const { getAvailablePlans } = await import("./stripe/products");
      return getAvailablePlans();
    }),
  }),
});

export type AppRouter = typeof appRouter;
