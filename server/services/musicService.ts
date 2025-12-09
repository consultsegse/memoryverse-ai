import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import { ENV } from "../_core/env";

/**
 * Music generation service using MusicGen (Meta's open-source model)
 * FREE alternative to Mubert/Suno AI
 */

export interface MusicGenerationParams {
    prompt: string;
    duration?: number; // in seconds, default 180 (3 minutes)
    style?: string; // e.g., "emotional", "upbeat", "cinematic"
}

export interface MusicGenerationResult {
    url: string;
    filePath: string;
    duration: number;
}

/**
 * Generate music using MusicGen (Python subprocess)
 */
export async function generateMusic(
    params: MusicGenerationParams
): Promise<MusicGenerationResult> {
    const { prompt, duration = 180, style = "emotional, cinematic" } = params;

    console.log(`[MusicService] Generating music with MusicGen: "${prompt}" (${duration}s)`);

    try {
        // Combine prompt with style
        const fullPrompt = `${style}, ${prompt}`;

        // Generate unique filename
        const timestamp = Date.now();
        const filename = `music_${timestamp}`;
        const outputDir = path.join(ENV.uploadDir, "music");
        const outputPath = path.join(outputDir, filename);

        // Ensure output directory exists
        await fs.mkdir(outputDir, { recursive: true });

        // Prepare input for Python script
        const input = JSON.stringify({
            prompt: fullPrompt,
            duration: duration,
            output_path: outputPath,
        });

        // Run Python script
        const pythonScript = path.join(__dirname, "../scripts/musicgen.py");
        const result = await runPythonScript(pythonScript, input);

        if (!result.success) {
            throw new Error(`MusicGen failed: ${result.error}`);
        }

        // Get public URL
        const publicUrl = getFileUrl(result.file_path);

        console.log(`[MusicService] Music generated successfully: ${publicUrl}`);

        return {
            url: publicUrl,
            filePath: result.file_path,
            duration: duration,
        };
    } catch (error) {
        console.error("[MusicService] Error generating music:", error);
        throw error;
    }
}

/**
 * Run Python script and return JSON result
 */
function runPythonScript(scriptPath: string, input: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const python = spawn("python3", [scriptPath]);

        let stdout = "";
        let stderr = "";

        // Send input via stdin
        python.stdin.write(input);
        python.stdin.end();

        // Collect output
        python.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        python.stderr.on("data", (data) => {
            stderr += data.toString();
            // Log progress to console
            console.log(`[MusicGen] ${data.toString().trim()}`);
        });

        python.on("close", (code) => {
            if (code === 0) {
                try {
                    const result = JSON.parse(stdout);
                    resolve(result);
                } catch (error) {
                    reject(new Error(`Failed to parse Python output: ${stdout}`));
                }
            } else {
                reject(new Error(`Python script failed with code ${code}: ${stderr}`));
            }
        });

        python.on("error", (error) => {
            reject(new Error(`Failed to start Python: ${error.message}`));
        });
    });
}

/**
 * Get public URL for uploaded file
 */
function getFileUrl(filePath: string): string {
    const baseUrl = process.env.VITE_APP_URL || "http://localhost:3000";
    const relativePath = filePath.replace(ENV.uploadDir, "");
    return `${baseUrl}/uploads${relativePath}`;
}

/**
 * Get music style tags based on story emotion/theme
 */
export function getMusicStyleFromStory(story: string): string {
    const storyLower = story.toLowerCase();

    // Emotional keywords
    if (
        storyLower.includes("amor") ||
        storyLower.includes("saudade") ||
        storyLower.includes("emoção")
    ) {
        return "emotional piano soft romantic";
    }

    if (
        storyLower.includes("alegria") ||
        storyLower.includes("feliz") ||
        storyLower.includes("festa")
    ) {
        return "upbeat happy energetic pop";
    }

    if (
        storyLower.includes("aventura") ||
        storyLower.includes("viagem") ||
        storyLower.includes("descoberta")
    ) {
        return "cinematic epic orchestral adventure";
    }

    if (
        storyLower.includes("tristeza") ||
        storyLower.includes("perda") ||
        storyLower.includes("despedida")
    ) {
        return "sad melancholic piano strings";
    }

    if (
        storyLower.includes("família") ||
        storyLower.includes("casa") ||
        storyLower.includes("infância")
    ) {
        return "warm nostalgic acoustic gentle";
    }

    // Default: emotional cinematic
    return "emotional cinematic ambient";
}
