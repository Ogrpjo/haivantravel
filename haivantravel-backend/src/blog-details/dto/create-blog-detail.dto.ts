import { IsOptional, IsString } from 'class-validator';

export class CreateBlogDetailDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  demo_image?: string;

  @IsOptional()
  @IsString()
  meta_title?: string;

  @IsOptional()
  @IsString()
  meta_keywords?: string;

  @IsOptional()
  @IsString()
  meta_description?: string;
}
