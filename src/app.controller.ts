
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getApiInfo() {
    return {
      name: 'OneAtlas API',
      description: 'Backend API for discovering and evaluating AI models.',
      status: 'running',
      endpoints: {
        models: '/models',
        modelDetails: '/models/:slug',
        providers: '/providers',
        benchmarks: '/benchmarks',
        rankings: '/rankings?benchmark=humaneval',
      },
    };
  }
}
