export type EmailTemplateVariables = Record<string, string | number | null>;

export type QueuedEmailJob = {
  to: string | string[];
  subject: string;
  html: string;
  attempts: number;
  maxAttempts: number;
};
