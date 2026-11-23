
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BenchmarksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.benchmark.findMany({
      include: {
        modelScores: {
          include: {
            model: {
              include: {
                provider: true,
              },
            },
          },
          orderBy: {
            score: 'desc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

    
async findRanking(benchmarkSlug: string) {
  const benchmark = await this.prisma.benchmark.findUnique({
    where: { slug: benchmarkSlug },
  });

  if (!benchmark) {
    throw new NotFoundException('Benchmark not found');
  }

  const scores = await this.prisma.modelBenchmark.findMany({
    where: {
      benchmarkId: benchmark.id,
    },
    include: {
      model: {
        include: {
          provider: true,
          pricing: true,
        },
      },
    },
    orderBy: {
      score: 'desc',
    },
  });

  return {
    benchmark: benchmark.name,
    rankings: scores.map((result, index) => ({
      rank: index + 1,
      score: result.score,
      model: result.model,
    })),
  };
}


}
