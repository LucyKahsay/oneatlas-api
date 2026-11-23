import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });


async function main() {
  const openai = await prisma.provider.upsert({
    where: { slug: 'openai' },
    update: {},
    create: {
      name: 'OpenAI',
      slug: 'openai',
      website: 'https://openai.com',
    },
  });

  const anthropic = await prisma.provider.upsert({
    where: { slug: 'anthropic' },
    update: {},
    create: {
      name: 'Anthropic',
      slug: 'anthropic',
      website: 'https://anthropic.com',
    },
  });

  const google = await prisma.provider.upsert({
    where: { slug: 'google' },
    update: {},
    create: {
      name: 'Google',
      slug: 'google',
      website: 'https://ai.google.dev',
    },
  });

  await prisma.model.createMany({
    skipDuplicates: true,
    data: [
      {
        name: 'GPT-4.1',
        slug: 'gpt-4-1',
        category: 'LLM',
        description: 'OpenAI general-purpose AI model.',
        contextWindow: 1047576,
        providerId: openai.id,
      },
      {
        name: 'GPT-4.1 mini',
        slug: 'gpt-4-1-mini',
        category: 'LLM',
        description: 'Smaller, efficient OpenAI model.',
        contextWindow: 1047576,
        providerId: openai.id,
      },
      {
        name: 'Claude Sonnet',
        slug: 'claude-sonnet',
        category: 'LLM',
        description: 'Anthropic general-purpose AI model.',
        contextWindow: 200000,
        providerId: anthropic.id,
      },
      {
        name: 'Gemini',
        slug: 'gemini',
        category: 'LLM',
        description: 'Google multimodal AI model.',
        contextWindow: 1000000,
        providerId: google.id,
      },
    ],
  });


  
  // Update existing models with illustrative capabilities and modalities
  await Promise.all([
    prisma.model.update({
      where: { slug: 'gpt-4-1' },
      data: {
        modalities: ['text', 'image'],
        capabilities: ['reasoning', 'coding', 'analysis'],
      },
    }),

    prisma.model.update({
      where: { slug: 'gpt-4-1-mini' },
      data: {
        modalities: ['text', 'image'],
        capabilities: ['reasoning', 'coding', 'analysis'],
      },
    }),

    prisma.model.update({
      where: { slug: 'claude-sonnet' },
      data: {
        modalities: ['text', 'image'],
        capabilities: ['reasoning', 'coding', 'analysis'],
      },
    }),

    prisma.model.update({
      where: { slug: 'gemini' },
      data: {
        modalities: ['text', 'image', 'audio', 'video'],
        capabilities: ['reasoning', 'coding', 'analysis', 'multimodal'],
      },
    }),
  ]);


  
  await prisma.modelPricing.createMany({
  data: [
    {
      modelId: (await prisma.model.findUniqueOrThrow({
        where: { slug: 'gpt-4-1' },
      })).id,
      inputPricePerMillion: 2.00,
      outputPricePerMillion: 8.00,
    },
    {
      modelId: (await prisma.model.findUniqueOrThrow({
        where: { slug: 'gpt-4-1-mini' },
      })).id,
      inputPricePerMillion: 0.40,
      outputPricePerMillion: 1.60,
    },
    {
      modelId: (await prisma.model.findUniqueOrThrow({
        where: { slug: 'claude-sonnet' },
      })).id,
      inputPricePerMillion: 3.00,
      outputPricePerMillion: 15.00,
    },
    {
      modelId: (await prisma.model.findUniqueOrThrow({
        where: { slug: 'gemini' },
      })).id,
      inputPricePerMillion: 1.25,
      outputPricePerMillion: 5.00,
    },
  ],
  skipDuplicates: true,
});



  // Create benchmark records
  const humaneval = await prisma.benchmark.upsert({
    where: { slug: 'humaneval' },
    update: {},
    create: {
      name: 'HumanEval',
      slug: 'humaneval',
      category: 'Coding',
      description: 'Evaluates a model’s ability to generate code.',
    },
  });

  const mmlu = await prisma.benchmark.upsert({
    where: { slug: 'mmlu' },
    update: {},
    create: {
      name: 'MMLU',
      slug: 'mmlu',
      category: 'Knowledge',
      description: 'Evaluates knowledge across multiple subjects.',
    },
  });

  const gpqa = await prisma.benchmark.upsert({
    where: { slug: 'gpqa' },
    update: {},
    create: {
      name: 'GPQA',
      slug: 'gpqa',
      category: 'Science',
      description: 'Evaluates graduate-level scientific reasoning.',
    },
  });

  // Get model IDs using their unique slugs
  const getModelId = async (slug: string) => {
    const model = await prisma.model.findUniqueOrThrow({
      where: { slug },
      select: { id: true },
    });

    return model.id;
  };

  // Store illustrative demo scores
  await prisma.modelBenchmark.createMany({
    skipDuplicates: true,
    data: [
      // HumanEval scores
      { modelId: await getModelId('gpt-4-1'), benchmarkId: humaneval.id, score: 90 },
      { modelId: await getModelId('gpt-4-1-mini'), benchmarkId: humaneval.id, score: 82 },
      { modelId: await getModelId('claude-sonnet'), benchmarkId: humaneval.id, score: 88 },
      { modelId: await getModelId('gemini'), benchmarkId: humaneval.id, score: 85 },

      // MMLU scores
      { modelId: await getModelId('gpt-4-1'), benchmarkId: mmlu.id, score: 90 },
      { modelId: await getModelId('gpt-4-1-mini'), benchmarkId: mmlu.id, score: 82 },
      { modelId: await getModelId('claude-sonnet'), benchmarkId: mmlu.id, score: 88 },
      { modelId: await getModelId('gemini'), benchmarkId: mmlu.id, score: 89 },

      // GPQA scores
      { modelId: await getModelId('gpt-4-1'), benchmarkId: gpqa.id, score: 70 },
      { modelId: await getModelId('gpt-4-1-mini'), benchmarkId: gpqa.id, score: 65 },
      { modelId: await getModelId('claude-sonnet'), benchmarkId: gpqa.id, score: 68 },
      { modelId: await getModelId('gemini'), benchmarkId: gpqa.id, score: 72 },
    ],
  });



  console.log('Database seeded successfully!');
}

  

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });