# 🔗 Guia de Integração Completo - MemoryVerse AI

Este guia detalha como configurar todas as integrações externas do MemoryVerse AI.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Configuração de APIs](#configuração-de-apis)
3. [Configuração do n8n](#configuração-do-n8n)
4. [Testes de Integração](#testes-de-integração)
5. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O MemoryVerse AI integra com:
- **OpenAI** - GPT-4 e DALL-E para geração de conteúdo
- **ElevenLabs** - Text-to-speech para podcasts
- **Suno AI** - Geração de música
- **Stripe** - Processamento de pagamentos
- **n8n** - Automação de workflows

---

## 🔑 Configuração de APIs

### 1. OpenAI (Obrigatório)

**Por que é necessário:** GPT-4 gera roteiros e DALL-E cria imagens para memórias.

**Como obter:**
1. Acesse [platform.openai.com](https://platform.openai.com/api-keys)
2. Faça login ou crie uma conta
3. Clique em "Create new secret key"
4. Copie a chave (começa com `sk-proj-...` ou `sk-...`)
5. **Importante:** Adicione créditos à sua conta OpenAI (mínimo $5)

**Configuração:**
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

**Custo estimado por memória:**
- GPT-4o: ~$0.02 por roteiro
- DALL-E 3: ~$0.04 por imagem HD
- **Total:** ~$0.06-0.50 dependendo do formato

---

### 2. ElevenLabs (Opcional - Para Podcasts)

**Por que é necessário:** Converte texto em narração profissional para podcasts.

**Como obter:**
1. Acesse [elevenlabs.io](https://elevenlabs.io)
2. Crie uma conta (tem plano gratuito com 10k caracteres/mês)
3. Vá em Settings → API Keys
4. Copie sua API key

**Configuração:**
```env
ELEVENLABS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
```

**Escolher voz em português:**
1. No painel ElevenLabs, vá em "Voice Library"
2. Procure vozes em português (ex: "Rodrigo", "Camila")
3. Copie o Voice ID
4. Configure: `ELEVENLABS_VOICE_ID=xxxxxxxxxxx`

**Custo:** $0.30 por 1K caracteres (~$0.60 por podcast de 2 minutos)

---

### 3. Stripe (Opcional - Para Pagamentos)

**Por que é necessário:** Processar assinaturas e pagamentos dos usuários.

**Como obter:**
1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Crie uma conta
3. Ative sua conta (forneça dados da empresa)
4. Vá em Developers → API Keys
5. Copie a "Secret key" (começa com `sk_live_...` ou `sk_test_...`)

**Configuração:**
```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

**Configurar Webhook:**
1. No Stripe Dashboard, vá em Developers → Webhooks
2. Clique em "Add endpoint"
3. URL: `https://n8n.memoryverse.com.br/webhook/stripe-webhook`
4. Selecione eventos:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copie o "Signing secret" para `STRIPE_WEBHOOK_SECRET`

---

### 4. Suno AI (Opcional - Para Música)

**Por que é necessário:** Gera músicas personalizadas baseadas nas memórias.

**Como obter:**
1. Acesse [suno.ai](https://suno.ai)
2. Crie uma conta
3. Contate o suporte para acesso à API (ainda em beta)

**Configuração:**
```env
SUNO_API_KEY=xxxxxxxxxxxxxxxxxxxxx
```

**Nota:** A API do Suno ainda está em acesso limitado. Alternativamente, você pode usar outras APIs de geração de música.

---

## 🤖 Configuração do n8n

### Pré-requisitos

- Instância n8n rodando (self-hosted ou cloud)
- Acesso ao painel administrativo do n8n

### Passo 1: Acessar n8n

```bash
# Se self-hosted
https://n8n.memoryverse.com.br

# Ou use n8n.cloud
https://app.n8n.cloud
```

### Passo 2: Importar Workflows

1. No n8n, clique em **Workflows** (menu lateral)
2. Clique em **Import from File**
3. Selecione os arquivos da pasta `n8n-workflows/`:
   - `01-memory-processing.json`
   - `02-video-generation.json`
   - `03-email-marketing.json`
   - `04-moderation-analytics.json`
   - `05-social-payments.json`

### Passo 3: Configurar Credenciais

Para cada workflow importado:

#### OpenAI Credentials
1. Clique no nó "OpenAI"
2. Clique em "Create New Credential"
3. Cole sua `OPENAI_API_KEY`
4. Clique em "Save"

#### ElevenLabs Credentials
1. Clique no nó "ElevenLabs"
2. Crie nova credencial
3. Cole `ELEVENLABS_API_KEY`
4. Configure Voice ID (opcional)

#### SMTP Credentials (Para emails)
1. Clique no nó "Send Email"
2. Configure:
   - **Host:** `smtp.gmail.com` (ou seu provedor)
   - **Port:** `587`
   - **User:** seu email
   - **Password:** senha de app do Gmail

**Gmail:** Gere uma senha de app em [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

#### Database Credentials
1. Clique no nó "Postgres"
2. Configure:
   - **Host:** `memoryverseai_postgres` (ou seu host)
   - **Database:** `memoryverseai`
   - **User:** `memoryverseai`
   - **Password:** (do seu .env)

### Passo 4: Ativar Workflows

Para cada workflow:
1. Abra o workflow
2. No canto superior direito, ative o toggle (deve ficar verde)
3. Verifique que aparece "Active" no status

### Passo 5: Obter URLs dos Webhooks

1. Abra o workflow "01-memory-processing"
2. Clique no nó "Webhook"
3. Copie a URL (ex: `https://n8n.memoryverse.com.br/webhook/memory-created`)
4. Configure no `.env` da aplicação:

```env
N8N_WEBHOOK_URL=https://n8n.memoryverse.com.br/webhook
N8N_WEBHOOK_SECRET=seu-secret-aqui
```

---

## 🧪 Testes de Integração

### Teste Automático

Execute o script de teste:

```bash
cd memoryverse-ai
npm run test:integrations
```

**Resultado esperado:**
```
✅ Passou: 6
❌ Falhou: 0
⚠️  Pulado: 5
```

### Teste Manual - Fluxo Completo

#### 1. Criar Memória

1. Acesse `http://localhost:3000` (ou seu domínio)
2. Faça login
3. Vá para Dashboard
4. Preencha:
   - **História:** "Era uma vez uma família que foi à praia"
   - **Formato:** Vídeo
5. Clique em "Criar Memória"

**Resultado esperado:**
- ✅ Toast de sucesso aparece
- ✅ Créditos decrementam
- ✅ Notificação "Memória em processamento" criada

#### 2. Verificar n8n

1. Abra n8n
2. Vá em **Executions** (menu lateral)
3. Procure por execução recente do workflow "01-memory-processing"

**Resultado esperado:**
- ✅ Execução aparece com status "Success"
- ✅ Payload contém `memoryId`, `story`, `format`

#### 3. Verificar Processamento

Aguarde 5-10 minutos e:
1. Vá em "Minhas Memórias"
2. Verifique o status da memória

**Resultado esperado:**
- ✅ Status muda de "processing" para "completed"
- ✅ Preview/thumbnail disponível
- ✅ Link de download funciona

---

## 🐛 Troubleshooting

### Erro: "OPENAI_API_KEY não configurado"

**Causa:** Variável de ambiente não foi carregada.

**Solução:**
1. Verifique que `.env` existe na raiz do projeto
2. Reinicie o servidor: `npm run dev`
3. Verifique que a chave está correta (sem espaços)

---

### Erro: "n8n Webhook failed"

**Causa:** n8n não está acessível ou workflow não está ativo.

**Solução:**
1. Verifique que n8n está rodando: `curl https://n8n.memoryverse.com.br`
2. Verifique que workflow está ativo (toggle verde)
3. Teste webhook manualmente no n8n (botão "Test Workflow")
4. Verifique logs do n8n para erros

---

### Erro: "Créditos insuficientes"

**Causa:** Usuário não tem créditos.

**Solução:**
1. Acesse o banco de dados
2. Execute:
```sql
UPDATE users SET creditsRemaining = 10 WHERE email = 'seu@email.com';
```

---

### Memória fica "processing" para sempre

**Causa:** Workflow n8n falhou ou não foi acionado.

**Solução:**
1. Verifique execuções no n8n (Executions)
2. Se não há execução, webhook não foi chamado:
   - Verifique `N8N_WEBHOOK_URL` no `.env`
   - Reinicie servidor
3. Se execução falhou:
   - Abra a execução no n8n
   - Veja qual nó falhou
   - Verifique credenciais daquele nó

---

### Email não está sendo enviado

**Causa:** Credenciais SMTP incorretas.

**Solução:**
1. No n8n, teste credencial SMTP
2. Para Gmail, use senha de app (não senha normal)
3. Verifique que porta é 587 (TLS) ou 465 (SSL)
4. Alternativa: Use SendGrid, AWS SES, ou Resend

---

## 📊 Monitoramento

### Logs do Servidor

```bash
# Ver logs em tempo real
npm run dev

# Procurar por erros
grep "ERROR" logs/app.log
```

### Logs do n8n

1. Acesse n8n
2. Vá em Executions
3. Clique em uma execução
4. Veja logs de cada nó

### Métricas Importantes

- **Taxa de sucesso n8n:** > 95%
- **Tempo médio de processamento:** < 10 minutos
- **Taxa de erro de APIs:** < 2%

---

## 🚀 Próximos Passos

Após configurar tudo:

1. ✅ Teste criar uma memória de cada formato
2. ✅ Verifique que notificações funcionam
3. ✅ Teste fluxo de pagamento (se Stripe configurado)
4. ✅ Configure backup automático do banco
5. ✅ Configure monitoramento (Sentry, LogRocket, etc.)

---

## 📞 Suporte

Problemas não resolvidos?

- 📧 Email: dev@memoryverse.com.br
- 📚 Documentação n8n: [docs.n8n.io](https://docs.n8n.io)
- 📚 Documentação OpenAI: [platform.openai.com/docs](https://platform.openai.com/docs)

---

**Última atualização:** 08/12/2024  
**Versão:** 2.0.0
