-- AlterTable
ALTER TABLE "loads" ADD COLUMN     "deliveryDate" TIMESTAMP(3),
ADD COLUMN     "destinationRegion" TEXT,
ADD COLUMN     "originRegion" TEXT;
