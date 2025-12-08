# 🚀 Guia Completo de Implementação do MemoryVerse AI

**Do Zero ao Avançado - Passo a Passo Completo**

---

## 📋 Índice

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Fase 0: Preparação](#fase-0-preparação)
3. [Fase 1: MVP Básico](#fase-1-mvp-básico)
4. [Fase 2: Integração de IA](#fase-2-integração-de-ia)
5. [Fase 3: Monetização](#fase-3-monetização)
6. [Fase 4: Automação](#fase-4-automação)
7. [Fase 5: Escala e Deploy](#fase-5-escala-e-deploy)
8. [Fase 6: Avançado](#fase-6-avançado)
9. [Checklist Final](#checklist-final)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral do Projeto

O **MemoryVerse AI** é uma plataforma SaaS que transforma histórias e memórias pessoais em conteúdo artístico usando inteligência artificial. Os usuários podem criar vídeos cinematográficos, músicas personalizadas, livros ilustrados e podcasts narrativos a partir de suas histórias.

### Arquitetura Geral

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  - Landing page multilíngue (5 idiomas)                 │
│  - Dashboard com notificações                           │
│  - Sistema de criação de memórias                       │
└────────────────────┬────────────────────────────────────┘
                     │ tRPC
┌────────────────────▼────────────────────────────────────┐
│              BACKEND (Node.js + Express)                 │
│  - Autenticação OAuth (Manus)                           │
│  - API tRPC type-safe                                   │
│  - Processamento de memórias                            │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Database │  │   APIs   │  │   n8n    │
│  (MySQL) │  │    IA    │  │Workflows │
└──────────┘  └──────────┘  └──────────┘
```

### Stack Tecnológico

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Frontend** | React 19 + Vite | 19.x |
| **Styling** | Tailwind CSS 4 | 4.x |
| **Backend** | Node.js + Express | 22.x |
| **API** | tRPC 11 | 11.x |
| **Database** | MySQL (TiDB) | 8.x |
| **ORM** | Drizzle | Latest |
| **Auth** | Manus OAuth | - |
| **Automação** | n8n | Latest |
| **Storage** | AWS S3 | - |

### Funcionalidades Principais

O MemoryVerse AI oferece quatro formatos de transformação de memórias, cada um utilizando diferentes APIs de inteligência artificial para criar conteúdo único e personalizado. Os usuários começam com três memórias gratuitas e podem assinar planos pagos para acesso ilimitado.

**Formatos disponíveis:**

- **Vídeo Cinematográfico**: Transforma histórias em vídeos com narração profissional, imagens geradas por IA e transições cinematográficas
- **Música Personalizada**: Cria composições musicais originais baseadas no tema e emoção da memória
- **Livro Ilustrado**: Gera livros digitais com ilustrações artísticas criadas por IA
- **Podcast Narrativo**: Produz episódios de podcast com narração em voz natural e efeitos sonoros

### Modelo de Negócio

O projeto opera com um modelo freemium de três camadas. Os usuários gratuitos recebem três memórias para experimentar a plataforma. O plano Creator, por R$ 97 mensais, oferece 50 memórias e qualidade HD. O plano Pro, por R$ 297 mensais, inclui memórias ilimitadas, qualidade 4K e licença comercial.

---

## 🎬 Fase 0: Preparação

**Tempo estimado:** 2-4 horas  
**Objetivo:** Configurar todas as contas, ferramentas e ambiente de desenvolvimento necessários.

### Passo 0.1: Criar Contas Necessárias

Antes de iniciar o desenvolvimento, você precisará criar contas em diversos serviços. A maioria oferece planos gratuitos ou trials que são suficientes para começar.

#### Contas Essenciais (Obrigatórias)

**Manus Platform**
- Acesse https://manus.im e crie sua conta
- Este será seu ambiente de desenvolvimento principal
- Já inclui: hospedagem, banco de dados MySQL, autenticação OAuth, storage S3

**OpenAI** (https://platform.openai.com)
- Necessário para GPT-4 (roteiros) e DALL-E 3 (imagens)
- Custo inicial: ~$5 de créditos gratuitos
- Adicione $20-50 para testes iniciais

**GitHub** (https://github.com)
- Para versionamento de código
- Crie um repositório privado: `memoryverse-ai`

#### Contas para IA (Fase 2)

**ElevenLabs** (https://elevenlabs.io)
- Geração de voz/narração profissional
- Plano gratuito: 10.000 caracteres/mês
- Upgrade: $5/mês para 30.000 caracteres

**Suno AI** (https://suno.ai)
- Geração de músicas completas
- Plano gratuito: 50 créditos/mês
- Upgrade: $10/mês para 500 créditos

**Runway ML** (https://runwayml.com)
- Geração e edição de vídeos
- Plano gratuito: 125 créditos (trial)
- Upgrade: $15/mês para 625 créditos

#### Contas para Pagamentos (Fase 3)

**Stripe** (https://stripe.com/br)
- Processamento de pagamentos
- Sem custo inicial
- Taxa: 3.99% + R$ 0.39 por transação

#### Contas para Automação (Fase 4)

**n8n Cloud** (https://n8n.io) - *Opcional*
- Automação de workflows
- Plano gratuito: 5.000 execuções/mês
- Alternativa: Self-host gratuito

#### Contas para Redes Sociais (Fase 4)

Você já criou as contas sociais do MemoryVerse AI. Agora precisa configurar acesso às APIs:

**Instagram/Facebook Developer** (https://developers.facebook.com)
- Criar app para Instagram API
- Permissões: `instagram_basic`, `instagram_content_publish`

**TikTok for Developers** (https://developers.tiktok.com)
- Criar app para TikTok API
- Permissões: `video.upload`, `video.publish`

**Google Cloud Console** (https://console.cloud.google.com)
- Ativar YouTube Data API v3
- Criar credenciais OAuth 2.0

### Passo 0.2: Instalar Ferramentas de Desenvolvimento

Configure seu ambiente local de desenvolvimento com as ferramentas necessárias.

**Node.js 22.x**
```bash
# macOS (usando Homebrew)
brew install node@22

# Linux (usando nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 22
nvm use 22

# Windows (baixar instalador)
# https://nodejs.org/en/download/
```

**Git**
```bash
# macOS
brew install git

# Linux (Ubuntu/Debian)
sudo apt-get install git

# Windows
# https://git-scm.com/download/win
```

**VS Code** (Recomendado)
- Download: https://code.visualstudio.com
- Extensões recomendadas:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin (Volar)

### Passo 0.3: Configurar Variáveis de Ambiente

Crie um arquivo para armazenar suas credenciais localmente (nunca commite este arquivo!).

```bash
# .env.local
# OpenAI
OPENAI_API_KEY=sk-...

# ElevenLabs
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=... # ID da voz escolhida

# Suno AI
SUNO_API_KEY=...

# Runway ML
RUNWAY_API_KEY=...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AWS S3 (fornecido pelo Manus)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contato@memoryverse.com.br
SMTP_PASSWORD=...
```

### Passo 0.4: Planejar Custos Iniciais

Entenda os custos mensais estimados para operar o MemoryVerse AI em diferentes escalas.

#### Custos por Memória

| Formato | APIs Utilizadas | Custo Unitário |
|---------|----------------|----------------|
| Vídeo | GPT-4 + DALL-E + ElevenLabs + Runway | $7.00 |
| Música | GPT-4 + Suno AI | $0.15 |
| Livro | GPT-4 + DALL-E (10 imagens) | $0.50 |
| Podcast | GPT-4 + ElevenLabs | $0.65 |

#### Custos Fixos Mensais

| Serviço | Custo | Observações |
|---------|-------|-------------|
| Manus Platform | Incluído | Hospedagem + DB + Auth + Storage |
| n8n Cloud | $20 | Ou self-host gratuito |
| SendGrid (Email) | $15 | 40.000 emails/mês |
| Stripe | 3.99% + R$0.39 | Por transação |

#### Projeção de Receita vs Custos

**Cenário: 100 usuários pagos/mês**

Receita:
- 50 usuários Creator (R$ 97) = R$ 4.850
- 50 usuários Pro (R$ 297) = R$ 14.850
- **Total: R$ 19.700 (~$3.940)**

Custos (assumindo 2.000 memórias/mês):
- 1.000 vídeos × $7 = $7.000
- 600 músicas × $0.15 = $90
- 400 livros × $0.50 = $200
- Fixos = $50
- **Total: ~$7.340**

**Margem bruta: ~$2.600 (66%)**

### Passo 0.5: Checklist de Preparação

Antes de prosseguir para a Fase 1, confirme que você tem:

- ✅ Conta no Manus Platform criada
- ✅ Conta OpenAI com créditos ($20+)
- ✅ Node.js 22.x instalado
- ✅ Git configurado
- ✅ VS Code instalado com extensões
- ✅ Arquivo `.env.local` criado
- ✅ Repositório GitHub criado
- ✅ Contas de redes sociais criadas (@memoryverseai)
- ✅ Email contato@memoryverse.com.br configurado

---

## 🏗️ Fase 1: MVP Básico

**Tempo estimado:** 1-2 dias  
**Objetivo:** Ter a aplicação funcionando localmente com todas as funcionalidades básicas.

### Passo 1.1: Inicializar Projeto no Manus

Acesse o Manus Platform e crie um novo projeto web com as configurações corretas.

**No Manus Dashboard:**
1. Clique em "New Project"
2. Selecione template: **"Web App (tRPC + Auth + Database)"**
3. Nome do projeto: `memoryverse-ai`
4. Título da aplicação: `MemoryVerse AI`
5. Features: Marque **Server**, **Database** e **User**
6. Clique em "Create Project"

O Manus irá:
- Criar estrutura completa do projeto
- Configurar banco de dados MySQL
- Configurar autenticação OAuth
- Configurar storage S3
- Iniciar servidor de desenvolvimento

**Aguarde 2-3 minutos** até o projeto estar pronto.

### Passo 1.2: Clonar e Configurar Localmente

Clone o projeto para sua máquina local e configure o ambiente de desenvolvimento.

```bash
# Clonar repositório (URL fornecida pelo Manus)
git clone https://github.com/seu-usuario/memoryverse-ai.git
cd memoryverse-ai

# Instalar dependências
pnpm install

# Copiar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais

# Iniciar servidor de desenvolvimento
pnpm dev
```

O servidor estará rodando em `http://localhost:3000`.

### Passo 1.3: Criar Schema do Banco de Dados

Defina as tabelas necessárias para o MemoryVerse AI no arquivo `drizzle/schema.ts`.

O schema já inclui a tabela `user` (criada pelo template). Você precisa adicionar as tabelas específicas do MemoryVerse AI.

**Tabelas necessárias:**

```typescript
// drizzle/schema.ts

import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

// Tabela de memórias
export const memories = sqliteTable("memories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => user.id),
  title: text("title").notNull(),
  story: text("story").notNull(), // História original do usuário
  format: text("format").notNull(), // video, music, book, podcast
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  
  // Conteúdo gerado
  script: text("script"), // Roteiro gerado pela IA
  videoUrl: text("video_url"),
  musicUrl: text("music_url"),
  bookUrl: text("book_url"),
  podcastUrl: text("podcast_url"),
  thumbnailUrl: text("thumbnail_url"),
  
  // Metadados
  duration: integer("duration"), // Duração em segundos
  language: text("language").default("pt-BR"),
  isPublic: integer("is_public", { mode: "boolean" }).default(false),
  
  // Analytics
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  shares: integer("shares").default(0),
  
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }),
});

// Tabela de notificações
export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => user.id),
  type: text("type").notNull(), // welcome, memory_completed, payment_success, etc
  title: text("title").notNull(),
  message: text("message").notNull(),
  link: text("link"),
  
  // Campos avançados
  imageUrl: text("image_url"),
  actionUrl: text("action_url"),
  actionLabel: text("action_label"),
  priority: text("priority").default("normal"), // low, normal, high, urgent
  
  // Status
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  readAt: integer("read_at", { mode: "timestamp" }),
  emailSent: integer("email_sent", { mode: "boolean" }).default(false),
  sentAt: integer("sent_at", { mode: "timestamp" }),
  
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Tabela de assinaturas
export const subscriptions = sqliteTable("subscriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => user.id),
  plan: text("plan").notNull(), // free, creator, pro
  status: text("status").notNull(), // active, canceled, past_due
  
  // Stripe
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripePriceId: text("stripe_price_id"),
  
  // Limites
  memoriesLimit: integer("memories_limit").notNull(),
  memoriesUsed: integer("memories_used").default(0),
  
  // Datas
  currentPeriodStart: integer("current_period_start", { mode: "timestamp" }),
  currentPeriodEnd: integer("current_period_end", { mode: "timestamp" }),
  canceledAt: integer("canceled_at", { mode: "timestamp" }),
  
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Schemas Zod para validação
export const insertMemorySchema = createInsertSchema(memories);
export const insertNotificationSchema = createInsertSchema(notifications);
export const insertSubscriptionSchema = createInsertSchema(subscriptions);
```

**Aplicar mudanças no banco:**

```bash
pnpm db:push
```

Este comando sincroniza o schema com o banco de dados MySQL.

### Passo 1.4: Criar Funções de Banco de Dados

Adicione funções helper no arquivo `server/db.ts` para interagir com as tabelas.

```typescript
// server/db.ts

import { db } from "./_core/db";
import { memories, notifications, subscriptions } from "../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

// ========== MEMORIES ==========

export async function createMemory(data: {
  userId: number;
  title: string;
  story: string;
  format: string;
}) {
  const [memory] = await db.insert(memories).values({
    ...data,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();
  return memory;
}

export async function getMemoryById(id: number) {
  const [memory] = await db.select().from(memories).where(eq(memories.id, id));
  return memory;
}

export async function getMemoriesByUserId(userId: number) {
  return db.select().from(memories)
    .where(eq(memories.userId, userId))
    .orderBy(desc(memories.createdAt));
}

export async function updateMemoryStatus(id: number, status: string, data?: any) {
  await db.update(memories)
    .set({
      status,
      ...data,
      updatedAt: new Date(),
      ...(status === "completed" && { completedAt: new Date() }),
    })
    .where(eq(memories.id, id));
}

// ========== NOTIFICATIONS ==========

export async function createNotification(data: {
  userId: number;
  type: string;
  title: string;
  message: string;
  link?: string;
  imageUrl?: string;
  actionUrl?: string;
  actionLabel?: string;
  priority?: string;
}) {
  const [notification] = await db.insert(notifications).values({
    ...data,
    createdAt: new Date(),
  }).returning();
  return notification;
}

export async function getNotificationsByUserId(userId: number) {
  return db.select().from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(id: number) {
  await db.update(notifications)
    .set({
      isRead: true,
      readAt: new Date(),
    })
    .where(eq(notifications.id, id));
}

// ========== SUBSCRIPTIONS ==========

export async function getSubscriptionByUserId(userId: number) {
  const [subscription] = await db.select().from(subscriptions)
    .where(eq(subscriptions.userId, userId));
  return subscription;
}

export async function createSubscription(data: {
  userId: number;
  plan: string;
  memoriesLimit: number;
}) {
  const [subscription] = await db.insert(subscriptions).values({
    ...data,
    status: "active",
    memoriesUsed: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();
  return subscription;
}

export async function incrementMemoriesUsed(userId: number) {
  const subscription = await getSubscriptionByUserId(userId);
  if (!subscription) throw new Error("No subscription found");
  
  await db.update(subscriptions)
    .set({
      memoriesUsed: subscription.memoriesUsed + 1,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.userId, userId));
}
```

### Passo 1.5: Criar Endpoints tRPC

Adicione os procedimentos tRPC no arquivo `server/routers.ts` para expor as funcionalidades via API.

```typescript
// server/routers.ts

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  // ========== AUTH ==========
  auth: router({
    me: publicProcedure.query(({ ctx }) => {
      return ctx.user ?? null;
    }),
    
    logout: protectedProcedure.mutation(async ({ ctx }) => {
      // Implementação do logout
      return { success: true };
    }),
  }),
  
  // ========== MEMORIES ==========
  memories: router({
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1).max(200),
        story: z.string().min(50).max(5000),
        format: z.enum(["video", "music", "book", "podcast"]),
      }))
      .mutation(async ({ ctx, input }) => {
        // Verificar limite de memórias
        const subscription = await db.getSubscriptionByUserId(ctx.user.id);
        if (!subscription) {
          // Criar assinatura free para novo usuário
          await db.createSubscription({
            userId: ctx.user.id,
            plan: "free",
            memoriesLimit: 3,
          });
        } else if (subscription.memoriesUsed >= subscription.memoriesLimit) {
          throw new Error("Limite de memórias atingido. Faça upgrade do seu plano!");
        }
        
        // Criar memória
        const memory = await db.createMemory({
          userId: ctx.user.id,
          ...input,
        });
        
        // Incrementar contador
        await db.incrementMemoriesUsed(ctx.user.id);
        
        // TODO: Chamar webhook n8n para processar memória
        
        return memory;
      }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getMemoryById(input.id);
      }),
    
    getByUserId: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getMemoriesByUserId(ctx.user.id);
      }),
  }),
  
  // ========== NOTIFICATIONS ==========
  notifications: router({
    getAll: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getNotificationsByUserId(ctx.user.id);
      }),
    
    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input.id);
        return { success: true };
      }),
  }),
  
  // ========== SUBSCRIPTIONS ==========
  subscriptions: router({
    getCurrent: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getSubscriptionByUserId(ctx.user.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
```

### Passo 1.6: Criar Páginas do Frontend

Agora vamos criar as páginas principais da aplicação. O template já fornece componentes base.

**Estrutura de páginas:**
- `Home.tsx` - Landing page (já existe, precisa customizar)
- `Dashboard.tsx` - Dashboard do usuário
- `MyMemories.tsx` - Lista de memórias criadas
- `Contact.tsx` - Página de contato (já existe)

Estes arquivos já foram criados nas fases anteriores. Você pode encontrá-los em:
- `/home/ubuntu/memoryverse-ai/client/src/pages/`

### Passo 1.7: Testar Localmente

Verifique se tudo está funcionando corretamente antes de prosseguir.

**Checklist de testes:**

1. **Servidor rodando:**
```bash
pnpm dev
# Deve abrir em http://localhost:3000
```

2. **Autenticação funcionando:**
   - Clique em "Entrar"
   - Faça login com sua conta Manus
   - Deve redirecionar para o dashboard

3. **Criar memória:**
   - No dashboard, clique em "Criar Memória"
   - Preencha o formulário
   - Verifique se aparece na lista de memórias

4. **Notificações:**
   - Clique no ícone de sino no header
   - Deve mostrar notificações (se houver)

5. **Banco de dados:**
```bash
# Verificar se tabelas foram criadas
pnpm drizzle-kit studio
# Abre interface visual do banco em http://localhost:4983
```

### Passo 1.8: Primeiro Deploy no Manus

Faça o primeiro deploy para ter a aplicação online.

```bash
# Commitar mudanças
git add .
git commit -m "feat: MVP básico do MemoryVerse AI"
git push origin main

# No Manus Dashboard:
# 1. Ir em "Code" → Ver mudanças
# 2. Criar checkpoint: "MVP Básico Completo"
# 3. Clicar em "Publish"
```

Sua aplicação estará disponível em: `https://seu-projeto.manus.space`

### Passo 1.9: Checklist da Fase 1

Antes de prosseguir para a Fase 2, confirme que você tem:

- ✅ Projeto inicializado no Manus
- ✅ Schema do banco de dados criado e sincronizado
- ✅ Funções de banco de dados implementadas
- ✅ Endpoints tRPC funcionando
- ✅ Páginas do frontend criadas
- ✅ Autenticação funcionando
- ✅ Criação de memórias funcionando (status "pending")
- ✅ Notificações aparecendo
- ✅ Primeiro deploy realizado

**Próximo passo:** Integrar APIs de IA para gerar conteúdo real!

---

## 🤖 Fase 2: Integração de IA

**Tempo estimado:** 3-5 dias  
**Objetivo:** Conectar APIs de IA para gerar vídeos, músicas, livros e podcasts reais.

### Passo 2.1: Configurar OpenAI (GPT-4 + DALL-E)

A OpenAI será usada para gerar roteiros (GPT-4) e imagens (DALL-E 3).

**Instalar SDK:**
```bash
pnpm add openai
```

**Criar helper para OpenAI:**

```typescript
// server/ai/openai.ts

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateScript(story: string, format: string) {
  const systemPrompt = `Você é um roteirista profissional especializado em transformar histórias pessoais em roteiros ${format === "video" ? "cinematográficos" : format === "music" ? "musicais" : format === "book" ? "literários" : "de podcast"}.`;
  
  const userPrompt = `História: ${story}\n\nCrie um roteiro profissional e emocionante para ${format}.`;
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 2000,
  });
  
  return completion.choices[0].message.content;
}

export async function generateImage(prompt: string) {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt + ". Cinematic, 4K, professional photography, dramatic lighting",
    size: "1792x1024",
    quality: "hd",
    style: "vivid",
  });
  
  return response.data[0].url;
}

export async function generateScenes(script: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Você é um diretor de cinema. Crie 5-8 cenas visuais detalhadas em formato JSON: [{\"scene\": 1, \"duration\": 10, \"description\": \"...\", \"prompt\": \"...\"}]",
      },
      {
        role: "user",
        content: `Roteiro: ${script}\n\nCrie cenas visuais detalhadas.`,
      },
    ],
    response_format: { type: "json_object" },
  });
  
  return JSON.parse(completion.choices[0].message.content || "{}");
}
```

### Passo 2.2: Configurar ElevenLabs (Voz)

ElevenLabs será usado para gerar narração profissional.

**Instalar SDK:**
```bash
pnpm add elevenlabs
```

**Criar helper para ElevenLabs:**

```typescript
// server/ai/elevenlabs.ts

import { ElevenLabsClient } from "elevenlabs";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function generateVoice(text: string, voiceId?: string) {
  const audio = await elevenlabs.generate({
    voice: voiceId || process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM", // Rachel (default)
    text,
    model_id: "eleven_multilingual_v2",
  });
  
  // Converter stream para buffer
  const chunks: Buffer[] = [];
  for await (const chunk of audio) {
    chunks.push(chunk);
  }
  
  return Buffer.concat(chunks);
}

export async function getVoices() {
  const voices = await elevenlabs.voices.getAll();
  return voices.voices;
}
```

### Passo 2.3: Configurar Suno AI (Música)

Suno AI será usado para gerar músicas completas.

**Criar helper para Suno AI:**

```typescript
// server/ai/suno.ts

export async function generateMusic(prompt: string, duration: number = 180) {
  const response = await fetch("https://api.suno.ai/v1/generate", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.SUNO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      duration,
      make_instrumental: false,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Suno API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
}

export async function getMusicStatus(taskId: string) {
  const response = await fetch(`https://api.suno.ai/v1/tasks/${taskId}`, {
    headers: {
      "Authorization": `Bearer ${process.env.SUNO_API_KEY}`,
    },
  });
  
  return response.json();
}
```

### Passo 2.4: Criar Workflow de Processamento

Agora vamos criar o workflow principal que orquestra todas as APIs de IA.

```typescript
// server/workflows/processMemory.ts

import * as openai from "../ai/openai";
import * as elevenlabs from "../ai/elevenlabs";
import * as suno from "../ai/suno";
import { storagePut } from "../storage";
import * as db from "../db";

export async function processMemory(memoryId: number) {
  try {
    // 1. Buscar memória
    const memory = await db.getMemoryById(memoryId);
    if (!memory) throw new Error("Memory not found");
    
    // 2. Atualizar status para "processing"
    await db.updateMemoryStatus(memoryId, "processing");
    
    // 3. Gerar roteiro com GPT-4
    console.log("Gerando roteiro...");
    const script = await openai.generateScript(memory.story, memory.format);
    await db.updateMemoryStatus(memoryId, "processing", { script });
    
    // 4. Processar baseado no formato
    let result: any = {};
    
    switch (memory.format) {
      case "video":
        result = await processVideo(script, memoryId);
        break;
      case "music":
        result = await processMusic(script, memoryId);
        break;
      case "book":
        result = await processBook(script, memoryId);
        break;
      case "podcast":
        result = await processPodcast(script, memoryId);
        break;
    }
    
    // 5. Atualizar memória com resultado
    await db.updateMemoryStatus(memoryId, "completed", result);
    
    // 6. Criar notificação
    await db.createNotification({
      userId: memory.userId,
      type: "memory_completed",
      title: "Sua memória está pronta!",
      message: `${memory.title} foi transformada em ${memory.format} com sucesso!`,
      link: `/my-memories/${memoryId}`,
      imageUrl: result.thumbnailUrl,
      priority: "high",
    });
    
    return result;
    
  } catch (error) {
    console.error("Error processing memory:", error);
    await db.updateMemoryStatus(memoryId, "failed", {
      error: error.message,
    });
    throw error;
  }
}

async function processVideo(script: string, memoryId: number) {
  // 1. Gerar cenas
  const scenes = await openai.generateScenes(script);
  
  // 2. Gerar imagem para cada cena
  const sceneImages = [];
  for (const scene of scenes.scenes) {
    const imageUrl = await openai.generateImage(scene.prompt);
    sceneImages.push({ ...scene, imageUrl });
  }
  
  // 3. Gerar narração
  const voiceBuffer = await elevenlabs.generateVoice(script);
  
  // 4. Upload para S3
  const audioKey = `memories/${memoryId}/narration.mp3`;
  const { url: audioUrl } = await storagePut(audioKey, voiceBuffer, "audio/mpeg");
  
  // 5. TODO: Compilar vídeo com Runway ML (Fase 4 - n8n)
  
  return {
    videoUrl: null, // Será preenchido pelo n8n
    thumbnailUrl: sceneImages[0].imageUrl,
    audioUrl,
    scenes: sceneImages,
  };
}

async function processMusic(script: string, memoryId: number) {
  // 1. Gerar música com Suno AI
  const musicTask = await suno.generateMusic(script);
  
  // 2. Aguardar conclusão (polling)
  let music;
  let attempts = 0;
  while (attempts < 30) { // Max 5 minutos
    await new Promise(resolve => setTimeout(resolve, 10000)); // 10s
    music = await suno.getMusicStatus(musicTask.task_id);
    if (music.status === "completed") break;
    attempts++;
  }
  
  if (!music || music.status !== "completed") {
    throw new Error("Music generation timeout");
  }
  
  // 3. Gerar thumbnail com DALL-E
  const thumbnailUrl = await openai.generateImage(`Album cover for: ${script}`);
  
  return {
    musicUrl: music.audio_url,
    thumbnailUrl,
  };
}

async function processBook(script: string, memoryId: number) {
  // 1. Dividir roteiro em capítulos
  const chapters = script.split("\n\n").filter(c => c.length > 50);
  
  // 2. Gerar ilustração para cada capítulo
  const illustrations = [];
  for (let i = 0; i < Math.min(chapters.length, 10); i++) {
    const imageUrl = await openai.generateImage(`Book illustration: ${chapters[i]}`);
    illustrations.push({ chapter: i + 1, imageUrl });
  }
  
  // 3. TODO: Gerar PDF do livro (Fase 4)
  
  return {
    bookUrl: null, // Será gerado depois
    thumbnailUrl: illustrations[0].imageUrl,
    illustrations,
  };
}

async function processPodcast(script: string, memoryId: number) {
  // 1. Gerar narração
  const voiceBuffer = await elevenlabs.generateVoice(script);
  
  // 2. Upload para S3
  const audioKey = `memories/${memoryId}/podcast.mp3`;
  const { url: podcastUrl } = await storagePut(audioKey, voiceBuffer, "audio/mpeg");
  
  // 3. Gerar thumbnail
  const thumbnailUrl = await openai.generateImage(`Podcast cover art: ${script}`);
  
  return {
    podcastUrl,
    thumbnailUrl,
  };
}
```

### Passo 2.5: Integrar Workflow no Endpoint

Atualize o endpoint de criação de memórias para chamar o workflow.

```typescript
// server/routers.ts

import { processMemory } from "./workflows/processMemory";

// No router de memories:
create: protectedProcedure
  .input(z.object({
    title: z.string().min(1).max(200),
    story: z.string().min(50).max(5000),
    format: z.enum(["video", "music", "book", "podcast"]),
  }))
  .mutation(async ({ ctx, input }) => {
    // ... código anterior ...
    
    // Criar memória
    const memory = await db.createMemory({
      userId: ctx.user.id,
      ...input,
    });
    
    // Incrementar contador
    await db.incrementMemoriesUsed(ctx.user.id);
    
    // Processar memória em background
    processMemory(memory.id).catch(console.error);
    
    return memory;
  }),
```

### Passo 2.6: Testar Geração de Conteúdo

Agora vamos testar se as APIs de IA estão funcionando corretamente.

**Teste 1: Gerar Música**

1. Acesse o dashboard
2. Clique em "Criar Memória"
3. Preencha:
   - Título: "Minha Primeira Música"
   - História: "Era uma vez um dia ensolarado na praia, onde as ondas dançavam ao som do vento..."
   - Formato: Música
4. Clique em "Criar"
5. Aguarde 2-3 minutos
6. Verifique se a música foi gerada

**Teste 2: Gerar Podcast**

1. Criar nova memória
2. Formato: Podcast
3. Aguarde 1-2 minutos
4. Verifique se o áudio foi gerado

**Teste 3: Gerar Livro**

1. Criar nova memória
2. Formato: Livro
3. Aguarde 3-5 minutos
4. Verifique se as ilustrações foram geradas

### Passo 2.7: Monitorar Custos

Configure alertas para monitorar gastos com APIs de IA.

**Criar script de monitoramento:**

```typescript
// server/monitoring/costs.ts

export async function calculateDailyCosts() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const memories = await db.getMemoriesByDate(today);
  
  let totalCost = 0;
  for (const memory of memories) {
    switch (memory.format) {
      case "video":
        totalCost += 7.00;
        break;
      case "music":
        totalCost += 0.15;
        break;
      case "book":
        totalCost += 0.50;
        break;
      case "podcast":
        totalCost += 0.65;
        break;
    }
  }
  
  console.log(`Custo do dia: $${totalCost.toFixed(2)}`);
  
  // Alerta se custo > $200/dia
  if (totalCost > 200) {
    // Enviar email de alerta
    console.warn("⚠️ ALERTA: Custo diário acima de $200!");
  }
  
  return totalCost;
}
```

### Passo 2.8: Checklist da Fase 2

Antes de prosseguir para a Fase 3, confirme que você tem:

- ✅ OpenAI configurado (GPT-4 + DALL-E)
- ✅ ElevenLabs configurado
- ✅ Suno AI configurado
- ✅ Workflow de processamento implementado
- ✅ Geração de música funcionando
- ✅ Geração de podcast funcionando
- ✅ Geração de livro funcionando
- ✅ Geração de vídeo parcial (sem compilação final)
- ✅ Notificações sendo enviadas
- ✅ Monitoramento de custos configurado

**Próximo passo:** Implementar sistema de pagamentos!

---

## 💳 Fase 3: Monetização

**Tempo estimado:** 2-3 dias  
**Objetivo:** Implementar sistema completo de pagamentos com Stripe.

### Passo 3.1: Configurar Stripe

Configure sua conta Stripe e obtenha as credenciais necessárias.

**No Stripe Dashboard (https://dashboard.stripe.com):**

1. Criar conta ou fazer login
2. Ir em "Developers" → "API keys"
3. Copiar:
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)
4. Ir em "Developers" → "Webhooks"
5. Clicar em "Add endpoint"
6. URL: `https://seu-projeto.manus.space/api/stripe/webhook`
7. Selecionar eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
8. Copiar **Signing secret** (whsec_...)

**Adicionar ao `.env.local`:**
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Passo 3.2: Criar Produtos e Preços no Stripe

Configure os planos de assinatura no Stripe Dashboard.

**Plano Creator (R$ 97/mês):**
1. Ir em "Products" → "Add product"
2. Nome: "MemoryVerse AI - Creator"
3. Descrição: "50 memórias por mês, qualidade HD, sem marca d'água"
4. Pricing:
   - Modelo: Recurring
   - Preço: R$ 97.00
   - Intervalo: Monthly
5. Salvar e copiar **Price ID** (price_...)

**Plano Pro (R$ 297/mês):**
1. Repetir processo acima
2. Nome: "MemoryVerse AI - Pro"
3. Descrição: "Memórias ilimitadas, qualidade 4K, licença comercial"
4. Preço: R$ 297.00
5. Copiar **Price ID**

**Adicionar ao código:**
```typescript
// shared/plans.ts

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    memoriesLimit: 3,
    features: [
      "3 memórias grátis",
      "Todos os formatos",
      "Qualidade padrão",
      "Marca d'água",
    ],
  },
  creator: {
    name: "Creator",
    price: 97,
    priceId: "price_1234...", // Seu Price ID do Stripe
    memoriesLimit: 50,
    features: [
      "50 memórias/mês",
      "Todos os formatos",
      "Qualidade HD",
      "Sem marca d'água",
      "Download ilimitado",
      "Suporte prioritário",
    ],
  },
  pro: {
    name: "Pro",
    price: 297,
    priceId: "price_5678...", // Seu Price ID do Stripe
    memoriesLimit: -1, // Ilimitado
    features: [
      "Memórias ilimitadas",
      "Todos os formatos",
      "Qualidade 4K",
      "Sem marca d'água",
      "Licença comercial",
      "API access",
      "Suporte VIP",
    ],
  },
};
```

### Passo 3.3: Instalar Stripe SDK

Instale o SDK do Stripe no projeto.

```bash
pnpm add stripe @stripe/stripe-js
```

### Passo 3.4: Criar Endpoints de Pagamento

Adicione endpoints tRPC para criar sessões de checkout.

```typescript
// server/routers.ts

import Stripe from "stripe";
import { PLANS } from "../shared/plans";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Adicionar ao router:
payments: router({
  createCheckoutSession: protectedProcedure
    .input(z.object({
      plan: z.enum(["creator", "pro"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const plan = PLANS[input.plan];
      
      const session = await stripe.checkout.sessions.create({
        customer_email: ctx.user.email,
        client_reference_id: ctx.user.id.toString(),
        line_items: [
          {
            price: plan.priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.VITE_APP_URL}/dashboard?payment=success`,
        cancel_url: `${process.env.VITE_APP_URL}/pricing?payment=canceled`,
        metadata: {
          userId: ctx.user.id.toString(),
          plan: input.plan,
        },
      });
      
      return { url: session.url };
    }),
  
  createPortalSession: protectedProcedure
    .mutation(async ({ ctx }) => {
      const subscription = await db.getSubscriptionByUserId(ctx.user.id);
      if (!subscription?.stripeCustomerId) {
        throw new Error("No subscription found");
      }
      
      const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: `${process.env.VITE_APP_URL}/dashboard`,
      });
      
      return { url: session.url };
    }),
}),
```

### Passo 3.5: Criar Webhook Handler

Crie um endpoint para receber webhooks do Stripe.

```typescript
// server/webhooks/stripe.ts

import Stripe from "stripe";
import * as db from "../db";
import { PLANS } from "../../shared/plans";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function handleStripeWebhook(req: any, res: any) {
  const sig = req.headers["stripe-signature"];
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle events
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    
    case "customer.subscription.updated":
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;
    
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;
    
    case "invoice.payment_failed":
      await handlePaymentFailed(event.data.object as Stripe.Invoice);
      break;
  }
  
  res.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = parseInt(session.client_reference_id!);
  const plan = session.metadata!.plan as "creator" | "pro";
  
  // Criar ou atualizar assinatura
  const existing = await db.getSubscriptionByUserId(userId);
  
  if (existing) {
    await db.updateSubscription(userId, {
      plan,
      status: "active",
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      memoriesLimit: PLANS[plan].memoriesLimit,
      memoriesUsed: 0,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
    });
  } else {
    await db.createSubscription({
      userId,
      plan,
      status: "active",
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      memoriesLimit: PLANS[plan].memoriesLimit,
    });
  }
  
  // Criar notificação
  await db.createNotification({
    userId,
    type: "payment_success",
    title: "Pagamento confirmado!",
    message: `Bem-vindo ao plano ${PLANS[plan].name}! 🎉`,
    link: "/dashboard",
    priority: "high",
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = parseInt(subscription.metadata.userId);
  
  await db.updateSubscription(userId, {
    status: "canceled",
    canceledAt: new Date(),
  });
  
  // Downgrade para free
  await db.createSubscription({
    userId,
    plan: "free",
    memoriesLimit: 0, // Já usou as 3 grátis
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const userId = parseInt(invoice.subscription_details?.metadata?.userId || "0");
  
  await db.createNotification({
    userId,
    type: "payment_failed",
    title: "Falha no pagamento",
    message: "Não conseguimos processar seu pagamento. Atualize seu método de pagamento.",
    link: "/dashboard/billing",
    priority: "urgent",
  });
}
```

**Registrar webhook no Express:**

```typescript
// server/_core/index.ts

import { handleStripeWebhook } from "../webhooks/stripe";

// Adicionar ANTES do middleware JSON
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
```

### Passo 3.6: Criar Página de Pricing

Crie uma página para exibir os planos e permitir upgrade.

```typescript
// client/src/pages/Pricing.tsx

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { PLANS } from "@/../../shared/plans";

export default function Pricing() {
  const createCheckout = trpc.payments.createCheckoutSession.useMutation();
  
  const handleUpgrade = async (plan: "creator" | "pro") => {
    try {
      const { url } = await createCheckout.mutateAsync({ plan });
      window.location.href = url;
    } catch (error) {
      toast.error("Erro ao criar sessão de pagamento");
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">
        Escolha seu Plano
      </h1>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {Object.entries(PLANS).map(([key, plan]) => (
          <Card key={key} className="p-6">
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="text-4xl font-bold mb-6">
              {plan.price === 0 ? "Grátis" : `R$ ${plan.price}`}
              {plan.price > 0 && <span className="text-lg">/mês</span>}
            </div>
            
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            {key !== "free" && (
              <Button
                className="w-full"
                onClick={() => handleUpgrade(key as any)}
                disabled={createCheckout.isLoading}
              >
                Assinar Agora
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Passo 3.7: Adicionar Billing Portal

Permita que usuários gerenciem suas assinaturas.

```typescript
// client/src/pages/Dashboard.tsx

// Adicionar botão de gerenciar assinatura
const createPortal = trpc.payments.createPortalSession.useMutation();

const handleManageBilling = async () => {
  try {
    const { url } = await createPortal.mutateAsync();
    window.location.href = url;
  } catch (error) {
    toast.error("Erro ao abrir portal de pagamentos");
  }
};

// No JSX:
<Button onClick={handleManageBilling}>
  Gerenciar Assinatura
</Button>
```

### Passo 3.8: Testar Fluxo de Pagamento

Teste todo o fluxo de pagamento usando cartões de teste do Stripe.

**Cartões de teste:**
- Sucesso: `4242 4242 4242 4242`
- Falha: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

**Fluxo de teste:**

1. Acessar `/pricing`
2. Clicar em "Assinar" no plano Creator
3. Preencher dados:
   - Email: seu-email@example.com
   - Cartão: 4242 4242 4242 4242
   - Data: 12/34
   - CVC: 123
4. Clicar em "Assinar"
5. Verificar redirecionamento para dashboard
6. Verificar notificação de pagamento confirmado
7. Verificar limite de memórias atualizado

### Passo 3.9: Checklist da Fase 3

Antes de prosseguir para a Fase 4, confirme que você tem:

- ✅ Stripe configurado com produtos e preços
- ✅ Endpoints de checkout criados
- ✅ Webhook handler implementado
- ✅ Página de pricing criada
- ✅ Billing portal funcionando
- ✅ Fluxo de pagamento testado
- ✅ Notificações de pagamento funcionando
- ✅ Limites de memórias sendo respeitados
- ✅ Downgrade para free funcionando

**Próximo passo:** Automatizar tudo com n8n!

---

## ⚙️ Fase 4: Automação

**Tempo estimado:** 2-3 dias  
**Objetivo:** Implementar workflows n8n para automação completa.

### Passo 4.1: Instalar n8n

Você tem duas opções: n8n Cloud (pago) ou self-host (gratuito).

**Opção 1: n8n Cloud (Recomendado para começar)**

1. Acesse https://n8n.io
2. Clique em "Start Free"
3. Crie sua conta
4. Plano gratuito: 5.000 execuções/mês

**Opção 2: Self-host com Docker**

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Rodar n8n
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Acessar: http://localhost:5678
```

### Passo 4.2: Importar Workflows

Importe os 5 workflows que criamos anteriormente.

**No n8n:**
1. Ir em "Workflows"
2. Clicar em "Import from File"
3. Selecionar arquivo: `n8n-workflows/01-memory-processing.json`
4. Repetir para os outros 4 arquivos

**Workflows importados:**
1. ✅ Processamento de Memórias
2. ✅ Geração de Vídeo Completo
3. ✅ Email Marketing & Onboarding
4. ✅ Moderação & Analytics
5. ✅ Redes Sociais & Pagamentos

### Passo 4.3: Configurar Credenciais

Configure as credenciais de todas as APIs no n8n.

**No n8n → Settings → Credentials:**

1. **OpenAI**
   - Tipo: OpenAI
   - API Key: (sua chave)

2. **ElevenLabs**
   - Tipo: HTTP Header Auth
   - Name: `xi-api-key`
   - Value: (sua chave)

3. **Suno AI**
   - Tipo: HTTP Header Auth
   - Name: `Authorization`
   - Value: `Bearer (sua chave)`

4. **AWS S3**
   - Tipo: AWS
   - Access Key ID: (sua chave)
   - Secret Access Key: (sua chave)
   - Region: us-east-1

5. **SMTP (Email)**
   - Tipo: SMTP
   - Host: smtp.gmail.com
   - Port: 587
   - User: contato@memoryverse.com.br
   - Password: (senha do app)

6. **Stripe**
   - Tipo: HTTP Header Auth
   - Name: `Authorization`
   - Value: `Bearer (sua secret key)`

### Passo 4.4: Ativar Webhooks

Ative os webhooks em cada workflow.

**Para cada workflow:**
1. Abrir workflow
2. Clicar no nó "Webhook"
3. Copiar URL do webhook
4. Ativar workflow (toggle no canto superior direito)

**URLs dos webhooks:**
- Processamento: `https://n8n.exemplo.com/webhook/memory-created`
- Novo Usuário: `https://n8n.exemplo.com/webhook/user-registered`
- Moderação: `https://n8n.exemplo.com/webhook/moderate-content`
- Publicação: `https://n8n.exemplo.com/webhook/memory-published`

### Passo 4.5: Integrar Webhooks no Backend

Adicione chamadas aos webhooks n8n no código do backend.

```typescript
// server/webhooks/n8n.ts

const N8N_BASE_URL = process.env.N8N_BASE_URL || "https://n8n.exemplo.com";

export async function triggerMemoryProcessing(memory: any) {
  await fetch(`${N8N_BASE_URL}/webhook/memory-created`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      memoryId: memory.id,
      userId: memory.userId,
      story: memory.story,
      format: memory.format,
      title: memory.title,
    }),
  });
}

export async function triggerUserOnboarding(user: any) {
  await fetch(`${N8N_BASE_URL}/webhook/user-registered`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user.id,
      email: user.email,
      name: user.name,
    }),
  });
}

export async function triggerModeration(content: any) {
  const response = await fetch(`${N8N_BASE_URL}/webhook/moderate-content`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contentId: content.id,
      content: content.text,
      userId: content.userId,
    }),
  });
  
  return response.json();
}
```

**Atualizar routers.ts:**

```typescript
// server/routers.ts

import * as n8n from "./webhooks/n8n";

// No endpoint de criar memória:
create: protectedProcedure
  .input(...)
  .mutation(async ({ ctx, input }) => {
    // ... código anterior ...
    
    // Criar memória
    const memory = await db.createMemory({
      userId: ctx.user.id,
      ...input,
    });
    
    // Incrementar contador
    await db.incrementMemoriesUsed(ctx.user.id);
    
    // Chamar n8n para processar
    await n8n.triggerMemoryProcessing(memory);
    
    return memory;
  }),
```

### Passo 4.6: Configurar Email Marketing

Configure a sequência de emails de onboarding.

**No workflow "Email Marketing":**

1. Verificar se SMTP está configurado
2. Testar envio de email manualmente
3. Ajustar timings se necessário:
   - Boas-vindas: 2 minutos após registro
   - Lembrete: 1 dia após (se não criou memória)
   - Upsell: 3 dias após
   - Feedback: 7 dias após

### Passo 4.7: Configurar Analytics Diários

Configure o workflow de analytics para enviar relatórios diários.

**No workflow "Moderação & Analytics":**

1. Verificar cron: `0 0 * * *` (meia-noite)
2. Configurar email de destino: admin@memoryverse.com.br
3. Ativar workflow

### Passo 4.8: Configurar Auto-Post em Redes Sociais

Configure as credenciais das redes sociais no n8n.

**Instagram:**
1. Criar app no Facebook Developers
2. Obter Access Token
3. Adicionar credencial no n8n

**TikTok:**
1. Criar app no TikTok for Developers
2. Obter API Key
3. Adicionar credencial no n8n

**YouTube:**
1. Criar projeto no Google Cloud Console
2. Ativar YouTube Data API v3
3. Criar credenciais OAuth 2.0
4. Adicionar credencial no n8n

### Passo 4.9: Testar Workflows

Teste cada workflow individualmente.

**Teste 1: Processamento de Memórias**
1. Criar nova memória no dashboard
2. Verificar execução no n8n
3. Verificar se memória foi processada
4. Verificar se notificação foi enviada

**Teste 2: Email Marketing**
1. Criar novo usuário (ou usar webhook test)
2. Verificar se email de boas-vindas foi enviado
3. Aguardar 1 dia (ou ajustar timing para 1 minuto)
4. Verificar se email de lembrete foi enviado

**Teste 3: Moderação**
1. Enviar conteúdo para moderação via API
2. Verificar análise da IA
3. Verificar se conteúdo inseguro foi sinalizado

### Passo 4.10: Checklist da Fase 4

Antes de prosseguir para a Fase 5, confirme que você tem:

- ✅ n8n instalado (cloud ou self-host)
- ✅ 5 workflows importados
- ✅ Todas as credenciais configuradas
- ✅ Webhooks ativados
- ✅ Integração com backend funcionando
- ✅ Email marketing funcionando
- ✅ Analytics diários funcionando
- ✅ Auto-post em redes sociais configurado
- ✅ Moderação de conteúdo funcionando
- ✅ Todos os workflows testados

**Próximo passo:** Deploy e escala!

---

## 🚀 Fase 5: Escala e Deploy

**Tempo estimado:** 2-3 dias  
**Objetivo:** Preparar aplicação para produção e escalar.

### Passo 5.1: Otimizar Performance

Implemente otimizações para melhorar performance.

**1. Adicionar Cache com Redis**

```bash
pnpm add ioredis
```

```typescript
// server/cache/redis.ts

import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function cacheGet(key: string) {
  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
}

export async function cacheSet(key: string, value: any, ttl: number = 3600) {
  await redis.setex(key, ttl, JSON.stringify(value));
}

export async function cacheDelete(key: string) {
  await redis.del(key);
}
```

**2. Implementar Rate Limiting**

```typescript
// server/middleware/rateLimit.ts

import { TRPCError } from "@trpc/server";

const requests = new Map<string, number[]>();

export function rateLimit(maxRequests: number, windowMs: number) {
  return async ({ ctx, next }: any) => {
    const key = ctx.user?.id || ctx.ip;
    const now = Date.now();
    
    const userRequests = requests.get(key) || [];
    const recentRequests = userRequests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Muitas requisições. Tente novamente em alguns minutos.",
      });
    }
    
    recentRequests.push(now);
    requests.set(key, recentRequests);
    
    return next();
  };
}
```

**3. Otimizar Queries do Banco**

```typescript
// Adicionar índices no schema
export const memories = sqliteTable("memories", {
  // ... campos existentes ...
}, (table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
  statusIdx: index("status_idx").on(table.status),
  createdAtIdx: index("created_at_idx").on(table.createdAt),
}));
```

### Passo 5.2: Configurar Monitoramento

Implemente monitoramento e logging.

**1. Adicionar Sentry para Error Tracking**

```bash
pnpm add @sentry/node @sentry/react
```

```typescript
// server/_core/sentry.ts

import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

export { Sentry };
```

**2. Adicionar Logging Estruturado**

```typescript
// server/utils/logger.ts

import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

### Passo 5.3: Configurar CI/CD

Configure pipeline de deploy automático.

**Criar arquivo `.github/workflows/deploy.yml`:**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "22"
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: pnpm test
      
      - name: Build
        run: pnpm build
      
      - name: Deploy to Manus
        run: |
          # Manus CLI deploy
          echo "Deploy automático via Manus"
```

### Passo 5.4: Configurar Domínio Customizado

Configure seu próprio domínio.

**No Manus Dashboard:**
1. Ir em "Settings" → "Domains"
2. Adicionar domínio: `memoryverse.com.br`
3. Configurar DNS:
   - Tipo: CNAME
   - Nome: @
   - Valor: (fornecido pelo Manus)
4. Aguardar propagação (até 24h)

**Configurar SSL:**
- SSL é automático via Let's Encrypt
- Certificado renovado automaticamente

### Passo 5.5: Configurar Backup Automático

Implemente backup automático do banco de dados.

**Já configurado no workflow n8n "Moderação & Analytics":**
- Backup a cada 6 horas
- Upload para S3
- Retenção: 30 dias

**Testar restore:**

```bash
# Baixar backup do S3
aws s3 cp s3://memoryverse-backups/backup_2024-12-02_00-00-00.sql ./backup.sql

# Restaurar no banco
mysql -h HOST -u USER -p DATABASE < backup.sql
```

### Passo 5.6: Configurar CDN

Configure CDN para assets estáticos.

**Opção 1: CloudFlare (Recomendado)**
1. Criar conta no CloudFlare
2. Adicionar site: memoryverse.com.br
3. Atualizar nameservers do domínio
4. Ativar cache automático
5. Ativar Brotli compression

**Opção 2: AWS CloudFront**
1. Criar distribuição no CloudFront
2. Origem: seu-projeto.manus.space
3. Configurar cache behaviors
4. Atualizar DNS para apontar para CloudFront

### Passo 5.7: Configurar Escalabilidade

Prepare para escalar horizontalmente.

**1. Separar Processamento de Memórias**

Mover processamento pesado para workers separados:

```typescript
// server/workers/memoryProcessor.ts

import { Queue, Worker } from "bullmq";

const memoryQueue = new Queue("memory-processing", {
  connection: {
    host: process.env.REDIS_HOST,
    port: 6379,
  },
});

export async function enqueueMemory(memoryId: number) {
  await memoryQueue.add("process", { memoryId });
}

// Worker separado
const worker = new Worker("memory-processing", async (job) => {
  const { memoryId } = job.data;
  await processMemory(memoryId);
}, {
  connection: {
    host: process.env.REDIS_HOST,
    port: 6379,
  },
});
```

**2. Configurar Load Balancer**

Se necessário, configure load balancer para múltiplas instâncias.

### Passo 5.8: Testes de Carga

Execute testes de carga para validar escalabilidade.

**Usando k6:**

```bash
# Instalar k6
brew install k6  # macOS
# ou
sudo apt-get install k6  # Linux

# Criar script de teste
cat > load-test.js << 'EOF'
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
};

export default function () {
  const res = http.get('https://memoryverse.com.br');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
EOF

# Executar teste
k6 run load-test.js
```

### Passo 5.9: Checklist da Fase 5

Antes de prosseguir para a Fase 6, confirme que você tem:

- ✅ Cache Redis implementado
- ✅ Rate limiting configurado
- ✅ Índices de banco otimizados
- ✅ Sentry configurado
- ✅ Logging estruturado
- ✅ CI/CD configurado
- ✅ Domínio customizado configurado
- ✅ SSL ativo
- ✅ Backup automático funcionando
- ✅ CDN configurado
- ✅ Testes de carga executados

**Próximo passo:** Recursos avançados!

---

## 🎓 Fase 6: Avançado

**Tempo estimado:** 1-2 semanas  
**Objetivo:** Implementar recursos avançados para crescimento e otimização.

### Passo 6.1: Implementar A/B Testing

Configure testes A/B para otimizar conversão.

**Instalar biblioteca:**
```bash
pnpm add @growthbook/growthbook-react
```

**Configurar GrowthBook:**

```typescript
// client/src/lib/growthbook.ts

import { GrowthBook } from "@growthbook/growthbook-react";

export const gb = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: process.env.VITE_GROWTHBOOK_KEY,
  enableDevMode: process.env.NODE_ENV === "development",
  trackingCallback: (experiment, result) => {
    // Analytics tracking
    console.log("Experiment viewed", {
      experimentId: experiment.key,
      variationId: result.variationId,
    });
  },
});
```

**Exemplo de teste A/B:**

```typescript
// Testar diferentes CTAs na landing page
const cta = gb.getFeatureValue("landing-cta", "Criar Minha Primeira Memória");

<Button>{cta}</Button>
```

### Passo 6.2: Implementar Analytics Avançado

Configure analytics detalhado com Mixpanel ou Amplitude.

**Instalar Mixpanel:**
```bash
pnpm add mixpanel-browser
```

**Configurar tracking:**

```typescript
// client/src/lib/analytics.ts

import mixpanel from "mixpanel-browser";

mixpanel.init(process.env.VITE_MIXPANEL_TOKEN!);

export const track = {
  pageView: (page: string) => {
    mixpanel.track("Page Viewed", { page });
  },
  
  memoryCreated: (format: string) => {
    mixpanel.track("Memory Created", { format });
  },
  
  subscriptionStarted: (plan: string) => {
    mixpanel.track("Subscription Started", { plan });
    mixpanel.people.set({
      plan,
      subscriptionDate: new Date().toISOString(),
    });
  },
  
  identify: (userId: number, email: string) => {
    mixpanel.identify(userId.toString());
    mixpanel.people.set({
      $email: email,
      $created: new Date().toISOString(),
    });
  },
};
```

### Passo 6.3: Implementar Referral Program

Crie programa de indicação para crescimento viral.

**Schema:**

```typescript
// drizzle/schema.ts

export const referrals = sqliteTable("referrals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  referrerId: integer("referrer_id").notNull().references(() => user.id),
  referredId: integer("referred_id").references(() => user.id),
  code: text("code").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, completed
  reward: text("reward"), // "3_memories", "1_month_free", etc
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }),
});
```

**Endpoints:**

```typescript
// server/routers.ts

referrals: router({
  getMyCode: protectedProcedure
    .query(async ({ ctx }) => {
      let referral = await db.getReferralByUserId(ctx.user.id);
      
      if (!referral) {
        // Gerar código único
        const code = generateReferralCode(ctx.user.id);
        referral = await db.createReferral(ctx.user.id, code);
      }
      
      return referral;
    }),
  
  applyCode: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const referral = await db.getReferralByCode(input.code);
      if (!referral) throw new Error("Código inválido");
      
      // Aplicar recompensa
      await db.giveReferralReward(referral.referrerId, "3_memories");
      await db.giveReferralReward(ctx.user.id, "3_memories");
      
      return { success: true };
    }),
}),
```

### Passo 6.4: Implementar Galeria Pública

Crie galeria de memórias públicas para viralização.

**Página de galeria:**

```typescript
// client/src/pages/Gallery.tsx

export default function Gallery() {
  const { data: memories, isLoading } = trpc.memories.getPublic.useQuery({
    limit: 20,
    offset: 0,
  });
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Galeria Pública</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {memories?.map((memory) => (
          <Card key={memory.id} className="overflow-hidden">
            <img
              src={memory.thumbnailUrl}
              alt={memory.title}
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-4">
              <h3 className="font-bold mb-2">{memory.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>❤️ {memory.likes}</span>
                <span>👁️ {memory.views}</span>
                <span>🔗 {memory.shares}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Passo 6.5: Implementar API Pública

Crie API pública para desenvolvedores.

**Gerar API keys:**

```typescript
// drizzle/schema.ts

export const apiKeys = sqliteTable("api_keys", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => user.id),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  permissions: text("permissions").notNull(), // JSON array
  rateLimit: integer("rate_limit").default(100), // requests/hour
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  lastUsedAt: integer("last_used_at", { mode: "timestamp" }),
});
```

**Documentação da API:**

```markdown
# MemoryVerse AI API

## Autenticação

Todas as requisições devem incluir o header:
```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### POST /api/v1/memories

Criar nova memória.

**Request:**
```json
{
  "title": "Minha Memória",
  "story": "Era uma vez...",
  "format": "video"
}
```

**Response:**
```json
{
  "id": 123,
  "status": "pending",
  "estimatedTime": 300
}
```

### GET /api/v1/memories/:id

Buscar memória por ID.

**Response:**
```json
{
  "id": 123,
  "title": "Minha Memória",
  "status": "completed",
  "videoUrl": "https://...",
  "thumbnailUrl": "https://..."
}
```
```

### Passo 6.6: Implementar Webhooks para Clientes

Permita que clientes recebam notificações via webhook.

```typescript
// drizzle/schema.ts

export const webhooks = sqliteTable("webhooks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => user.id),
  url: text("url").notNull(),
  events: text("events").notNull(), // JSON array
  secret: text("secret").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
```

**Disparar webhooks:**

```typescript
// server/webhooks/client.ts

export async function triggerClientWebhook(userId: number, event: string, data: any) {
  const webhooks = await db.getWebhooksByUserId(userId);
  
  for (const webhook of webhooks) {
    if (!webhook.isActive) continue;
    if (!webhook.events.includes(event)) continue;
    
    const signature = generateSignature(data, webhook.secret);
    
    await fetch(webhook.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-MemoryVerse-Signature": signature,
      },
      body: JSON.stringify({
        event,
        data,
        timestamp: Date.now(),
      }),
    });
  }
}
```

### Passo 6.7: Implementar Machine Learning

Use ML para melhorar recomendações e qualidade.

**1. Recomendação de Formatos**

```typescript
// server/ml/recommendations.ts

export async function recommendFormat(story: string, userHistory: any[]) {
  // Analisar história
  const keywords = extractKeywords(story);
  const sentiment = analyzeSentiment(story);
  
  // Analisar histórico do usuário
  const preferredFormats = userHistory.reduce((acc, memory) => {
    acc[memory.format] = (acc[memory.format] || 0) + 1;
    return acc;
  }, {});
  
  // Lógica de recomendação
  if (keywords.includes("música") || sentiment.emotion === "joy") {
    return "music";
  }
  if (keywords.includes("viagem") || keywords.includes("aventura")) {
    return "video";
  }
  if (story.length > 1000) {
    return "book";
  }
  
  // Fallback: formato mais usado pelo usuário
  return Object.keys(preferredFormats).sort((a, b) => 
    preferredFormats[b] - preferredFormats[a]
  )[0] || "video";
}
```

**2. Análise de Qualidade**

```typescript
// server/ml/quality.ts

export async function analyzeQuality(memory: any) {
  const scores = {
    visual: 0,
    audio: 0,
    narrative: 0,
  };
  
  // Analisar qualidade visual (se vídeo/livro)
  if (memory.thumbnailUrl) {
    scores.visual = await analyzeImageQuality(memory.thumbnailUrl);
  }
  
  // Analisar qualidade de áudio (se música/podcast)
  if (memory.audioUrl) {
    scores.audio = await analyzeAudioQuality(memory.audioUrl);
  }
  
  // Analisar narrativa
  scores.narrative = await analyzeNarrativeQuality(memory.script);
  
  const overall = (scores.visual + scores.audio + scores.narrative) / 3;
  
  return {
    scores,
    overall,
    suggestions: generateImprovementSuggestions(scores),
  };
}
```

### Passo 6.8: Implementar Internacionalização Completa

Expanda para mais idiomas e mercados.

**Adicionar mais idiomas:**

```typescript
// client/src/locales/fr.json (Francês)
// client/src/locales/de.json (Alemão)
// client/src/locales/it.json (Italiano)
// client/src/locales/ru.json (Russo)
// client/src/locales/ar.json (Árabe)
```

**Detecção automática de idioma:**

```typescript
// client/src/lib/i18n.ts

const detectLanguage = () => {
  const stored = localStorage.getItem("language");
  if (stored) return stored;
  
  const browser = navigator.language.split("-")[0];
  const supported = ["pt", "en", "es", "zh", "ja", "fr", "de", "it", "ru", "ar"];
  
  return supported.includes(browser) ? browser : "en";
};
```

### Passo 6.9: Implementar SEO Avançado

Otimize para motores de busca.

**1. Server-Side Rendering (SSR)**

Se necessário, migre para Next.js para SSR:

```bash
# Criar novo projeto Next.js
npx create-next-app@latest memoryverse-nextjs
# Migrar código gradualmente
```

**2. Sitemap Dinâmico**

```typescript
// server/routes/sitemap.ts

export async function generateSitemap() {
  const memories = await db.getPublicMemories();
  
  const urls = [
    { loc: "/", priority: 1.0 },
    { loc: "/pricing", priority: 0.8 },
    { loc: "/gallery", priority: 0.7 },
    ...memories.map(m => ({
      loc: `/gallery/${m.id}`,
      priority: 0.6,
      lastmod: m.updatedAt,
    })),
  ];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.map(url => `
        <url>
          <loc>https://memoryverse.com.br${url.loc}</loc>
          <priority>${url.priority}</priority>
          ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
        </url>
      `).join("")}
    </urlset>`;
}
```

**3. Schema Markup**

```typescript
// Adicionar JSON-LD nas páginas
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "MemoryVerse AI",
  "description": "Transforme suas memórias em arte com IA",
  "applicationCategory": "MultimediaApplication",
  "offers": {
    "@type": "Offer",
    "price": "97.00",
    "priceCurrency": "BRL"
  }
}
</script>
```

### Passo 6.10: Checklist da Fase 6

Parabéns! Você completou todas as fases. Confirme que você tem:

- ✅ A/B testing configurado
- ✅ Analytics avançado implementado
- ✅ Programa de referral funcionando
- ✅ Galeria pública criada
- ✅ API pública documentada
- ✅ Webhooks para clientes implementados
- ✅ ML para recomendações
- ✅ Análise de qualidade automática
- ✅ Internacionalização completa
- ✅ SEO avançado implementado

---

## ✅ Checklist Final

Use esta checklist para garantir que tudo está funcionando perfeitamente.

### Infraestrutura

- [ ] Projeto criado no Manus
- [ ] Banco de dados configurado
- [ ] Storage S3 configurado
- [ ] Domínio customizado configurado
- [ ] SSL ativo
- [ ] CDN configurado
- [ ] Backup automático funcionando

### Backend

- [ ] Autenticação OAuth funcionando
- [ ] Endpoints tRPC criados
- [ ] Schema do banco sincronizado
- [ ] APIs de IA integradas (OpenAI, ElevenLabs, Suno)
- [ ] Processamento de memórias funcionando
- [ ] Sistema de notificações funcionando
- [ ] Webhooks n8n integrados

### Frontend

- [ ] Landing page multilíngue
- [ ] Dashboard funcional
- [ ] Criação de memórias funcionando
- [ ] Lista de memórias funcionando
- [ ] Notificações aparecendo
- [ ] Página de pricing criada
- [ ] Página de contato criada
- [ ] Galeria pública criada

### Pagamentos

- [ ] Stripe configurado
- [ ] Produtos criados no Stripe
- [ ] Checkout funcionando
- [ ] Webhooks Stripe configurados
- [ ] Billing portal funcionando
- [ ] Limites de memórias sendo respeitados

### Automação

- [ ] n8n instalado
- [ ] 5 workflows importados
- [ ] Credenciais configuradas
- [ ] Email marketing funcionando
- [ ] Analytics diários funcionando
- [ ] Moderação automática funcionando
- [ ] Auto-post em redes sociais configurado

### Performance

- [ ] Cache Redis implementado
- [ ] Rate limiting configurado
- [ ] Índices de banco otimizados
- [ ] Testes de carga executados

### Monitoramento

- [ ] Sentry configurado
- [ ] Logging estruturado
- [ ] Analytics configurado
- [ ] Alertas configurados

### Avançado

- [ ] A/B testing configurado
- [ ] Programa de referral implementado
- [ ] API pública documentada
- [ ] SEO otimizado

---

## 🐛 Troubleshooting

### Problema: Memórias não estão sendo processadas

**Possíveis causas:**
1. Webhook n8n não está ativo
2. Credenciais de API inválidas
3. Limite de créditos das APIs atingido

**Solução:**
1. Verificar se workflow está ativo no n8n
2. Testar credenciais manualmente
3. Verificar saldo nas contas de API

### Problema: Emails não estão sendo enviados

**Possíveis causas:**
1. Credenciais SMTP incorretas
2. Domínio não verificado
3. Emails indo para spam

**Solução:**
1. Testar SMTP com ferramenta externa
2. Verificar domínio no provedor de email
3. Configurar SPF, DKIM e DMARC

### Problema: Pagamentos não estão funcionando

**Possíveis causas:**
1. Webhook Stripe não configurado
2. Credenciais incorretas
3. Produtos não criados no Stripe

**Solução:**
1. Verificar URL do webhook no Stripe Dashboard
2. Testar com cartão de teste
3. Verificar logs do webhook

### Problema: Performance lenta

**Possíveis causas:**
1. Queries não otimizadas
2. Falta de cache
3. Muitas requisições simultâneas

**Solução:**
1. Adicionar índices no banco
2. Implementar cache Redis
3. Configurar rate limiting

---

## 📚 Recursos Adicionais

### Documentação

- **Manus Platform:** https://docs.manus.im
- **tRPC:** https://trpc.io/docs
- **Drizzle ORM:** https://orm.drizzle.team
- **Tailwind CSS:** https://tailwindcss.com/docs
- **n8n:** https://docs.n8n.io

### APIs de IA

- **OpenAI:** https://platform.openai.com/docs
- **ElevenLabs:** https://docs.elevenlabs.io
- **Suno AI:** https://suno.ai/docs
- **Runway ML:** https://docs.runwayml.com

### Comunidade

- **Discord do Manus:** https://discord.gg/manus
- **GitHub:** https://github.com/memoryverse-ai
- **Twitter:** @memoryverseai

---

## 🎉 Conclusão

Parabéns! Você completou o guia completo de implementação do MemoryVerse AI.

Agora você tem uma plataforma SaaS completa e escalável que:
- ✅ Transforma memórias em arte com IA
- ✅ Processa pagamentos com Stripe
- ✅ Automatiza marketing e operações com n8n
- ✅ Escala para milhares de usuários
- ✅ Gera receita recorrente

**Próximos passos:**
1. Lançar versão beta para primeiros usuários
2. Coletar feedback e iterar
3. Investir em marketing (SEO, ads, redes sociais)
4. Escalar para 1.000+ usuários pagos
5. Levantar investimento (se necessário)

**Boa sorte com o MemoryVerse AI!** 🚀

---

**Autor:** Manus AI  
**Data:** 02/12/2024  
**Versão:** 1.0.0
