import { Controller, Get, Post, Body } from '@nestjs/common';
import { EventsService } from './events.service';
import { SaveEventDto } from './dto/save-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findOne() {
    return this.eventsService.findOne();
  }

  @Post()
  save(@Body() dto: SaveEventDto) {
    return this.eventsService.save(dto);
  }
}
