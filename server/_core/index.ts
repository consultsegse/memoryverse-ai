import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import path from "path";
import { sql } from "drizzle-orm";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
// import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // IMPORTANTE: Stripe webhook DEVE vir ANTES do express.json()
  // para preservar o raw body para verificação de assinatura
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const { handleStripeWebhook } = await import("../stripe/webhook");
      return handleStripeWebhook(req, res);
    }
  );

  // Health check endpoint for Easypanel/Load Balancers
  app.get("/health", (_req, res) => {
    res.status(200).send("OK");
  });

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Serve uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // OAuth callback under /api/oauth/callback
  // OAuth routes removed
  // registerOAuthRoutes(app);
  // DB Migration & Health Check
  const waitForDatabase = async (attempts = 60, delay = 5000) => {
    while (attempts > 0) {
      try {
        const { getDb } = await import("../db");
        const db = await getDb();
        if (db) {
          // Test query
          await db.execute(sql`SELECT 1`);
          console.log("[Startup] ✅ Database connected successfully.");
          return db;
        }
      } catch (err) {
        console.warn(`[Startup] Database not ready, retrying in ${delay / 1000}s... (${attempts} attempts left)`, err);
      }
      await new Promise(resolve => setTimeout(resolve, delay));
      attempts--;
    }
    throw new Error("Unable to connect to database after multiple attempts");
  };

  try {
    const db = await waitForDatabase();

    if (db) {
      const migrationsFolder = path.join(process.cwd(), "drizzle");
      console.log(`[Startup] Running DB migrations from: ${migrationsFolder}`);

      const { migrate } = await import("drizzle-orm/node-postgres/migrator");
      await migrate(db, { migrationsFolder });

    }
  } catch (err: any) {
    console.error("[Startup] Migration failed:", err.message);

    // Self-healing: If migration history is corrupted (file not found), or tables already exist, wipe and retry
    if (err.message.includes("not found") || err.message.includes("mismatch") || err.message.includes("checksum") || err.message.includes("already exists") || err.message.includes("duplicate") || err.message.includes("CREATE TABLE") || err.code === "22000" || err.code === "42P07") {
      console.log("[Startup] 🚨 DETECTED CORRUPTED MIGRATION STATE. INITIATING AUTO-REPAIR (RESET DB)...");
      try {
        const { getDb } = await import("../db");
        const db = await getDb();
        if (db) {
          // Dangerous: Wipes the entire database to fix the broken state
          await db.execute(sql`DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO postgres; GRANT ALL ON SCHEMA public TO public;`);
          console.log("[Startup] ✅ Database wiped successfully.");

          console.log("[Startup] Retrying migration request...");
          const migrationsFolder = path.join(process.cwd(), "drizzle");
          const { migrate } = await import("drizzle-orm/node-postgres/migrator");
          await migrate(db, { migrationsFolder });
          console.log("[Startup] ✅ Re-migration successful.");
        }
      } catch (retryErr) {
        console.error("[Startup] ❌ Auto-repair failed:", retryErr);
        process.exit(1);
      }
    } else {
      console.error("[Startup] Critical DB Error. Exiting.");
      process.exit(1);
    }
  }

  // API Route: n8n Webhook Listener (Step 11 of Workflow)
  app.post("/api/n8n/webhook", express.json(), async (req, res) => {
    try {
      // Basic security check (if env var is set)
      if (process.env.N8N_WEBHOOK_SECRET && req.headers["x-n8n-secret"] !== process.env.N8N_WEBHOOK_SECRET) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { memoryId, status, videoUrl, musicUrl, bookUrl, podcastUrl, thumbnailUrl, error } = req.body;

      if (!memoryId || !status) {
        return res.status(400).json({ error: "Missing memoryId or status" });
      }

      const { getDb, createNotification } = await import("../db");
      const db = await getDb();
      if (!db) return res.status(503).json({ error: "Database unavailable" });

      const { memories, users } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");

      // Update memory
      await db.update(memories)
        .set({
          status: status as any,
          videoUrl,
          musicUrl,
          bookUrl,
          podcastUrl,
          thumbnailUrl,
          updatedAt: new Date(),
        })
        .where(eq(memories.id, Number(memoryId)));

      // Notify User
      const [memory] = await db.select().from(memories).where(eq(memories.id, Number(memoryId)));

      if (memory) {
        if (status === "completed") {
          await createNotification({
            userId: memory.userId,
            type: "memory_completed",
            title: "Sua memória está pronta! 🎉",
            message: `O processamento da sua memória "${memory.title}" foi concluído.`,
            link: `/my-memories/${memoryId}`,
            priority: "high",
            isRead: false
          });
        } else if (status === "failed") {
          await createNotification({
            userId: memory.userId,
            type: "memory_failed",
            title: "Falha no processamento",
            message: `Houve um erro ao criar sua memória: ${error || "Erro desconhecido"}`,
            priority: "urgent",
            isRead: false
          });

          // Refund credits? (Optional logic here)
        }
      }

      return res.json({ success: true });
    } catch (err: any) {
      console.error("[n8n Webhook] Error:", err);
      return res.status(500).json({ error: err.message });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
