/**
 * Image generation helper using internal ImageService
 *
 * Example usage:
 *   const { url: imageUrl } = await generateImage({
 *     prompt: "A serene landscape with mountains"
 *   });
 *
 * For editing:
 *   const { url: imageUrl } = await generateImage({
 *     prompt: "Add a rainbow to this landscape",
 *     originalImages: [{
 *       url: "https://example.com/original.jpg",
 *       mimeType: "image/jpeg"
 *     }]
 *   });
 */
import { storagePut } from "server/storage";
import { ENV } from "./env";

export type GenerateImageOptions = {
  prompt: string;
  originalImages?: Array<{
    url?: string;
    b64Json?: string;
    mimeType?: string;
  }>;
};

export type GenerateImageResponse = {
  url?: string;
};

export async function generateImage(
  options: GenerateImageOptions
): Promise<GenerateImageResponse> {
  console.log("[Mock] Generating image for:", options.prompt);

  // Download a placeholder image since we don't have an external generator configured yet.
  // In production, you would replace this with an OpenAI DALL-E call.
  const placeholderUrl = `https://placehold.co/1024x1024/png?text=${encodeURIComponent(options.prompt.substring(0, 20))}`;

  try {
    const response = await fetch(placeholderUrl);
    if (!response.ok) throw new Error("Failed to fetch placeholder");

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to Local Storage
    const { url } = await storagePut(
      `generated/${Date.now()}.png`,
      buffer,
      "image/png"
    );

    return { url };
  } catch (error) {
    console.error("Image generation failed:", error);
    throw new Error("Failed to generate image (Mock)");
  }
}
