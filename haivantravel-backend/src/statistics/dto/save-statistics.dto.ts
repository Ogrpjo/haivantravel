import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class StatisticsItemDto {
  @IsString()
  title: string;

  @IsString()
  number: string;
}

export class SaveStatisticsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatisticsItemDto)
  items: StatisticsItemDto[];
}
