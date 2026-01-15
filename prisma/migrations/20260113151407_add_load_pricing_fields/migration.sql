-- AlterTable
ALTER TABLE "loads"
  ALTER COLUMN "price" DROP NOT NULL,
  ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'USD',
  ADD COLUMN "negotiablePrice" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "prepayment" DOUBLE PRECISION,
  ADD COLUMN "prepaymentCurrency" TEXT,
  ADD COLUMN "trucksCount" INTEGER;
