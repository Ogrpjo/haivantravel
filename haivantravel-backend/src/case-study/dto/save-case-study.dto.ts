import { IsOptional, IsString } from 'class-validator';

export class SaveCaseStudyDto {
  @IsOptional()
  @IsString()
  content?: string | null;
}
