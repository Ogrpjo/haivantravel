import { IsOptional, IsString } from 'class-validator';

export class SaveEventDto {
  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsString()
  time?: string | null;
}
