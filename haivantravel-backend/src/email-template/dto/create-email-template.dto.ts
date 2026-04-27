import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmailTemplateDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  subject_template: string;

  @IsString()
  @IsNotEmpty()
  html_template: string;

  @IsBoolean()
  is_active: boolean;
}
