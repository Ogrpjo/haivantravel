import { IsOptional, IsString } from 'class-validator';

export class SaveMiceDto {
  @IsOptional()
  @IsString()
  content?: string | null;
}

