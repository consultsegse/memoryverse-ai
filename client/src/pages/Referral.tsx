import { useState } from "react";
import { Copy, Check, Gift, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function Referral() {
  const [copied, setCopied] = useState(false);
  const [referralCode] = useState("REF-123-ABC456XYZ");

  // Mock data - será substituído por tRPC real
  const stats = {
    total: 5,
    pending: 2,
    completed: 2,
    rewarded: 1,
    totalCreditsEarned: 13,
    nextReward: {
      remaining: 2,
      reward: "+10 créditos",
    },
  };

  const referralUrl = `${window.location.origin}?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const text = `Transforme suas memórias em arte com IA! 🎨✨\n\nVídeos, músicas, livros e podcasts personalizados.\n\nGanhe 3 créditos grátis: ${referralUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareViaEmail = () => {
    const subject = "Ganhe 3 créditos grátis no MemoryVerse AI";
    const body = `Olá!\n\nUse meu link de indicação e ganhe 3 créditos grátis para criar suas memórias:\n\n${referralUrl}\n\nVale a pena!`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const milestones = [
    { count: 1, reward: "+3 créditos", completed: stats.rewarded >= 1 },
    { count: 3, reward: "+10 créditos", completed: stats.rewarded >= 3 },
    { count: 5, reward: "+1 mês Pro grátis", completed: stats.rewarded >= 5 },
    { count: 10, reward: "+3 meses Pro grátis", completed: stats.rewarded >= 10 },
    { count: 25, reward: "+1 ano Pro grátis", completed: stats.rewarded >= 25 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Indique e Ganhe</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convide seus amigos e ganhem 3 créditos grátis cada um!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Indicações</CardDescription>
              <CardTitle className="text-4xl">{stats.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                {stats.pending} pendentes • {stats.rewarded} recompensadas
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Créditos Ganhos</CardDescription>
              <CardTitle className="text-4xl text-green-600">
                {stats.totalCreditsEarned}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">Total acumulado</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Próxima Recompensa</CardDescription>
              <CardTitle className="text-2xl">{stats.nextReward.reward}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                Faltam {stats.nextReward.remaining} indicações
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Seu Link de Indicação</CardTitle>
            <CardDescription>
              Compartilhe com amigos para ambos ganharem 3 créditos grátis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={referralUrl} readOnly className="font-mono text-sm" />
              <Button onClick={copyToClipboard} variant="outline">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-2">
              <Button onClick={shareViaWhatsApp} variant="outline">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </Button>
              <Button onClick={shareViaEmail} variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recompensas Progressivas</CardTitle>
            <CardDescription>
              Quanto mais indicar, mais você ganha!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                    milestone.completed
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        milestone.completed
                          ? "bg-green-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {milestone.completed ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <span className="font-bold">{milestone.count}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-bold">
                        {milestone.count} {milestone.count === 1 ? "indicação" : "indicações"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {milestone.completed ? "Recompensa recebida!" : "Em progresso"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={milestone.completed ? "default" : "secondary"}
                      className="text-sm px-3 py-1"
                    >
                      {milestone.reward}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How it Works */}
        <Card>
          <CardHeader>
            <CardTitle>Como Funciona</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold mb-2">1. Compartilhe</h3>
                <p className="text-sm text-gray-600">
                  Envie seu link para amigos e familiares
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold mb-2">2. Eles Ganham</h3>
                <p className="text-sm text-gray-600">
                  Seu amigo ganha 3 créditos ao se cadastrar
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold mb-2">3. Você Ganha</h3>
                <p className="text-sm text-gray-600">
                  Você também ganha 3 créditos instantaneamente
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
