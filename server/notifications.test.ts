import { describe, it, expect, beforeAll } from "vitest";
import { createNotificationFromTemplate, shouldSendNotification } from "./notificationTemplates";
import { generateEmailTemplate } from "./emailService";

describe("Sistema de Notificações Personalizadas", () => {
  describe("Templates de Notificação", () => {
    it("deve criar notificação de boas-vindas", () => {
      const notification = createNotificationFromTemplate("welcome", 1, {
        userName: "João Silva",
      });

      expect(notification.type).toBe("welcome");
      expect(notification.userId).toBe(1);
      expect(notification.title).toContain("Bem-vindo");
      expect(notification.message).toContain("3 memórias grátis");
      expect(notification.priority).toBe("high");
      expect(notification.actionUrl).toBe("/dashboard");
      expect(notification.actionLabel).toBe("Criar Primeira Memória");
    });

    it("deve criar notificação de memória concluída", () => {
      const notification = createNotificationFromTemplate("memory_completed", 1, {
        memoryTitle: "Minha Memória Especial",
        memoryId: 42,
        memoryFormat: "vídeo",
        thumbnailUrl: "https://example.com/thumb.jpg",
      });

      expect(notification.type).toBe("memory_completed");
      expect(notification.title).toContain("memória está pronta");
      expect(notification.message).toContain("Minha Memória Especial");
      expect(notification.message).toContain("vídeo");
      expect(notification.link).toBe("/my-memories/42");
      expect(notification.imageUrl).toBe("https://example.com/thumb.jpg");
      expect(notification.priority).toBe("high");
    });

    it("deve criar notificação de erro com prioridade urgente", () => {
      const notification = createNotificationFromTemplate("memory_failed", 1, {
        memoryTitle: "Memória com Problema",
      });

      expect(notification.type).toBe("memory_failed");
      expect(notification.priority).toBe("urgent");
      expect(notification.title).toContain("Erro");
      expect(notification.actionLabel).toBe("Tentar Novamente");
    });

    it("deve criar notificação de curtida com prioridade baixa", () => {
      const notification = createNotificationFromTemplate("new_like", 1, {
        memoryTitle: "Minha Memória",
        memoryId: 10,
        likeCount: 42,
      });

      expect(notification.type).toBe("new_like");
      expect(notification.priority).toBe("low");
      expect(notification.message).toContain("42 curtidas");
    });

    it("deve criar notificação de marco alcançado", () => {
      const notification = createNotificationFromTemplate("milestone", 1, {
        milestoneType: "memórias",
        milestoneValue: 10,
      });

      expect(notification.type).toBe("milestone");
      expect(notification.title).toContain("10");
      expect(notification.title).toContain("memórias");
      expect(notification.priority).toBe("normal");
    });

    it("deve criar notificação de promoção", () => {
      const notification = createNotificationFromTemplate("promotion", 1, {
        promotionTitle: "Black Friday",
        promotionDiscount: "50%",
      });

      expect(notification.type).toBe("promotion");
      expect(notification.title).toContain("Black Friday");
      expect(notification.message).toContain("50%");
      expect(notification.link).toBe("/pricing");
    });

    it("deve criar notificação de pagamento confirmado", () => {
      const notification = createNotificationFromTemplate("payment_success", 1, {
        amount: "R$ 97,00",
      });

      expect(notification.type).toBe("payment_success");
      expect(notification.priority).toBe("high");
      expect(notification.message).toContain("R$ 97,00");
    });
  });

  describe("Preferências de Notificação", () => {
    it("deve respeitar preferências de email para memória concluída", () => {
      const prefs = {
        emailMemoryCompleted: true,
        pushMemoryCompleted: true,
      };

      const result = shouldSendNotification("memory_completed", prefs);

      expect(result.inApp).toBe(true);
      expect(result.email).toBe(true);
    });

    it("deve desabilitar email quando preferência é false", () => {
      const prefs = {
        emailMemoryCompleted: false,
        pushMemoryCompleted: true,
      };

      const result = shouldSendNotification("memory_completed", prefs);

      expect(result.inApp).toBe(true);
      expect(result.email).toBe(false);
    });

    it("deve desabilitar notificação in-app quando preferência é false", () => {
      const prefs = {
        emailNewLike: false,
        pushNewLike: false,
      };

      const result = shouldSendNotification("new_like", prefs);

      expect(result.inApp).toBe(false);
      expect(result.email).toBe(false);
    });

    it("deve sempre enviar notificações de sistema", () => {
      const prefs = {};

      const result = shouldSendNotification("system", prefs);

      expect(result.inApp).toBe(true);
      expect(result.email).toBe(false);
    });
  });

  describe("Templates de Email", () => {
    it("deve gerar template HTML para boas-vindas", () => {
      const notification = createNotificationFromTemplate("welcome", 1, {
        userName: "Maria",
      });

      const template = generateEmailTemplate(notification as any, "Maria");

      expect(template.subject).toContain("Bem-vindo");
      expect(template.html).toContain("Maria");
      expect(template.html).toContain("3 memórias grátis");
      expect(template.html).toContain("<!DOCTYPE html>");
      expect(template.text).toContain("Bem-vindo");
    });

    it("deve gerar template HTML para memória concluída", () => {
      const notification = createNotificationFromTemplate("memory_completed", 1, {
        memoryTitle: "Viagem à Praia",
        memoryId: 5,
        memoryFormat: "vídeo",
        thumbnailUrl: "https://example.com/thumb.jpg",
      });

      const template = generateEmailTemplate(notification as any, "Pedro");

      expect(template.subject).toContain("memória está pronta");
      expect(template.html).toContain("Pedro");
      expect(template.html).toContain("Viagem à Praia");
      expect(template.html).toContain("https://example.com/thumb.jpg");
      expect(template.html).toContain("Ver Memória");
    });

    it("deve gerar template HTML para pagamento confirmado", () => {
      const notification = createNotificationFromTemplate("payment_success", 1, {
        amount: "R$ 297,00",
      });

      const template = generateEmailTemplate(notification as any, "Ana");

      expect(template.subject).toContain("Pagamento");
      expect(template.html).toContain("R$ 297,00");
      expect(template.html).toContain("Acessar Dashboard");
      expect(template.html).toContain("#10b981"); // Verde para sucesso
    });

    it("deve incluir link de gerenciar preferências em todos os emails", () => {
      const notification = createNotificationFromTemplate("welcome", 1, {});
      const template = generateEmailTemplate(notification as any, "Usuário");

      expect(template.html).toContain("Gerenciar preferências");
      expect(template.html).toContain("/settings/notifications");
    });
  });

  describe("Campos Avançados", () => {
    it("deve incluir todos os campos necessários para notificação rica", () => {
      const notification = createNotificationFromTemplate("memory_completed", 1, {
        memoryTitle: "Teste",
        memoryId: 1,
        memoryFormat: "vídeo",
        thumbnailUrl: "https://example.com/img.jpg",
      });

      // Campos básicos
      expect(notification).toHaveProperty("userId");
      expect(notification).toHaveProperty("type");
      expect(notification).toHaveProperty("title");
      expect(notification).toHaveProperty("message");

      // Campos avançados
      expect(notification).toHaveProperty("imageUrl");
      expect(notification).toHaveProperty("actionUrl");
      expect(notification).toHaveProperty("actionLabel");
      expect(notification).toHaveProperty("priority");
      expect(notification).toHaveProperty("link");

      // Campos de controle
      expect(notification).toHaveProperty("isRead");
      expect(notification).toHaveProperty("emailSent");
    });

    it("deve ter prioridades válidas", () => {
      const priorities = ["low", "normal", "high", "urgent"];
      
      const low = createNotificationFromTemplate("new_like", 1, {});
      const normal = createNotificationFromTemplate("milestone", 1, {});
      const high = createNotificationFromTemplate("memory_completed", 1, {});
      const urgent = createNotificationFromTemplate("memory_failed", 1, {});

      expect(priorities).toContain(low.priority);
      expect(priorities).toContain(normal.priority);
      expect(priorities).toContain(high.priority);
      expect(priorities).toContain(urgent.priority);
    });
  });
});
