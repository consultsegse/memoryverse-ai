import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
// import { NotificationCenter } from "@/components/NotificationCenter";
// import { LanguageSelector } from "@/components/LanguageSelector";
import { Link, useLocation } from "wouter";
import { Video, Music, BookOpen, Mic, Sparkles, Plus, Grid3x3, LogOut } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [story, setStory] = useState("");
  const [selectedFormats, setSelectedFormats] = useState<("video" | "music" | "book" | "podcast")[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Static formats without i18n
  const formats = [
    { id: "video", name: "Vídeo Cinematográfico", icon: Video, description: "Transforme sua história em um vídeo emocionante" },
    { id: "music", name: "Música Personalizada", icon: Music, description: "Crie uma música única sobre sua memória" },
    { id: "book", name: "Livro Ilustrado", icon: BookOpen, description: "Gere um livro digital com ilustrações" },
    { id: "podcast", name: "Podcast Narrado", icon: Mic, description: "Ouça sua história narrada profissionalmente" },
  ];

  const createMemoryMutation = trpc.memories.create.useMutation({
    onSuccess: () => {
      toast.success("Memória criada com sucesso!");
      setStory("");
      setSelectedFormats([]);
      setIsCreating(false);
    },
    onError: (error) => {
      toast.error(`Erro ao criar memória: ${error.message}`);
      setIsCreating(false);
    },
  });

  const handleFormatToggle = (formatId: "video" | "music" | "book" | "podcast") => {
    setSelectedFormats(prev =>
      prev.includes(formatId)
        ? prev.filter(id => id !== formatId)
        : [...prev, formatId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!story.trim()) {
      toast.error("Por favor, conte sua história");
      return;
    }
    
    if (selectedFormats.length === 0) {
      toast.error("Selecione pelo menos um formato");
      return;
    }

    setIsCreating(true);
    createMemoryMutation.mutate({
      story: story.trim(),
      formats: selectedFormats,
    });
  };

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
            {/* <LanguageSelector /> */}
            {/* <NotificationCenter /> */}
            <Link href="/my-memories">
              <Button variant="outline">
                <Grid3x3 className="h-4 w-4 mr-2" />
                Minhas Memórias
              </Button>
            </Link>
            <Button variant="ghost" onClick={() => logout()}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Welcome */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Bem-vindo, {user?.name || "Criador"}!
          </h1>
          <p className="text-gray-600 text-lg">
            Transforme suas memórias em arte com inteligência artificial
          </p>
        </div>

        {/* Create Memory Form */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Criar Nova Memória
            </CardTitle>
            <CardDescription>
              Conte sua história e escolha os formatos que deseja gerar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Story Input */}
              <div className="space-y-2">
                <Label htmlFor="story">Sua História</Label>
                <Textarea
                  id="story"
                  placeholder="Conte sua história aqui... Pode ser uma memória especial, um momento marcante, ou qualquer experiência que você queira eternizar."
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="min-h-[200px] resize-none"
                  disabled={isCreating}
                />
                <p className="text-sm text-gray-500">
                  {story.length} caracteres
                </p>
              </div>

              {/* Format Selection */}
              <div className="space-y-4">
                <Label>Selecione os Formatos</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formats.map((format) => {
                    const Icon = format.icon;
                    const isSelected = selectedFormats.includes(format.id as "video" | "music" | "book" | "podcast");
                    
                    return (
                      <label
                        key={format.id}
                        className={`
                          p-4 rounded-lg border-2 cursor-pointer transition-all block
                          ${isSelected
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                          }
                          ${isCreating ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => !isCreating && handleFormatToggle(format.id as "video" | "music" | "book" | "podcast")}
                            disabled={isCreating}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="h-5 w-5 text-purple-600" />
                              <span className="font-medium">{format.name}</span>
                            </div>
                            <p className="text-sm text-gray-600">{format.description}</p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isCreating || !story.trim() || selectedFormats.length === 0}
              >
                {isCreating ? (
                  <>
                    <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                    Criando sua memória...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Criar Memória
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⚡ Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Suas memórias ficam prontas em poucos minutos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎨 Profissional</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Qualidade cinematográfica com IA de última geração
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💾 Suas Memórias</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Acesse e compartilhe suas criações a qualquer momento
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
