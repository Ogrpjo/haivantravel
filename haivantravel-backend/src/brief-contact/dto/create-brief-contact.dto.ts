import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateBriefContactDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  company_name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  event_type: string;

  @IsString()
  @IsNotEmpty()
  attendee_scale: string;

  @IsString()
  @IsNotEmpty()
  budget: string;

  @IsString()
  @IsNotEmpty()
  expected_time: string;

  @IsString()
  @IsNotEmpty()
  requirements: string;
}

