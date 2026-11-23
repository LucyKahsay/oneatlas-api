-- CreateTable
CREATE TABLE "ModelPricing" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "inputPricePerMillion" DECIMAL(10,6) NOT NULL,
    "outputPricePerMillion" DECIMAL(10,6) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModelPricing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModelPricing_modelId_key" ON "ModelPricing"("modelId");

-- AddForeignKey
ALTER TABLE "ModelPricing" ADD CONSTRAINT "ModelPricing_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;
