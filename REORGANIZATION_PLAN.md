# Plano de Reorganização - MemoryVerse AI

**Data:** Dezembro 2025  
**Versão:** 1.0  
**Objetivo:** Reorganizar projeto em estrutura lógica e profissional

---

## 📊 Análise da Estrutura Atual

### Problemas Identificados

1. **Documentação espalhada** - Arquivos MD na raiz (BUSINESS_PLAN, IMPLEMENTATION_GUIDE, etc)
2. **Falta de separação de domínios** - Código misturado sem clara separação de responsabilidades
3. **Serviços não modularizados** - Lógica de IA, Stripe, Email em arquivos isolados
4. **Testes misturados com código** - `.test.ts` junto com código de produção
5. **Workflows sem organização** - n8n-workflows sem documentação integrada
6. **Knowledge base isolada** - Não integrada com o resto da documentação

---

## 🎯 Nova Estrutura Proposta

```
memoryverse-ai/
├── docs/                           # 📚 TODA a documentação
│   ├── README.md                   # Visão geral do projeto
│   ├── ARCHITECTURE.md             # Arquitetura técnica
│   ├── API.md                      # Documentação da API
│   ├── DEPLOYMENT.md               # Guia de deploy
│   ├── business/
│   │   ├── BUSINESS_PLAN.md
│   │   ├── MARKET_ANALYSIS.md
│   │   └── PRICING_STRATEGY.md
│   ├── development/
│   │   ├── IMPLEMENTATION_GUIDE.md
│   │   ├── TESTING.md
│   │   └── CONTRIBUTING.md
│   └── agent/
│       ├── KNOWLEDGE_BASE.md
│       ├── AGENT_PROMPT.md
│       ├── CONVERSATION_FLOWS.md
│       └── USER_DOCUMENTATION.md
│
├── client/                         # 🎨 Frontend
│   ├── public/
│   ├── src/
│   │   ├── _core/                  # Core do framework
│   │   ├── components/
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── layout/             # Layout components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── DashboardLayout.tsx
│   │   │   ├── features/           # Feature-specific components
│   │   │   │   ├── memories/
│   │   │   │   ├── notifications/
│   │   │   │   └── pricing/
│   │   │   └── shared/             # Shared components
│   │   ├── pages/                  # Page components
│   │   ├── hooks/                  # Custom hooks
│   │   ├── contexts/               # React contexts
│   │   ├── lib/                    # Utilities
│   │   └── locales/                # i18n translations
│   └── index.html
│
├── server/                         # 🔧 Backend
│   ├── _core/                      # Core do framework
│   ├── domains/                    # Domain-driven design
│   │   ├── auth/
│   │   │   ├── auth.router.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.test.ts
│   │   ├── memories/
│   │   │   ├── memories.router.ts
│   │   │   ├── memories.service.ts
│   │   │   ├── memories.test.ts
│   │   │   └── processors/
│   │   │       ├── video.processor.ts
│   │   │       ├── music.processor.ts
│   │   │       ├── book.processor.ts
│   │   │       └── podcast.processor.ts
│   │   ├── notifications/
│   │   │   ├── notifications.router.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── notifications.test.ts
│   │   │   └── templates.ts
│   │   ├── payments/
│   │   │   ├── payments.router.ts
│   │   │   ├── stripe.service.ts
│   │   │   ├── stripe.test.ts
│   │   │   ├── products.ts
│   │   │   └── webhook.ts
│   │   └── agent/
│   │       ├── agent.router.ts
│   │       ├── agent.service.ts
│   │       └── agent.test.ts
│   ├── integrations/               # Integrações externas
│   │   ├── openai/
│   │   │   ├── client.ts
│   │   │   └── prompts.ts
│   │   ├── elevenlabs/
│   │   │   └── client.ts
│   │   ├── suno/
│   │   │   └── client.ts
│   │   └── email/
│   │       ├── client.ts
│   │       └── templates/
│   ├── db.ts                       # Database utilities
│   ├── storage.ts                  # S3 storage
│   └── routers.ts                  # Main router
│
├── drizzle/                        # 🗄️ Database
│   ├── schema.ts
│   ├── relations.ts
│   └── meta/
│
├── shared/                         # 🔄 Shared code
│   ├── _core/
│   ├── types.ts
│   ├── const.ts
│   └── utils.ts
│
├── automation/                     # 🤖 Automação
│   ├── n8n/
│   │   ├── workflows/
│   │   │   ├── 01-memory-processing.json
│   │   │   ├── 02-video-generation.json
│   │   │   ├── 03-email-marketing.json
│   │   │   ├── 04-moderation-analytics.json
│   │   │   ├── 05-social-payments.json
│   │   │   └── 06-chatbot-agent.json
│   │   └── README.md
│   └── scripts/
│       ├── seed-database.ts
│       ├── generate-examples.ts
│       └── backup.ts
│
├── tests/                          # 🧪 Testes
│   ├── e2e/                        # End-to-end tests
│   ├── integration/                # Integration tests
│   └── fixtures/                   # Test data
│
├── .env.example                    # Exemplo de variáveis
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── drizzle.config.ts
└── README.md                       # README principal
```

---

## 🔄 Plano de Migração

### Fase 1: Documentação (Prioridade Alta)

**Ações:**
1. Criar pasta `docs/` na raiz
2. Mover todos os `.md` da raiz para `docs/`
3. Organizar em subpastas (business, development, agent)
4. Criar `docs/README.md` como índice
5. Atualizar referências nos arquivos

**Arquivos afetados:**
- BUSINESS_PLAN.md → docs/business/
- MARKET_ANALYSIS_REPORT.md → docs/business/
- IMPLEMENTATION_GUIDE.md → docs/development/
- knowledge-base/* → docs/agent/
- market-research-data.md → docs/business/

### Fase 2: Backend - Domain-Driven Design (Prioridade Alta)

**Ações:**
1. Criar pasta `server/domains/`
2. Agrupar código por domínio (auth, memories, notifications, payments, agent)
3. Cada domínio tem: router, service, tests
4. Mover processadores de IA para `server/domains/memories/processors/`
5. Criar pasta `server/integrations/` para APIs externas

**Arquivos afetados:**
- server/ai/memoryProcessor.ts → server/domains/memories/processors/
- server/stripe/* → server/domains/payments/
- server/emailService.ts → server/integrations/email/
- server/notificationTemplates.ts → server/domains/notifications/

### Fase 3: Frontend - Feature-Based (Prioridade Média)

**Ações:**
1. Criar `client/src/components/layout/`
2. Criar `client/src/components/features/`
3. Agrupar componentes por feature
4. Separar componentes de layout

**Arquivos afetados:**
- DashboardLayout.tsx → components/layout/
- NotificationCenter.tsx → components/features/notifications/
- ShareButtons.tsx → components/features/memories/

### Fase 4: Automação e Scripts (Prioridade Média)

**Ações:**
1. Criar pasta `automation/`
2. Mover n8n-workflows para `automation/n8n/workflows/`
3. Criar scripts utilitários em `automation/scripts/`

**Arquivos afetados:**
- n8n-workflows/* → automation/n8n/workflows/

### Fase 5: Testes Separados (Prioridade Baixa)

**Ações:**
1. Manter testes unitários junto com código (*.test.ts)
2. Criar pasta `tests/` para testes E2E e integração
3. Criar fixtures compartilhados

---

## ✅ Benefícios da Nova Estrutura

1. **Clareza** - Fácil encontrar qualquer arquivo
2. **Escalabilidade** - Adicionar novos domínios é simples
3. **Manutenibilidade** - Código organizado por responsabilidade
4. **Onboarding** - Novos devs entendem rápido
5. **Documentação** - Tudo centralizado em `docs/`
6. **Testes** - Separados mas próximos do código

---

## 🚀 Execução

**Ordem de execução:**
1. Fase 1 (Documentação) - 30 min
2. Fase 2 (Backend DDD) - 1-2h
3. Fase 4 (Automação) - 15 min
4. Fase 3 (Frontend) - 1h
5. Fase 5 (Testes) - 30 min

**Total estimado:** 3-4 horas

---

## ⚠️ Cuidados

1. **Não quebrar imports** - Atualizar todos os imports após mover arquivos
2. **Testar após cada fase** - Garantir que nada quebrou
3. **Commit incremental** - Commit após cada fase
4. **Atualizar README** - Documentar nova estrutura

---

**Status:** 📋 Planejado  
**Próximo passo:** Executar Fase 1 (Documentação)
