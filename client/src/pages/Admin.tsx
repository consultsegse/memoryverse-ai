import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function AdminModeration() {
    const [_, setLocation] = useLocation();

    const mockFlaggedItems = [
        { id: 101, content: "História suspeita...", reason: "Violence", severity: "medium", user: "user@example.com" },
        { id: 102, content: "Spam detectado", reason: "Spam", severity: "low", user: "bot@example.com" }
    ];

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Painel de Moderação</h1>
                <Button variant="outline" onClick={() => setLocation("/dashboard")}>Voltar</Button>
            </div>

            <div className="grid gap-4">
                {mockFlaggedItems.map(item => (
                    <Card key={item.id}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Item #{item.id}</CardTitle>
                            <span className={`px-2 py-1 rounded text-xs uppercase ${item.severity === 'high' ? 'bg-red-500 text-white' :
                                    item.severity === 'medium' ? 'bg-yellow-500 text-white' :
                                        'bg-blue-500 text-white'
                                }`}>
                                {item.severity}
                            </span>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-2"><strong>Motivo:</strong> {item.reason}</p>
                            <p className="bg-gray-100 p-4 rounded mb-4">{item.content}</p>
                            <div className="flex gap-2">
                                <Button variant="destructive">Remover</Button>
                                <Button variant="default">Aprovar</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {mockFlaggedItems.length === 0 && <p>Nenhum item pendente.</p>}
            </div>
        </div>
    );
}
