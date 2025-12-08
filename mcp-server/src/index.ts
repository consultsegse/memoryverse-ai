#!/usr/bin/env node

/**
 * MemoryVerse AI - MCP Support Agent Server
 * 
 * Este é um servidor MCP (Model Context Protocol) que expõe o agente de suporte
 * Luna como uma ferramenta utilizável por outros sistemas.
 * 
 * Funcionalidades:
 * - Tools: chat, create_memory, check_plan, upgrade_plan, get_examples
 * - Resources: knowledge_base, faq, conversation_flows, user_docs
 * - Prompts: system_prompt, conversation_templates
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// Schemas de validação
const ChatInputSchema = z.object({
  user_id: z.string().describe("ID do usuário"),
  message: z.string().describe("Mensagem do usuário"),
  context: z.object({
    plan: z.enum(["free", "creator", "pro"]).optional(),
    credits_remaining: z.number().optional(),
    last_memory_created: z.string().optional(),
  }).optional(),
});

const CreateMemoryInputSchema = z.object({
  user_id: z.string().describe("ID do usuário"),
  story: z.string().min(50).describe("História a ser transformada (mínimo 50 caracteres)"),
  formats: z.array(z.enum(["video", "music", "book", "podcast"])).describe("Formatos desejados"),
});

const CheckPlanInputSchema = z.object({
  user_id: z.string().describe("ID do usuário"),
});

const UpgradePlanInputSchema = z.object({
  user_id: z.string().describe("ID do usuário"),
  target_plan: z.enum(["creator", "pro"]).describe("Plano desejado"),
});

const GetExamplesInputSchema = z.object({
  format: z.enum(["video", "music", "book", "podcast", "all"]).optional().describe("Filtrar por formato"),
  limit: z.number().min(1).max(20).optional().default(5).describe("Número de exemplos"),
});

// Servidor MCP
const server = new Server(
  {
    name: "memoryverse-agent",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

/**
 * TOOLS - Ferramentas disponíveis
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "chat",
        description: "Conversar com o agente Luna do MemoryVerse AI. Use para responder perguntas, guiar usuários e fornecer suporte.",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "ID único do usuário",
            },
            message: {
              type: "string",
              description: "Mensagem do usuário",
            },
            context: {
              type: "object",
              description: "Contexto do usuário (plano, créditos, etc)",
              properties: {
                plan: {
                  type: "string",
                  enum: ["free", "creator", "pro"],
                  description: "Plano atual do usuário",
                },
                credits_remaining: {
                  type: "number",
                  description: "Créditos restantes",
                },
                last_memory_created: {
                  type: "string",
                  description: "Data da última memória criada (ISO 8601)",
                },
              },
            },
          },
          required: ["user_id", "message"],
        },
      },
      {
        name: "create_memory",
        description: "Criar uma nova memória transformando uma história em vídeo, música, livro ou podcast.",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "ID do usuário",
            },
            story: {
              type: "string",
              description: "História a ser transformada (50-2000 palavras)",
              minLength: 50,
            },
            formats: {
              type: "array",
              items: {
                type: "string",
                enum: ["video", "music", "book", "podcast"],
              },
              description: "Formatos desejados (pode escolher múltiplos)",
            },
          },
          required: ["user_id", "story", "formats"],
        },
      },
      {
        name: "check_plan",
        description: "Verificar informações do plano do usuário (plano atual, créditos restantes, data de renovação).",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "ID do usuário",
            },
          },
          required: ["user_id"],
        },
      },
      {
        name: "upgrade_plan",
        description: "Iniciar processo de upgrade de plano (Free → Creator ou Pro).",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "ID do usuário",
            },
            target_plan: {
              type: "string",
              enum: ["creator", "pro"],
              description: "Plano desejado",
            },
          },
          required: ["user_id", "target_plan"],
        },
      },
      {
        name: "get_examples",
        description: "Obter exemplos de memórias criadas para mostrar ao usuário.",
        inputSchema: {
          type: "object",
          properties: {
            format: {
              type: "string",
              enum: ["video", "music", "book", "podcast", "all"],
              description: "Filtrar por formato específico",
            },
            limit: {
              type: "number",
              minimum: 1,
              maximum: 20,
              default: 5,
              description: "Número de exemplos a retornar",
            },
          },
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "chat": {
        const input = ChatInputSchema.parse(args);
        
        // Simular resposta do agente (em produção, chamar API real)
        const response = await handleChat(input);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      }

      case "create_memory": {
        const input = CreateMemoryInputSchema.parse(args);
        
        const response = await handleCreateMemory(input);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      }

      case "check_plan": {
        const input = CheckPlanInputSchema.parse(args);
        
        const response = await handleCheckPlan(input);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      }

      case "upgrade_plan": {
        const input = UpgradePlanInputSchema.parse(args);
        
        const response = await handleUpgradePlan(input);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      }

      case "get_examples": {
        const input = GetExamplesInputSchema.parse(args || {});
        
        const response = await handleGetExamples(input);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid input: ${error.message}`);
    }
    throw error;
  }
});

/**
 * RESOURCES - Recursos disponíveis
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "memoryverse://knowledge-base",
        name: "Knowledge Base",
        description: "Base de conhecimento completa do MemoryVerse AI (FAQ, troubleshooting, casos de uso)",
        mimeType: "text/markdown",
      },
      {
        uri: "memoryverse://faq",
        name: "FAQ",
        description: "Perguntas frequentes organizadas por categoria",
        mimeType: "text/markdown",
      },
      {
        uri: "memoryverse://conversation-flows",
        name: "Conversation Flows",
        description: "Fluxos de conversação estruturados e árvore de decisão",
        mimeType: "text/markdown",
      },
      {
        uri: "memoryverse://user-documentation",
        name: "User Documentation",
        description: "Documentação completa para usuários finais",
        mimeType: "text/markdown",
      },
      {
        uri: "memoryverse://pricing",
        name: "Pricing Information",
        description: "Informações detalhadas sobre planos e preços",
        mimeType: "application/json",
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case "memoryverse://knowledge-base":
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: await getKnowledgeBase(),
          },
        ],
      };

    case "memoryverse://faq":
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: await getFAQ(),
          },
        ],
      };

    case "memoryverse://conversation-flows":
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: await getConversationFlows(),
          },
        ],
      };

    case "memoryverse://user-documentation":
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: await getUserDocumentation(),
          },
        ],
      };

    case "memoryverse://pricing":
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(getPricingInfo(), null, 2),
          },
        ],
      };

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

/**
 * PROMPTS - Prompts disponíveis
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "system_prompt",
        description: "System prompt completo do agente Luna",
        arguments: [],
      },
      {
        name: "conversation_template",
        description: "Template de conversação para um fluxo específico",
        arguments: [
          {
            name: "flow",
            description: "Nome do fluxo (creation, discovery, plans, support, feedback)",
            required: true,
          },
        ],
      },
    ],
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "system_prompt":
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: await getSystemPrompt(),
            },
          },
        ],
      };

    case "conversation_template":
      const flow = args?.flow as string;
      if (!flow) {
        throw new Error("Missing required argument: flow");
      }
      
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: await getConversationTemplate(flow),
            },
          },
        ],
      };

    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
});

/**
 * Handler functions - Em produção, estas funções chamariam a API real
 */

async function handleChat(input: z.infer<typeof ChatInputSchema>) {
  // TODO: Integrar com API real do MemoryVerse
  // Por enquanto, retorna resposta simulada
  
  return {
    reply: "Olá! 👋 Eu sou a Luna, assistente do MemoryVerse AI. Como posso te ajudar hoje?",
    action: "reply",
    metadata: {
      confidence: 0.95,
      next_step: "await_user_response",
    },
  };
}

async function handleCreateMemory(input: z.infer<typeof CreateMemoryInputSchema>) {
  // TODO: Integrar com API real
  
  return {
    success: true,
    memory_ids: [1, 2], // IDs simulados
    message: `Memórias criadas com sucesso! Processando ${input.formats.length} formato(s).`,
    estimated_time: "8-12 minutos",
  };
}

async function handleCheckPlan(input: z.infer<typeof CheckPlanInputSchema>) {
  // TODO: Buscar dados reais do banco
  
  return {
    plan: "free",
    credits_remaining: 3,
    credits_total: 3,
    renewal_date: null,
    features: {
      quality: "Padrão (720p, 128kbps)",
      watermark: true,
      support: "Email (48h)",
    },
  };
}

async function handleUpgradePlan(input: z.infer<typeof UpgradePlanInputSchema>) {
  // TODO: Gerar checkout URL real
  
  const prices = {
    creator: { monthly: 97, annual: 931 },
    pro: { monthly: 297, annual: 2851 },
  };
  
  return {
    success: true,
    checkout_url: `https://memoryverse.ai/checkout/${input.target_plan}`,
    plan: input.target_plan,
    price: prices[input.target_plan],
    message: `Redirecionando para checkout do plano ${input.target_plan}...`,
  };
}

async function handleGetExamples(input: z.infer<typeof GetExamplesInputSchema>) {
  // TODO: Buscar exemplos reais do banco
  
  const examples = [
    {
      id: 1,
      title: "História de Amor da Vovó",
      format: "video",
      thumbnail: "https://example.com/thumb1.jpg",
      url: "https://example.com/video1.mp4",
      duration: "5:32",
    },
    {
      id: 2,
      title: "Memórias de Infância",
      format: "podcast",
      thumbnail: "https://example.com/thumb2.jpg",
      url: "https://example.com/podcast2.mp3",
      duration: "8:15",
    },
  ];
  
  return {
    examples: examples.slice(0, input.limit),
    total: examples.length,
  };
}

/**
 * Resource getters - Carregam conteúdo dos arquivos de documentação
 */

async function getKnowledgeBase(): Promise<string> {
  // TODO: Carregar do arquivo real
  return `# Knowledge Base - MemoryVerse AI\n\n[Conteúdo da base de conhecimento...]`;
}

async function getFAQ(): Promise<string> {
  return `# FAQ - MemoryVerse AI\n\n## Quanto custa?\n\nTemos 3 planos:\n- Free: R$ 0 (3 memórias)\n- Creator: R$ 97/mês (20 memórias)\n- Pro: R$ 297/mês (ilimitado)`;
}

async function getConversationFlows(): Promise<string> {
  return `# Conversation Flows\n\n[Fluxos de conversação...]`;
}

async function getUserDocumentation(): Promise<string> {
  return `# User Documentation\n\n[Documentação do usuário...]`;
}

function getPricingInfo() {
  return {
    plans: [
      {
        id: "free",
        name: "Free",
        price: { monthly: 0, annual: 0 },
        credits: 3,
        features: ["3 memórias vitalícias", "Todos os formatos", "Qualidade padrão", "Com marca d'água"],
      },
      {
        id: "creator",
        name: "Creator",
        price: { monthly: 97, annual: 931 },
        credits: 20,
        features: ["20 memórias/mês", "Qualidade Full HD", "Sem marca d'água", "Suporte prioritário"],
      },
      {
        id: "pro",
        name: "Pro",
        price: { monthly: 297, annual: 2851 },
        credits: -1, // unlimited
        features: ["Memórias ilimitadas", "Qualidade 4K", "API de integração", "Suporte VIP"],
      },
    ],
  };
}

async function getSystemPrompt(): Promise<string> {
  // TODO: Carregar do arquivo real
  return `Você é Luna, a assistente virtual oficial do MemoryVerse AI...`;
}

async function getConversationTemplate(flow: string): Promise<string> {
  const templates: Record<string, string> = {
    creation: "Template para fluxo de criação de memória...",
    discovery: "Template para fluxo de descoberta do produto...",
    plans: "Template para consulta de planos...",
    support: "Template para suporte técnico...",
    feedback: "Template para coleta de feedback...",
  };
  
  return templates[flow] || "Template não encontrado";
}

/**
 * Inicializar servidor
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("MemoryVerse AI MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
