import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Feedback() {
    const [_, setLocation] = useLocation();
    const [comment, setComment] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Feedback Enviado!", { description: "Obrigado por nos ajudar a melhorar." });
        setComment("");
        setTimeout(() => setLocation("/dashboard"), 1000);
    };

    return (
        <div className="container mx-auto p-8 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Deixe seu Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="text-gray-600">O que você está achando do MemoryVerse AI?</p>
                        <Textarea
                            placeholder="Sua opinião é muito importante..."
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            className="min-h-[150px]"
                        />
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => setLocation("/dashboard")}>Cancelar</Button>
                            <Button type="submit">Enviar Feedback</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
