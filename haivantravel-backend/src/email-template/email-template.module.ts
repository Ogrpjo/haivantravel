import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplate } from './email-template.entity';
import { EmailTemplateService } from './email-template.service';
import { EmailTemplateController } from './email-template.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmailTemplate])],
  providers: [EmailTemplateService],
  controllers: [EmailTemplateController],
  exports: [EmailTemplateService],
})
export class EmailTemplateModule implements OnModuleInit {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  async onModuleInit() {
    await this.emailTemplateService.seedDefaults();
  }
}
