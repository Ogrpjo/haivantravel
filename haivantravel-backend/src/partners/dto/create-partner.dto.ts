import { IsString } from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  business_type: string;
}
