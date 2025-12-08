import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NotificationCenter } from "@/components/NotificationCenter";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Link } from "wouter";
import {
  Sparkles,
  Plus,
  Video,
  Music,
  BookOpen,
  Mic,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Heart,
  Share2,
  Download,
  LogOut
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "date-fns";
import { ptBR, enUS, es, zhCN, ja } from "date-fns/locale";
import { useTranslation } from 'react-i18next';

const formatIcons = {
  video: Video,
  music: Music,
  book: BookOpen,
  podcast: Mic,
  animation: Video,
  nft: Sparkles,
};

export default function MyMemories() {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const { data: memories = [], isLoading } = trpc.memories.list.useQuery();

  const statusConfig = {
    processing: {
      label: t('memories.status.processing'),
      icon: Clock,
      color: "bg-blue-100 text-blue-700",
    },
    completed: {
      label: t('memories.status.completed'),
      icon: CheckCircle2,
      color: "bg-green-100 text-green-700",
    },
    failed: {
      label: t('memories.status.failed'),
      icon: XCircle,
      color: "bg-red-100 text-red-700",
    },
  };

  // Map i18n language to date-fns locale
  const getDateLocale = () => {
    const localeMap: Record<string, typeof ptBR> = {
      pt: ptBR,
      en: enUS,
      es: es,
      zh: zhCN,
      ja: ja,
    };
    return localeMap[i18n.language] || enUS;
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
                {t('common.appName')}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            <NotificationCenter />
            <Link href="/dashboard">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('nav.newMemory')}
              </Button>
            </Link>
            <Button variant="ghost" onClick={() => logout()}>
              <LogOut className="h-4 w-4 mr-2" />
              {t('common.logout')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {t('memories.title')} <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{t('memories.titleHighlight')}</span>
          </h1>
          <p className="text-gray-600">
            {t('memories.count', { count: memories.length })}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && memories.length === 0 && (
          <Card className="max-w-2xl mx-auto text-center p-12">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-purple-600" />
            <h2 className="text-2xl font-bold mb-2">{t('memories.empty')}</h2>
            <p className="text-gray-600 mb-6">
              {t('memories.emptyDesc')}
            </p>
            <Link href="/dashboard">
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                {t('memories.createFirst')}
              </Button>
            </Link>
          </Card>
        )}

        {/* Memories Grid */}
        {!isLoading && memories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((memory) => {
              const FormatIcon = formatIcons[memory.format as keyof typeof formatIcons] || Video;
              const statusInfo = statusConfig[memory.status as keyof typeof statusConfig] || statusConfig.processing;
              const StatusIcon = statusInfo.icon;

              return (
                <Card key={memory.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 relative">
                    {memory.thumbnailUrl ? (
                      <img
                        src={memory.thumbnailUrl}
                        alt={memory.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FormatIcon className="h-16 w-16 text-purple-600 opacity-50" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-4">
                    {/* Format Badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <FormatIcon className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium capitalize">{memory.format}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {memory.title}
                    </h3>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {memory.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {memory.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" />
                        {memory.shares}
                      </div>
                    </div>

                    {/* Date */}
                    <p className="text-xs text-gray-500 mb-3">
                      {t('memories.createdAgo', {
                        time: formatDistanceToNow(new Date(memory.createdAt), {
                          addSuffix: true,
                          locale: getDateLocale()
                        })
                      })}
                    </p>

                    {/* Actions */}
                    {memory.status === "completed" && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          {t('memories.view')}
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="h-4 w-4 mr-1" />
                          {t('memories.download')}
                        </Button>
                      </div>
                    )}

                    {memory.status === "processing" && (
                      <Button size="sm" variant="outline" className="w-full" disabled>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        {t('memories.processing')}
                      </Button>
                    )}

                    {memory.status === "failed" && (
                      <Button size="sm" variant="outline" className="w-full text-red-600">
                        <XCircle className="h-4 w-4 mr-2" />
                        {t('memories.tryAgain')}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
