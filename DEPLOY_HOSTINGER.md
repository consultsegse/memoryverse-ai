# Deploy do MemoryVerse AI na Hostinger

Este guia detalha como fazer deploy do MemoryVerse AI em um servidor VPS da Hostinger.

## Pré-requisitos

- VPS Hostinger com Ubuntu 22.04 ou superior
- Acesso SSH ao servidor
- Domínio apontado para o IP do servidor
- Banco de dados MySQL criado no painel da Hostinger

## Passo 1: Preparar o Servidor

### 1.1 Conectar via SSH

```bash
ssh root@seu-ip-do-servidor
```

### 1.2 Atualizar o Sistema

```bash
apt update && apt upgrade -y
```

### 1.3 Instalar Node.js 22

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node --version  # Deve mostrar v22.x.x
```

### 1.4 Instalar pnpm

```bash
npm install -g pnpm
pnpm --version
```

### 1.5 Instalar PM2 (Gerenciador de Processos)

```bash
npm install -g pm2
```

### 1.6 Instalar Nginx

```bash
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

## Passo 2: Configurar Banco de Dados MySQL

### 2.1 Criar Banco de Dados

No painel da Hostinger, crie um banco de dados MySQL e anote:
- Nome do banco
- Usuário
- Senha
- Host (geralmente localhost ou IP do servidor)

### 2.2 Testar Conexão

```bash
mysql -h HOST -u USUARIO -p NOME_DO_BANCO
```

## Passo 3: Fazer Upload do Projeto

### 3.1 Clonar ou Fazer Upload

Opção A - Via Git (recomendado):
```bash
cd /var/www
git clone https://github.com/seu-usuario/memoryverse-ai.git
cd memoryverse-ai
```

Opção B - Via FTP/SFTP:
- Use FileZilla ou similar
- Faça upload para `/var/www/memoryverse-ai`

### 3.2 Configurar Permissões

```bash
chown -R www-data:www-data /var/www/memoryverse-ai
chmod -R 755 /var/www/memoryverse-ai
```

## Passo 4: Configurar Variáveis de Ambiente

### 4.1 Criar Arquivo .env

```bash
cd /var/www/memoryverse-ai
nano .env
```

### 4.2 Adicionar Variáveis

```env
# Database
DATABASE_URL=mysql://usuario:senha@localhost:3306/nome_do_banco

# JWT Secret (gere uma string aleatória segura)
JWT_SECRET=sua_chave_secreta_muito_longa_e_aleatoria

# OAuth (se usar Manus OAuth, senão remover)
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=seu_app_id

# OpenAI API (para geração de conteúdo)
OPENAI_API_KEY=sk-...

# S3 / Storage (se usar)
AWS_ACCESS_KEY_ID=sua_chave
AWS_SECRET_ACCESS_KEY=sua_chave_secreta
AWS_REGION=us-east-1
AWS_BUCKET_NAME=memoryverse-storage

# Ambiente
NODE_ENV=production
PORT=3000
```

Salvar: `Ctrl+O`, `Enter`, `Ctrl+X`

## Passo 5: Instalar Dependências e Build

### 5.1 Instalar Pacotes

```bash
cd /var/www/memoryverse-ai
pnpm install
```

### 5.2 Aplicar Migrações do Banco

```bash
pnpm db:push
```

### 5.3 Build do Projeto

```bash
pnpm build
```

## Passo 6: Configurar PM2

### 6.1 Criar Arquivo de Configuração PM2

```bash
nano ecosystem.config.js
```

Conteúdo:
```javascript
module.exports = {
  apps: [{
    name: 'memoryverse-ai',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
```

### 6.2 Iniciar Aplicação

```bash
mkdir -p logs
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6.3 Verificar Status

```bash
pm2 status
pm2 logs memoryverse-ai
```

## Passo 7: Configurar Nginx como Proxy Reverso

### 7.1 Criar Configuração do Site

```bash
nano /etc/nginx/sites-available/memoryverse-ai
```

Conteúdo:
```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    # Logs
    access_log /var/log/nginx/memoryverse-access.log;
    error_log /var/log/nginx/memoryverse-error.log;

    # Proxy para Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Aumentar tamanho máximo de upload (para áudios/vídeos)
    client_max_body_size 50M;
}
```

### 7.2 Ativar Site

```bash
ln -s /etc/nginx/sites-available/memoryverse-ai /etc/nginx/sites-enabled/
nginx -t  # Testar configuração
systemctl reload nginx
```

## Passo 8: Configurar SSL com Let's Encrypt

### 8.1 Instalar Certbot

```bash
apt install -y certbot python3-certbot-nginx
```

### 8.2 Obter Certificado SSL

```bash
certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

Siga as instruções interativas.

### 8.3 Renovação Automática

```bash
certbot renew --dry-run
```

O certbot já configura renovação automática via cron.

## Passo 9: Configurar Firewall

```bash
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
ufw status
```

## Passo 10: Otimizações de Performance

### 10.1 Configurar Nginx para Cache

Editar `/etc/nginx/nginx.conf` e adicionar dentro de `http {}`:

```nginx
# Cache de arquivos estáticos
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m use_temp_path=off;

# Compressão Gzip
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
```

### 10.2 Aumentar Limites do Sistema

Editar `/etc/security/limits.conf`:

```
* soft nofile 65536
* hard nofile 65536
```

## Passo 11: Monitoramento e Logs

### 11.1 Ver Logs da Aplicação

```bash
pm2 logs memoryverse-ai
pm2 logs memoryverse-ai --lines 100
```

### 11.2 Ver Logs do Nginx

```bash
tail -f /var/log/nginx/memoryverse-access.log
tail -f /var/log/nginx/memoryverse-error.log
```

### 11.3 Monitorar Recursos

```bash
pm2 monit
htop  # Instalar com: apt install htop
```

## Passo 12: Atualizações Futuras

### 12.1 Fazer Pull das Mudanças

```bash
cd /var/www/memoryverse-ai
git pull origin main
```

### 12.2 Reinstalar e Rebuild

```bash
pnpm install
pnpm build
pm2 restart memoryverse-ai
```

## Comandos Úteis

```bash
# Reiniciar aplicação
pm2 restart memoryverse-ai

# Parar aplicação
pm2 stop memoryverse-ai

# Ver status
pm2 status

# Ver logs em tempo real
pm2 logs memoryverse-ai --lines 200

# Reiniciar Nginx
systemctl restart nginx

# Verificar uso de memória
free -h

# Verificar uso de disco
df -h

# Backup do banco de dados
mysqldump -u usuario -p nome_do_banco > backup_$(date +%Y%m%d).sql
```

## Troubleshooting

### Aplicação não inicia

```bash
pm2 logs memoryverse-ai  # Ver erros
pm2 delete memoryverse-ai
pm2 start ecosystem.config.js
```

### Erro de conexão com banco

- Verificar credenciais no `.env`
- Testar conexão manual: `mysql -h HOST -u USER -p`
- Verificar se o banco existe

### Nginx retorna 502 Bad Gateway

- Verificar se a aplicação está rodando: `pm2 status`
- Verificar logs: `pm2 logs`
- Reiniciar aplicação: `pm2 restart memoryverse-ai`

### SSL não funciona

```bash
certbot certificates  # Ver certificados instalados
certbot renew --force-renewal  # Forçar renovação
```

## Segurança Adicional

### Fail2Ban (Proteção contra Brute Force)

```bash
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

### Backup Automático

Criar script de backup em `/root/backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u usuario -p'senha' nome_do_banco > /root/backups/db_$DATE.sql
find /root/backups -name "db_*.sql" -mtime +7 -delete
```

Adicionar ao crontab:
```bash
crontab -e
# Adicionar linha:
0 2 * * * /root/backup.sh
```

## Suporte

Para problemas específicos da Hostinger, consulte:
- https://support.hostinger.com
- Chat de suporte 24/7

---

**Desenvolvido por**: Manus AI  
**Versão**: 1.0  
**Data**: Novembro 2025
