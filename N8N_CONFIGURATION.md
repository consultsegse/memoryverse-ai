# ⚙️ Guia de Configuração n8n - MemoryVerse AI

Este guia ajuda você a configurar os workflows do n8n para funcionarem perfeitamente com sua aplicação MemoryVerse.

## 1. Variáveis de Ambiente (Global)
No n8n, você precisa configurar a variável global `VITE_APP_URL` para que os fluxos saibam onde sua aplicação está rodando.

**Se estiver usando Easypanel:**
1. Vá em **Settings** > **Environment Variables** (no n8n ou no Easypanel Service do n8n).
2. Adicione:
   - `VITE_APP_URL`: `http://168.231.93.103:3000` (ou seu domínio: `https://memoryverse.com.br`)

**Se estiver rodando Local:**
- O n8n (na nuvem) NÃO consegue acessar `localhost`.
- Você deve usar o **Tunnel** (ngrok) ou implantar tudo no Easypanel.

## 2. Credenciais Necessárias
Configure as seguintes credenciais no menu **Credentials** do n8n:

| Nome da Credencial | Tipo | Onde conseguir |
|-------------------|------|----------------|
| **OpenAI API** | OpenAI API | [platform.openai.com](https://platform.openai.com) |
| **Suno AI API** | Header Auth | [suno.ai](https://suno.ai) (Use `Authorization: Bearer <key>`) |
| **SMTP Email** | SMTP | Seu provedor de email (Gmail/SendGrid) |
| **AWS S3** | AWS S3 | AWS Console (para backups e videos) |
| **Stripe Webhook** | Header Auth | Dashboard do Stripe |

## 3. Importando os Fluxos
1. Baixe os arquivos `.json` da pasta `n8n-workflows/` do projeto.
2. No n8n, clique em **Add Workflow** > **Import from File**.
3. Selecione os arquivos:
   - `01-memory-processing.json`
   - `02-video-generation.json`
   - `03-email-marketing.json`
   - ...

## 4. Testando a Conexão
Para verificar se tudo está funcionando:
1. Abra o fluxo **01 - Processamento de Memórias**.
2. Clique em **Execute Workflow**.
3. Na aplicação MemoryVerse, crie uma nova memória.
4. Veja se o nó **Webhook** no n8n recebeu o dado (ficará verde).

---

## 📊 Planilhas de Dados (Schema)

O sistema usa Banco de Dados SQL, mas aqui está a estrutura caso precise exportar para Excel/Sheets:

**Usuários (Users)**
| ID | Nome | Email | Plano | Créditos | Data Criação |
|----|------|-------|-------|----------|--------------|
| 1 | João | joao@...| Free | 3 | 2024-12-01 |

**Memórias (Memories)**
| ID | Usuário | Título | Formato | Status | URL Vídeo |
|----|---------|--------|---------|--------|-----------|
| 10 | João | Viagem | video | completed | https://... |

*Se desejar que o n8n salve automaticamente em uma planilha do Google Sheets, me avise que eu adiciono o nó "Google Sheets" no final de cada fluxo!*
