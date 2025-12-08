# 🚀 MemoryVerse AI - Quick Start

## ✅ Status Atual

- [x] Site no ar: https://memoryverse.com.br
- [x] Banco de dados funcionando
- [x] Admin criado: gilmar.santos.santana@gmail.com
- [x] Webhook n8n implementado: `/api/n8n/webhook`
- [ ] APIs de IA configuradas
- [ ] Workflows n8n importados

## 📝 Próximos 3 Passos

### 1. Configurar OpenAI (5 minutos)

1. Acesse: https://platform.openai.com/api-keys
2. Clique em "Create new secret key"
3. Copie a chave (começa com `sk-proj-...`)
4. No Easypanel → `memoryverseai` → Environment
5. Adicione: `OPENAI_API_KEY=sk-proj-...`
6. Clique em **Save** e **Rebuild**

### 2. Importar Workflows n8n (10 minutos)

1. Acesse: https://n8n.memoryverse.com.br
2. Faça login/crie conta
3. Clique em **Workflows** → **Import from File**
4. Importe estes arquivos (estão em `n8n-workflows/`):
   - `01-memory-processing.json`
   - `02-notification-system.json`
   - `03-affiliate-tracking.json`

5. Para cada workflow:
   - Configure credenciais OpenAI
   - Ative o workflow (toggle no canto superior direito)

### 3. Testar (2 minutos)

1. Login em https://memoryverse.com.br
2. Dashboard → Criar Memória
3. Preencha e envie
4. Verifique no n8n se o workflow foi acionado

## 🔑 Variáveis de Ambiente

Copie o arquivo `.env.production.template` para o Easypanel.

**Obrigatório agora:**
- `OPENAI_API_KEY` - Para funcionar

**Opcional (configure depois):**
- `ELEVENLABS_API_KEY` - Para áudio/podcasts
- `STRIPE_SECRET_KEY` - Para pagamentos

## 📚 Documentação Completa

- Guia de Integração: `AI_INTEGRATION_GUIDE.md`
- Workflows n8n: `n8n-workflows/README.md`
- Deploy: `DEPLOY_GUIDE_FINAL.md`
