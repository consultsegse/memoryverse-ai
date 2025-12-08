import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Heart, Music, BookOpen, Video, Mic, Sparkles, Check, ArrowRight, Mail } from "lucide-react";
import { Link } from "wouter";
import { SOCIAL_MEDIA, CONTACT_INFO } from "@shared/socialMedia";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              MemoryVerse AI
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#como-funciona" className="text-gray-600 hover:text-purple-600 transition">Como Funciona</a>
            <a href="#formatos" className="text-gray-600 hover:text-purple-600 transition">Formatos</a>
            <a href="/pricing" className="text-gray-600 hover:text-purple-600 transition">Preços</a>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <Button asChild>
                <a href={getLoginUrl()}>Começar Grátis</a>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            ✨ Transforme Memórias em Arte com IA
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Suas Histórias <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Merecem Ser Eternas
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Conte sua história e receba em minutos um vídeo cinematográfico, música personalizada,
            livro ilustrado e muito mais. Tudo criado por inteligência artificial.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-6">
                  Criar Minha Primeira Memória <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <a href={getLoginUrl()}>
                  Criar Minha Primeira Memória <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            )}
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Ver Preços
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 pt-4">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <span>3 memórias grátis</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <span>Pronto em 5 minutos</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Como Funciona</h2>
            <p className="text-gray-600 text-lg">Três passos simples para eternizar suas memórias</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-purple-600">1</span>
                </div>
                <CardTitle>Conte Sua História</CardTitle>
                <CardDescription>
                  Escreva ou grave sua memória. Pode ser qualquer momento especial da sua vida.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-purple-600">2</span>
                </div>
                <CardTitle>Escolha os Formatos</CardTitle>
                <CardDescription>
                  Selecione como quer receber: vídeo, música, livro, podcast ou todos!
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <CardTitle>Receba em Minutos</CardTitle>
                <CardDescription>
                  Nossa IA cria conteúdo profissional e emocionante em 5-10 minutos.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Formats */}
      <section id="formatos" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Formatos Disponíveis</h2>
            <p className="text-gray-600 text-lg">Uma história, infinitas possibilidades. Escolha o formato perfeito para sua memória.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Video className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Vídeo Cinematográfico</CardTitle>
                <CardDescription>
                  Vídeo emocionante de 1-3 minutos com trilha sonora
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Music className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Música Personalizada</CardTitle>
                <CardDescription>
                  Música original sobre sua história
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Livro Ilustrado</CardTitle>
                <CardDescription>
                  Livro digital com ilustrações profissionais
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Mic className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Podcast Narrado</CardTitle>
                <CardDescription>
                  Áudio narrado com voz profissional
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Animação 2D</CardTitle>
                <CardDescription>
                  Desenho animado da sua memória
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Sparkles className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>NFT Exclusivo</CardTitle>
                <CardDescription>
                  Transforme em arte digital colecionável
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="precos" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Planos e Preços</h2>
            <p className="text-gray-600 text-lg">Escolha o plano perfeito para suas necessidades</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <div className="text-3xl font-bold">R$ 0<span className="text-lg font-normal text-gray-600">/para sempre</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>3 memórias grátis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Todos os formatos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Qualidade HD</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Resolução HD</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <a href={getLoginUrl()}>Começar Grátis</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-600 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Mais Popular
                </span>
              </div>
              <CardHeader>
                <CardTitle>Creator</CardTitle>
                <div className="text-3xl font-bold">R$ 97<span className="text-lg font-normal text-gray-600">/mês</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>20 memórias/mês</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Sem marca d'água</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Suporte prioritário</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Galeria privada</span>
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full mt-6">Assinar Agora</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <div className="text-3xl font-bold">R$ 297<span className="text-lg font-normal text-gray-600">/mês</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Memórias ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Acesso à API</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Uso comercial</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>NFTs inclusos</span>
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full mt-6" variant="outline">Falar com Vendas</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para Eternizar Suas Memórias?</h2>
          <p className="text-xl mb-8 opacity-90">
            Comece gratuitamente. Sem cartão de crédito. Cancele quando quiser.
          </p>
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Criar Minha Primeira Memória <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <a href={getLoginUrl()}>
                Criar Minha Primeira Memória <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold text-white">MemoryVerse AI</span>
              </div>
              <p className="text-sm">
                Transforme suas memórias em arte com inteligência artificial.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Produto</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#como-funciona" className="hover:text-white transition">Como Funciona</a></li>
                <li><a href="#formatos" className="hover:text-white transition">Formatos</a></li>
                <li><a href="/pricing" className="hover:text-white transition">Preços</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/contact"><a className="hover:text-white transition">Contato</a></Link></li>
                <li><Link href="/privacy"><a className="hover:text-white transition">Privacidade</a></Link></li>
                <li><Link href="/terms"><a className="hover:text-white transition">Termos de Uso</a></Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Redes Sociais</h3>
              <div className="flex gap-4">
                <a href={SOCIAL_MEDIA.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  Instagram
                </a>
                <a href={SOCIAL_MEDIA.tiktok.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  TikTok
                </a>
                <a href={SOCIAL_MEDIA.youtube.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  YouTube
                </a>
              </div>
              <div className="mt-4">
                <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-2 text-sm hover:text-white transition">
                  <Mail className="h-4 w-4" />
                  {CONTACT_INFO.email}
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 MemoryVerse AI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
