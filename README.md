# MemoryVerse AI - Refatoração Completa ✅

## 🎉 Projeto Adaptado para Hostinger VPS

Este projeto foi completamente refatorado para rodar em **Hostinger VPS** ao invés de AWS.

---

## 📋 Mudanças Principais

### Removido
- ❌ AWS S3 (storage)
- ❌ Suno AI (música - sem API pública)
- ❌ Runway ML (vídeo avançado - muito caro)

### Adicionado
- ✅ Storage local (`/var/www/memoryverse/uploads/`)
- ✅ File upload service (Multer)
- ✅ SMTP configuration (Resend)
- ✅ 2 endpoints críticos para n8n

---

## 🚀 Como Fazer Deploy

### 1. Preparar VPS

```bash
ssh root@168.231.93.103
apt update && apt upgrade -y

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx

# Instalar PM2
npm install -g pm2
```

### 2. Criar Estrutura

```bash
mkdir -p /var/www/memoryverse/uploads/{videos,music,images,podcasts,thumbnails}
chown -R www-data:www-data /var/www/memoryverse/uploads
```

### 3. Deploy Aplicação

```bash
cd /var/www/memoryverse
git clone [seu-repo] app
cd app
npm install --production
npm run build
```

### 4. Configurar Ambiente

```bash
cp .env.production.template .env
nano .env
# Adicionar suas chaves de API
```

### 5. Iniciar com PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. Configurar Nginx + SSL

Ver guia completo em: **`DEPLOY_HOSTINGER.md`**

---

## 📚 Documentação

- **`DEPLOY_HOSTINGER.md`** - Guia completo de deploy
- **`n8n-workflows/HOSTINGER_CHANGES.md`** - Mudanças nos workflows
- **`.gemini/antigravity/brain/.../walkthrough.md`** - Documentação técnica completa
- **`.gemini/antigravity/brain/.../audit_report.md`** - Auditoria do código

---

## 🔧 Configuração

### Variáveis de Ambiente Necessárias

```env
# Database (já configurado)
DATABASE_URL=postgres://...

# Storage Local
UPLOAD_DIR=/var/www/memoryverse/uploads

# APIs
OPENAI_API_KEY=sk-proj-...
ELEVENLABS_API_KEY=sk_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SMTP (Resend - criar conta em resend.com)
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=re_... (sua API key)

# n8n
N8N_WEBHOOK_URL=https://n8n.memoryverse.com.br/webhook
```

---

## ✅ Status

- ✅ Backend adaptado
- ✅ Storage local configurado
- ✅ Endpoints criados
- ✅ TypeScript corrigido
- ⏳ Workflows n8n (precisa atualizar manualmente)
- ⏳ Deploy (seguir guia)

---

## 💰 Custos Mensais

| Serviço | Custo |
|---------|-------|
| Hostinger VPS | Já pago |
| OpenAI | $10-50 |
| ElevenLabs | $5 |
| Resend | $0 (grátis) |
| Stripe | $0* |

*2.9% + $0.30 por transação

**Total:** $15-55/mês

---

## 🎯 Próximos Passos

1. ✅ Código refatorado
2. ⏳ Criar conta Resend
3. ⏳ Atualizar workflows n8n
4. ⏳ Deploy na VPS
5. ⏳ Testar end-to-end

---

## 📞 Suporte

**Logs:**
- App: `pm2 logs memoryverse`
- Nginx: `/var/log/nginx/error.log`

**Comandos:**
- Reiniciar: `pm2 restart memoryverse`
- Status: `pm2 status`
- Build: `npm run build`

---

**Última atualização:** 08/12/2024  
**Versão:** 2.0.0 (Hostinger VPS)
