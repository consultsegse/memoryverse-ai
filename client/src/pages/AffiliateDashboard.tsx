import { useState } from "react";
import { Copy, Check, Share2, TrendingUp, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function AffiliateDashboard() {
  const [copied, setCopied] = useState(false);
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [affiliateCode] = useState("DEMO-USER-ABC123");
  const [pixKey, setPixKey] = useState("");

  // Mock data - será substituído por tRPC real
  const stats = {
    totalEarnings: 15000, // R$ 150
    pendingEarnings: 8500, // R$ 85
    paidEarnings: 6500, // R$ 65
    totalReferrals: 12,
    convertedReferrals: 8,
    conversionRate: 67,
  };

  const affiliateUrl = `${window.location.origin}?ref=${affiliateCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateUrl);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const becomeAffiliate = () => {
    setIsAffiliate(true);
    toast.success("Você agora é um afiliado!");
  };

  if (!isAffiliate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16">
        <div className="container max-w-4xl">
          <Card className="p-12 text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="w-10 h-10 text-purple-600" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4">Programa de Afiliados</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Ganhe comissões recorrentes indicando o MemoryVerse AI
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">30%</div>
                <div className="text-sm text-gray-600">Comissão primeira venda</div>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">10-20%</div>
                <div className="text-sm text-gray-600">Comissão recorrente</div>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">R$ 50</div>
                <div className="text-sm text-gray-600">Saque mínimo PIX</div>
              </div>
            </div>

            <Button size="lg" onClick={becomeAffiliate} className="text-lg px-8">
              Tornar-se Afiliado Grátis
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8">
      <div className="container max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard de Afiliados</h1>
          <p className="text-gray-600">Acompanhe seus ganhos em tempo real</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Ganhos Totais</CardDescription>
              <CardTitle className="text-3xl">
                R$ {(stats.totalEarnings / 100).toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4" />
                <span>Lifetime</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Saldo Disponível</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                R$ {(stats.pendingEarnings / 100).toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button size="sm" className="w-full" disabled={stats.pendingEarnings < 5000}>
                Solicitar Saque
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Referências</CardDescription>
              <CardTitle className="text-3xl">{stats.convertedReferrals}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{stats.totalReferrals} total</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Conversão</CardDescription>
              <CardTitle className="text-3xl">{stats.conversionRate}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">Taxa de conversão</div>
            </CardContent>
          </Card>
        </div>

        {/* Affiliate Link */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Seu Link de Afiliado</CardTitle>
            <CardDescription>Compartilhe para rastrear referências</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={affiliateUrl} readOnly className="font-mono text-sm" />
              <Button onClick={copyToClipboard} variant="outline">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <Button className="w-full" variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar nas Redes Sociais
            </Button>
          </CardContent>
        </Card>

        {/* PIX Config */}
        <Card>
          <CardHeader>
            <CardTitle>Configuração de Pagamento</CardTitle>
            <CardDescription>Configure sua chave PIX</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="pix">Chave PIX</Label>
                <Input
                  id="pix"
                  placeholder="CPF, email, telefone ou chave aleatória"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button disabled={!pixKey}>Salvar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
