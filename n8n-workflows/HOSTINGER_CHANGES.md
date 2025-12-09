# 🔄 Workflows n8n - Mudanças para Hostinger VPS

## 📋 Resumo das Mudanças

### Removido:
- ❌ AWS S3 (3 nós)
- ❌ Suno AI (1 nó)
- ❌ Runway ML (muito caro)

### Mantido:
- ✅ OpenAI (GPT-4, DALL-E)
- ✅ ElevenLabs (podcasts)
- ✅ SMTP (emails)
- ✅ Stripe (webhooks)

---

## 🎯 Estratégia de Simplificação

### Workflow 01 - Memory Processing (SIMPLIFICADO)

**Antes:**
1. GPT-4 → Roteiro
2. DALL-E → Imagens
3. **AWS S3** → Upload ❌
4. **Suno AI** → Música ❌
5. Atualizar DB
6. Notificar usuário

**Depois:**
1. GPT-4 → Roteiro
2. DALL-E → Imagens
3. **Salvar localmente** → Via backend ✅
4. **Música desabilitada** → Mensagem "Em breve" ✅
5. Atualizar DB
6. Notificar usuário

---

### Workflow 02 - Video Generation (DESABILITADO)

**Motivo:**
- Usa AWS S3 (2 nós)
- Usa Runway ML ($$$)
- Muito complexo para MVP

**Solução:**
- Marcar como "Advanced Feature"
- Implementar depois com alternativa local

---

### Workflow 03 - Email Marketing (OK)

**Status:** ✅ Funciona sem mudanças
- Usa apenas SMTP
- Não depende de AWS

---

### Workflow 04 - Moderation (SIMPLIFICADO)

**Antes:**
- Backup para AWS S3 ❌

**Depois:**
- Backup local ✅
- Ou desabilitar backup automático

---

### Workflow 05 - Social & Payments (OK)

**Status:** ✅ Funciona sem mudanças
- Usa apenas Stripe webhooks
- Não depende de AWS

---

## 🔧 Implementação

### Opção 1: Usar Workflows Simplificados (Recomendado)

Criar versões "lite" dos workflows:
- `01-memory-processing-lite.json`
- `03-email-marketing.json` (sem mudanças)
- `05-social-payments.json` (sem mudanças)

### Opção 2: Processar Localmente

Usar apenas o fallback local do backend:
- Desabilitar n8n temporariamente
- Processar tudo via `memoryProcessor.ts`
- Mais simples para começar

---

## 📝 Mudanças Específicas

### 01-memory-processing.json

#### Remover Suno AI (linhas 142-182)

**Substituir por:**
```json
{
  "parameters": {
    "conditions": {
      "string": [{
        "value1": "={{ $json.format }}",
        "operation": "equals",
        "value2": "music"
      }]
    }
  },
  "id": "if-music",
  "name": "É Música?",
  "type": "n8n-nodes-base.if",
  "typeVersion": 1,
  "position": [1050, 400]
},
{
  "parameters": {
    "url": "={{ $env.VITE_APP_URL }}/api/trpc/notifications.createCustom",
    "sendBody": true,
    "bodyParameters": {
      "parameters": [{
        "name": "userId",
        "value": "={{ $json.userId }}"
      }, {
        "name": "type",
        "value": "feature_unavailable"
      }, {
        "name": "context",
        "value": {
          "message": "Formato música em breve! Por enquanto, tente vídeo ou podcast."
        }
      }]
    }
  },
  "id": "music-unavailable",
  "name": "Música Indisponível",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 3,
  "position": [1250, 400]
}
```

---

### 02-video-generation.json

#### Desabilitar Workflow Completo

**Adicionar nota no README:**
```markdown
## Workflow 02 - DESABILITADO

Este workflow usa:
- AWS S3 (não disponível)
- Runway ML ($$$)

**Alternativa:**
Use o Workflow 01 que já gera vídeos básicos com DALL-E.

**Futuro:**
- Implementar compilação local com FFmpeg
- Ou usar Cloudflare R2 + alternativa ao Runway
```

---

### 04-moderation-analytics.json

#### Remover Backup S3 (linhas 240-260)

**Substituir por:**
```json
{
  "parameters": {
    "command": "pg_dump -U memoryverseai memoryverseai > /var/backups/db_{{ $now.toFormat('yyyyMMdd') }}.sql"
  },
  "id": "backup-local",
  "name": "Backup Local",
  "type": "n8n-nodes-base.executeCommand",
  "typeVersion": 1,
  "position": [1450, 500]
}
```

---

## ✅ Checklist de Atualização

### Workflow 01
- [ ] Remover nó Suno AI
- [ ] Adicionar mensagem "música indisponível"
- [ ] Testar fluxo vídeo
- [ ] Testar fluxo podcast

### Workflow 02
- [ ] Desabilitar workflow
- [ ] Adicionar nota no README
- [ ] Documentar alternativa futura

### Workflow 03
- [ ] Nenhuma mudança necessária
- [ ] Testar envio de email

### Workflow 04
- [ ] Remover backup S3
- [ ] Adicionar backup local
- [ ] Ou desabilitar backup

### Workflow 05
- [ ] Nenhuma mudança necessária
- [ ] Testar Stripe webhooks

---

## 🚀 Próximos Passos

1. **Importar workflows atualizados no n8n**
2. **Configurar credenciais:**
   - OpenAI
   - ElevenLabs
   - SMTP
3. **Testar cada workflow**
4. **Monitorar logs**

---

## 💡 Alternativas Futuras

### Para Música:
- Mubert API (tem API pública)
- MusicGen local (open source)
- Suno quando lançar API

### Para Storage:
- Cloudflare R2 (10 GB grátis)
- Backblaze B2 (10 GB grátis)
- Manter local (77 GB disponíveis)

### Para Vídeo Avançado:
- FFmpeg local (grátis)
- Shotstack API (mais barato que Runway)
- Remotion (React-based)

---

**Última atualização:** 08/12/2024 19:50
