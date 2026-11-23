-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "capabilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "modalities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "releaseDate" TIMESTAMP(3);
