import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModelsService {

  constructor(private readonly prisma: PrismaService) {}




async findAll(
  search?: string,
  provider?: string,
  category?: string,
  page = 1,
  limit = 10,
) {
  const skip = (page - 1) * limit;

  const where = {
    ...(search && {
      name: {
        contains: search,
        mode: 'insensitive' as const,
      },
    }),
    ...(provider && {
      provider: {
        slug: provider,
      },
    }),
    ...(category && {
      category: {
        equals: category,
        mode: 'insensitive' as const,
      },
    }),
  };

  const [models, total] = await Promise.all([
    this.prisma.model.findMany({
      where,
      include: {
        provider: true,
        pricing: true,
      },
      skip,
      take: limit,
      orderBy: {
        name: 'asc',
      },
    }),

    this.prisma.model.count({ where }),
  ]);

  return {
    data: models,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}


async findBySlug(slug: string) {
  const model = await this.prisma.model.findUnique({
    where: { slug },
    include: {
      provider: true,
      pricing: true,
    },
  });

  if (!model) {
    throw new NotFoundException('Model not found');
  }

  return model;
}

}