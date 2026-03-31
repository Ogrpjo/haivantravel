import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  link_url?: string;
}
