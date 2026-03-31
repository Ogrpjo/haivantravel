import { IsOptional, IsString } from 'class-validator';

export class SaveGalaDto {
  @IsOptional()
  @IsString()
  content?: string | null;
}

