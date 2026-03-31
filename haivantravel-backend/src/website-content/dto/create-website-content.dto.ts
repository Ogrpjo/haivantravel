import { IsString, IsOptional, IsObject, IsIn } from 'class-validator';

export class CreateWebsiteContentDto {
  @IsString()
  @IsIn(['home', 'blog'])
  page: string;

  @IsString()
  @IsIn([
    'gallery',
    'statistics',
    'emotion_creator',
    'company_overview',
    'about_us',
  ])
  section: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsObject()
  extra_data?: Record<string, unknown>;
}
