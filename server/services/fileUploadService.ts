import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";

// Upload directory configuration
const UPLOAD_BASE_DIR = process.env.UPLOAD_DIR || "/var/www/memoryverse/uploads";

// Ensure upload directories exist
async function ensureUploadDirs() {
    const dirs = [
        path.join(UPLOAD_BASE_DIR, "videos"),
        path.join(UPLOAD_BASE_DIR, "music"),
        path.join(UPLOAD_BASE_DIR, "images"),
        path.join(UPLOAD_BASE_DIR, "podcasts"),
        path.join(UPLOAD_BASE_DIR, "thumbnails"),
        path.join(UPLOAD_BASE_DIR, "temp"),
    ];

    for (const dir of dirs) {
        try {
            await fs.mkdir(dir, { recursive: true });
        } catch (error) {
            console.error(`Failed to create directory ${dir}:`, error);
        }
    }
}

// Initialize directories
ensureUploadDirs().catch(console.error);

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const type = req.body.type || "temp";
        const uploadPath = path.join(UPLOAD_BASE_DIR, type);

        try {
            await fs.mkdir(uploadPath, { recursive: true });
            cb(null, uploadPath);
        } catch (error) {
            cb(error as Error, uploadPath);
        }
    },
    filename: (req, file, cb) => {
        const uniqueId = nanoid(10);
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${uniqueId}${ext}`;
        cb(null, filename);
    },
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/webm",
        "audio/mpeg",
        "audio/wav",
        "audio/mp3",
        "application/pdf",
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} not allowed`));
    }
};

// Multer instance
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB max
    },
});

// Helper to get public URL for uploaded file
export function getFileUrl(filePath: string): string {
    const baseUrl = process.env.VITE_APP_URL || "http://localhost:3000";
    const relativePath = filePath.replace(UPLOAD_BASE_DIR, "");
    return `${baseUrl}/uploads${relativePath}`;
}

// Helper to save base64 image
export async function saveBase64Image(
    base64Data: string,
    type: "images" | "thumbnails" = "images"
): Promise<string> {
    const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
        throw new Error("Invalid base64 image data");
    }

    const ext = matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, "base64");

    const filename = `${Date.now()}-${nanoid(10)}.${ext}`;
    const uploadPath = path.join(UPLOAD_BASE_DIR, type);
    const filePath = path.join(uploadPath, filename);

    await fs.mkdir(uploadPath, { recursive: true });
    await fs.writeFile(filePath, buffer);

    return getFileUrl(filePath);
}

// Helper to save file from URL
export async function saveFileFromUrl(
    url: string,
    type: "videos" | "music" | "images" | "podcasts" | "thumbnails"
): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch file from ${url}`);
    }

    const buffer = await response.arrayBuffer();
    const ext = path.extname(new URL(url).pathname) || ".bin";
    const filename = `${Date.now()}-${nanoid(10)}${ext}`;
    const uploadPath = path.join(UPLOAD_BASE_DIR, type);
    const filePath = path.join(uploadPath, filename);

    await fs.mkdir(uploadPath, { recursive: true });
    await fs.writeFile(filePath, Buffer.from(buffer));

    return getFileUrl(filePath);
}

// Helper to delete file
export async function deleteFile(fileUrl: string): Promise<void> {
    try {
        const baseUrl = process.env.VITE_APP_URL || "http://localhost:3000";
        const relativePath = fileUrl.replace(`${baseUrl}/uploads`, "");
        const filePath = path.join(UPLOAD_BASE_DIR, relativePath);

        await fs.unlink(filePath);
        console.log(`Deleted file: ${filePath}`);
    } catch (error) {
        console.error(`Failed to delete file ${fileUrl}:`, error);
    }
}

// Cleanup old temp files (run daily)
export async function cleanupTempFiles(olderThanDays: number = 1): Promise<void> {
    const tempDir = path.join(UPLOAD_BASE_DIR, "temp");
    const cutoffTime = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;

    try {
        const files = await fs.readdir(tempDir);

        for (const file of files) {
            const filePath = path.join(tempDir, file);
            const stats = await fs.stat(filePath);

            if (stats.mtimeMs < cutoffTime) {
                await fs.unlink(filePath);
                console.log(`Cleaned up temp file: ${file}`);
            }
        }
    } catch (error) {
        console.error("Failed to cleanup temp files:", error);
    }
}

// Get storage stats
export async function getStorageStats(): Promise<{
    totalSize: number;
    fileCount: number;
    byType: Record<string, { size: number; count: number }>;
}> {
    const types = ["videos", "music", "images", "podcasts", "thumbnails"];
    const stats = {
        totalSize: 0,
        fileCount: 0,
        byType: {} as Record<string, { size: number; count: number }>,
    };

    for (const type of types) {
        const typeDir = path.join(UPLOAD_BASE_DIR, type);
        let typeSize = 0;
        let typeCount = 0;

        try {
            const files = await fs.readdir(typeDir);

            for (const file of files) {
                const filePath = path.join(typeDir, file);
                const fileStats = await fs.stat(filePath);
                typeSize += fileStats.size;
                typeCount++;
            }
        } catch (error) {
            // Directory might not exist yet
        }

        stats.byType[type] = { size: typeSize, count: typeCount };
        stats.totalSize += typeSize;
        stats.fileCount += typeCount;
    }

    return stats;
}
