import { IsOptional, IsString } from 'class-validator';

export class UpdatePartnerDto {
  @IsOptional()
  @IsString()
  business_type?: string;
}
