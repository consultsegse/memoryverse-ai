import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

import { useAuth } from "@/_core/hooks/useAuth";
const getLoginUrl = () => `/api/oauth/login?redirect=${encodeURIComponent(window.location.pathname)}`;

export function Pricing() {
  const { user } = useAuth();
  const createCheckoutMutation = trpc.stripe.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      alert(`Erro: ${error.message}`);
    },
  });

  const handleSubscribe = (plan: "creator" | "pro") => {
    if (!user) {
      window.location.href = getLoginUrl();
      return;
    }

    createCheckoutMutation.mutate({ planId: plan, interval: "month" });
  };

  const plans = [
    {
      name: "Free",
      price: "R$ 0",
      period: "/sempre",
      description: "Perfeito para experimentar",
      icon: Sparkles,
      features: [
        "3 memórias grátis",
        "Todos os 4 formatos (vídeo, música, livro, podcast)",
        "Qualidade padrão",
        "Marca d'água MemoryVerse",
        "Suporte por email",
      ],
      cta: "Começar Grátis",
      popular: false,
      action: () => {
        if (!user) {
          window.location.href = getLoginUrl();
        } else {
          window.location.href = "/dashboard";
        }
      },
    },
    {
      name: "Creator",
      price: "R$ 97",
      period: "/mês",
      description: "Para criadores de conteúdo",
      icon: Zap,
      features: [
        "20 memórias por mês",
        "Todos os 4 formatos",
        "Qualidade HD",
        "Sem marca d'água",
        "Suporte prioritário",
        "Acesso antecipado a novos recursos",
      ],
      cta: "Assinar Creator",
      popular: true,
      action: () => handleSubscribe("creator"),
    },
    {
      name: "Pro",
      price: "R$ 297",
      period: "/mês",
      description: "Para uso ilimitado",
      icon: Crown,
      features: [
        "Memórias ILIMITADAS",
        "Todos os 4 formatos",
        "Qualidade 4K",
        "Sem marca d'água",
        "Suporte VIP (WhatsApp)",
        "Acesso antecipado a novos recursos",
        "Memórias colaborativas",
        "API para integração",
      ],
      cta: "Assinar Pro",
      popular: false,
      action: () => handleSubscribe("pro"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Sparkles className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MemoryVerse AI
              </span>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">Início</Button>
            </Link>
            {user ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <Button onClick={() => window.location.href = getLoginUrl()}>
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Escolha Seu Plano
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            Transforme suas memórias em arte com inteligência artificial. Sem contratos, cancele quando quiser.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            💳 Primeiros 100 clientes ganham <span className="font-bold text-purple-600">50% de desconto no primeiro mês</span>
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card
                  key={plan.name}
                  className={`relative ${
                    plan.popular
                      ? "border-purple-500 border-2 shadow-2xl scale-105"
                      : "border-gray-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Mais Popular
                      </span>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8 pt-8">
                    <div className="mx-auto mb-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <Icon className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <CardDescription className="text-sm mb-4">
                      {plan.description}
                    </CardDescription>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-500">{plan.period}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      className="w-full"
                      size="lg"
                      variant={plan.popular ? "default" : "outline"}
                      onClick={plan.action}
                      disabled={createCheckoutMutation.isPending}
                    >
                      {createCheckoutMutation.isPending ? "Processando..." : plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comparação Detalhada
          </h2>
          
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Recurso</th>
                  <th className="px-6 py-4 text-center">Free</th>
                  <th className="px-6 py-4 text-center">Creator</th>
                  <th className="px-6 py-4 text-center">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4">Memórias por mês</td>
                  <td className="px-6 py-4 text-center">3</td>
                  <td className="px-6 py-4 text-center">20</td>
                  <td className="px-6 py-4 text-center font-bold text-purple-600">Ilimitado</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4">Qualidade de vídeo</td>
                  <td className="px-6 py-4 text-center">HD</td>
                  <td className="px-6 py-4 text-center">Full HD</td>
                  <td className="px-6 py-4 text-center font-bold text-purple-600">4K</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Marca d'água</td>
                  <td className="px-6 py-4 text-center">Sim</td>
                  <td className="px-6 py-4 text-center">Não</td>
                  <td className="px-6 py-4 text-center">Não</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4">Suporte</td>
                  <td className="px-6 py-4 text-center">Email</td>
                  <td className="px-6 py-4 text-center">Prioritário</td>
                  <td className="px-6 py-4 text-center font-bold text-purple-600">VIP (WhatsApp)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Memórias colaborativas</td>
                  <td className="px-6 py-4 text-center">-</td>
                  <td className="px-6 py-4 text-center">-</td>
                  <td className="px-6 py-4 text-center">✓</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4">API para integração</td>
                  <td className="px-6 py-4 text-center">-</td>
                  <td className="px-6 py-4 text-center">-</td>
                  <td className="px-6 py-4 text-center">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Perguntas Frequentes
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: "Posso cancelar a qualquer momento?",
                a: "Sim! Não há contratos ou multas. Você pode cancelar sua assinatura a qualquer momento e continuar usando até o final do período pago.",
              },
              {
                q: "Quanto tempo demora para gerar uma memória?",
                a: "Em média, 5-10 minutos. Vídeos podem demorar um pouco mais (até 15 minutos) dependendo da complexidade.",
              },
              {
                q: "Posso usar as memórias comercialmente?",
                a: "Sim! Assinantes Creator e Pro têm direitos comerciais completos sobre as memórias geradas.",
              },
              {
                q: "E se eu não gostar do resultado?",
                a: "Você pode regenerar gratuitamente quantas vezes quiser. Se ainda assim não ficar satisfeito, oferecemos reembolso total em até 7 dias.",
              },
              {
                q: "Preciso de conhecimento técnico?",
                a: "Não! Basta contar sua história em texto. Nossa IA cuida de todo o resto.",
              },
              {
                q: "Vocês guardam minhas memórias?",
                a: "Sim, todas as memórias ficam salvas na sua conta. Você pode baixar ou compartilhar a qualquer momento.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para Eternizar Suas Memórias?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de pessoas que já transformaram suas histórias em arte.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6"
            onClick={() => window.location.href = user ? "/dashboard" : getLoginUrl()}
          >
            Começar Agora Grátis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 MemoryVerse AI. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            contato@memoryverse.com.br
          </p>
        </div>
      </footer>
    </div>
  );
}
