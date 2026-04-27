import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { EmailTemplateService } from '../email-template/email-template.service';
import { EmailTemplateVariables, QueuedEmailJob } from './mail.types';

@Injectable()
export class MailService implements OnModuleDestroy {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter;
  private readonly from: string;
  private readonly queue: QueuedEmailJob[] = [];
  private processing = false;
  private readonly timer: NodeJS.Timeout;

  constructor(
    private readonly configService: ConfigService,
    private readonly emailTemplateService: EmailTemplateService,
  ) {
    const host = this.configService.get<string>('MAIL_HOST') ?? '';
    const port = Number(this.configService.get<string>('MAIL_PORT') ?? 587);
    const secure = String(
      this.configService.get<string>('MAIL_SECURE') ?? 'false',
    ).toLowerCase() === 'true';
    const user = this.configService.get<string>('MAIL_USER') ?? '';
    const pass = this.configService.get<string>('MAIL_PASS') ?? '';

    const from = this.configService.get<string>('MAIL_FROM');
    this.from = from && from.trim().length > 0 ? from : user;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    });

    this.timer = setInterval(() => {
      void this.processQueue();
    }, 1000);
  }

  onModuleDestroy() {
    clearInterval(this.timer);
  }

  async enqueueTemplatedEmail(
    templateKey: string,
    to: string | string[],
    variables: EmailTemplateVariables,
    maxAttempts = 3,
  ) {
    const template = await this.emailTemplateService.findByKey(templateKey);
    if (!template.is_active) {
      return;
    }

    const subject = this.render(template.subject_template, variables);
    const html = this.render(template.html_template, variables);

    this.queue.push({
      to,
      subject,
      html,
      attempts: 0,
      maxAttempts,
    });

    // Trigger processing immediately (helps in environments where interval/timers are unreliable).
    void this.processQueue();
  }

  async sendTestTemplatedEmail(
    templateKey: string,
    to: string,
    variables: EmailTemplateVariables,
  ) {
    const template = await this.emailTemplateService.findByKey(templateKey);
    const subject = this.render(template.subject_template, variables);
    const html = this.render(template.html_template, variables);
    await this.sendNow(to, subject, html);
  }

  getQueueStatus() {
    return { length: this.queue.length, processing: this.processing };
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    const job = this.queue.shift();
    if (!job) {
      this.processing = false;
      return;
    }

    try {
      await this.sendNow(job.to, job.subject, job.html);
    } catch (error) {
      job.attempts += 1;
      if (job.attempts < job.maxAttempts) {
        const delay = Math.pow(2, job.attempts) * 1000;
        setTimeout(() => this.queue.push(job), delay);
        this.logger.warn(
          `Email send failed, retrying (${job.attempts}/${job.maxAttempts})`,
        );
      } else {
        this.logger.error('Email send failed after max retries', error);
      }
    } finally {
      this.processing = false;
    }
  }

  private async sendNow(to: string | string[], subject: string, html: string) {
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject,
      html,
    });
  }

  private render(template: string, variables: EmailTemplateVariables): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
      const value = variables[key];
      if (value === null || value === undefined) {
        return '';
      }
      return String(value);
    });
  }
}
