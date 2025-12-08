/**
 * Informações de redes sociais e contato do MemoryVerse AI
 */

export const SOCIAL_MEDIA = {
  instagram: {
    username: "memoryverseai",
    url: "https://instagram.com/memoryverseai",
    displayName: "@memoryverseai",
  },
  tiktok: {
    username: "memoryverseai",
    url: "https://tiktok.com/@memoryverseai",
    displayName: "@memoryverseai",
  },
  youtube: {
    username: "mymemoryverseai",
    url: "https://youtube.com/@mymemoryverseai",
    displayName: "@mymemoryverseai",
  },
  facebook: {
    url: "https://facebook.com/memoryverseai",
    displayName: "MemoryVerse AI",
  },
  twitter: {
    username: "memoryverseai",
    url: "https://twitter.com/memoryverseai",
    displayName: "@memoryverseai",
  },
  linkedin: {
    url: "https://linkedin.com/company/memoryverseai",
    displayName: "MemoryVerse AI",
  },
} as const;

export const CONTACT_INFO = {
  email: "contato@memoryverse.com.br",
  supportEmail: "suporte@memoryverse.com.br",
  businessEmail: "negocios@memoryverse.com.br",
  website: "https://memoryverse.com.br",
} as const;

export const COMPANY_INFO = {
  name: "MemoryVerse AI",
  tagline: "Transforme suas memórias em arte com inteligência artificial",
  description: "Plataforma de IA que transforma suas histórias e memórias em vídeos cinematográficos, músicas personalizadas, livros ilustrados e podcasts narrativos.",
  foundedYear: 2024,
  country: "Brasil",
} as const;

/**
 * Gera URL de compartilhamento para diferentes plataformas
 */
export function generateShareUrl(platform: "facebook" | "twitter" | "whatsapp" | "telegram" | "linkedin", params: {
  url: string;
  title?: string;
  text?: string;
  hashtags?: string[];
}): string {
  const encodedUrl = encodeURIComponent(params.url);
  const encodedTitle = encodeURIComponent(params.title || "");
  const encodedText = encodeURIComponent(params.text || "");
  const hashtags = params.hashtags?.join(",") || "";

  const urls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}&hashtags=${hashtags}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  return urls[platform];
}

/**
 * Hashtags padrão do MemoryVerse AI
 */
export const DEFAULT_HASHTAGS = [
  "MemoryVerseAI",
  "InteligenciaArtificial",
  "Memorias",
  "IA",
  "VideoIA",
  "MusicaIA",
] as const;
