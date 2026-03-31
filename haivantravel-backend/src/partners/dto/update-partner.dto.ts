import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePartnerDto {
  @IsOptional()
  @IsString()
  business_type?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value == null ? undefined : Number(value),
  )
  @IsNumber()
  icon_size?: number;
}
