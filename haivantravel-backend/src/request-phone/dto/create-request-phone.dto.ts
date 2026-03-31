import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRequestPhoneDto {
  @IsString()
  @IsNotEmpty()
  phone: string;
}
