import { Body, BadRequestException, Controller, Get, Post } from '@nestjs/common';
import { AboutUsStatisticService } from './about-us-statistic.service';

interface SaveStatisticBody {
  number_1?: number | string;
  name_1?: string;
  number_2?: number | string;
  name_2?: string;
  number_3?: number | string;
  name_3?: string;
  number_4?: number | string;
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
  if (words > 5) {
    throw new BadRequestException(`${label} vượt quá 5 từ (hiện tại: ${words}).`);
  }
}

function parseNumber(value: number | string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new BadRequestException('Number statistic không hợp lệ.');
  }
  return Math.max(0, Math.trunc(parsed));
}

@Controller('about-us-statistic')
export class AboutUsStatisticController {
  constructor(private readonly statisticService: AboutUsStatisticService) {}

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
      number_1: parseNumber(body.number_1),
      name_1: body.name_1?.trim() ?? undefined,
      number_2: parseNumber(body.number_2),
      name_2: body.name_2?.trim() ?? undefined,
      number_3: parseNumber(body.number_3),
      name_3: body.name_3?.trim() ?? undefined,
      number_4: parseNumber(body.number_4),
      name_4: body.name_4?.trim() ?? undefined,
    });
  }
}
