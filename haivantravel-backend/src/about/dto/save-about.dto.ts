import { IsOptional, IsString } from 'class-validator';

export class SaveAboutDto {
  @IsOptional()
  @IsString()
  content?: string | null;
}
