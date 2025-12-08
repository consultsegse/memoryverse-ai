# 🤖 Workflows n8n - MemoryVerse AI

Documentação completa dos fluxos de automação do MemoryVerse AI usando n8n.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Workflows Disponíveis](#workflows-disponíveis)
3. [Configuração](#configuração)
4. [APIs e Credenciais](#apis-e-credenciais)
5. [Webhooks](#webhooks)
6. [Custos Estimados](#custos-estimados)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Os workflows n8n automatizam todo o pipeline do MemoryVerse AI, desde a criação de memórias até o marketing e suporte ao cliente.

### Arquitetura

```
┌─────────────────┐
│   Aplicação     │
│  (MemoryVerse)  │
└────────┬────────┘
         │ Webhooks
         ▼
┌─────────────────┐
│      n8n        │
│   Workflows     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌───────┐
│  APIs │ │  DB   │
│  IA   │ │       │
└───────┘ └───────┘
```

---

## 🔄 Workflows Disponíveis

### 1. **Processamento de Memórias** (`01-memory-processing.json`)

**Trigger:** Webhook POST `/memory-created`

**Fluxo:**
1. Recebe dados da memória (história, formato, userId)
2. Gera roteiro com GPT-4
3. Cria conteúdo baseado no formato:
   - **Vídeo:** DALL-E → Imagens
   - **Música:** Suno AI → Música completa
   - **Livro:** DALL-E → Ilustrações
   - **Podcast:** ElevenLabs → Narração
4. Atualiza status no banco de dados
5. Envia notificação ao usuário

**Tempo estimado:** 3-8 minutos por memória

---

### 2. **Geração de Vídeo Completo** (`02-video-generation.json`)

**Trigger:** Webhook POST `/generate-video`

**Fluxo Avançado:**
1. GPT-4 cria cenas detalhadas (5-8 cenas)
2. DALL-E gera imagem para cada cena
3. Upload das imagens para S3
4. GPT-4 cria narração profissional
5. ElevenLabs converte texto em voz
6. Runway ML compila vídeo final com transições
7. Retorna URL do vídeo

**Tempo estimado:** 8-15 minutos

**Qualidade:** 4K, narração profissional, transições cinematográficas

---

### 3. **Email Marketing & Onboarding** (`03-email-marketing.json`)

**Trigger:** Webhook POST `/user-registered`

**Sequência Automática:**

| Tempo | Ação | Objetivo |
|-------|------|----------|
| +2 min | Email de boas-vindas | Apresentar plataforma |
| +1 dia | Verificar se criou memórias | - |
| +1 dia | Email de lembrete (se não criou) | Ativar usuário |
| +3 dias | Oferta 50% OFF no plano Creator | Converter para pago |
| +7 dias | Solicitar feedback | Melhorar produto |

**Taxa de conversão esperada:** 15-25%

---

### 4. **Moderação & Analytics** (`04-moderation-analytics.json`)

#### A) Moderação de Conteúdo

**Trigger:** Webhook POST `/moderate-content`

**Fluxo:**
1. GPT-4 analisa conteúdo
2. Detecta categorias problemáticas:
   - Violência
   - Discurso de ódio
   - Conteúdo sexual
   - Spam
   - Desinformação
   - Informações pessoais
3. Se inseguro → Sinaliza + Alerta admin
4. Retorna resultado da moderação

**Tempo de resposta:** < 2 segundos

#### B) Analytics Diários

**Trigger:** Cron diário às 00:00

**Fluxo:**
1. Busca estatísticas do dia anterior
2. GPT-4 gera relatório executivo com insights
3. Envia email para administradores

**Métricas incluídas:**
- Novos usuários
- Memórias criadas/completadas
- Taxa de conversão
- Receita e MRR
- Churn rate

#### C) Backup Automático

**Trigger:** Cron a cada 6 horas

**Fluxo:**
1. Cria snapshot do banco de dados
2. Upload para S3 (bucket `memoryverse-backups`)
3. Mantém últimos 30 dias

---

### 5. **Redes Sociais & Pagamentos** (`05-social-payments.json`)

#### A) Auto-Post em Redes Sociais

**Trigger:** Webhook POST `/memory-published`

**Fluxo:**
1. Verifica se auto-post está ativado
2. GPT-4 gera legendas otimizadas para cada plataforma:
   - **Instagram:** Caption + hashtags
   - **TikTok:** Caption viral + hashtags
   - **YouTube:** Título + descrição + tags
3. Posta simultaneamente em todas as plataformas
4. Salva IDs dos posts no banco

**Hashtags automáticas:** #MemoryVerseAI #InteligenciaArtificial #IA

#### B) Webhooks do Stripe

**Trigger:** Webhook POST `/stripe-webhook`

**Eventos tratados:**

| Evento Stripe | Ação |
|--------------|------|
| `checkout.session.completed` | Ativar assinatura + Notificar usuário + Email confirmação |
| `customer.subscription.deleted` | Cancelar assinatura + Email despedida |
| `invoice.payment_failed` | Alertar usuário + Retry automático |

---

## ⚙️ Configuração

### Pré-requisitos

1. **n8n instalado** (self-hosted ou cloud)
2. **Credenciais das APIs** (ver seção abaixo)
3. **Banco de dados** configurado
4. **S3 bucket** para armazenamento

### Importar Workflows

```bash
# 1. Copiar arquivos para o n8n
cp n8n-workflows/*.json /path/to/n8n/workflows/

# 2. No n8n UI, ir em Workflows → Import from File
# 3. Selecionar cada arquivo .json
# 4. Configurar credenciais (ver próxima seção)
```

### Configurar Webhooks na Aplicação

Adicionar ao `server/routers.ts`:

```typescript
// Após criar memória
await fetch('https://n8n.memoryverse.com.br/webhook/memory-created', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    memoryId: memory.id,
    userId: user.id,
    story: memory.story,
    format: memory.format,
  }),
});

// Após registro de usuário
await fetch('https://n8n.memoryverse.com.br/webhook/user-registered', {
  method: 'POST',
  body: JSON.stringify({
    userId: user.id,
    email: user.email,
    name: user.name,
  }),
});
```

---

## 🔑 APIs e Credenciais

### 1. OpenAI (GPT-4 + DALL-E)

```env
OPENAI_API_KEY=sk-...
```

**Modelos usados:**
- `gpt-4o` - Roteiros, legendas, análises
- `dall-e-3` - Geração de imagens

**Custo estimado:**
- GPT-4o: $0.005/1K tokens (~$0.02 por memória)
- DALL-E 3: $0.040 por imagem HD

### 2. ElevenLabs (Voz)

```env
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=... # ID da voz escolhida
```

**Modelo:** `eleven_multilingual_v2`

**Custo:** $0.30 por 1K caracteres (~$0.60 por narração de 2min)

### 3. Suno AI (Música)

```env
SUNO_API_KEY=...
```

**Custo:** ~$0.10 por música (180 segundos)

### 4. Runway ML (Vídeo)

```env
RUNWAY_API_KEY=...
```

**Custo:** $0.05 por segundo de vídeo (~$6 por vídeo de 2min)

### 5. AWS S3 (Armazenamento)

```env
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
```

**Buckets necessários:**
- `memoryverse-scenes` - Imagens das cenas
- `memoryverse-audio` - Arquivos de áudio
- `memoryverse-backups` - Backups do banco

### 6. SMTP (Email)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contato@memoryverse.com.br
SMTP_PASSWORD=...
```

**Alternativas recomendadas:**
- SendGrid (99% deliverability)
- AWS SES (mais barato)
- Resend (developer-friendly)

### 7. Redes Sociais

#### Instagram
- OAuth 2.0 via Facebook Developer
- Permissões: `instagram_basic`, `instagram_content_publish`

#### TikTok
- TikTok for Developers API
- Permissões: `video.upload`, `video.publish`

#### YouTube
- Google Cloud Console
- API: YouTube Data API v3
- Permissões: `youtube.upload`

### 8. Stripe (Pagamentos)

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Configurar webhook no Stripe Dashboard:**
- URL: `https://n8n.memoryverse.com.br/webhook/stripe-webhook`
- Eventos: `checkout.session.completed`, `customer.subscription.deleted`

---

## 🌐 Webhooks

### URLs dos Webhooks

Assumindo n8n em `https://n8n.memoryverse.com.br`:

| Workflow | URL | Método |
|----------|-----|--------|
| Processamento de Memórias | `/webhook/memory-created` | POST |
| Geração de Vídeo | `/webhook/generate-video` | POST |
| Novo Usuário | `/webhook/user-registered` | POST |
| Moderação | `/webhook/moderate-content` | POST |
| Memória Publicada | `/webhook/memory-published` | POST |
| Stripe | `/webhook/stripe-webhook` | POST |

### Exemplo de Payload

#### `/webhook/memory-created`

```json
{
  "memoryId": 123,
  "userId": 456,
  "story": "Era uma vez...",
  "format": "video",
  "title": "Minha Memória Especial"
}
```

#### `/webhook/moderate-content`

```json
{
  "contentId": 789,
  "content": "Texto para moderar...",
  "userId": 456
}
```

---

## 💰 Custos Estimados

### Por Memória (Média)

| Formato | APIs Usadas | Custo |
|---------|-------------|-------|
| **Vídeo** | GPT-4 + DALL-E + ElevenLabs + Runway | ~$7.00 |
| **Música** | GPT-4 + Suno AI | ~$0.15 |
| **Livro** | GPT-4 + DALL-E (10 imagens) | ~$0.50 |
| **Podcast** | GPT-4 + ElevenLabs | ~$0.65 |

### Custos Fixos Mensais

- **n8n Cloud:** $20/mês (ou self-hosted grátis)
- **S3 Storage:** ~$5/mês (100GB)
- **SMTP (SendGrid):** $15/mês (40k emails)
- **Banco de dados:** Incluído no Manus

### Escala (1000 memórias/mês)

- 500 vídeos: $3,500
- 300 músicas: $45
- 200 livros: $100

**Total:** ~$3,645/mês + $40 fixos = **$3,685/mês**

**Receita com 1000 memórias:**
- 200 usuários pagos × R$97 = R$19,400 (~$3,880)
- **Margem:** ~$200/mês (5%)

---

## 🐛 Troubleshooting

### Workflow não está executando

1. Verificar se webhook está ativo (toggle verde)
2. Testar webhook manualmente no n8n
3. Verificar logs de erro

### Erro de credenciais

1. Ir em **Credentials** no n8n
2. Testar conexão de cada credencial
3. Verificar se API keys estão válidas

### Timeout em requisições

- Aumentar timeout no nó HTTP Request
- Configuração: `Options → Timeout → 60000` (60s)

### Memória não está sendo processada

1. Verificar logs do workflow
2. Testar cada nó individualmente
3. Verificar se payload do webhook está correto

### Email não está sendo enviado

1. Verificar credenciais SMTP
2. Testar com ferramenta externa (Postman)
3. Verificar se domínio está na whitelist

---

## 📊 Monitoramento

### Métricas Importantes

- **Taxa de sucesso dos workflows:** > 95%
- **Tempo médio de processamento:** < 10 minutos
- **Taxa de erro de APIs:** < 2%
- **Custo por memória:** Monitorar mensalmente

### Alertas Recomendados

1. **Workflow falhou 3x seguidas** → Notificar admin
2. **Custo diário > $200** → Alertar financeiro
3. **Taxa de erro > 5%** → Investigar APIs
4. **Backup falhou** → Alerta crítico

---

## 🚀 Próximos Passos

1. **Implementar retry automático** para falhas temporárias
2. **Adicionar A/B testing** nos emails de marketing
3. **Criar workflow de suporte** com chatbot IA
4. **Implementar queue system** para processar memórias em lote
5. **Adicionar webhooks do WhatsApp** para notificações

---

## 📞 Suporte

Dúvidas sobre os workflows? Entre em contato:
- Email: dev@memoryverse.com.br
- Documentação n8n: https://docs.n8n.io

---

**Última atualização:** 02/12/2024
**Versão:** 1.0.0
