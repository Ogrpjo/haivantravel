import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

function toOptionalInt(value: unknown): number | undefined {
  if (value === '' || value === null || value === undefined) return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

function trimOrUndefined(value: unknown): string | undefined {
  if (value === '' || value === null || value === undefined) return undefined;
  if (typeof value !== 'string') return undefined;
  const t = value.trim();
  return t === '' ? undefined : t;
}

export class UpdateProjectDto {
  @IsOptional()
  @Transform(({ value }) => trimOrUndefined(value))
  @IsString()
  title?: string;

  /** Gửi chuỗi rỗng để xóa mô tả (lưu null). */
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined) return undefined;
    return typeof value === 'string' ? value.trim() : undefined;
  })
  @IsString()
  short_description?: string;

  @IsOptional()
  @Transform(({ value }) => trimOrUndefined(value))
  @IsString()
  project_type?: string;

  @IsOptional()
  @Transform(({ value }) => toOptionalInt(value))
  @IsInt()
  @Min(0)
  duration_days?: number;

  @IsOptional()
  @Transform(({ value }) => toOptionalInt(value))
  @IsInt()
  @Min(0)
  guest_count?: number;

  @IsOptional()
  @Transform(({ value }) => toOptionalInt(value))
  @IsInt()
  @Min(0)
  artist_count?: number;

  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  link_url?: string;

  /** Gửi chuỗi rỗng để xóa nội dung chi tiết (lưu null). */
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined) return undefined;
    return typeof value === 'string' ? value : undefined;
  })
  @IsString()
  content?: string;

  /** Gửi chuỗi rỗng để xóa SEO title (lưu null). */
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined) return undefined;
    return typeof value === 'string' ? value.trim() : undefined;
  })
  @IsString()
  seo_title?: string;

  /** Gửi chuỗi rỗng để xóa SEO keywords (lưu null). */
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined) return undefined;
    return typeof value === 'string' ? value.trim() : undefined;
  })
  @IsString()
  seo_keywords?: string;

  /** Gửi chuỗi rỗng để xóa SEO description (lưu null). */
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined) return undefined;
    return typeof value === 'string' ? value.trim() : undefined;
  })
  @IsString()
  seo_description?: string;
}
