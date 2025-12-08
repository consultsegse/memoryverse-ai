import type { Notification } from "../drizzle/schema";

/**
 * Serviço de envio de emails para notificações
 * 
 * NOTA: Este é um serviço de exemplo que demonstra a estrutura.
 * Para produção, integre com um provedor real como:
 * - SendGrid
 * - AWS SES
 * - Mailgun
 * - Resend
 * - Postmark
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * Gera template de email baseado na notificação
 */
export function generateEmailTemplate(notification: Notification, userName: string): EmailTemplate {
  const baseUrl = process.env.VITE_APP_URL || "https://memoryverse.ai";
  
  const templates: Record<string, EmailTemplate> = {
    memory_completed: {
      subject: `✨ ${notification.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
            img { max-width: 100%; height: auto; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Sua memória está pronta!</h1>
            </div>
            <div class="content">
              <p>Olá ${userName},</p>
              <p>${notification.message}</p>
              ${notification.imageUrl ? `<img src="${notification.imageUrl}" alt="Preview da memória">` : ""}
              <p style="text-align: center;">
                <a href="${baseUrl}${notification.actionUrl || notification.link}" class="button">
                  ${notification.actionLabel || "Ver Memória"}
                </a>
              </p>
            </div>
            <div class="footer">
              <p>MemoryVerse AI - Transformando memórias em arte</p>
              <p><a href="${baseUrl}/settings/notifications">Gerenciar preferências de email</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `${notification.title}\n\n${notification.message}\n\nVer memória: ${baseUrl}${notification.actionUrl || notification.link}`,
    },
    
    payment_success: {
      subject: `✅ ${notification.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Pagamento Confirmado</h1>
            </div>
            <div class="content">
              <p>Olá ${userName},</p>
              <p>${notification.message}</p>
              <p style="text-align: center;">
                <a href="${baseUrl}/dashboard" class="button">Acessar Dashboard</a>
              </p>
            </div>
            <div class="footer">
              <p>MemoryVerse AI</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `${notification.title}\n\n${notification.message}`,
    },
    
    welcome: {
      subject: `🎉 Bem-vindo ao MemoryVerse AI!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .feature { padding: 15px; margin: 10px 0; background: #f9fafb; border-left: 4px solid #667eea; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Bem-vindo ao MemoryVerse AI!</h1>
              <p>Transforme suas memórias em arte com inteligência artificial</p>
            </div>
            <div class="content">
              <p>Olá ${userName},</p>
              <p>Estamos muito felizes em ter você conosco! Você está prestes a descobrir uma nova forma de eternizar suas memórias.</p>
              
              <h3>O que você pode fazer:</h3>
              <div class="feature">
                <strong>🎥 Vídeos Cinematográficos</strong><br>
                Transforme suas histórias em vídeos emocionantes com trilha sonora
              </div>
              <div class="feature">
                <strong>🎵 Músicas Personalizadas</strong><br>
                Crie canções únicas sobre suas memórias
              </div>
              <div class="feature">
                <strong>📚 Livros Ilustrados</strong><br>
                Gere livros digitais com ilustrações profissionais
              </div>
              <div class="feature">
                <strong>🎙️ Podcasts Narrativos</strong><br>
                Produza episódios narrados profissionalmente
              </div>
              
              <p><strong>Você tem 3 memórias grátis para começar!</strong></p>
              
              <p style="text-align: center;">
                <a href="${baseUrl}/dashboard" class="button">Criar Minha Primeira Memória</a>
              </p>
            </div>
            <div class="footer">
              <p>MemoryVerse AI - Suas histórias merecem ser eternas</p>
              <p><a href="${baseUrl}/settings/notifications">Gerenciar preferências de email</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Bem-vindo ao MemoryVerse AI!\n\n${notification.message}\n\nComeçar: ${baseUrl}/dashboard`,
    },
  };

  // Use template específico ou template genérico
  return templates[notification.type] || {
    subject: notification.title,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #667eea; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${notification.title}</h1>
          </div>
          <div class="content">
            <p>Olá ${userName},</p>
            <p>${notification.message}</p>
            ${notification.actionUrl ? `
              <p style="text-align: center;">
                <a href="${baseUrl}${notification.actionUrl}" class="button">
                  ${notification.actionLabel || "Ver Detalhes"}
                </a>
              </p>
            ` : ""}
          </div>
          <div class="footer">
            <p>MemoryVerse AI</p>
            <p><a href="${baseUrl}/settings/notifications">Gerenciar preferências de email</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `${notification.title}\n\n${notification.message}`,
  };
}

/**
 * Envia email de notificação
 * 
 * IMPLEMENTAÇÃO DE EXEMPLO - Substitua por provedor real em produção
 */
export async function sendNotificationEmail(
  to: string,
  notification: Notification,
  userName: string
): Promise<boolean> {
  try {
    const template = generateEmailTemplate(notification, userName);
    
    // TODO: Integrar com provedor de email real
    // Exemplo com SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({
    //   to,
    //   from: 'noreply@memoryverse.ai',
    //   subject: template.subject,
    //   text: template.text,
    //   html: template.html,
    // });
    
    // Por enquanto, apenas loga (para desenvolvimento)
    console.log(`[Email] Would send to ${to}:`, {
      subject: template.subject,
      preview: template.text.substring(0, 100),
    });
    
    return true;
  } catch (error) {
    console.error("[Email] Failed to send notification email:", error);
    return false;
  }
}

/**
 * Processa fila de emails pendentes
 */
export async function processEmailQueue() {
  const { getUnsentEmailNotifications, markNotificationEmailSent } = await import("./db");
  const { getUserByOpenId } = await import("./db");
  
  try {
    const pendingNotifications = await getUnsentEmailNotifications();
    
    for (const notification of pendingNotifications) {
      // Buscar dados do usuário
      // TODO: Melhorar query para buscar por ID diretamente
      const user = await getUserByOpenId(notification.userId.toString());
      
      if (!user?.email) {
        console.warn(`[Email] User ${notification.userId} has no email`);
        continue;
      }
      
      const sent = await sendNotificationEmail(
        user.email,
        notification,
        user.name || "Usuário"
      );
      
      if (sent) {
        await markNotificationEmailSent(notification.id);
      }
    }
    
    return { processed: pendingNotifications.length };
  } catch (error) {
    console.error("[Email] Error processing email queue:", error);
    return { processed: 0, error };
  }
}
