import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  business_type: string;

  @Type(() => Number)
  @IsNumber()
  icon_size: number;
}
