import { IsString, IsUrl } from 'class-validator';

export class CreateSocialLinkDto {
  @IsString()
  title: string;

  @IsString()
  @IsUrl()
  url: string;
}
