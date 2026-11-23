import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModelsModule } from './models/models.module';
import { ProvidersModule } from './providers/providers.module';
import { BenchmarksModule } from './benchmarks/benchmarks.module';

@Module({
  imports: [ModelsModule, ProvidersModule, BenchmarksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
