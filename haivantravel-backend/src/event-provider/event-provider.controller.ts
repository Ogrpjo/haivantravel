import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { EventProviderCard } from './event-provider.entity';
import { EventProviderService } from './event-provider.service';

type SaveEventProviderBody = {
  small_text?: string;
  big_text?: string;
  right_text?: string;
  cards?: EventProviderCard[];
};

function normalizeCard(input: EventProviderCard): EventProviderCard {
  return {
    type: input.type?.trim?.() ? String(input.type).trim() : null,
    title: input.title?.trim?.() ? String(input.title).trim() : null,
    description: input.description?.trim?.() ? String(input.description).trim() : null,
    is_active: input.is_active ?? true,
  };
}

@Controller('event-provider')
export class EventProviderController {
  constructor(private readonly service: EventProviderService) {}

  @Get()
  findOne() {
    return this.service.findOne();
  }

  @Post()
  save(@Body() body: SaveEventProviderBody) {
    const cards = body.cards;
    if (cards !== undefined) {
      if (!Array.isArray(cards)) throw new BadRequestException('cards phải là mảng.');
      if (cards.length !== 6) throw new BadRequestException('cards phải có đúng 6 phần tử.');
    }

    return this.service.save({
      small_text: body.small_text?.trim() ?? undefined,
      big_text: body.big_text?.trim() ?? undefined,
      right_text: body.right_text?.trim() ?? undefined,
      cards: cards ? cards.map(normalizeCard) : undefined,
    });
  }
}

