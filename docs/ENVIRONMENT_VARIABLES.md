# Variáveis de Ambiente - MemoryVerse AI

**Versão:** 1.0  
**Data:** Dezembro 2025

---

## 📋 Visão Geral

Este documento lista todas as variáveis de ambiente necessárias para o MemoryVerse AI funcionar corretamente.

---

## 🔐 Variáveis Obrigatórias

### OpenAI (GPT-4 + DALL-E)

**Obrigatório para:** Geração de roteiros, textos e imagens

```bash
OPENAI_API_KEY=sk-...
```

**Como obter:**
1. Acesse https://platform.openai.com/api-keys
2. Crie uma nova API key
3. Adicione créditos na conta (mínimo $5)

**Custo estimado:** $0.10-0.50 por memória

---

### ElevenLabs (Narração)

**Obrigatório para:** Podcasts e narração de vídeos

```bash
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

**Como obter:**
1. Acesse https://elevenlabs.io
2. Crie conta e vá em Profile → API Keys
3. Copie a API key
4. Escolha uma voz em Voice Library (opcional)

**Custo estimado:** $0.30 por 1000 caracteres

**Vozes recomendadas:**
- `21m00Tcm4TlvDq8ikWAM` - Rachel (feminina, inglês)
- `pNInz6obpgDQGcFmaJgB` - Adam (masculino, inglês)

---

## ⚙️ Variáveis Opcionais

### Suno AI (Música)

**Opcional para:** Geração de músicas

**Opção 1: Via Webhook n8n (Recomendado)**

```bash
SUNO_WEBHOOK_URL=https://your-n8n.com/webhook/suno-generate
SUNO_STATUS_WEBHOOK_URL=https://your-n8n.com/webhook/suno-status
N8N_WEBHOOK_TOKEN=your_secret_token
```

**Opção 2: API Não-oficial (Não recomendado)**

```bash
SUNO_UNOFFICIAL_API_URL=https://...
SUNO_UNOFFICIAL_API_KEY=...
```

**Fallback:** Se não configurado, usa música genérica

---

### Email Service

**Opcional para:** Notificações por email

**Opção 1: SMTP (Gmail, Outlook, etc)**

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Opção 2: SendGrid**

```bash
SENDGRID_API_KEY=SG...
```

**Opção 3: Mailgun**

```bash
MAILGUN_API_KEY=...
MAILGUN_DOMAIN=mg.yourdomain.com
```

---

## 🔧 Variáveis do Sistema

**Estas variáveis são configuradas automaticamente pelo Manus:**

```bash
# Database
DATABASE_URL=mysql://...

# Authentication
JWT_SECRET=...
OAUTH_SERVER_URL=...
VITE_OAUTH_PORTAL_URL=...
VITE_APP_ID=...

# Owner
OWNER_OPEN_ID=...
OWNER_NAME=...

# Manus APIs
BUILT_IN_FORGE_API_URL=...
BUILT_IN_FORGE_API_KEY=...
VITE_FRONTEND_FORGE_API_KEY=...
VITE_FRONTEND_FORGE_API_URL=...

# Stripe (auto-configured)
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
VITE_STRIPE_PUBLISHABLE_KEY=...

# Analytics
VITE_ANALYTICS_ENDPOINT=...
VITE_ANALYTICS_WEBSITE_ID=...

# App
VITE_APP_TITLE=MemoryVerse AI
VITE_APP_LOGO=/logo.png
```

**Não edite estas variáveis manualmente!**

---

## 📝 Como Adicionar Variáveis

### Via Interface do Manus

1. Abra o projeto no Manus
2. Clique em "Settings" → "Secrets"
3. Adicione a variável e valor
4. Salve

### Via Código (para desenvolvimento)

Use a ferramenta `webdev_request_secrets`:

```typescript
await webdev_request_secrets({
  secrets: [
    {
      key: "OPENAI_API_KEY",
      description: "API key do OpenAI para GPT-4 e DALL-E"
    }
  ],
  message: "Adicione sua API key do OpenAI para habilitar geração de memórias"
});
```

---

## ✅ Checklist de Configuração

Para lançar em produção, você precisa de:

- [ ] `OPENAI_API_KEY` - **Obrigatório**
- [ ] `ELEVENLABS_API_KEY` - **Obrigatório** (para podcasts)
- [ ] `SUNO_WEBHOOK_URL` - Opcional (música)
- [ ] Email service - Opcional (notificações)
- [ ] Stripe configurado - Já configurado ✅

---

## 🔒 Segurança

### Boas Práticas

1. **Nunca commite** variáveis de ambiente no Git
2. **Use secrets management** do Manus
3. **Rotacione keys** regularmente (a cada 3-6 meses)
4. **Monitore uso** das APIs para detectar abusos
5. **Limite rate** em produção

### Variáveis Sensíveis

Estas variáveis **NUNCA** devem ser expostas no frontend:

- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `JWT_SECRET`
- `DATABASE_URL`

Variáveis com prefixo `VITE_` são **públicas** e podem ser vistas no frontend.

---

## 💰 Estimativa de Custos

### Por Memória

| Formato | OpenAI | ElevenLabs | Suno | Total |
|---------|--------|------------|------|-------|
| Vídeo | $0.30 | - | - | $0.30 |
| Música | $0.10 | - | $0.50 | $0.60 |
| Livro | $0.20 | - | - | $0.20 |
| Podcast | $0.15 | $0.30 | - | $0.45 |

### Mensal (1000 memórias)

- OpenAI: ~$200
- ElevenLabs: ~$150
- Suno: ~$250
- **Total: ~$600/mês**

### ROI

Com plano Creator (R$ 97/mês = ~$19):
- 20 memórias/mês
- Custo: 20 × $0.40 = $8
- Lucro: $19 - $8 = **$11/usuário/mês**

---

## 🆘 Troubleshooting

### "OPENAI_API_KEY not configured"

**Solução:** Adicione a API key nas configurações do projeto

### "ElevenLabs API error: Insufficient credits"

**Solução:** Adicione créditos na conta ElevenLabs

### "Suno webhook timeout"

**Solução:** 
1. Verifique se n8n está rodando
2. Teste o webhook manualmente
3. Aumente timeout para 60s

### "SMTP authentication failed"

**Solução:**
1. Use "App Password" ao invés da senha normal (Gmail)
2. Habilite "Less secure apps" (se disponível)
3. Ou use SendGrid/Mailgun

---

## 📚 Referências

- [OpenAI API Docs](https://platform.openai.com/docs)
- [ElevenLabs API Docs](https://elevenlabs.io/docs)
- [Stripe API Docs](https://stripe.com/docs/api)
- [n8n Webhooks](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)

---

**Última atualização:** Dezembro 2025  
**Versão:** 1.0
