
import "dotenv/config";
import { hashPassword } from "../services/authService";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

async function createAdmin() {
    const db = await getDb();
    if (!db) {
        console.error("Database connection failed");
        process.exit(1);
    }

    const email = process.env.ADMIN_EMAIL || "admin@memoryverse.com.br";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const name = "Super Admin";

    console.log(`Creating admin user: ${email}`);

    // Check if exists
    const [existing] = await db.select().from(users).where(eq(users.email, email));
    if (existing) {
        console.log("Admin user already exists. Updating role to 'admin'...");
        await db.update(users).set({ role: "admin" }).where(eq(users.id, existing.id));
        console.log("Updated.");
        process.exit(0);
    }

    const hashedPassword = await hashPassword(password);

    await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
        openId: nanoid(),
        role: "admin",
        plan: "pro", // Give admin pro plan features
        loginMethod: "email",
        creditsRemaining: 999999
    });

    console.log("Admin user created successfully!");
    process.exit(0);
}

createAdmin().catch(console.error);
