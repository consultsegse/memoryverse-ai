import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ArrowLeft, Download, Share2 } from "lucide-react";
import { toast } from "sonner";

export default function MemoryDetail() {
    const { id } = useParams();
    const memoryId = parseInt(id || "0");
    const [_, setLocation] = useLocation();

    const { data: memory, isLoading } = trpc.memories.getById.useQuery({ id: memoryId }, {
        enabled: !!memoryId
    });

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    if (!memory) {
        return (
            <div className="container mx-auto p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Memória não encontrada</h1>
                <Button onClick={() => setLocation("/dashboard")}>Voltar ao Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Button variant="ghost" onClick={() => setLocation("/my-memories")} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> Minhas Memórias
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl">{memory.title || "Sem título"}</CardTitle>
                            <CardDescription>Criado em {new Date(memory.createdAt || "").toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center relative">
                                {memory.format === 'video' && memory.videoUrl ? (
                                    <video src={memory.videoUrl} controls className="w-full h-full" poster={memory.thumbnailUrl || ""} />
                                ) : memory.thumbnailUrl ? (
                                    <img src={memory.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-white">Processando visualização...</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>História Original</CardTitle></CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-300">
                                {memory.story}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Detalhes</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="font-semibold block mb-1">Formato</span>
                                <span className="capitalize px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                    {memory.format}
                                </span>
                            </div>

                            <div>
                                <span className="font-semibold block mb-1">Status</span>
                                <span className={`px-3 py-1 rounded-full text-sm ${memory.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        memory.status === 'failed' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {memory.status === 'completed' ? 'Concluído' :
                                        memory.status === 'failed' ? 'Falha' : 'Processando'}
                                </span>
                            </div>

                            {memory.status === 'completed' && (
                                <div className="pt-4 space-y-2">
                                    {memory.videoUrl && (
                                        <Button className="w-full" variant="outline" onClick={() => window.open(memory.videoUrl || "", '_blank')}>
                                            <Download className="mr-2 h-4 w-4" /> Baixar Vídeo
                                        </Button>
                                    )}
                                    {memory.musicUrl && (
                                        <Button className="w-full" variant="outline" onClick={() => window.open(memory.musicUrl || "", '_blank')}>
                                            <Download className="mr-2 h-4 w-4" /> Baixar Música
                                        </Button>
                                    )}
                                    {memory.bookUrl && (
                                        <Button className="w-full" variant="outline" onClick={() => window.open(memory.bookUrl || "", '_blank')}>
                                            <Download className="mr-2 h-4 w-4" /> Baixar PDF
                                        </Button>
                                    )}

                                    <Button className="w-full" onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast.success("Link copiado!", { description: "Compartilhe sua memória com amigos." });
                                    }}>
                                        <Share2 className="mr-2 h-4 w-4" /> Compartilhar
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
