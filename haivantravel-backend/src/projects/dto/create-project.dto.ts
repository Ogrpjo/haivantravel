import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  link_url: string;
}
