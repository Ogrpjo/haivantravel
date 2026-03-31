import { IsString } from 'class-validator';

export class CreateGalleryDto {
  @IsString()
  image_url: string;
}
