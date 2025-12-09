export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  n8nWebhookUrl: process.env.N8N_WEBHOOK_URL ?? "",
  n8nWebhookSecret: process.env.N8N_WEBHOOK_SECRET ?? "",
  uploadDir: process.env.UPLOAD_DIR ?? "/var/www/memoryverse/uploads",
  smtpHost: process.env.SMTP_HOST ?? "",
  smtpPort: parseInt(process.env.SMTP_PORT ?? "587"),
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPassword: process.env.SMTP_PASSWORD ?? "",
  // Forge API (optional - falls back to OpenAI)
  forgeApiKey: process.env.OPENAI_API_KEY ?? "",
  forgeApiUrl: process.env.FORGE_API_URL ?? "",
};
