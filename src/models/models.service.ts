
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModelsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    search?: string,
    provider?: string,
    category?: string,
    capability?: string,
    modality?: string,
    sortBy?: string,
    order?: string,
    page = 1,
    limit = 10,
  ) {
    // Validate pagination
    if (page < 1 || limit < 1 || limit > 100) {
      throw new BadRequestException(
        'Page must be at least 1 and limit must be between 1 and 100',
      );
    }

    // Build database filters
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
      ...(capability && {
        capabilities: {
          has: capability.toLowerCase(),
        },
      }),
      ...(modality && {
        modalities: {
          has: modality.toLowerCase(),
        },
      }),
    };

    // Only allow supported sorting fields
    const allowedSortFields = [
      'name',
      'contextWindow',
      'releaseDate',
      'inputPrice',
    ];

    if (sortBy && !allowedSortFields.includes(sortBy)) {
      throw new BadRequestException(
        'sortBy must be name, contextWindow, releaseDate, or inputPrice',
      );
    }

    const direction: 'asc' | 'desc' = order === 'desc' ? 'desc' : 'asc';

    const orderBy =
      sortBy === 'contextWindow'
        ? { contextWindow: direction }
        : sortBy === 'releaseDate'
          ? { releaseDate: direction }
          : sortBy === 'inputPrice'
            ? { pricing: { inputPricePerMillion: direction } }
            : { name: direction };

    const skip = (page - 1) * limit;

    // Fetch models and total count together
    const [models, total] = await Promise.all([
      this.prisma.model.findMany({
        where,
        include: {
          provider: true,
          pricing: true,
        },
        skip,
        take: limit,
        orderBy,
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
        benchmarks: {
          include: {
            benchmark: true,
          },
        },
      },
    });

    if (!model) {
      throw new NotFoundException('Model not found');
    }

    return model;
  }


  
  async compare(slugs: string) {
    // Convert comma-separated slugs into an array
    const modelSlugs = [
      ...new Set(
        (slugs ?? '')
          .split(',')
          .map((slug) => slug.trim())
          .filter(Boolean),
      ),
    ];

    // Require between 2 and 4 different models
    if (modelSlugs.length < 2 || modelSlugs.length > 4) {
      throw new BadRequestException(
        'Provide between 2 and 4 model slugs to compare',
      );
    }

    // Fetch all requested models with their related information
    const models = await this.prisma.model.findMany({
      where: {
        slug: {
          in: modelSlugs,
        },
      },
      include: {
        provider: true,
        pricing: true,
        benchmarks: {
          include: {
            benchmark: true,
          },
        },
      },
    });

    // Make sure every requested model exists
    if (models.length !== modelSlugs.length) {
      throw new NotFoundException('One or more models not found');
    }

    // Preserve the order in which the user requested the models
    const orderedModels = modelSlugs.map((slug) =>
      models.find((model) => model.slug === slug),
    );

    return {
      count: orderedModels.length,
      models: orderedModels,
    };
  }


}
