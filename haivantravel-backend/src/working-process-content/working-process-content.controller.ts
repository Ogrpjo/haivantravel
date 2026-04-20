import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { WorkingProcessContentService } from './working-process-content.service';
import { WorkingProcessCard } from './working-process-content.entity';

type SaveWorkingProcessContentBody = {
  small_text?: string;
  big_text?: string;
  description?: string;
  cards?: WorkingProcessCard[];
};

function normalizeCard(input: WorkingProcessCard): WorkingProcessCard {
  return {
    number: input.number?.trim?.() ? String(input.number).trim() : null,
    title: input.title?.trim?.() ? String(input.title).trim() : null,
    description: input.description?.trim?.()
      ? String(input.description).trim()
      : null,
    is_active: input.is_active ?? true,
  };
}

@Controller('working-process-content')
export class WorkingProcessContentController {
  constructor(private readonly service: WorkingProcessContentService) {}

  @Get()
  findOne() {
    return this.service.findOne();
  }

  @Post()
  save(@Body() body: SaveWorkingProcessContentBody) {
    const cards = body.cards;
    if (cards !== undefined) {
      if (!Array.isArray(cards)) throw new BadRequestException('cards phải là mảng.');
      if (cards.length !== 6) {
        throw new BadRequestException('cards phải có đúng 6 phần tử.');
      }
    }

    return this.service.save({
      small_text: body.small_text?.trim() ?? undefined,
      big_text: body.big_text?.trim() ?? undefined,
      description: body.description?.trim() ?? undefined,
      cards: cards ? cards.map(normalizeCard) : undefined,
    });
  }
}

