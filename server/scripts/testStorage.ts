import { storagePut } from "../storage";
import { promises as fs } from "fs";
import path from "path";

async function main() {
    console.log("Testing storagePut...");
    try {
        const { url } = await storagePut("test-file.txt", "Hello World content");
        console.log("Success! URL:", url);

        const filePath = path.join(process.cwd(), "uploads", "test-file.txt");
        const exists = await fs.access(filePath).then(() => true).catch(() => false);
        console.log("File exists on disk:", exists, "at", filePath);
    } catch (e) {
        console.error("Storage failed:", e);
    }
}

main();
