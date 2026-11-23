import {
  Controller,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { ModelsService } from './models.service';

@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

 
@Get()
findAll(
  @Query('search') search?: string,
  @Query('provider') provider?: string,
  @Query('category') category?: string,
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
) {
  return this.modelsService.findAll(
    search,
    provider,
    category,
    page,
    limit,
  );
}

@Get(':slug')
findBySlug(@Param('slug') slug: string) {
  return this.modelsService.findBySlug(slug);
}
}