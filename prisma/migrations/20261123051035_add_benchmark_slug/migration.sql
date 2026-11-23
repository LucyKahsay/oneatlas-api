/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Benchmark` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Benchmark` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Benchmark" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Benchmark_slug_key" ON "Benchmark"("slug");
