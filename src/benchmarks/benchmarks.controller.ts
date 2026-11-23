
import { Controller, Get, Query } from '@nestjs/common';
import { BenchmarksService } from './benchmarks.service';

@Controller()
export class BenchmarksController {
  constructor(private readonly benchmarksService: BenchmarksService) {}

  @Get('benchmarks')
  findAll() {
    return this.benchmarksService.findAll();
  }

  @Get('rankings')
  findRanking(@Query('benchmark') benchmark: string) {
    return this.benchmarksService.findRanking(benchmark);
  }
}
