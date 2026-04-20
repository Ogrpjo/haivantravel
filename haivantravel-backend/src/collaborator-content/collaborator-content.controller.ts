import { Body, Controller, Get, Post } from '@nestjs/common';
import { CollaboratorContentService } from './collaborator-content.service';

interface SaveCollaboratorContentBody {
  first_text?: string;
  blue_text_1?: string;
  blue_text_2?: string;
  last_text?: string;
  description?: string;
}

@Controller('collaborator-content')
export class CollaboratorContentController {
  constructor(private readonly contentService: CollaboratorContentService) {}

  @Get()
  findOne() {
    return this.contentService.findOne();
  }

  @Post()
  save(@Body() body: SaveCollaboratorContentBody) {
    return this.contentService.save({
      first_text: body.first_text?.trim() ?? undefined,
      blue_text_1: body.blue_text_1?.trim() ?? undefined,
      blue_text_2: body.blue_text_2?.trim() ?? undefined,
      last_text: body.last_text?.trim() ?? undefined,
      description: body.description?.trim() ?? undefined,
    });
  }
}
