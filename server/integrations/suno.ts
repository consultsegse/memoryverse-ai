/**
 * Integração com Suno AI para geração de música
 * 
 * Suno AI não tem API pública oficial, então usamos abordagens alternativas:
 * 1. API não-oficial (se disponível)
 * 2. Webhook via n8n (recomendado para produção)
 * 3. Fallback para música genérica
 */

interface SunoGenerateOptions {
  prompt: string;
  duration?: number; // segundos
  style?: string;
  instrumental?: boolean;
}

interface SunoGenerateResult {
  success: boolean;
  audioUrl?: string;
  jobId?: string;
  error?: string;
}

/**
 * Gera música usando Suno AI
 * 
 * NOTA: Como Suno não tem API pública, esta implementação usa webhook via n8n.
 * Configure o webhook n8n que chama a API do Suno e retorna a URL do áudio.
 */
export async function generateMusic(options: SunoGenerateOptions): Promise<SunoGenerateResult> {
  const { prompt, duration = 180, style, instrumental = false } = options;
  
  try {
    // Verificar se webhook está configurado
    const webhookUrl = process.env.SUNO_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn('[Suno] SUNO_WEBHOOK_URL not configured, using fallback');
      return {
        success: false,
        error: 'Suno AI webhook not configured',
      };
    }
    
    // Chamar webhook n8n que processa com Suno
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.N8N_WEBHOOK_TOKEN || ''}`,
      },
      body: JSON.stringify({
        prompt,
        duration,
        style,
        instrumental,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Suno webhook failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      audioUrl: data.audioUrl,
      jobId: data.jobId,
    };
  } catch (error: any) {
    console.error('[Suno] Error generating music:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Verifica status de geração de música (para processos assíncronos)
 */
export async function checkMusicStatus(jobId: string): Promise<SunoGenerateResult> {
  try {
    const webhookUrl = process.env.SUNO_STATUS_WEBHOOK_URL;
    
    if (!webhookUrl) {
      return {
        success: false,
        error: 'Suno status webhook not configured',
      };
    }
    
    const response = await fetch(`${webhookUrl}?jobId=${jobId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.N8N_WEBHOOK_TOKEN || ''}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Status check failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      success: data.status === 'completed',
      audioUrl: data.audioUrl,
      jobId,
    };
  } catch (error: any) {
    console.error('[Suno] Error checking status:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Gera música usando API não-oficial do Suno (alternativa)
 * 
 * AVISO: APIs não-oficiais podem parar de funcionar a qualquer momento.
 * Use apenas para desenvolvimento/testes.
 */
export async function generateMusicUnofficialAPI(options: SunoGenerateOptions): Promise<SunoGenerateResult> {
  const { prompt, style } = options;
  
  try {
    // Exemplo de API não-oficial (ajustar conforme API disponível)
    const apiUrl = process.env.SUNO_UNOFFICIAL_API_URL;
    const apiKey = process.env.SUNO_UNOFFICIAL_API_KEY;
    
    if (!apiUrl || !apiKey) {
      return {
        success: false,
        error: 'Unofficial API not configured',
      };
    }
    
    const response = await fetch(`${apiUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        style,
        make_instrumental: options.instrumental,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      audioUrl: data.audio_url,
      jobId: data.id,
    };
  } catch (error: any) {
    console.error('[Suno] Unofficial API error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Fallback: Retorna URL de música genérica quando Suno não está disponível
 * 
 * Em produção, você pode:
 * 1. Usar biblioteca de músicas royalty-free
 * 2. Gerar música com outra IA (ex: MusicGen do Meta)
 * 3. Retornar erro e pedir ao usuário para tentar novamente
 */
export function getMusicFallback(style?: string): SunoGenerateResult {
  // Biblioteca de músicas genéricas por estilo
  const fallbackMusic: Record<string, string> = {
    pop: 'https://example.com/music/generic-pop.mp3',
    rock: 'https://example.com/music/generic-rock.mp3',
    acoustic: 'https://example.com/music/generic-acoustic.mp3',
    electronic: 'https://example.com/music/generic-electronic.mp3',
    classical: 'https://example.com/music/generic-classical.mp3',
    jazz: 'https://example.com/music/generic-jazz.mp3',
    default: 'https://example.com/music/generic-default.mp3',
  };
  
  const audioUrl = fallbackMusic[style?.toLowerCase() || 'default'] || fallbackMusic.default;
  
  return {
    success: true,
    audioUrl,
  };
}
