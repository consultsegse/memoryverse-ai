#!/usr/bin/env python3
"""
Projeções Financeiras - MemoryVerse AI
Análise de viabilidade financeira com cenários conservador, realista e otimista
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Configurar fonte para português
plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['figure.figsize'] = (14, 8)
plt.rcParams['font.size'] = 10

# ===== PREMISSAS =====

# Preços dos planos (em R$)
PRICES = {
    'free': 0,
    'creator': 97,
    'pro': 297
}

# Custos de IA por memória (estimativa)
COST_PER_MEMORY = {
    'video': 2.50,      # OpenAI GPT-4 + DALL-E + Runway
    'music': 1.50,      # Suno AI
    'book': 1.00,       # GPT-4 + DALL-E
    'podcast': 0.80,    # ElevenLabs
}

# Custos fixos mensais (R$)
FIXED_COSTS_MONTHLY = {
    'infrastructure': 500,      # Servidor, banco de dados, S3
    'apis': 1000,              # OpenAI, ElevenLabs, Suno (base)
    'marketing': 3000,         # Ads, conteúdo
    'tools': 300,              # n8n, analytics, etc
    'total': 4800
}

# Cenários de crescimento de usuários
SCENARIOS = {
    'conservador': {
        'month_1': {'free': 50, 'creator': 5, 'pro': 0},
        'growth_rate': {'free': 1.15, 'creator': 1.20, 'pro': 1.10},  # 15%, 20%, 10% ao mês
        'conversion_free_to_creator': 0.05,  # 5% convertem
        'conversion_creator_to_pro': 0.10,   # 10% upgrades
    },
    'realista': {
        'month_1': {'free': 100, 'creator': 10, 'pro': 1},
        'growth_rate': {'free': 1.25, 'creator': 1.30, 'pro': 1.15},  # 25%, 30%, 15%
        'conversion_free_to_creator': 0.08,
        'conversion_creator_to_pro': 0.15,
    },
    'otimista': {
        'month_1': {'free': 200, 'creator': 20, 'pro': 3},
        'growth_rate': {'free': 1.35, 'creator': 1.40, 'pro': 1.20},  # 35%, 40%, 20%
        'conversion_free_to_creator': 0.12,
        'conversion_creator_to_pro': 0.20,
    }
}

# Uso médio de memórias por usuário/mês
MEMORIES_PER_USER = {
    'free': 1.5,      # Limitado a 3 total
    'creator': 8,     # Limitado a 20/mês
    'pro': 25,        # Ilimitado, mas uso médio
}

def calculate_projections(scenario_name, months=36):
    """Calcula projeções financeiras para um cenário"""
    scenario = SCENARIOS[scenario_name]
    
    results = []
    
    # Estado atual
    users = scenario['month_1'].copy()
    
    for month in range(1, months + 1):
        # Crescimento orgânico
        for plan in ['free', 'creator', 'pro']:
            users[plan] = int(users[plan] * scenario['growth_rate'][plan])
        
        # Conversões
        if month > 2:  # Conversões começam após 2 meses
            conversions_to_creator = int(users['free'] * scenario['conversion_free_to_creator'])
            conversions_to_pro = int(users['creator'] * scenario['conversion_creator_to_pro'])
            
            users['free'] -= conversions_to_creator
            users['creator'] += conversions_to_creator - conversions_to_pro
            users['pro'] += conversions_to_pro
        
        # Receita
        revenue = (
            users['creator'] * PRICES['creator'] +
            users['pro'] * PRICES['pro']
        )
        
        # Custos variáveis (IA)
        total_memories = (
            users['free'] * MEMORIES_PER_USER['free'] +
            users['creator'] * MEMORIES_PER_USER['creator'] +
            users['pro'] * MEMORIES_PER_USER['pro']
        )
        
        # Custo médio por memória (mix de formatos)
        avg_cost_per_memory = np.mean(list(COST_PER_MEMORY.values()))
        variable_costs = total_memories * avg_cost_per_memory
        
        # Custos totais
        total_costs = FIXED_COSTS_MONTHLY['total'] + variable_costs
        
        # Lucro
        profit = revenue - total_costs
        profit_margin = (profit / revenue * 100) if revenue > 0 else -100
        
        # Métricas
        total_users = sum(users.values())
        arpu = revenue / total_users if total_users > 0 else 0
        
        results.append({
            'month': month,
            'users_free': users['free'],
            'users_creator': users['creator'],
            'users_pro': users['pro'],
            'total_users': total_users,
            'revenue': revenue,
            'variable_costs': variable_costs,
            'fixed_costs': FIXED_COSTS_MONTHLY['total'],
            'total_costs': total_costs,
            'profit': profit,
            'profit_margin': profit_margin,
            'arpu': arpu,
            'total_memories': total_memories,
        })
    
    return pd.DataFrame(results)

# Calcular projeções para todos os cenários
print("Calculando projeções financeiras...")
projections = {}
for scenario in ['conservador', 'realista', 'otimista']:
    projections[scenario] = calculate_projections(scenario)
    print(f"\n=== Cenário {scenario.upper()} ===")
    print(f"Mês 12: Receita R$ {projections[scenario].iloc[11]['revenue']:,.2f} | Lucro R$ {projections[scenario].iloc[11]['profit']:,.2f}")
    print(f"Mês 24: Receita R$ {projections[scenario].iloc[23]['revenue']:,.2f} | Lucro R$ {projections[scenario].iloc[23]['profit']:,.2f}")
    print(f"Mês 36: Receita R$ {projections[scenario].iloc[35]['revenue']:,.2f} | Lucro R$ {projections[scenario].iloc[35]['profit']:,.2f}")

# ===== VISUALIZAÇÕES =====

# Gráfico 1: Receita por Cenário
plt.figure(figsize=(14, 6))
for scenario in ['conservador', 'realista', 'otimista']:
    plt.plot(projections[scenario]['month'], projections[scenario]['revenue'], 
             label=scenario.capitalize(), linewidth=2)

plt.title('Projeção de Receita Mensal - 3 Anos', fontsize=14, fontweight='bold')
plt.xlabel('Mês')
plt.ylabel('Receita (R$)')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('/home/ubuntu/memoryverse-ai/revenue-projection.png', dpi=300)
print("\nGráfico de receita salvo: revenue-projection.png")

# Gráfico 2: Lucro por Cenário
plt.figure(figsize=(14, 6))
for scenario in ['conservador', 'realista', 'otimista']:
    plt.plot(projections[scenario]['month'], projections[scenario]['profit'], 
             label=scenario.capitalize(), linewidth=2)

plt.axhline(y=0, color='r', linestyle='--', alpha=0.5, label='Breakeven')
plt.title('Projeção de Lucro Mensal - 3 Anos', fontsize=14, fontweight='bold')
plt.xlabel('Mês')
plt.ylabel('Lucro (R$)')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('/home/ubuntu/memoryverse-ai/profit-projection.png', dpi=300)
print("Gráfico de lucro salvo: profit-projection.png")

# Gráfico 3: Crescimento de Usuários
plt.figure(figsize=(14, 6))
for scenario in ['conservador', 'realista', 'otimista']:
    plt.plot(projections[scenario]['month'], projections[scenario]['total_users'], 
             label=scenario.capitalize(), linewidth=2)

plt.title('Crescimento de Usuários Totais - 3 Anos', fontsize=14, fontweight='bold')
plt.xlabel('Mês')
plt.ylabel('Usuários Totais')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('/home/ubuntu/memoryverse-ai/users-growth.png', dpi=300)
print("Gráfico de usuários salvo: users-growth.png")

# ===== ANÁLISE DE BREAKEVEN =====
print("\n=== ANÁLISE DE BREAKEVEN ===")
for scenario in ['conservador', 'realista', 'otimista']:
    df = projections[scenario]
    breakeven_month = df[df['profit'] > 0]['month'].min()
    if pd.notna(breakeven_month):
        print(f"{scenario.capitalize()}: Breakeven no mês {int(breakeven_month)}")
    else:
        print(f"{scenario.capitalize()}: Não atinge breakeven em 36 meses")

# ===== EXPORTAR DADOS =====
with pd.ExcelWriter('/home/ubuntu/memoryverse-ai/financial-projections.xlsx') as writer:
    for scenario in ['conservador', 'realista', 'otimista']:
        projections[scenario].to_excel(writer, sheet_name=scenario.capitalize(), index=False)

print("\nPlanilha exportada: financial-projections.xlsx")
print("\n✅ Análise financeira completa!")
