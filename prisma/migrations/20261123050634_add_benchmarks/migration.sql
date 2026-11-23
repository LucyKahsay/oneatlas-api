-- CreateTable
CREATE TABLE "Benchmark" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Benchmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelBenchmark" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "benchmarkId" TEXT NOT NULL,
    "score" DECIMAL(8,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModelBenchmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Benchmark_name_key" ON "Benchmark"("name");

-- CreateIndex
CREATE INDEX "ModelBenchmark_benchmarkId_idx" ON "ModelBenchmark"("benchmarkId");

-- CreateIndex
CREATE UNIQUE INDEX "ModelBenchmark_modelId_benchmarkId_key" ON "ModelBenchmark"("modelId", "benchmarkId");

-- AddForeignKey
ALTER TABLE "ModelBenchmark" ADD CONSTRAINT "ModelBenchmark_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelBenchmark" ADD CONSTRAINT "ModelBenchmark_benchmarkId_fkey" FOREIGN KEY ("benchmarkId") REFERENCES "Benchmark"("id") ON DELETE CASCADE ON UPDATE CASCADE;
