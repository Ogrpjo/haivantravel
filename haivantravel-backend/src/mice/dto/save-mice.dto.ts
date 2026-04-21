import { IsOptional, IsString } from 'class-validator';

export class SaveMiceDto {
  @IsOptional()
  @IsString()
  content?: string | null;

  @IsOptional()
  @IsString()
  html_content?: string | null;

  @IsOptional()
  @IsString()
  css_content?: string | null;
}

