import { IsOptional, IsString } from 'class-validator';

export class SaveRecruitmentDto {
  @IsOptional()
  @IsString()
  content?: string | null;
}
