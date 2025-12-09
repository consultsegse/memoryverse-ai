# 📧 Configurar Resend SMTP - Guia Rápido

## 🎯 Por que Resend?

- ✅ **3.000 emails grátis/mês**
- ✅ API simples
- ✅ Melhor deliverability
- ✅ Dashboard profissional
- ✅ Sem limite diário

---

## 🚀 Passo a Passo (5 minutos)

### 1. Criar Conta

Acesse: https://resend.com/signup

- Email: seu-email@gmail.com
- Senha: (criar senha forte)
- Verificar email

### 2. Obter API Key

1. Fazer login em: https://resend.com/api-keys
2. Clicar em **"Create API Key"**
3. Nome: `MemoryVerse Production`
4. Permissão: **"Sending access"**
5. Clicar em **"Add"**
6. **COPIAR A CHAVE** (começa com `re_`)

⚠️ **IMPORTANTE:** Copie agora! Não será mostrada novamente.

---

### 3. Adicionar ao .env

```bash
# Abrir arquivo .env
nano /var/www/memoryverse/app/.env
```

Adicionar:
```env
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

Salvar: `Ctrl+O` → Enter → `Ctrl+X`

---

### 4. Configurar Domínio (Opcional mas Recomendado)

**Para emails de `contato@memoryverse.com.br`:**

1. Ir em: https://resend.com/domains
2. Clicar em **"Add Domain"**
3. Digitar: `memoryverse.com.br`
4. Adicionar registros DNS:

```
Tipo: TXT
Nome: @
Valor: [copiar da Resend]

Tipo: CNAME  
Nome: resend._domainkey
Valor: [copiar da Resend]
```

5. Aguardar verificação (5-30 min)

---

### 5. Testar Envio

```bash
# No servidor
cd /var/www/memoryverse/app
npm run test:email
```

Ou criar script de teste:

```javascript
// test-email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 587,
  auth: {
    user: 'resend',
    pass: process.env.SMTP_PASSWORD
  }
});

transporter.sendMail({
  from: 'MemoryVerse <contato@memoryverse.com.br>',
  to: 'seu-email@gmail.com',
  subject: 'Teste Resend',
  html: '<h1>Funcionou! 🎉</h1>'
}).then(() => console.log('✅ Email enviado!'))
  .catch(err => console.error('❌ Erro:', err));
```

Rodar:
```bash
node test-email.js
```

---

## ✅ Checklist

- [ ] Conta Resend criada
- [ ] API key obtida
- [ ] Adicionada ao `.env`
- [ ] Domínio configurado (opcional)
- [ ] Email de teste enviado

---

## 📊 Limites

| Plano | Emails/Mês | Custo |
|-------|------------|-------|
| **Free** | 3.000 | $0 |
| Pro | 50.000 | $20 |
| Business | 100.000 | $80 |

**Recomendação:** Começar com Free

---

## 🆘 Troubleshooting

### Email não chega

1. Verificar spam
2. Verificar domínio verificado
3. Ver logs: https://resend.com/emails

### Erro de autenticação

1. Verificar API key no `.env`
2. Reiniciar aplicação: `pm2 restart memoryverse`

### Domínio não verifica

1. Aguardar até 30 minutos
2. Verificar DNS propagado: https://dnschecker.org
3. Contatar suporte Resend

---

## 📞 Suporte

- Docs: https://resend.com/docs
- Status: https://status.resend.com
- Email: support@resend.com

---

**Próximo passo:** Testar emails de boas-vindas! 🚀
