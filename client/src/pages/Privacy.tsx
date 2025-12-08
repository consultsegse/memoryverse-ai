import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <Link href="/">
                <Button variant="ghost" className="mb-6"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>
            </Link>
            <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
            <div className="prose dark:prose-invert">
                <p>Última atualização: 08 de Dezembro de 2025</p>

                <h3>1. Coleta de Dados</h3>
                <p>Coletamos seu email, nome e as memórias (texto/mídia) que você envia para processamento.</p>

                <h3>2. Uso dos Dados</h3>
                <p>Seus dados são usados exclusivamente para gerar o conteúdo contratado (vídeos, músicas, etc) e melhorar nossos serviços de IA.</p>

                <h3>3. Compartilhamento</h3>
                <p>Não vendemos seus dados. Compartilhamos apenas com provedores necessários (ex: processadores de pagamento, APIs de IA) sob estrito sigilo.</p>

                <h3>4. Segurança</h3>
                <p>Utilizamos criptografia e práticas de segurança padrão da indústria para proteger suas informações.</p>

                <h3>5. Seus Direitos</h3>
                <p>Você pode solicitar a exclusão de sua conta e todos os dados associados a qualquer momento através do painel de Configurações.</p>

                <p className="mt-8 text-sm text-gray-500">Contato para dúvidas: privacidade@memoryverse.com.br</p>
            </div>
        </div>
    );
}
