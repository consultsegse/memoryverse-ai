# 🎵 Configurar Mubert API - Guia Rápido

## 🎯 O Que é Mubert?

Mubert é uma plataforma de geração de música com IA que substitui Suno AI (que não tem API pública).

**Features:**
- ✅ API pública e estável
- ✅ Gera música de 30s a 25 minutos
- ✅ Múltiplos estilos (pop, rock, cinematic, etc)
- ✅ Alta qualidade (320kbps MP3)

---

## 🚀 Passo a Passo (10 minutos)

### 1. Criar Conta

Acesse: https://mubert.com/render/api

1. Clicar em **"Get API Access"**
2. Preencher formulário:
   - Nome: Seu nome
   - Email: seu-email@gmail.com
   - Company: MemoryVerse AI
   - Use case: "AI-powered memory creation platform"
3. Verificar email

---

### 2. Obter API Key

1. Fazer login em: https://mubert.com/render/api
2. Dashboard → **API Keys**
3. Copiar sua **PAT (Personal Access Token)**

⚠️ **IMPORTANTE:** Guarde essa chave com segurança!

---

### 3. Adicionar ao .env

```bash
# No servidor
nano /var/www/memoryverse/app/.env
```

Adicionar:
```env
MUBERT_API_KEY=your_pat_here
```

Salvar: `Ctrl+O` → Enter → `Ctrl+X`

---

### 4. Testar API

Criar arquivo de teste:

```javascript
// test-mubert.js
const MUBERT_API_KEY = process.env.MUBERT_API_KEY;

async function testMubert() {
  const response = await fetch('https://api.mubert.com/v2/RecordTrack', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'RecordTrack',
      params: {
        pat: MUBERT_API_KEY,
        duration: 60, // 1 minuto para teste
        tags: 'emotional, piano, cinematic',
        mode: 'track',
        bitrate: 320
      }
    })
  });

  const data = await response.json();
  console.log('Track ID:', data.data.tasks[0].id);
  console.log('Status:', data.data.tasks[0].status);
  
  // Aguardar geração (pode levar 1-2 minutos)
  console.log('Aguardando geração...');
}

testMubert();
```

Rodar:
```bash
node test-mubert.js
```

---

## 📊 Planos e Preços

| Plano | Gerações/Mês | Duração Máx | Custo |
|-------|--------------|-------------|-------|
| **Free** | 500 | 1 minuto | $0 |
| **Pro** | 5.000 | 25 minutos | $14.99 |
| **Business** | 50.000 | 25 minutos | $99 |

**Recomendação:** Começar com Free para testar, depois Pro.

---

## 🎨 Estilos Disponíveis

### Tags Populares

**Emocionais:**
- `emotional, piano, soft`
- `romantic, strings, gentle`
- `melancholic, sad, ambient`

**Energéticas:**
- `upbeat, happy, energetic`
- `pop, dance, electronic`
- `rock, guitar, drums`

**Cinematográficas:**
- `cinematic, epic, orchestral`
- `adventure, heroic, dramatic`
- `ambient, atmospheric, calm`

**Nostálgicas:**
- `nostalgic, acoustic, warm`
- `vintage, retro, lo-fi`
- `family, memories, gentle`

---

## 🔧 Como Funciona no MemoryVerse

### 1. Usuário Cria Memória

```
História: "Era verão de 1995 quando conheci minha avó..."
Formato: Música
```

### 2. IA Analisa Emoção

```javascript
// musicService.ts detecta automaticamente
getMusicStyleFromStory(story)
// Retorna: "warm, nostalgic, acoustic, gentle"
```

### 3. Mubert Gera Música

```
Duração: 180 segundos (3 minutos)
Estilo: warm, nostalgic, acoustic, gentle
Qualidade: 320kbps MP3
```

### 4. Usuário Recebe

```
✅ Música pronta em 2-3 minutos
✅ Download disponível
✅ Compartilhamento nas redes
```

---

## ✅ Checklist

- [ ] Conta Mubert criada
- [ ] API key (PAT) obtida
- [ ] Adicionada ao `.env`
- [ ] Teste realizado
- [ ] Primeira música gerada

---

## 🆘 Troubleshooting

### Erro: "Invalid PAT"

1. Verificar se copiou a chave correta
2. Verificar se não tem espaços extras
3. Tentar gerar nova chave

### Música não gera

1. Verificar limite do plano (500/mês no Free)
2. Ver logs: https://mubert.com/render/api/logs
3. Contatar suporte

### Qualidade baixa

1. Verificar `bitrate: 320` no código
2. Upgrade para plano Pro
3. Ajustar tags de estilo

---

## 📞 Suporte

- **Docs:** https://mubert.com/render/api/docs
- **Email:** api@mubert.com
- **Status:** https://status.mubert.com

---

## 🎯 Próximos Passos

1. ✅ Criar conta Mubert
2. ✅ Obter API key
3. ✅ Adicionar ao .env
4. ⏳ Testar geração
5. ⏳ Atualizar workflow n8n
6. ⏳ Fazer deploy

**Tempo total:** 10 minutos

---

**Pronto para gerar músicas incríveis! 🎵**
