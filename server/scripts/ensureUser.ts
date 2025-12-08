import "dotenv/config";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "../services/authService";
import { nanoid } from "nanoid";

async function main() {
    const db = await getDb();
    if (!db) { console.error("No DB"); return; }

    const email = "gilmar.santos.santana@gmail.com";
    const pass = "@G071917j#";

    const [existing] = await db.select().from(users).where(eq(users.email, email));

    if (existing) {
        console.log("User exists:", existing.email, "Role:", existing.role);
        // Update password just in case
        const hashedPassword = await hashPassword(pass);
        await db.update(users).set({ password: hashedPassword }).where(eq(users.id, existing.id));
        console.log("Password updated to ensure login works.");
    } else {
        console.log("User not found. Registering...");
        const hashedPassword = await hashPassword(pass);
        await db.insert(users).values({
            name: "Gilmar Santos",
            email: email,
            password: hashedPassword,
            openId: nanoid(),
            loginMethod: "email",
            role: "admin", // promote to admin for full testing
            plan: "creator",
            creditsRemaining: 100
        });
        console.log("User created as Admin/Creator.");
    }
}

main().catch(console.error);
