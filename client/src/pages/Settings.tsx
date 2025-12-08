import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Settings() {
    const { user, logout } = useAuth();
    const [_, setLocation] = useLocation();
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate update
        setTimeout(() => {
            setLoading(false);
            toast.success("Perfil atualizado com sucesso!");
        }, 1000);
    };

    if (!user) {
        setTimeout(() => setLocation("/login"), 0);
        return null;
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Configurações</h1>

            <div className="grid gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Perfil</CardTitle>
                        <CardDescription>Atualize suas informações pessoais</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Nome</Label>
                                <Input defaultValue={user.name || ""} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input defaultValue={user.email || ""} disabled className="bg-gray-100" />
                            </div>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Salvando..." : "Salvar Alterações"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Segurança</CardTitle>
                        <CardDescription>Gerencie sua senha</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" onClick={() => toast.info("Link de redefinição enviado para seu email.")}>
                            Alterar Senha
                        </Button>

                        <div className="pt-4 border-t">
                            <Button variant="destructive" onClick={() => { logout(); setLocation("/"); }}>
                                Sair da Conta
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
