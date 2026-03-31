import { IsOptional, IsString } from 'class-validator';

export class SaveTeamBuildingDto {
  @IsOptional()
  @IsString()
  content?: string | null;
}

