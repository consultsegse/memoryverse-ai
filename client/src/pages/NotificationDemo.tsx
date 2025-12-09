import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationCenter } from "@/components/NotificationCenter";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Link } from "wouter";
import { Sparkles, Bell, Send, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function NotificationDemo() {
  const { user, logout } = useAuth();

  const createNotificationMutation = trpc.notifications.createCustom.useMutation({
    onSuccess: () => {
      toast.success("Notificação criada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar notificação: " + error.message);
    },
  });

  const notificationExamples = [
    {
      type: "welcome" as const,
      title: "Notificação de Boas-vindas",
      description: "Enviada quando um novo usuário se cadastra",
      context: {
        userName: user?.name || "Usuário",
      },
    },
    {
      type: "memory_completed" as const,
      title: "Memória Concluída",
      description: "Alta prioridade - Quando uma memória é processada",
      context: {
        memoryTitle: "Minha Primeira Memória",
        memoryId: 1,
        memoryFormat: "vídeo",
        thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
      },
    },
    {
      type: "milestone" as const,
      title: "Marco Alcançado",
      description: "Quando o usuário atinge um objetivo",
      context: {
        milestoneType: "memórias",
        milestoneValue: 10,
      },
    },
    {
      type: "new_like" as const,
      title: "Nova Curtida",
      description: "Baixa prioridade - Quando alguém curte uma memória",
      context: {
        memoryTitle: "Minha Memória Especial",
        memoryId: 2,
        likeCount: 42,
        thumbnailUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=300&fit=crop",
      },
    },
    {
      type: "promotion" as const,
      title: "Promoção Especial",
      description: "Notificação de marketing com desconto",
      context: {
        promotionTitle: "Black Friday - 50% OFF",
        promotionDiscount: "50%",
      },
    },
    {
      type: "payment_success" as const,
      title: "Pagamento Confirmado",
      description: "Alta prioridade - Confirmação de pagamento",
      context: {
        amount: "R$ 97,00",
      },
    },
    {
      type: "memory_failed" as const,
      title: "Erro no Processamento",
      description: "Urgente - Quando há falha ao processar memória",
      context: {
        memoryTitle: "Memória com Problema",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                MemoryVerse AI
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            <NotificationCenter />
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Button variant="ghost" onClick={() => logout()}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            <Bell className="h-4 w-4" />
            Sistema de Notificações Personalizadas
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Demonstração de <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Notificações</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Teste o sistema completo de notificações ricas com templates, prioridades e ações personalizadas
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎨 Notificações Ricas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Imagens, ações customizadas e design profissional
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⚡ Prioridades</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                4 níveis: Low, Normal, High e Urgent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📧 Email Integrado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Templates HTML profissionais prontos para envio
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Notification Examples */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Criar Notificações de Teste</h2>
          <div className="grid gap-4">
            {notificationExamples.map((example) => (
              <Card key={example.type} className="hover:shadow-lg transition">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{example.title}</CardTitle>
                      <CardDescription>{example.description}</CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        if (!user) return;
                        createNotificationMutation.mutate({
                          userId: user.id,
                          type: example.type,
                          context: example.context,
                        });
                      }}
                      disabled={createNotificationMutation.isPending || !user}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Criar
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <Card className="max-w-4xl mx-auto mt-12 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle>💡 Como Usar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. Clique em "Criar" em qualquer exemplo acima</p>
            <p>2. Abra o centro de notificações no canto superior direito (ícone do sino)</p>
            <p>3. Veja a notificação rica com imagem, prioridade e ação</p>
            <p>4. Filtre por prioridade (All, Urgent, High, Normal, Low)</p>
            <p>5. Marque como lida ou exclua notificações</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
