# 🎵 MusicGen Setup - Geração de Música GRÁTIS

## 🎯 O Que é MusicGen?

MusicGen é o modelo de IA de geração de música da **Meta (Facebook)**, completamente **open-source e gratuito**.

**Vantagens:**
- ✅ **100% GRÁTIS** (sem limites)
- ✅ Qualidade profissional
- ✅ Roda localmente na VPS
- ✅ Sem dependência de APIs pagas
- ✅ Você controla tudo

**Modelos disponíveis:**
- `small` (300M) - Rápido, 2 GB RAM ⭐ **Recomendado**
- `medium` (1.5B) - Melhor qualidade, 4 GB RAM
- `large` (3.3B) - Máxima qualidade, 8 GB RAM

---

## 🚀 Instalação na VPS (15 minutos)

### 1. Conectar na VPS

```bash
ssh root@168.231.93.103
```

### 2. Instalar Python e Dependências

```bash
# Atualizar sistema
apt update && apt upgrade -y

# Instalar Python 3.10+
apt install -y python3 python3-pip python3-venv

# Verificar versão
python3 --version  # Deve ser 3.8+
```

### 3. Instalar PyTorch (CPU)

```bash
# PyTorch CPU (mais leve, sem GPU)
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

### 4. Instalar AudioCraft (MusicGen)

```bash
pip3 install audiocraft
```

### 5. Testar Instalação

```bash
python3 << 'EOF'
from audiocraft.models import MusicGen
print("✅ MusicGen instalado com sucesso!")

# Baixar modelo small (primeira vez demora ~2 min)
print("Baixando modelo 'small'...")
model = MusicGen.get_pretrained('small')
print("✅ Modelo carregado!")
EOF
```

---

## 🧪 Teste Rápido

```bash
# Criar script de teste
cat > test_musicgen.py << 'EOF'
from audiocraft.models import MusicGen
from audiocraft.data.audio import audio_write

# Carregar modelo
model = MusicGen.get_pretrained('small')
model.set_generation_params(duration=30)  # 30 segundos

# Gerar música
print("Gerando música...")
wav = model.generate(['emotional piano melody'])

# Salvar
audio_write('test_music', wav[0].cpu(), model.sample_rate)
print("✅ Música salva em test_music.wav")
EOF

# Rodar teste
python3 test_musicgen.py
```

**Resultado:** Arquivo `test_music.wav` criado!

---

## 📁 Arquivos Criados

### 1. `server/scripts/musicgen.py`
Script Python que gera música

### 2. `server/services/musicService.ts`
Serviço Node.js que chama o Python

**Como funciona:**
```
Node.js → Python subprocess → MusicGen → WAV file → Public URL
```

---

## 🔧 Configuração

### Nenhuma API key necessária! ✅

MusicGen roda 100% localmente, sem precisar de:
- ❌ API keys
- ❌ Contas externas
- ❌ Pagamentos
- ❌ Limites de uso

---

## 🎨 Como Usar

### No código:

```typescript
import { generateMusic } from './services/musicService';

const result = await generateMusic({
  prompt: "Minha história de amor com minha esposa",
  duration: 180,  // 3 minutos
  style: "romantic, piano, emotional"
});

console.log(result.url);  // URL pública do MP3
```

### Estilos automáticos:

O sistema detecta automaticamente o estilo baseado na história:

- "amor" → `romantic, piano, emotional`
- "alegria" → `upbeat, happy, energetic`
- "aventura" → `cinematic, epic, orchestral`
- "tristeza" → `sad, melancholic, piano`

---

## ⚡ Performance

### Tempo de Geração

| Duração | Modelo Small | Modelo Medium |
|---------|--------------|---------------|
| 30s | ~30s | ~60s |
| 1 min | ~60s | ~2 min |
| 3 min | ~3 min | ~6 min |

**Sua VPS (2 GB RAM):** Use modelo `small`

### Uso de Recursos

- **RAM:** ~1.5 GB durante geração
- **CPU:** 100% durante geração
- **Disco:** ~500 MB (modelo + cache)

---

## 🔄 Workflow n8n

Atualizar nó de música:

```json
{
  "name": "Gerar Música (MusicGen)",
  "type": "n8n-nodes-base.executeCommand",
  "parameters": {
    "command": "python3 /var/www/memoryverse/app/server/scripts/musicgen.py",
    "sendStdin": true,
    "stdinData": "={{ JSON.stringify({ prompt: $json.musicPrompt, duration: 180 }) }}"
  }
}
```

---

## ✅ Checklist

- [ ] Python 3.8+ instalado
- [ ] PyTorch instalado
- [ ] AudioCraft instalado
- [ ] Modelo 'small' baixado
- [ ] Teste executado com sucesso
- [ ] Script `musicgen.py` no servidor
- [ ] Workflow n8n atualizado

---

## 🆘 Troubleshooting

### Erro: "No module named 'audiocraft'"

```bash
pip3 install audiocraft
```

### Erro: "Out of memory"

```bash
# Usar modelo smaller ou adicionar swap
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

### Música com qualidade baixa

```python
# Aumentar temperatura para mais criatividade
model.set_generation_params(
    duration=180,
    temperature=1.5,  # 0.0-2.0
    top_k=250
)
```

---

## 💰 Comparação de Custos

| Solução | Custo/Mês | Qualidade |
|---------|-----------|-----------|
| **MusicGen** | **$0** ✅ | ⭐⭐⭐⭐ |
| Mubert Pro | $32 | ⭐⭐⭐⭐ |
| Suno AI | Sem API | ⭐⭐⭐⭐⭐ |

**Economia:** $32/mês = $384/ano! 🎉

---

## 🎯 Próximos Passos

1. ✅ Código implementado
2. ⏳ Instalar na VPS (15 min)
3. ⏳ Testar geração
4. ⏳ Atualizar workflow n8n
5. ⏳ Deploy completo

**Tempo total:** 30 minutos

---

**Música profissional, 100% grátis! 🎵**
