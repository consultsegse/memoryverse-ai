# Guia de Deploy VPS - MemoryVerse AI

Este guia detalha como preparar e fazer deploy do MemoryVerse AI em qualquer servidor VPS (como Hostinger, DigitalOcean, AWS, etc) rodando Ubuntu.

## 🎯 Objetivo
Hospedar o **MemoryVerse AI** de forma independente, utilizando seu próprio domínio (`memoryverse.com.br`), banco de dados e autenticação local.

## 📋 Pré-requisitos

1.  **VPS Baseada em Ubuntu** (22.04 ou superior recomendada).
2.  **Domínio Configurado**: Aponte o registro `A` do seu domínio (`memoryverse.com.br`) para o IP Público da sua VPS.
3.  **Acesso SSH**: Você deve conseguir acessar o servidor via terminal (`ssh root@seu-ip`).

---

## 🚀 Passo 1: Preparação do Sistema

Acesse sua VPS e atualize os pacotes:

```bash
sudo apt update && sudo apt upgrade -y
```

### Instalar Node.js 20+ e pnpm
```bash
# Instalar Node.js via nvm ou direto do source (recomendado NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar versão
node -v # Deve ser v20.x.x ou superior

# Instalar pnpm globalmente
sudo npm install -g pnpm pm2
```

### Instalar PostgreSQL (Banco de Dados)
Como nos desconectamos do Manus/Easypanel, precisaremos de um banco de dados local na VPS ou usar um serviço externo (como Postgres gerenciado).

**Para instalar localmente:**
```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Criar banco e usuário
sudo -u postgres psql
```

Dentro do prompt do PostgreSQL:
```sql
CREATE DATABASE memoryverse;
CREATE USER memory_user WITH ENCRYPTED PASSWORD 'SUA_SENHA_SEGURA_DO_BANCO';
GRANT ALL PRIVILEGES ON DATABASE memoryverse TO memory_user;
\q
```

---

## 📦 Passo 2: Clonar e Configurar o Projeto

Navegue para a pasta web (geralmente `/var/www`):

```bash
cd /var/www
git clone https://github.com/SEU_USUARIO/memoryverse-ai.git
cd memoryverse-ai
```

### Instalar Dependências
```bash
pnpm install
```

### Configurar Variáveis de Ambiente (.env)
Crie o arquivo `.env` com as configurações de produção:

```bash
nano .env
```

Cole este conteúdo (ajuste as credenciais):

```ini
# --- Servidor ---
NODE_ENV=production
PORT=3000

# --- Banco de Dados ---
# Formato: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL=postgresql://memory_user:SUA_SENHA_SEGURA_DO_BANCO@localhost:5432/memoryverse

# --- Segurança (Gere chaves seguras!) ---
# Use o comando `openssl rand -hex 32` para gerar
JWT_SECRET=super_secret_jwt_key_32chars_random
CRON_SECRET=super_secret_cron_key_32chars_random

# --- APIs Externas ---
OPENAI_API_KEY=sk-proj-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
ELEVENLABS_API_KEY=...

# --- URLs da Aplicação ---
VITE_APP_URL=https://memoryverse.com.br
N8N_WEBHOOK_URL=https://n8n.memoryverse.com.br/webhook # Se estiver usando N8N
```

Salve o arquivo (`Ctrl+O`, `Enter`, `Ctrl+X`).

### Aplicar Migrações do Banco
Isso criará as tabelas no seu PostgreSQL:

```bash
pnpm db:push
```

### Build da Aplicação
Compile o frontend e o backend:

```bash
pnpm build
```

---

## 🏃 Passo 3: Rodar com PM2

O PM2 manterá seu site online 24/7.

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```
*(Se não tiver um `ecosystem.config.js`, o comando `pnpm start` roda `node dist/index.js`. Você pode fazer `pm2 start "npm run start" --name memoryverse`)*

---

## 🌐 Passo 4: Configurar Nginx (Proxy Reverso)

Instale e configure o Nginx para receber requisições do domínio `memoryverse.com.br` e repassar para o Node.js na porta 3000.

```bash
sudo apt install nginx -y
```

Crie o arquivo de configuração do site:
```bash
sudo nano /etc/nginx/sites-available/memoryverse
```

Conteúdo:
```nginx
server {
    server_name memoryverse.com.br www.memoryverse.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ative o site e reinicie o Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/memoryverse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Configurar HTTPS (SSL Gratuito)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d memoryverse.com.br -d www.memoryverse.com.br
```

---

## ✅ Conclusão

Seu site deve estar acessível em **https://memoryverse.com.br**.

- **Login/Registro**: Agora são feitos internamente (sem redirecionar para Manus).
- **Banco de Dados**: Roda localmente na VPS.
