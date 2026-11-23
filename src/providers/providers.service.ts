import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.provider.findMany({
      include: {
        _count: {
          select: {
            models: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}