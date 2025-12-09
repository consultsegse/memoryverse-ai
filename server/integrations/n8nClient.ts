/**
 * Cliente n8n - MemoryVerse AI
 * 
 * Gerencia comunicação com workflows n8n via webhooks
 */

import { ENV } from "../_core/env";

export interface MemoryWebhookPayload {
    memoryId: number;
    userId: number;
    story: string;
    format: "video" | "music" | "book" | "podcast";
    title: string;
}

export interface N8nResponse {
    success: boolean;
    message?: string;
    executionId?: string;
}

/**
 * Verifica se n8n está configurado e acessível
 */
export async function checkN8nHealth(): Promise<boolean> {
    if (!ENV.n8nWebhookUrl) {
        console.warn("[n8n] N8N_WEBHOOK_URL not configured");
        return false;
    }

    try {
        // Tenta fazer um HEAD request para verificar conectividade
        const response = await fetch(ENV.n8nWebhookUrl, {
            method: "HEAD",
            signal: AbortSignal.timeout(5000), // 5s timeout
        });

        return response.ok || response.status === 404; // 404 é ok, significa que n8n está rodando
    } catch (error) {
        console.error("[n8n] Health check failed:", error);
        return false;
    }
}

/**
 * Dispara processamento de memória via webhook n8n
 * Com retry automático em caso de falha
 */
export async function triggerMemoryProcessing(
    payload: MemoryWebhookPayload,
    retries = 2
): Promise<{ success: boolean; usedFallback: boolean; error?: string }> {
    if (!ENV.n8nWebhookUrl) {
        console.warn("[n8n] Webhook URL not configured, skipping");
        return { success: false, usedFallback: true, error: "N8N_WEBHOOK_URL not configured" };
    }

    const webhookUrl = `${ENV.n8nWebhookUrl}/memory-created`;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            console.log(`[n8n] Triggering memory processing (attempt ${attempt + 1}/${retries + 1})`, {
                memoryId: payload.memoryId,
                format: payload.format,
                webhookUrl,
            });

            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(ENV.n8nWebhookSecret && { "X-Webhook-Secret": ENV.n8nWebhookSecret }),
                },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(10000), // 10s timeout
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Webhook returned ${response.status}: ${errorText}`);
            }

            const data = await response.json() as N8nResponse;

            console.log("[n8n] Memory processing triggered successfully", {
                memoryId: payload.memoryId,
                executionId: data.executionId,
            });

            return { success: true, usedFallback: false };
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            console.error(`[n8n] Attempt ${attempt + 1} failed:`, lastError.message);

            // Se não for a última tentativa, aguarda antes de tentar novamente
            if (attempt < retries) {
                const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
                console.log(`[n8n] Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    // Todas as tentativas falharam
    console.error("[n8n] All retry attempts failed, will use fallback", {
        error: lastError?.message,
        memoryId: payload.memoryId,
    });

    return {
        success: false,
        usedFallback: true,
        error: lastError?.message || "Unknown error",
    };
}

/**
 * Dispara webhook de novo usuário registrado
 */
export async function triggerUserRegistered(userId: number, email: string, name: string) {
    if (!ENV.n8nWebhookUrl) return;

    try {
        await fetch(`${ENV.n8nWebhookUrl}/user-registered`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, email, name }),
            signal: AbortSignal.timeout(5000),
        });

        console.log("[n8n] User registration webhook triggered", { userId, email });
    } catch (error) {
        console.error("[n8n] Failed to trigger user registration webhook:", error);
        // Não falha silenciosamente - email marketing não é crítico
    }
}

/**
 * Dispara webhook de memória publicada (para redes sociais)
 */
export async function triggerMemoryPublished(memoryId: number, userId: number) {
    if (!ENV.n8nWebhookUrl) return;

    try {
        await fetch(`${ENV.n8nWebhookUrl}/memory-published`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ memoryId, userId }),
            signal: AbortSignal.timeout(5000),
        });

        console.log("[n8n] Memory published webhook triggered", { memoryId });
    } catch (error) {
        console.error("[n8n] Failed to trigger memory published webhook:", error);
    }
}

/**
 * Dispara moderação de conteúdo
 */
export async function triggerContentModeration(
    contentId: number,
    content: string,
    userId: number
): Promise<{ safe: boolean; categories: string[] }> {
    if (!ENV.n8nWebhookUrl) {
        // Fallback: assume seguro se n8n não configurado
        return { safe: true, categories: [] };
    }

    try {
        const response = await fetch(`${ENV.n8nWebhookUrl}/moderate-content`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contentId, content, userId }),
            signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
            throw new Error(`Moderation failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("[n8n] Content moderation failed:", error);
        // Em caso de erro, assume seguro para não bloquear usuário
        return { safe: true, categories: [] };
    }
}
