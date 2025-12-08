import { useState } from "react";
import { X, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "after_create" | "no_credits" | "checkout";
  onUpgrade?: (plan: string) => void;
}

export function UpsellModal({ isOpen, onClose, type, onUpgrade }: UpsellModalProps) {
  if (!isOpen) return null;

  const renderContent = () => {
    switch (type) {
      case "after_create":
        return <AfterCreateContent onClose={onClose} onUpgrade={onUpgrade} />;
      case "no_credits":
        return <NoCreditsContent onClose={onClose} onUpgrade={onUpgrade} />;
      case "checkout":
        return <CheckoutUpsellContent onClose={onClose} onUpgrade={onUpgrade} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}

function AfterCreateContent({ onClose, onUpgrade }: { onClose: () => void; onUpgrade?: (plan: string) => void }) {
  return (
    <Card className="p-8 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Memória Criada com Sucesso! 🎉</h2>
        <p className="text-gray-600">
          Que tal criar mais memórias com desconto especial?
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="p-6 border-2 border-purple-500 rounded-lg bg-purple-50">
          <Badge className="mb-3 bg-purple-600">Mais Popular</Badge>
          <h3 className="text-xl font-bold mb-2">Pacote Plus</h3>
          <div className="text-3xl font-bold mb-1">R$ 267</div>
          <div className="text-sm text-gray-600 mb-4">25 créditos (18% OFF)</div>
          <ul className="space-y-2 text-sm mb-4">
            <li>✓ 25 memórias</li>
            <li>✓ Todos os formatos</li>
            <li>✓ Créditos nunca expiram</li>
            <li>✓ Sem marca d'água</li>
          </ul>
          <Button className="w-full" onClick={() => onUpgrade?.("plus")}>
            Comprar Agora
          </Button>
        </div>

        <div className="p-6 border-2 border-gray-200 rounded-lg">
          <div className="h-7 mb-3"></div>
          <h3 className="text-xl font-bold mb-2">Pacote Básico</h3>
          <div className="text-3xl font-bold mb-1">R$ 117</div>
          <div className="text-sm text-gray-600 mb-4">10 créditos (10% OFF)</div>
          <ul className="space-y-2 text-sm mb-4">
            <li>✓ 10 memórias</li>
            <li>✓ Todos os formatos</li>
            <li>✓ Créditos nunca expiram</li>
            <li>✓ Sem marca d'água</li>
          </ul>
          <Button variant="outline" className="w-full" onClick={() => onUpgrade?.("basic")}>
            Comprar Agora
          </Button>
        </div>
      </div>

      <div className="text-center">
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">
          Não, obrigado
        </button>
      </div>
    </Card>
  );
}

function NoCreditsContent({ onClose, onUpgrade }: { onClose: () => void; onUpgrade?: (plan: string) => void }) {
  return (
    <Card className="p-8 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Seus Créditos Acabaram!</h2>
        <p className="text-gray-600">
          Continue criando memórias incríveis. Escolha a melhor opção:
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="p-6 border-2 border-purple-500 rounded-lg bg-purple-50">
          <Badge className="mb-3 bg-purple-600">Melhor Custo-Benefício</Badge>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Plano Creator</h3>
              <div className="text-2xl font-bold text-purple-600">R$ 97/mês</div>
            </div>
            <Zap className="w-12 h-12 text-purple-600" />
          </div>
          <ul className="space-y-2 text-sm mb-4">
            <li>✓ 20 memórias por mês</li>
            <li>✓ Qualidade Full HD</li>
            <li>✓ Processamento prioritário</li>
            <li>✓ Suporte prioritário</li>
          </ul>
          <Button className="w-full" size="lg" onClick={() => onUpgrade?.("creator")}>
            Assinar Creator
          </Button>
        </div>

        <div className="p-6 border-2 border-gray-200 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Ou compre créditos avulsos:</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => onUpgrade?.("credits-10")}>
              10 créditos<br />
              <span className="text-sm">R$ 117</span>
            </Button>
            <Button variant="outline" onClick={() => onUpgrade?.("credits-25")}>
              25 créditos<br />
              <span className="text-sm">R$ 267</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">
          Decidir depois
        </button>
      </div>
    </Card>
  );
}

function CheckoutUpsellContent({ onClose, onUpgrade }: { onClose: () => void; onUpgrade?: (plan: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Card className="p-8 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="text-center mb-6">
        <Badge className="mb-4 bg-green-600">Oferta Especial</Badge>
        <h2 className="text-3xl font-bold mb-2">Adicione Mais e Economize!</h2>
        <p className="text-gray-600">
          Aproveite estas ofertas exclusivas antes de finalizar
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <div
          onClick={() => setSelected("annual")}
          className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
            selected === "annual"
              ? "border-purple-500 bg-purple-50"
              : "border-gray-200 hover:border-purple-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <Badge className="mb-2 bg-purple-600">Economize 20%</Badge>
              <h3 className="text-lg font-bold">Upgrade para Anual</h3>
              <p className="text-sm text-gray-600">
                Pague apenas R$ 931/ano ao invés de R$ 1.164
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">-R$ 233</div>
              <div className="text-sm text-gray-600">economia/ano</div>
            </div>
          </div>
        </div>

        <div
          onClick={() => setSelected("credits")}
          className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
            selected === "credits"
              ? "border-purple-500 bg-purple-50"
              : "border-gray-200 hover:border-purple-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Adicione 10 Créditos Extras</h3>
              <p className="text-sm text-gray-600">
                Por apenas R$ 97 (normalmente R$ 117)
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">R$ 97</div>
              <div className="text-sm text-gray-600 line-through">R$ 117</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClose}
        >
          Não, Obrigado
        </Button>
        <Button
          className="flex-1"
          disabled={!selected}
          onClick={() => {
            if (selected) onUpgrade?.(selected);
          }}
        >
          Adicionar ao Pedido
        </Button>
      </div>
    </Card>
  );
}
