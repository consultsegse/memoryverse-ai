# Fluxos de Conversação e Integração - MemoryVerse AI

**Versão:** 1.0  
**Data:** Dezembro 2025  
**Autor:** Manus AI

---

## Sumário

1. [Árvore de Decisão](#árvore-de-decisão)
2. [Fluxos Principais](#fluxos-principais)
3. [Integração com n8n](#integração-com-n8n)
4. [Webhooks e APIs](#webhooks-e-apis)
5. [Monitoramento e Analytics](#monitoramento-e-analytics)

---

## Árvore de Decisão

```
Usuário inicia conversa
│
├─> Saudação genérica ("oi", "olá")
│   └─> Apresentação da Luna + Pergunta "Como posso ajudar?"
│       │
│       ├─> Quer criar memória
│       │   └─> [FLUXO: Criação de Memória]
│       │
│       ├─> Quer saber sobre produto
│       │   └─> [FLUXO: Descoberta de Produto]
│       │
│       ├─> Quer saber preços
│       │   └─> [FLUXO: Consulta de Planos]
│       │
│       ├─> Tem problema técnico
│       │   └─> [FLUXO: Suporte Técnico]
│       │
│       └─> Outra intenção
│           └─> Classificar e rotear
│
├─> Pergunta direta sobre produto
│   └─> [FLUXO: Descoberta de Produto]
│
├─> Pergunta sobre preços/planos
│   └─> [FLUXO: Consulta de Planos]
│
├─> Relato de problema
│   └─> [FLUXO: Suporte Técnico]
│
├─> Quer criar memória
│   └─> [FLUXO: Criação de Memória]
│
└─> Feedback ou sugestão
    └─> [FLUXO: Coleta de Feedback]
```

---

## Fluxos Principais

### FLUXO 1: Criação de Memória

**Objetivo:** Guiar o usuário do início ao fim na criação de uma memória

**Etapas:**

1. **Coleta da História**
   - Prompt: "Me conte a história que você quer transformar..."
   - Validação: Verificar se tem pelo menos 50 palavras
   - Se muito curta: Pedir mais detalhes
   - Se adequada: Avançar

2. **Análise e Feedback**
   - Analisar qualidade da história
   - Se boa: Elogiar e avançar
   - Se pode melhorar: Sugerir melhorias específicas
   - Dar opção: "Criar assim mesmo" ou "Melhorar primeiro"

3. **Escolha de Formato**
   - Apresentar 4 opções com descrição
   - Explicar diferenças
   - Permitir múltipla escolha

4. **Confirmação e Processamento**
   - Confirmar detalhes
   - Verificar créditos disponíveis
   - Se sem créditos: Oferecer upgrade
   - Se com créditos: Iniciar processamento

5. **Acompanhamento**
   - Informar tempo estimado
   - Oferecer atividades enquanto aguarda
   - Notificar quando pronto

6. **Feedback Pós-Criação**
   - Perguntar se gostou
   - Coletar avaliação (👍/👎)
   - Se negativo: Oferecer ajuda
   - Se positivo: Sugerir compartilhamento

**Pontos de Saída:**
- Usuário sem créditos → [FLUXO: Consulta de Planos]
- Erro técnico → [FLUXO: Suporte Técnico]
- Usuário desiste → Salvar progresso e encerrar

**Exemplo de Conversa:**

```
Luna: Que legal! 😊 Vou te ajudar a criar uma memória incrível.

Primeiro, me conte a história que você quer transformar. Pode ser uma lembrança de infância, como você conheceu alguém especial, uma aventura...

Escreva entre 100-500 palavras. Quanto mais detalhes e emoções, melhor!

---

Usuário: [Compartilha história de 300 palavras sobre avó]

---

Luna: Que história linda! 💕 Adorei a parte sobre os bolinhos de chuva que ela fazia.

Para deixar ainda mais emocionante, que tal adicionar:
- Como era o cheiro da cozinha quando ela cozinhava?
- Alguma frase que ela sempre dizia?

Ou podemos criar assim mesmo! Qual formato você gostaria?
📹 Vídeo | 🎵 Música | 📖 Livro | 🎙️ Podcast

---

Usuário: Vídeo

---

Luna: Perfeito! Vou criar um vídeo cinematográfico com sua história. ✨

Tempo estimado: 10 minutos

Você receberá uma notificação quando estiver pronto. Enquanto isso, pode explorar exemplos na galeria!

Alguma dúvida?
```

---

### FLUXO 2: Descoberta de Produto

**Objetivo:** Educar o usuário sobre o MemoryVerse AI

**Etapas:**

1. **Identificar Conhecimento Atual**
   - Perguntar: "Você já conhece o MemoryVerse AI?"
   - Se sim: Perguntar o que quer saber especificamente
   - Se não: Fazer apresentação completa

2. **Apresentação Gradual**
   - Explicar conceito principal (1 frase)
   - Mostrar 4 formatos disponíveis
   - Dar exemplo concreto de uso
   - Perguntar se ficou claro

3. **Aprofundamento Baseado em Interesse**
   - Se interessado em tecnologia: Explicar IAs usadas
   - Se interessado em qualidade: Mostrar exemplos
   - Se interessado em uso: Dar casos de uso
   - Se interessado em preço: Transicionar para [FLUXO: Consulta de Planos]

4. **Call to Action**
   - Oferecer criar primeira memória grátis
   - Ou ver exemplos na galeria
   - Ou explorar planos

**Pontos de Saída:**
- Quer criar memória → [FLUXO: Criação de Memória]
- Quer saber preços → [FLUXO: Consulta de Planos]
- Satisfeito → Encerrar com CTA

**Exemplo de Conversa:**

```
Luna: Olá! 👋 Você já conhece o MemoryVerse AI?

---

Usuário: Não, o que é?

---

Luna: O MemoryVerse transforma suas histórias pessoais em memórias eternas usando IA!

Você conta uma história (tipo "como conheci minha esposa") e em minutos recebe:
📹 Vídeo cinematográfico com narração
🎵 Música personalizada inspirada na história
📖 Livro ilustrado para ler ou imprimir
🎙️ Podcast narrado profissionalmente

Tudo criado automaticamente por inteligência artificial. É como ter um estúdio de produção no bolso!

Ficou curioso? Posso te mostrar exemplos reais!

---

Usuário: Sim, mostra

---

Luna: Vou te mostrar 3 exemplos incríveis:

1. **Vídeo:** História de um avô contando sobre a guerra → Virou filme emocionante de 5min
2. **Música:** Pedido de casamento → Virou canção romântica original
3. **Livro:** Memórias de infância → Virou livro ilustrado de 20 páginas

[Links para exemplos]

O melhor: você pode começar GRÁTIS! 3 memórias vitalícias sem cartão de crédito.

Quer criar sua primeira memória agora?
```

---

### FLUXO 3: Consulta de Planos

**Objetivo:** Ajudar o usuário a escolher o plano ideal

**Etapas:**

1. **Identificar Necessidade**
   - Perguntar: "Quantas memórias você pretende criar por mês?"
   - Ou: "É para uso pessoal ou profissional?"
   - Entender contexto de uso

2. **Apresentar Planos Relevantes**
   - Se uso ocasional: Focar em Free e Creator
   - Se uso frequente: Focar em Creator e Pro
   - Se profissional: Focar em Pro

3. **Comparação Consultiva**
   - Mostrar tabela comparativa
   - Destacar diferenças principais
   - Explicar custo-benefício

4. **Lidar com Objeções**
   - "Muito caro" → Mostrar ROI, comparar com concorrentes
   - "Não sei se vou usar tanto" → Sugerir Free primeiro
   - "Preciso de mais recursos" → Coletar feedback

5. **Fechamento**
   - Se decidiu: Guiar para checkout
   - Se indeciso: Sugerir Free para testar
   - Se não convencido: Agendar follow-up

**Pontos de Saída:**
- Decidiu plano → Guiar para checkout
- Quer testar Free → [FLUXO: Criação de Memória]
- Não convencido → Salvar lead para remarketing

**Exemplo de Conversa:**

```
Luna: Ótima pergunta! Deixa eu te ajudar a escolher o melhor plano.

Primeiro, me conta: você pretende criar memórias com que frequência?
- Ocasionalmente (1-2 por mês)
- Regularmente (5-10 por mês)
- Intensivamente (20+ por mês)

---

Usuário: Regularmente, umas 8 por mês

---

Luna: Perfeito! Para 8 memórias/mês, o plano **Creator** é ideal:

🎨 **Creator** (R$ 97/mês)
- 20 memórias/mês (sobra para você!)
- Qualidade Full HD
- Sem marca d'água
- Custo: R$ 4,85 por memória

Comparando:
- Free: Apenas 3 vitalícias
- Pro: R$ 297/mês (vale só se criar 30+/mês)

Com Creator você tem folga e paga menos de R$ 5 por memória profissional!

Quer fazer upgrade agora ou testar Free primeiro?
```

---

### FLUXO 4: Suporte Técnico

**Objetivo:** Resolver problemas técnicos rapidamente

**Etapas:**

1. **Classificar Problema**
   - Problema de criação (travado, erro)
   - Problema de conta (login, senha)
   - Problema de pagamento (cobrança, cartão)
   - Problema de qualidade (resultado ruim)
   - Outro

2. **Troubleshooting Básico**
   - Aplicar solução padrão baseada no problema
   - Pedir informações necessárias
   - Testar solução

3. **Validar Resolução**
   - Perguntar se resolveu
   - Se sim: Encerrar com satisfação
   - Se não: Tentar solução alternativa

4. **Escalação (se necessário)**
   - Após 2-3 tentativas sem sucesso
   - Ou se problema complexo/crítico
   - Coletar informações detalhadas
   - Criar ticket de suporte
   - Informar SLA de resposta

5. **Follow-up**
   - Agendar check-in após X horas
   - Notificar quando resolvido
   - Coletar feedback sobre atendimento

**Pontos de Saída:**
- Problema resolvido → Encerrar
- Problema não resolvido → Escalar para humano
- Problema recorrente → Registrar para produto

**Exemplo de Conversa:**

```
Luna: Entendo sua frustração! 😔 Vamos resolver isso juntos.

Me conta: o que exatamente está acontecendo?

---

Usuário: Minha memória está travada há 20 minutos em "Processando"

---

Luna: Ok, vamos tentar algumas coisas:

1. Primeiro, atualiza a página (F5) para ver se o status mudou
2. Se ainda estiver travado, clica em "Cancelar" e aguarda 5 minutos
3. Depois tenta criar novamente

Às vezes acontece em horários de pico (18h-21h). Consegue tentar isso?

---

Usuário: Atualizei e apareceu pronta!

---

Luna: Eba! 🎉 Que bom que resolveu!

Como ficou o resultado? Gostou da memória?

Se tiver qualquer outro problema, é só chamar!
```

---

### FLUXO 5: Coleta de Feedback

**Objetivo:** Coletar feedback estruturado dos usuários

**Etapas:**

1. **Identificar Tipo de Feedback**
   - Elogio
   - Crítica/Reclamação
   - Sugestão de recurso
   - Bug report

2. **Coletar Detalhes**
   - Para elogios: Agradecer e perguntar o que mais gostou
   - Para críticas: Empatizar e pedir detalhes específicos
   - Para sugestões: Entender caso de uso e valor
   - Para bugs: Coletar informações técnicas

3. **Registrar Estruturadamente**
   - Categoria
   - Prioridade (baixa/média/alta)
   - Detalhes completos
   - Informações do usuário

4. **Dar Retorno**
   - Agradecer contribuição
   - Explicar próximos passos
   - Se aplicável: Informar roadmap

5. **Follow-up (quando relevante)**
   - Notificar quando recurso for implementado
   - Pedir para testar versão beta
   - Agradecer novamente

**Exemplo de Conversa:**

```
Luna: Adorei sua sugestão! 💡

Deixa eu entender melhor: você gostaria de poder escolher o estilo de ilustração do livro, certo?

Tipo: realista, cartoon, aquarela, etc?

---

Usuário: Isso! Seria incrível poder escolher

---

Luna: Concordo totalmente! Vou registrar sua sugestão para o time de produto.

Recursos mais pedidos entram no roadmap prioritário. Inclusive, isso já está planejado para Q2 2026!

Quer que eu te avise quando lançar para você testar em primeira mão?

---

Usuário: Sim!

---

Luna: Perfeito! Vou te adicionar na lista de beta testers. 🎨

Você receberá um email quando o recurso estiver disponível (previsão: Abril/2026).

Muito obrigada pelo feedback! Ele é super valioso para melhorarmos o produto.

Posso ajudar com mais alguma coisa?
```

---

## Integração com n8n

### Arquitetura de Integração

```
Usuário
  ↓
WhatsApp/Telegram/Web Chat
  ↓
n8n Webhook (recebe mensagem)
  ↓
n8n HTTP Request (envia para API do agente)
  ↓
Agente IA (processa com base no prompt)
  ↓
n8n (recebe resposta)
  ↓
n8n Switch (roteamento baseado em ação)
  ├─> Criar Memória → Workflow de Processamento
  ├─> Consultar Plano → Webhook Stripe
  ├─> Suporte → Criar Ticket no Zendesk
  └─> Resposta Simples → Enviar de volta ao usuário
```

### Workflow n8n: Chatbot Integrado

**Arquivo:** `06-chatbot-agent.json`

**Nodes:**

1. **Webhook Trigger**
   - Recebe mensagens do usuário
   - Suporta múltiplos canais (WhatsApp, Telegram, Web)

2. **Extract User Data**
   - Extrai: user_id, message, channel, timestamp
   - Busca histórico de conversas no banco

3. **Call Agent API**
   - POST para API do agente
   - Body: { user_id, message, context, history }
   - Headers: Authorization Bearer token

4. **Process Agent Response**
   - Parse JSON response
   - Extrai: reply, action, metadata

5. **Switch: Route by Action**
   - Se action = "create_memory" → Node 6
   - Se action = "check_plan" → Node 7
   - Se action = "escalate_support" → Node 8
   - Senão → Node 9 (resposta simples)

6. **Create Memory Workflow**
   - Chama workflow de processamento de memórias
   - Passa: story, format, user_id

7. **Check Plan Status**
   - Query no banco: SELECT plan FROM users WHERE id = user_id
   - Retorna informações do plano

8. **Create Support Ticket**
   - POST para Zendesk API
   - Cria ticket com: subject, description, user_email

9. **Send Reply to User**
   - Envia resposta do agente de volta ao canal
   - Salva mensagem no histórico

10. **Save to Database**
    - INSERT INTO conversations (user_id, message, reply, timestamp)

**Código do Workflow:**

```json
{
  "name": "MemoryVerse AI - Chatbot Agent",
  "nodes": [
    {
      "parameters": {
        "path": "chatbot",
        "responseMode": "responseNode",
        "options": {}
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300]
    },
    {
      "parameters": {
        "functionCode": "const user_id = $input.item.json.user_id;\nconst message = $input.item.json.message;\nconst channel = $input.item.json.channel || 'web';\nconst timestamp = new Date().toISOString();\n\nreturn {\n  user_id,\n  message,\n  channel,\n  timestamp\n};"
      },
      "name": "Extract User Data",
      "type": "n8n-nodes-base.function",
      "position": [450, 300]
    },
    {
      "parameters": {
        "url": "https://api.openai.com/v1/chat/completions",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "openAiApi",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "model",
              "value": "gpt-4"
            },
            {
              "name": "messages",
              "value": "={{ [{role: 'system', content: $node['Load System Prompt'].json.prompt}, {role: 'user', content: $json.message}] }}"
            }
          ]
        }
      },
      "name": "Call Agent API",
      "type": "n8n-nodes-base.httpRequest",
      "position": [650, 300]
    },
    {
      "parameters": {
        "functionCode": "const response = $input.item.json.choices[0].message.content;\nconst parsed = JSON.parse(response);\n\nreturn {\n  reply: parsed.reply,\n  action: parsed.action || 'reply',\n  metadata: parsed.metadata || {}\n};"
      },
      "name": "Process Agent Response",
      "type": "n8n-nodes-base.function",
      "position": [850, 300]
    },
    {
      "parameters": {
        "rules": {
          "rules": [
            {
              "conditions": {
                "string": [
                  {
                    "value1": "={{$json.action}}",
                    "value2": "create_memory"
                  }
                ]
              },
              "renameOutput": true,
              "outputKey": "create_memory"
            },
            {
              "conditions": {
                "string": [
                  {
                    "value1": "={{$json.action}}",
                    "value2": "check_plan"
                  }
                ]
              },
              "renameOutput": true,
              "outputKey": "check_plan"
            },
            {
              "conditions": {
                "string": [
                  {
                    "value1": "={{$json.action}}",
                    "value2": "escalate_support"
                  }
                ]
              },
              "renameOutput": true,
              "outputKey": "escalate"
            }
          ]
        },
        "fallbackOutput": "extra"
      },
      "name": "Switch: Route by Action",
      "type": "n8n-nodes-base.switch",
      "position": [1050, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{"node": "Extract User Data", "type": "main", "index": 0}]]
    },
    "Extract User Data": {
      "main": [[{"node": "Call Agent API", "type": "main", "index": 0}]]
    },
    "Call Agent API": {
      "main": [[{"node": "Process Agent Response", "type": "main", "index": 0}]]
    },
    "Process Agent Response": {
      "main": [[{"node": "Switch: Route by Action", "type": "main", "index": 0}]]
    }
  }
}
```

---

## Webhooks e APIs

### API do Agente

**Endpoint:** `POST /api/agent/chat`

**Request:**

```json
{
  "user_id": "user_123",
  "message": "Quero criar uma memória",
  "context": {
    "plan": "free",
    "credits_remaining": 3,
    "last_memory_created": "2025-12-01T10:30:00Z"
  },
  "history": [
    {
      "role": "user",
      "content": "Oi",
      "timestamp": "2025-12-05T14:20:00Z"
    },
    {
      "role": "assistant",
      "content": "Olá! Eu sou a Luna...",
      "timestamp": "2025-12-05T14:20:01Z"
    }
  ]
}
```

**Response:**

```json
{
  "reply": "Que legal! 😊 Vou te ajudar a criar uma memória incrível...",
  "action": "create_memory",
  "metadata": {
    "next_step": "collect_story",
    "suggested_formats": ["video", "music", "book", "podcast"]
  },
  "confidence": 0.95
}
```

**Actions Possíveis:**

- `reply`: Apenas responder (sem ação adicional)
- `create_memory`: Iniciar fluxo de criação
- `check_plan`: Consultar informações do plano
- `upgrade_plan`: Iniciar processo de upgrade
- `escalate_support`: Escalar para suporte humano
- `collect_feedback`: Registrar feedback
- `show_examples`: Mostrar galeria de exemplos

### Webhook de Notificações

**Endpoint:** `POST /api/webhooks/notifications`

**Eventos:**

- `memory.created`: Memória criada com sucesso
- `memory.failed`: Falha na criação
- `plan.upgraded`: Usuário fez upgrade
- `plan.downgraded`: Usuário fez downgrade
- `support.ticket_created`: Ticket de suporte criado

**Payload Exemplo:**

```json
{
  "event": "memory.created",
  "timestamp": "2025-12-05T15:30:00Z",
  "data": {
    "memory_id": "mem_456",
    "user_id": "user_123",
    "format": "video",
    "status": "completed",
    "url": "https://storage.memoryverse.ai/mem_456.mp4"
  }
}
```

---

## Monitoramento e Analytics

### Métricas do Agente

**Dashboard no n8n:**

1. **Volume de Conversas**
   - Total de mensagens/dia
   - Usuários únicos/dia
   - Conversas ativas

2. **Performance**
   - Tempo médio de resposta
   - Taxa de resolução (sem escalação)
   - Taxa de conversão (criação de memória)

3. **Satisfação**
   - Avaliações positivas/negativas
   - NPS (Net Promoter Score)
   - Feedback qualitativo

4. **Ações**
   - Memórias criadas via chat
   - Upgrades realizados via chat
   - Tickets de suporte criados

**Queries SQL para Analytics:**

```sql
-- Volume de conversas por dia
SELECT 
  DATE(timestamp) as date,
  COUNT(*) as total_messages,
  COUNT(DISTINCT user_id) as unique_users
FROM conversations
WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- Taxa de resolução
SELECT 
  COUNT(CASE WHEN action != 'escalate_support' THEN 1 END) / COUNT(*) * 100 as resolution_rate
FROM conversations
WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY);

-- Taxa de conversão
SELECT 
  COUNT(DISTINCT CASE WHEN action = 'create_memory' THEN user_id END) / 
  COUNT(DISTINCT user_id) * 100 as conversion_rate
FROM conversations
WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY);

-- Satisfação média
SELECT 
  AVG(CASE WHEN feedback = 'positive' THEN 1 ELSE 0 END) * 100 as satisfaction_rate
FROM conversations
WHERE feedback IS NOT NULL
AND timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY);
```

---

## Próximos Passos

1. **Implementar API do Agente**
   - Endpoint `/api/agent/chat`
   - Integração com OpenAI GPT-4
   - Sistema de contexto e histórico

2. **Criar Workflows n8n**
   - Importar `06-chatbot-agent.json`
   - Configurar credenciais (OpenAI, Stripe, Zendesk)
   - Testar fluxos end-to-end

3. **Integrar Canais**
   - WhatsApp Business API
   - Telegram Bot
   - Web Chat Widget

4. **Configurar Monitoramento**
   - Dashboard de métricas
   - Alertas para problemas
   - Relatórios semanais

5. **Treinar e Iterar**
   - Coletar conversas reais
   - Identificar pontos de melhoria
   - Atualizar prompt do agente
   - A/B testing de respostas

---

**Última atualização:** Dezembro 2025  
**Versão:** 1.0  
**Próxima revisão:** Março 2026
