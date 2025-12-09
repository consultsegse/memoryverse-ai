#!/usr/bin/env tsx
/**
 * Script de Teste de Integrações - MemoryVerse AI
 * 
 * Testa todas as integrações externas e componentes do sistema:
 * - Banco de dados
 * - n8n Webhooks
 * - OpenAI API
 * - ElevenLabs API
 * - Stripe API
 * - Suno AI
 */

import dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), ".env") });

interface TestResult {
    name: string;
    status: "✅ PASS" | "❌ FAIL" | "⚠️ SKIP";
    message: string;
    details?: string;
}

const results: TestResult[] = [];

function logTest(result: TestResult) {
    results.push(result);
    console.log(`\n${result.status} ${result.name}`);
    console.log(`   ${result.message}`);
    if (result.details) {
        console.log(`   ${result.details}`);
    }
}

async function testDatabase() {
    console.log("\n🗄️  Testando Banco de Dados...");

    try {
        const { getDb } = await import("../db");
        const db = await getDb();

        if (!db) {
            logTest({
                name: "Database Connection",
                status: "❌ FAIL",
                message: "Não foi possível conectar ao banco de dados",
                details: "Verifique DATABASE_URL no .env"
            });
            return;
        }

        // Test simple query
        const { users } = await import("../../drizzle/schema");
        const userCount = await db.select().from(users);

        logTest({
            name: "Database Connection",
            status: "✅ PASS",
            message: `Conectado com sucesso! ${userCount.length} usuários encontrados`,
        });
    } catch (error) {
        logTest({
            name: "Database Connection",
            status: "❌ FAIL",
            message: "Erro ao conectar ao banco",
            details: error instanceof Error ? error.message : String(error)
        });
    }
}

async function testN8nWebhook() {
    console.log("\n🔗 Testando n8n Webhook...");

    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
        logTest({
            name: "n8n Webhook",
            status: "⚠️ SKIP",
            message: "N8N_WEBHOOK_URL não configurado",
            details: "Configure N8N_WEBHOOK_URL no .env para testar"
        });
        return;
    }

    try {
        const testPayload = {
            memoryId: 999,
            userId: 1,
            story: "Test story for integration",
            format: "video",
            title: "Test Memory",
            test: true
        };

        const response = await fetch(`${webhookUrl}/memory-created`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(testPayload),
        });

        if (response.ok) {
            logTest({
                name: "n8n Webhook",
                status: "✅ PASS",
                message: `Webhook respondeu com status ${response.status}`,
                details: `URL: ${webhookUrl}/memory-created`
            });
        } else {
            logTest({
                name: "n8n Webhook",
                status: "❌ FAIL",
                message: `Webhook retornou status ${response.status}`,
                details: await response.text()
            });
        }
    } catch (error) {
        logTest({
            name: "n8n Webhook",
            status: "❌ FAIL",
            message: "Erro ao chamar webhook",
            details: error instanceof Error ? error.message : String(error)
        });
    }
}

async function testOpenAI() {
    console.log("\n🤖 Testando OpenAI API...");

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        logTest({
            name: "OpenAI API",
            status: "⚠️ SKIP",
            message: "OPENAI_API_KEY não configurado",
            details: "Configure OPENAI_API_KEY no .env para testar"
        });
        return;
    }

    try {
        const { default: OpenAI } = await import("openai");
        const openai = new OpenAI({ apiKey });

        // Test simple completion
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Say 'test successful' in Portuguese" }],
            max_tokens: 10,
        });

        const response = completion.choices[0]?.message?.content || "";

        logTest({
            name: "OpenAI API",
            status: "✅ PASS",
            message: "API respondeu com sucesso",
            details: `Resposta: "${response}"`
        });
    } catch (error) {
        logTest({
            name: "OpenAI API",
            status: "❌ FAIL",
            message: "Erro ao chamar OpenAI",
            details: error instanceof Error ? error.message : String(error)
        });
    }
}

async function testElevenLabs() {
    console.log("\n🎙️  Testando ElevenLabs API...");

    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
        logTest({
            name: "ElevenLabs API",
            status: "⚠️ SKIP",
            message: "ELEVENLABS_API_KEY não configurado",
            details: "Configure ELEVENLABS_API_KEY no .env para testar (opcional)"
        });
        return;
    }

    try {
        // Test API connection by listing voices
        const response = await fetch("https://api.elevenlabs.io/v1/voices", {
            headers: {
                "xi-api-key": apiKey,
            },
        });

        if (response.ok) {
            const data = await response.json();
            logTest({
                name: "ElevenLabs API",
                status: "✅ PASS",
                message: "API conectada com sucesso",
                details: `${data.voices?.length || 0} vozes disponíveis`
            });
        } else {
            logTest({
                name: "ElevenLabs API",
                status: "❌ FAIL",
                message: `API retornou status ${response.status}`,
                details: await response.text()
            });
        }
    } catch (error) {
        logTest({
            name: "ElevenLabs API",
            status: "❌ FAIL",
            message: "Erro ao chamar ElevenLabs",
            details: error instanceof Error ? error.message : String(error)
        });
    }
}

async function testStripe() {
    console.log("\n💳 Testando Stripe API...");

    const apiKey = process.env.STRIPE_SECRET_KEY;

    if (!apiKey) {
        logTest({
            name: "Stripe API",
            status: "⚠️ SKIP",
            message: "STRIPE_SECRET_KEY não configurado",
            details: "Configure STRIPE_SECRET_KEY no .env para testar (opcional)"
        });
        return;
    }

    try {
        const { default: Stripe } = await import("stripe");
        const stripe = new Stripe(apiKey);

        // Test by retrieving account info
        const account = await stripe.balance.retrieve();

        logTest({
            name: "Stripe API",
            status: "✅ PASS",
            message: "API conectada com sucesso",
            details: `Conta verificada`
        });
    } catch (error) {
        logTest({
            name: "Stripe API",
            status: "❌ FAIL",
            message: "Erro ao chamar Stripe",
            details: error instanceof Error ? error.message : String(error)
        });
    }
}

async function testEnvironmentVariables() {
    console.log("\n⚙️  Verificando Variáveis de Ambiente...");

    const required = [
        { name: "DATABASE_URL", value: process.env.DATABASE_URL },
        { name: "JWT_SECRET", value: process.env.JWT_SECRET },
    ];

    const optional = [
        { name: "N8N_WEBHOOK_URL", value: process.env.N8N_WEBHOOK_URL },
        { name: "OPENAI_API_KEY", value: process.env.OPENAI_API_KEY },
        { name: "ELEVENLABS_API_KEY", value: process.env.ELEVENLABS_API_KEY },
        { name: "STRIPE_SECRET_KEY", value: process.env.STRIPE_SECRET_KEY },
    ];

    let allRequiredPresent = true;

    for (const env of required) {
        if (!env.value) {
            logTest({
                name: `Env: ${env.name}`,
                status: "❌ FAIL",
                message: "Variável obrigatória não configurada",
            });
            allRequiredPresent = false;
        } else {
            logTest({
                name: `Env: ${env.name}`,
                status: "✅ PASS",
                message: "Configurado",
            });
        }
    }

    for (const env of optional) {
        if (!env.value) {
            logTest({
                name: `Env: ${env.name}`,
                status: "⚠️ SKIP",
                message: "Variável opcional não configurada",
            });
        } else {
            logTest({
                name: `Env: ${env.name}`,
                status: "✅ PASS",
                message: "Configurado",
            });
        }
    }

    if (!allRequiredPresent) {
        console.log("\n⚠️  Algumas variáveis obrigatórias não estão configuradas!");
    }
}

async function runAllTests() {
    console.log("╔════════════════════════════════════════════════════════╗");
    console.log("║  🧪 MemoryVerse AI - Teste de Integrações            ║");
    console.log("╚════════════════════════════════════════════════════════╝");

    await testEnvironmentVariables();
    await testDatabase();
    await testN8nWebhook();
    await testOpenAI();
    await testElevenLabs();
    await testStripe();

    // Summary
    console.log("\n\n╔════════════════════════════════════════════════════════╗");
    console.log("║  📊 Resumo dos Testes                                 ║");
    console.log("╚════════════════════════════════════════════════════════╝");

    const passed = results.filter(r => r.status === "✅ PASS").length;
    const failed = results.filter(r => r.status === "❌ FAIL").length;
    const skipped = results.filter(r => r.status === "⚠️ SKIP").length;

    console.log(`\n✅ Passou: ${passed}`);
    console.log(`❌ Falhou: ${failed}`);
    console.log(`⚠️  Pulado: ${skipped}`);
    console.log(`📝 Total: ${results.length}`);

    if (failed > 0) {
        console.log("\n⚠️  Alguns testes falharam. Verifique os detalhes acima.");
        process.exit(1);
    } else if (passed === 0) {
        console.log("\n⚠️  Nenhum teste passou. Configure as variáveis de ambiente.");
        process.exit(1);
    } else {
        console.log("\n✅ Todos os testes configurados passaram!");
        process.exit(0);
    }
}

// Run tests
runAllTests().catch((error) => {
    console.error("\n❌ Erro fatal ao executar testes:", error);
    process.exit(1);
});
