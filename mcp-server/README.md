# MemoryVerse AI - MCP Support Agent

**Versão:** 1.0.0  
**Tipo:** MCP Server (Model Context Protocol)  
**Autor:** MemoryVerse AI

---

## 📖 Visão Geral

Este é um servidor MCP (Model Context Protocol) que expõe o agente de suporte **Luna** do MemoryVerse AI como uma ferramenta utilizável por outros sistemas, aplicações e agentes de IA.

### O que é MCP?

Model Context Protocol (MCP) é um protocolo padronizado que permite que modelos de IA acessem ferramentas, recursos e contexto de forma estruturada. Pense nele como uma "API para agentes de IA".

### Por que usar MCP?

- **Interoperabilidade:** Qualquer sistema que suporte MCP pode usar o agente Luna
- **Padronização:** Interface consistente e bem documentada
- **Composabilidade:** Combine múltiplos MCPs para criar workflows complexos
- **Reutilização:** Use o mesmo agente em diferentes contextos

---

## 🛠️ Funcionalidades

### Tools (Ferramentas)

1. **chat** - Conversar com o agente Luna
   - Input: `user_id`, `message`, `context` (opcional)
   - Output: Resposta do agente com ação sugerida

2. **create_memory** - Criar nova memória
   - Input: `user_id`, `story`, `formats`
   - Output: IDs das memórias criadas e tempo estimado

3. **check_plan** - Verificar plano do usuário
   - Input: `user_id`
   - Output: Informações do plano, créditos, features

4. **upgrade_plan** - Iniciar upgrade de plano
   - Input: `user_id`, `target_plan`
   - Output: URL de checkout e informações do plano

5. **get_examples** - Obter exemplos de memórias
   - Input: `format` (opcional), `limit` (opcional)
   - Output: Lista de exemplos com thumbnails e URLs

### Resources (Recursos)

1. **memoryverse://knowledge-base** - Base de conhecimento completa
2. **memoryverse://faq** - Perguntas frequentes
3. **memoryverse://conversation-flows** - Fluxos de conversação
4. **memoryverse://user-documentation** - Documentação do usuário
5. **memoryverse://pricing** - Informações de preços

### Prompts (Prompts)

1. **system_prompt** - System prompt completo do agente Luna
2. **conversation_template** - Templates de conversação por fluxo

---

## 🚀 Instalação

### Método 1: Usar localmente

```bash
cd mcp-server
npm install
npm run build
```

### Método 2: Instalar globalmente

```bash
cd mcp-server
npm install -g .
```

Após instalação global, o comando `memoryverse-mcp` estará disponível.

---

## 📝 Uso

### Com manus-mcp-cli

1. **Adicionar servidor:**

```bash
manus-mcp-cli server add memoryverse \
  --command "node /home/ubuntu/memoryverse-ai/mcp-server/dist/index.js"
```

2. **Listar ferramentas:**

```bash
manus-mcp-cli tool list -s memoryverse
```

3. **Executar ferramenta:**

```bash
manus-mcp-cli tool call -s memoryverse chat \
  '{"user_id": "user123", "message": "Olá, quero criar uma memória"}'
```

4. **Ler recurso:**

```bash
manus-mcp-cli resource read -s memoryverse memoryverse://faq
```

5. **Obter prompt:**

```bash
manus-mcp-cli prompt get -s memoryverse system_prompt
```

### Com Claude Desktop

Adicione ao arquivo de configuração do Claude Desktop (`~/Library/Application Support/Claude/claude_desktop_config.json` no macOS):

```json
{
  "mcpServers": {
    "memoryverse": {
      "command": "node",
      "args": ["/path/to/memoryverse-ai/mcp-server/dist/index.js"]
    }
  }
}
```

### Com outros clientes MCP

Qualquer cliente que implemente o protocolo MCP pode usar este servidor via stdio.

---

## 🔧 Desenvolvimento

### Estrutura do Projeto

```
mcp-server/
├── src/
│   └── index.ts          # Servidor MCP principal
├── dist/                 # Código compilado
├── package.json
├── tsconfig.json
└── README.md
```

### Executar em modo desenvolvimento

```bash
npm run dev
```

### Compilar

```bash
npm run build
```

### Testar

```bash
npm test
```

---

## 📚 Exemplos de Uso

### Exemplo 1: Chat básico

```bash
manus-mcp-cli tool call -s memoryverse chat '{
  "user_id": "user123",
  "message": "Quanto custa o plano Creator?"
}'
```

**Resposta:**
```json
{
  "reply": "O plano Creator custa R$ 97/mês...",
  "action": "reply",
  "metadata": {
    "confidence": 0.95
  }
}
```

### Exemplo 2: Criar memória

```bash
manus-mcp-cli tool call -s memoryverse create_memory '{
  "user_id": "user123",
  "story": "Era uma vez, minha avó contava histórias...",
  "formats": ["video", "podcast"]
}'
```

**Resposta:**
```json
{
  "success": true,
  "memory_ids": [1, 2],
  "message": "Memórias criadas com sucesso!",
  "estimated_time": "8-12 minutos"
}
```

### Exemplo 3: Ler FAQ

```bash
manus-mcp-cli resource read -s memoryverse memoryverse://faq
```

**Resposta:**
```markdown
# FAQ - MemoryVerse AI

## Quanto custa?

Temos 3 planos:
- Free: R$ 0 (3 memórias)
- Creator: R$ 97/mês (20 memórias)
- Pro: R$ 297/mês (ilimitado)
...
```

---

## 🔗 Integração com Backend

Para integrar o MCP server com o backend do MemoryVerse AI:

### 1. Criar endpoint tRPC

```typescript
// server/routers.ts

agent: router({
  chat: publicProcedure
    .input(z.object({
      user_id: z.string(),
      message: z.string(),
      context: z.object({...}).optional(),
    }))
    .mutation(async ({ input }) => {
      // Chamar lógica real do agente
      const response = await agentService.chat(input);
      return response;
    }),
}),
```

### 2. Atualizar MCP server para usar API real

```typescript
// mcp-server/src/index.ts

async function handleChat(input: ChatInput) {
  const response = await fetch('https://memoryverse.ai/api/trpc/agent.chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_KEY}`,
    },
    body: JSON.stringify(input),
  });
  
  return response.json();
}
```

---

## 🌐 Casos de Uso

### 1. Chatbot em outros canais

Use o MCP server para expor o agente Luna em:
- WhatsApp (via n8n + MCP)
- Telegram (via n8n + MCP)
- Discord (via bot + MCP)
- Slack (via bot + MCP)

### 2. Integração com Claude/GPT

Permita que Claude ou GPT usem o agente Luna como ferramenta:
- "Claude, use o MemoryVerse para criar um vídeo da minha história"
- "GPT, pergunte ao MemoryVerse quanto custa o plano Pro"

### 3. Automação com n8n

Crie workflows n8n que usam o MCP:
- Quando usuário envia email → MCP responde automaticamente
- Quando usuário preenche formulário → MCP cria memória
- Quando usuário reclama → MCP escala para suporte

### 4. API pública

Exponha o MCP como API REST para desenvolvedores terceiros:
- Parceiros podem integrar o MemoryVerse em seus apps
- Afiliados podem criar interfaces customizadas
- Empresas podem white-label o serviço

---

## 🔐 Segurança

### Autenticação

Por padrão, o MCP server roda via stdio (sem rede). Para expor via HTTP:

1. Use um proxy autenticado (ex: nginx com API key)
2. Implemente rate limiting
3. Valide todos os inputs com Zod
4. Não exponha informações sensíveis

### Variáveis de Ambiente

```bash
# .env
MEMORYVERSE_API_URL=https://memoryverse.ai/api
MEMORYVERSE_API_KEY=your_api_key_here
DATABASE_URL=mysql://...
```

---

## 📊 Monitoramento

### Logs

O servidor MCP loga para stderr:

```bash
# Ver logs em tempo real
manus-mcp-cli server logs memoryverse
```

### Métricas

Implemente métricas customizadas:
- Total de chamadas por tool
- Tempo médio de resposta
- Taxa de erro
- Usuários únicos

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para adicionar novas ferramentas:

1. Adicione o schema de validação
2. Registre a tool em `ListToolsRequestSchema`
3. Implemente o handler em `CallToolRequestSchema`
4. Adicione testes
5. Atualize documentação

---

## 📄 Licença

MIT License - MemoryVerse AI

---

## 🆘 Suporte

- **Email:** contato@memoryverse.com.br
- **Documentação:** https://docs.memoryverse.ai
- **GitHub:** https://github.com/memoryverse-ai

---

**Última atualização:** Dezembro 2025  
**Versão:** 1.0.0
