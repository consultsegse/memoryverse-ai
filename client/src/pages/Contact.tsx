import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { NotificationCenter } from "@/components/NotificationCenter";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Link } from "wouter";
import { Sparkles, Mail, MapPin, Phone, Send, Instagram, Youtube, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio (em produção, chamar API de email)
    setTimeout(() => {
      toast.success("Mensagem enviada com sucesso! Responderemos em breve.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
            <LanguageSelector />
            {isAuthenticated && <NotificationCenter />}
            <Link href="/">
              <Button variant="ghost">Início</Button>
            </Link>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <Button>Entrar</Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            <Mail className="h-4 w-4" />
            Entre em Contato
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Fale <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Conosco</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Tem alguma dúvida, sugestão ou quer saber mais sobre nossos serviços? Estamos aqui para ajudar!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Envie sua Mensagem</CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo e responderemos o mais rápido possível
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Seu nome"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Sobre o que você quer falar?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Escreva sua mensagem aqui..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Email */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-600" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a 
                  href="mailto:contato@memoryverse.com.br" 
                  className="text-purple-600 hover:underline"
                >
                  contato@memoryverse.com.br
                </a>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Redes Sociais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a 
                  href="https://instagram.com/memoryverseai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition"
                >
                  <Instagram className="h-5 w-5" />
                  <span>@memoryverseai</span>
                </a>
                
                <a 
                  href="https://tiktok.com/@memoryverseai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>@memoryverseai</span>
                </a>
                
                <a 
                  href="https://youtube.com/@mymemoryverseai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition"
                >
                  <Youtube className="h-5 w-5" />
                  <span>@mymemoryverseai</span>
                </a>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Horário de Atendimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Segunda - Sexta</span>
                    <span className="font-medium">9h - 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sábado</span>
                    <span className="font-medium">9h - 13h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Domingo</span>
                    <span className="font-medium">Fechado</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Quick Links */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Como funciona o MemoryVerse AI?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Nossa IA transforma suas histórias em diferentes formatos artísticos em minutos.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Quais formatos estão disponíveis?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Vídeos, músicas, livros ilustrados, podcasts e muito mais!
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Quanto custa?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Oferecemos 3 memórias grátis e planos a partir de R$ 97/mês.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Posso usar comercialmente?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Sim! Nossos planos Pro e Creator incluem licença comercial.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
