import { Body, BadRequestException, Controller, Get, Post } from '@nestjs/common';
import { StatisticService } from './statistic.service';

interface SaveStatisticBody {
  small_text?: string;
  big_text?: string;
  number_1?: string;
  name_1?: string;
  number_2?: string;
  name_2?: string;
  number_3?: string;
  name_3?: string;
  number_4?: string;
  name_4?: string;
}

function countWords(text?: string | null): number {
  const value = text?.trim();
  if (!value) return 0;
  return value.split(/\s+/).length;
}

function validateNameWordLimit(label: string, value: string | undefined): void {
  if (value === undefined) return;
  const words = countWords(value);
  if (words > 10) {
    throw new BadRequestException(`${label} vượt quá 10 từ (hiện tại: ${words}).`);
  }
}

function parseTextNumber(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return value.trim();
}

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get()
  findOne() {
    return this.statisticService.findOne();
  }

  @Post()
  save(@Body() body: SaveStatisticBody) {
    validateNameWordLimit('name_1', body.name_1);
    validateNameWordLimit('name_2', body.name_2);
    validateNameWordLimit('name_3', body.name_3);
    validateNameWordLimit('name_4', body.name_4);

    return this.statisticService.save({
      small_text: body.small_text?.trim() ?? undefined,
      big_text: body.big_text?.trim() ?? undefined,
      number_1: parseTextNumber(body.number_1),
      name_1: body.name_1?.trim() ?? undefined,
      number_2: parseTextNumber(body.number_2),
      name_2: body.name_2?.trim() ?? undefined,
      number_3: parseTextNumber(body.number_3),
      name_3: body.name_3?.trim() ?? undefined,
      number_4: parseTextNumber(body.number_4),
      name_4: body.name_4?.trim() ?? undefined,
    });
  }
}
