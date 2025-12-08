import OpenAI from "openai";
import { ElevenLabsClient } from "elevenlabs";
import { storagePut } from "../storage";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

interface ProcessMemoryResult {
  videoUrl?: string;
  musicUrl?: string;
  bookUrl?: string;
  podcastUrl?: string;
  thumbnailUrl?: string;
  status: "completed" | "failed";
  error?: string;
}

/**
 * Processa uma memória usando APIs de IA
 */
export async function processMemory(
  memoryId: number,
  story: string,
  format: "video" | "music" | "book" | "podcast"
): Promise<ProcessMemoryResult> {
  try {
    console.log(`[MemoryProcessor] Processing memory ${memoryId} as ${format}`);

    switch (format) {
      case "video":
        return await processVideo(memoryId, story);
      case "music":
        return await processMusic(memoryId, story);
      case "book":
        return await processBook(memoryId, story);
      case "podcast":
        return await processPodcast(memoryId, story);
      default:
        throw new Error(`Unknown format: ${format}`);
    }
  } catch (error: any) {
    console.error(`[MemoryProcessor] Error processing memory ${memoryId}:`, error);
    return {
      status: "failed",
      error: error.message || "Unknown error",
    };
  }
}

/**
 * Processa vídeo: gera roteiro, cenas e thumbnail
 */
async function processVideo(memoryId: number, story: string): Promise<ProcessMemoryResult> {
  console.log(`[Video] Generating script for memory ${memoryId}`);

  // MOCK MODE: If no OpenAI Key, return mock data
  if (!process.env.OPENAI_API_KEY) {
    console.log("[Mock] No OpenAI Key. Using mock video generation.");
    const { generateImage } = await import("../_core/imageGeneration");
    const { url: thumbnailUrl } = await generateImage({ prompt: story });

    return {
      videoUrl: thumbnailUrl, // Mocking video with image for now
      thumbnailUrl,
      status: "completed",
    };
  }

  // 1. Gerar roteiro cinematográfico
  const scriptCompletion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Você é um roteirista profissional especializado em transformar histórias pessoais em roteiros cinematográficos emocionantes. Crie um roteiro com 5-8 cenas detalhadas.",
      },
      {
        role: "user",
        content: `História: ${story}\n\nCrie um roteiro cinematográfico emocionante com cenas visuais detalhadas.`,
      },
    ],
    temperature: 0.8,
    max_tokens: 1500,
  });

  const script = scriptCompletion.choices[0].message.content || "";

  // 2. Gerar cenas com DALL-E
  console.log(`[Video] Generating scenes for memory ${memoryId}`);

  const scenesCompletion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: 'Você é um diretor de cinema. Crie 5 cenas visuais em formato JSON: {"scenes": [{"number": 1, "description": "...", "prompt": "..."}]}',
      },
      {
        role: "user",
        content: `Roteiro: ${script}\n\nCrie 5 cenas visuais detalhadas com prompts para DALL-E.`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const scenesData = JSON.parse(scenesCompletion.choices[0].message.content || "{}");
  const scenes = scenesData.scenes || [];

  // 3. Gerar thumbnail (primeira cena)
  let thumbnailUrl: string | undefined;

  if (scenes.length > 0) {
    console.log(`[Video] Generating thumbnail for memory ${memoryId}`);

    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: scenes[0].prompt + ". Cinematic, 4K, professional photography, dramatic lighting, wide angle",
      size: "1792x1024",
      quality: "hd",
      style: "vivid",
    });

    thumbnailUrl = imageResponse.data?.[0]?.url;
  }

  // 4. TODO: Gerar narração com ElevenLabs
  // 5. TODO: Compilar vídeo com Runway ML (via n8n)

  return {
    videoUrl: undefined, // Será gerado pelo n8n
    thumbnailUrl,
    status: "completed",
  };
}

/**
 * Processa música: gera composição musical
 */
async function processMusic(memoryId: number, story: string): Promise<ProcessMemoryResult> {
  console.log(`[Music] Generating music for memory ${memoryId}`);

  // MOCK MODE
  if (!process.env.OPENAI_API_KEY) {
    console.log("[Mock] No OpenAI Key. Using mock music generation.");
    const { generateImage } = await import("../_core/imageGeneration");
    const { url: thumbnailUrl } = await generateImage({ prompt: "Music Cover: " + story });
    // Use fallback music url
    return {
      musicUrl: "https://example.com/music/generic-pop.mp3",
      thumbnailUrl,
      status: "completed",
    };
  }

  // 1. Gerar prompt musical com GPT-4
  const musicPromptCompletion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Você é um compositor musical. Crie um prompt detalhado para geração de música baseado na história.",
      },
      {
        role: "user",
        content: `História: ${story}\n\nCrie um prompt musical detalhado (gênero, instrumentos, emoção, ritmo).`,
      },
    ],
    max_tokens: 300,
  });

  const musicPrompt = musicPromptCompletion.choices[0].message.content || story;

  // 2. Gerar thumbnail (capa do álbum)
  console.log(`[Music] Generating album cover for memory ${memoryId}`);

  const coverResponse = await openai.images.generate({
    model: "dall-e-3",
    prompt: `Album cover art for: ${musicPrompt}. Professional music album cover, artistic, high quality`,
    size: "1024x1024",
    quality: "hd",
    style: "vivid",
  });

  const thumbnailUrl = coverResponse.data?.[0]?.url;

  // 3. Gerar música com Suno AI
  console.log(`[Music] Generating music with Suno AI for memory ${memoryId}`);

  const { generateMusic } = await import("../integrations/suno");
  const musicResult = await generateMusic({
    prompt: musicPrompt,
    duration: 180,
    style: "pop", // TODO: Detectar estilo da história
  });

  let musicUrl: string | undefined;

  if (musicResult.success && musicResult.audioUrl) {
    musicUrl = musicResult.audioUrl;
  } else {
    console.warn(`[Music] Suno AI failed, using fallback`);
    // Fallback: música genérica
    const { getMusicFallback } = await import("../integrations/suno");
    const fallback = getMusicFallback("pop");
    musicUrl = fallback.audioUrl;
  }

  return {
    musicUrl,
    thumbnailUrl,
    status: "completed",
  };
}

/**
 * Processa livro: gera texto e ilustrações
 */
async function processBook(memoryId: number, story: string): Promise<ProcessMemoryResult> {
  console.log(`[Book] Generating book for memory ${memoryId}`);

  // MOCK MODE
  if (!process.env.OPENAI_API_KEY) {
    console.log("[Mock] No OpenAI Key. Using mock book generation.");
    const { generateImage } = await import("../_core/imageGeneration");
    const { url: thumbnailUrl } = await generateImage({ prompt: "Book Cover: " + story });

    // Generate a mock PDF using simple PDF generator (if valid) or just placeholder
    // For simplicity, we assume generateSimplePDF can run without AI if we pass hardcoded content
    const { generateBookPDF } = await import("../integrations/pdfGenerator");
    const pdf = await generateBookPDF(memoryId, {
      title: "Mock Book",
      chapters: [{ title: "Chapter 1", content: story }]
    });

    return {
      bookUrl: pdf.pdfUrl,
      thumbnailUrl,
      status: pdf.success ? "completed" : "failed",
    };
  }

  // 1. Expandir história em capítulos
  const bookCompletion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Você é um escritor profissional. Transforme a história em um livro com 3-5 capítulos bem desenvolvidos.",
      },
      {
        role: "user",
        content: `História: ${story}\n\nCrie um livro emocionante com capítulos bem desenvolvidos.`,
      },
    ],
    temperature: 0.8,
    max_tokens: 2000,
  });

  const bookText = bookCompletion.choices[0].message.content || "";

  // 2. Gerar ilustração de capa
  console.log(`[Book] Generating book cover for memory ${memoryId}`);

  const coverResponse = await openai.images.generate({
    model: "dall-e-3",
    prompt: `Book cover illustration for: ${story.substring(0, 200)}. Professional book cover art, artistic, high quality`,
    size: "1024x1792",
    quality: "hd",
    style: "vivid",
  });

  const thumbnailUrl = coverResponse.data?.[0]?.url;

  // 3. Gerar PDF do livro
  console.log(`[Book] Generating PDF for memory ${memoryId}`);

  const { generateBookPDF } = await import("../integrations/pdfGenerator");

  // Extrair capítulos do texto gerado
  const chapters = extractChaptersFromText(bookText);

  const pdfResult = await generateBookPDF(memoryId, {
    title: story.substring(0, 100),
    author: "MemoryVerse AI",
    chapters,
    coverImageUrl: thumbnailUrl,
  });

  let bookUrl: string | undefined;

  if (pdfResult.success && pdfResult.pdfUrl) {
    bookUrl = pdfResult.pdfUrl;
  } else {
    console.warn(`[Book] PDF generation failed: ${pdfResult.error}`);
  }

  return {
    bookUrl,
    thumbnailUrl,
    status: bookUrl ? "completed" : "failed",
  };
}

/**
 * Processa podcast: gera roteiro e narração
 */
async function processPodcast(memoryId: number, story: string): Promise<ProcessMemoryResult> {
  console.log(`[Podcast] Generating podcast for memory ${memoryId}`);

  // MOCK MODE
  if (!process.env.OPENAI_API_KEY) {
    console.log("[Mock] No OpenAI Key. Using mock podcast generation.");
    const { generateImage } = await import("../_core/imageGeneration");
    const { url: thumbnailUrl } = await generateImage({ prompt: "Podcast Cover: " + story });

    return {
      podcastUrl: "https://example.com/music/generic-podcast.mp3",
      thumbnailUrl,
      status: "completed",
    };
  }

  // 1. Gerar roteiro de podcast
  const scriptCompletion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Você é um roteirista de podcast. Transforme a história em um roteiro de podcast envolvente com introdução, desenvolvimento e conclusão.",
      },
      {
        role: "user",
        content: `História: ${story}\n\nCrie um roteiro de podcast profissional e envolvente.`,
      },
    ],
    temperature: 0.8,
    max_tokens: 1500,
  });

  const script = scriptCompletion.choices[0].message.content || "";

  // 2. Gerar narração com ElevenLabs
  console.log(`[Podcast] Generating narration for memory ${memoryId}`);

  try {
    const audio = await elevenlabs.textToSpeech.convert(
      process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM",
      {
        model_id: "eleven_multilingual_v2",
        text: script,
        output_format: "mp3_44100_128",
      }
    );

    // Converter stream para buffer
    const chunks: Buffer[] = [];
    for await (const chunk of audio) {
      chunks.push(Buffer.from(chunk));
    }
    const audioBuffer = Buffer.concat(chunks);

    // Upload para S3
    const audioKey = `memories/${memoryId}/podcast.mp3`;
    const { url: podcastUrl } = await storagePut(audioKey, audioBuffer, "audio/mpeg");

    // 3. Gerar thumbnail (capa do podcast)
    console.log(`[Podcast] Generating podcast cover for memory ${memoryId}`);

    const coverResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Podcast cover art for: ${story.substring(0, 200)}. Professional podcast artwork, modern, high quality`,
      size: "1024x1024",
      quality: "hd",
      style: "vivid",
    });

    const thumbnailUrl = coverResponse.data?.[0]?.url;

    return {
      podcastUrl,
      thumbnailUrl,
      status: "completed",
    };
  } catch (error: any) {
    console.error(`[Podcast] ElevenLabs error:`, error);

    // Fallback: apenas gerar thumbnail se ElevenLabs falhar
    const coverResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Podcast cover art for: ${story.substring(0, 200)}. Professional podcast artwork, modern, high quality`,
      size: "1024x1024",
      quality: "hd",
      style: "vivid",
    });

    return {
      podcastUrl: undefined,
      thumbnailUrl: coverResponse.data?.[0]?.url,
      status: "completed",
    };
  }
}

/**
 * Extrai capítulos do texto do livro
 */
function extractChaptersFromText(text: string): Array<{ title: string; content: string }> {
  // Tentar detectar capítulos por padrões comuns
  const chapterPatterns = [
    /Capítulo \d+[:\-]?\s*([^\n]+)\n([\s\S]+?)(?=Capítulo \d+|$)/gi,
    /Chapter \d+[:\-]?\s*([^\n]+)\n([\s\S]+?)(?=Chapter \d+|$)/gi,
    /\n\n([^\n]{10,50})\n\n([\s\S]+?)(?=\n\n[^\n]{10,50}\n\n|$)/g,
  ];

  for (const pattern of chapterPatterns) {
    const matches = Array.from(text.matchAll(pattern));
    if (matches.length > 0) {
      return matches.map(match => ({
        title: match[1].trim(),
        content: match[2].trim(),
      }));
    }
  }

  // Fallback: dividir em parágrafos e agrupar
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  const chaptersPerGroup = Math.ceil(paragraphs.length / 3);

  const chapters: Array<{ title: string; content: string }> = [];
  for (let i = 0; i < 3; i++) {
    const start = i * chaptersPerGroup;
    const end = Math.min(start + chaptersPerGroup, paragraphs.length);
    const content = paragraphs.slice(start, end).join('\n\n');

    if (content.trim()) {
      chapters.push({
        title: `Parte ${i + 1}`,
        content,
      });
    }
  }

  return chapters;
}

/**
 * Processa memória em background (chamado após criar no banco)
 */
export async function queueMemoryProcessing(memoryId: number, story: string, format: "video" | "music" | "book" | "podcast") {
  // Processar em background sem bloquear
  setTimeout(async () => {
    try {
      const result = await processMemory(memoryId, story, format);

      // Atualizar banco de dados
      const { getDb } = await import("../db");
      const db = await getDb();
      if (!db) {
        console.error(`[MemoryProcessor] Database not available for memory ${memoryId}`);
        return;
      }

      const { memories } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");

      await db.update(memories)
        .set({
          status: result.status,
          videoUrl: result.videoUrl,
          musicUrl: result.musicUrl,
          bookUrl: result.bookUrl,
          podcastUrl: result.podcastUrl,
          thumbnailUrl: result.thumbnailUrl,
        })
        .where(eq(memories.id, memoryId));

      // Criar notificação de conclusão
      if (result.status === "completed") {
        const { createNotification } = await import("../db");
        const [memory] = await db.select().from(memories).where(eq(memories.id, memoryId));

        await createNotification({
          userId: memory.userId,
          type: "memory_completed",
          title: "✨ Sua memória está pronta!",
          message: `Sua memória foi transformada em ${format} com sucesso! Clique para visualizar.`,
          link: `/my-memories/${memoryId}`,
          imageUrl: result.thumbnailUrl,
          actionUrl: `/my-memories/${memoryId}`,
          actionLabel: "Ver Memória",
          priority: "high",
          isRead: false,
        });
      } else {
        const { createNotification } = await import("../db");
        const [memory] = await db.select().from(memories).where(eq(memories.id, memoryId));

        await createNotification({
          userId: memory.userId,
          type: "memory_failed",
          title: "❌ Falha ao processar memória",
          message: `Não conseguimos processar sua memória. Erro: ${result.error}`,
          link: "/dashboard",
          priority: "urgent",
          isRead: false,
        });
      }

      console.log(`[MemoryProcessor] Memory ${memoryId} processed: ${result.status}`);
    } catch (error) {
      console.error(`[MemoryProcessor] Fatal error processing memory ${memoryId}:`, error);
    }
  }, 1000); // Delay de 1 segundo para não bloquear resposta HTTP
}
