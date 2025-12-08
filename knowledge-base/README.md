# Base de Conhecimento - MemoryVerse AI Agent

**Versão:** 1.0  
**Data:** Dezembro 2025  
**Autor:** Manus AI

---

## 📚 Visão Geral

Esta base de conhecimento contém toda a documentação necessária para implementar e operar o agente de IA especialista do MemoryVerse AI. O agente (chamado **Luna**) é responsável por atender usuários via chat, guiá-los na criação de memórias e fornecer suporte técnico.

---

## 📁 Estrutura de Arquivos

### 1. KNOWLEDGE_BASE.md
**Conteúdo:** FAQ completo, troubleshooting, casos de uso, melhores práticas e limitações

**Uso:** 
- Referência para o agente responder perguntas frequentes
- Guia de troubleshooting para problemas técnicos
- Exemplos de casos de uso para inspirar usuários
- Documentação de limitações conhecidas

**Quando usar:**
- Usuário faz pergunta sobre funcionalidades
- Usuário reporta problema técnico
- Usuário pede exemplos de uso
- Usuário questiona limitações

### 2. AGENT_SYSTEM_PROMPT.md
**Conteúdo:** Prompt completo do sistema para o agente de IA, incluindo personalidade, tom de voz, conhecimento do produto e scripts de resposta

**Uso:**
- Prompt principal a ser usado na API do agente (OpenAI GPT-4)
- Define identidade, personalidade e comportamento da Luna
- Contém respostas prontas para perguntas frequentes
- Estabelece limites e pontos de escalação

**Quando usar:**
- Ao configurar a API do agente pela primeira vez
- Ao atualizar o comportamento do agente
- Ao treinar novos membros da equipe de suporte

### 3. CONVERSATION_FLOWS.md
**Conteúdo:** Fluxos de conversação estruturados, árvore de decisão, integração com n8n e webhooks

**Uso:**
- Guia para implementar workflows no n8n
- Referência para entender fluxos de conversação
- Documentação de APIs e webhooks
- Queries SQL para analytics

**Quando usar:**
- Ao implementar workflows no n8n
- Ao integrar novos canais (WhatsApp, Telegram)
- Ao configurar monitoramento e analytics
- Ao debugar problemas de integração

---

## 🚀 Como Implementar

### Passo 1: Configurar API do Agente

1. **Criar endpoint no backend:**

```typescript
// server/routers.ts

import { AGENT_SYSTEM_PROMPT } from '../knowledge-base/prompts';

export const agentRouter = router({
  chat: publicProcedure
    .input(z.object({
      user_id: z.string(),
      message: z.string(),
      context: z.object({
        plan: z.string(),
        credits_remaining: z.number(),
        last_memory_created: z.string().optional(),
      }).optional(),
      history: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
        timestamp: z.string(),
      })).optional(),
    }))
    .mutation(async ({ input }) => {
      // Buscar histórico do usuário no banco
      const history = await db.query.conversations.findMany({
        where: eq(conversations.userId, input.user_id),
        orderBy: desc(conversations.timestamp),
        limit: 10,
      });

      // Montar mensagens para o GPT-4
      const messages = [
        { role: 'system', content: AGENT_SYSTEM_PROMPT },
        ...history.map(h => ({
          role: h.role,
          content: h.content,
        })),
        { role: 'user', content: input.message },
      ];

      // Chamar OpenAI
      const response = await invokeLLM({
        messages,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'agent_response',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                reply: { type: 'string' },
                action: { type: 'string' },
                metadata: { type: 'object' },
              },
              required: ['reply', 'action'],
            },
          },
        },
      });

      const parsed = JSON.parse(response.choices[0].message.content);

      // Salvar conversa no banco
      await db.insert(conversations).values({
        userId: input.user_id,
        message: input.message,
        reply: parsed.reply,
        action: parsed.action,
        timestamp: new Date(),
      });

      return parsed;
    }),
});
```

2. **Criar tabela de conversas:**

```typescript
// drizzle/schema.ts

export const conversations = sqliteTable('conversations', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id),
  message: text('message').notNull(),
  reply: text('reply').notNull(),
  action: text('action').notNull(), // reply, create_memory, check_plan, escalate_support
  metadata: text('metadata', { mode: 'json' }), // JSON com dados adicionais
  feedback: text('feedback'), // positive, negative, null
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
});
```

3. **Executar migration:**

```bash
pnpm db:push
```

### Passo 2: Criar Workflow no n8n

1. **Importar workflow base:**
   - Abrir n8n
   - Ir em "Workflows" → "Import from File"
   - Selecionar `n8n-workflows/06-chatbot-agent.json`

2. **Configurar credenciais:**
   - OpenAI API Key
   - Stripe API Key (para consultas de plano)
   - Zendesk API Key (para tickets de suporte)
   - Database credentials (MySQL)

3. **Configurar webhook:**
   - Copiar URL do webhook do n8n
   - Adicionar no frontend como endpoint de chat

4. **Testar workflow:**
   - Enviar mensagem de teste
   - Verificar logs no n8n
   - Confirmar resposta no frontend

### Passo 3: Integrar Frontend

1. **Criar componente de chat:**

```typescript
// client/src/components/ChatWidget.tsx

import { useState } from 'react';
import { trpc } from '@/lib/trpc';

export function ChatWidget() {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [input, setInput] = useState('');
  
  const chatMutation = trpc.agent.chat.useMutation({
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply,
      }]);
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, {
      role: 'user',
      content: input,
    }]);

    chatMutation.mutate({
      user_id: 'current_user_id', // Pegar do useAuth()
      message: input,
      context: {
        plan: 'free', // Pegar do useAuth()
        credits_remaining: 3,
      },
    });

    setInput('');
  };

  return (
    <div className="chat-widget">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>
      <input 
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
}
```

2. **Adicionar widget no layout:**

```typescript
// client/src/App.tsx

import { ChatWidget } from '@/components/ChatWidget';

// Adicionar no canto inferior direito
<div className="fixed bottom-4 right-4 z-50">
  <ChatWidget />
</div>
```

### Passo 4: Configurar Monitoramento

1. **Criar dashboard de métricas:**

```typescript
// client/src/pages/AgentAnalytics.tsx (Admin only)

export function AgentAnalytics() {
  const { data: stats } = trpc.agent.getStats.useQuery();

  return (
    <div className="container py-8">
      <h1>Analytics do Agente</h1>
      
      <div className="grid grid-cols-4 gap-4 mt-8">
        <Card>
          <CardHeader>Total de Conversas</CardHeader>
          <CardContent>{stats?.total_conversations}</CardContent>
        </Card>
        
        <Card>
          <CardHeader>Taxa de Resolução</CardHeader>
          <CardContent>{stats?.resolution_rate}%</CardContent>
        </Card>
        
        <Card>
          <CardHeader>Taxa de Conversão</CardHeader>
          <CardContent>{stats?.conversion_rate}%</CardContent>
        </Card>
        
        <Card>
          <CardHeader>Satisfação</CardHeader>
          <CardContent>{stats?.satisfaction_rate}%</CardContent>
        </Card>
      </div>
    </div>
  );
}
```

2. **Criar endpoint de stats:**

```typescript
// server/routers.ts

getStats: adminProcedure
  .query(async () => {
    const total = await db.select({ count: sql`count(*)` })
      .from(conversations)
      .where(sql`timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)`);

    const resolved = await db.select({ count: sql`count(*)` })
      .from(conversations)
      .where(sql`action != 'escalate_support' AND timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)`);

    // ... outras queries

    return {
      total_conversations: total[0].count,
      resolution_rate: (resolved[0].count / total[0].count) * 100,
      // ... outras métricas
    };
  }),
```

---

## 🔧 Manutenção e Atualização

### Quando Atualizar o Prompt

Atualize `AGENT_SYSTEM_PROMPT.md` quando:
- Novos recursos forem lançados
- Preços mudarem
- Feedback dos usuários indicar confusão
- Taxa de escalação estiver alta (>20%)
- Satisfação estiver baixa (<85%)

### Como Atualizar

1. Editar arquivo `AGENT_SYSTEM_PROMPT.md`
2. Testar localmente com exemplos de conversas
3. Fazer A/B testing (50% prompt antigo, 50% novo)
4. Analisar métricas por 7 dias
5. Se melhor, aplicar 100%
6. Documentar mudanças no changelog

### Versionamento

Seguir versionamento semântico:
- **Major (1.0 → 2.0):** Mudanças grandes na personalidade ou comportamento
- **Minor (1.0 → 1.1):** Novos recursos ou fluxos
- **Patch (1.0.0 → 1.0.1):** Correções de bugs ou melhorias pequenas

---

## 📊 Métricas de Sucesso

### KPIs Principais

| Métrica | Meta | Atual | Status |
|---------|------|-------|--------|
| Taxa de Resolução | >80% | - | 🟡 A medir |
| Satisfação | >90% | - | 🟡 A medir |
| Tempo de Resposta | <30s | - | 🟡 A medir |
| Taxa de Conversão | >40% | - | 🟡 A medir |
| Taxa de Upgrade | >15% | - | 🟡 A medir |

### Como Medir

1. **Taxa de Resolução:**
   ```sql
   SELECT COUNT(CASE WHEN action != 'escalate_support' THEN 1 END) / COUNT(*) * 100
   FROM conversations
   WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY);
   ```

2. **Satisfação:**
   ```sql
   SELECT AVG(CASE WHEN feedback = 'positive' THEN 1 ELSE 0 END) * 100
   FROM conversations
   WHERE feedback IS NOT NULL
   AND timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY);
   ```

3. **Tempo de Resposta:**
   - Medir no n8n (tempo entre webhook recebido e resposta enviada)
   - Meta: <30 segundos

4. **Taxa de Conversão:**
   ```sql
   SELECT COUNT(DISTINCT CASE WHEN action = 'create_memory' THEN user_id END) / 
          COUNT(DISTINCT user_id) * 100
   FROM conversations
   WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY);
   ```

5. **Taxa de Upgrade:**
   ```sql
   SELECT COUNT(DISTINCT c.user_id) / COUNT(DISTINCT u.id) * 100
   FROM conversations c
   JOIN users u ON c.user_id = u.id
   WHERE c.action = 'upgrade_plan'
   AND c.timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
   AND u.plan = 'free';
   ```

---

## 🐛 Troubleshooting

### Problema: Agente não responde

**Possíveis causas:**
- API do OpenAI fora do ar
- Credenciais inválidas
- Timeout na requisição

**Solução:**
1. Verificar status da API OpenAI: https://status.openai.com
2. Verificar logs do n8n
3. Testar credenciais manualmente
4. Aumentar timeout (de 30s para 60s)

### Problema: Respostas genéricas/ruins

**Possíveis causas:**
- Prompt desatualizado
- Contexto insuficiente
- Histórico de conversa não sendo passado

**Solução:**
1. Revisar `AGENT_SYSTEM_PROMPT.md`
2. Verificar se contexto do usuário está sendo passado
3. Confirmar que histórico está sendo carregado do banco
4. Testar com exemplos específicos

### Problema: Taxa de escalação alta (>20%)

**Possíveis causas:**
- Problemas técnicos recorrentes
- Perguntas não cobertas no prompt
- Usuários insatisfeitos

**Solução:**
1. Analisar conversas escaladas (últimas 50)
2. Identificar padrões comuns
3. Adicionar respostas para esses casos no prompt
4. Melhorar troubleshooting no `KNOWLEDGE_BASE.md`

---

## 📞 Suporte

Para dúvidas sobre esta base de conhecimento:
- **Email:** contato@memoryverse.com.br
- **Documentação:** https://docs.memoryverse.ai
- **GitHub:** https://github.com/memoryverse-ai/agent

---

**Última atualização:** Dezembro 2025  
**Versão:** 1.0  
**Próxima revisão:** Março 2026
