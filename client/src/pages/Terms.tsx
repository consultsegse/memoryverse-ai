import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <Link href="/">
                <Button variant="ghost" className="mb-6"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>
            </Link>
            <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>

            <div className="prose dark:prose-invert">
                <p>Ao usar o MemoryVerse AI, você concorda com estes termos.</p>

                <h3>1. O Serviço</h3>
                <p>Oferecemos ferramentas de IA para geração de conteúdo multimídia a partir de descrições textuais.</p>

                <h3>2. Responsabilidade do Usuário</h3>
                <p>Você é responsável pelo conteúdo que envia. Não permitimos conteúdo ilegal, odioso ou que viole direitos autorais de terceiros.</p>

                <h3>3. Propriedade Intelectual</h3>
                <p>O usuário mantém os direitos sobre suas histórias originais. O MemoryVerse concede uma licença de uso sobre os ativos gerados (vídeos/músicas) conforme seu plano de assinatura.</p>

                <h3>4. Pagamentos e Reembolsos</h3>
                <p>Assinaturas são cobradas mensalmente. Reembolsos podem ser solicitados em até 7 dias após a primeira compra, caso não esteja satisfeito.</p>

                <h3>5. Cancelamento</h3>
                <p>Você pode cancelar a qualquer momento no painel. O acesso continua até o fim do ciclo vigente.</p>
            </div>
        </div>
    );
}
