import { promises as fs } from "fs";
import path from "path";

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
fs.mkdir(UPLOADS_DIR, { recursive: true }).catch(console.error);

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  // Clean the key and ensure valid filename
  const safeKey = relKey.replace(/^[\/\\]+/, "").replace(/\.\./g, ""); // Prevent traversal
  const filePath = path.join(UPLOADS_DIR, safeKey);
  const dirPath = path.dirname(filePath);

  // Ensure subdirectory exists
  await fs.mkdir(dirPath, { recursive: true });

  let buffer: Buffer;
  if (Buffer.isBuffer(data)) {
    buffer = data;
  } else if (typeof data === "string") {
    buffer = Buffer.from(data);
  } else {
    buffer = Buffer.from(data);
  }

  await fs.writeFile(filePath, buffer);

  // Return local URL (served by static middleware)
  const url = `/uploads/${safeKey.replace(/\\/g, "/")}`; // Normalize slashes for URL
  return { key: safeKey, url };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const safeKey = relKey.replace(/^[\/\\]+/, "").replace(/\.\./g, "");
  const url = `/uploads/${safeKey.replace(/\\/g, "/")}`;
  return { key: safeKey, url };
}
