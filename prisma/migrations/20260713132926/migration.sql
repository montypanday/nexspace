/*
  Warnings:

  - A unique constraint covering the columns `[activeFloorPlanId]` on the table `floor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assetId` to the `space` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floorPlanId` to the `space` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "bookableAssetId" TEXT;

-- AlterTable
ALTER TABLE "floor" ADD COLUMN     "activeFloorPlanId" TEXT;

-- AlterTable
ALTER TABLE "space" ADD COLUMN     "assetId" TEXT NOT NULL,
ADD COLUMN     "floorPlanId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "bookable_asset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "floorId" TEXT NOT NULL,

    CONSTRAINT "bookable_asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "floor_plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "floorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "floor_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "floor_plan_element" (
    "id" TEXT NOT NULL,
    "type" TEXT,
    "attrs" JSONB NOT NULL,
    "floorPlanId" TEXT NOT NULL,
    "spaceId" TEXT,

    CONSTRAINT "floor_plan_element_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookable_asset_floorId_name_key" ON "bookable_asset"("floorId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "floor_plan_element_spaceId_key" ON "floor_plan_element"("spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "floor_activeFloorPlanId_key" ON "floor"("activeFloorPlanId");

-- AddForeignKey
ALTER TABLE "floor" ADD CONSTRAINT "floor_activeFloorPlanId_fkey" FOREIGN KEY ("activeFloorPlanId") REFERENCES "floor_plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookable_asset" ADD CONSTRAINT "bookable_asset_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "floor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "floor_plan" ADD CONSTRAINT "floor_plan_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "floor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "floor_plan_element" ADD CONSTRAINT "floor_plan_element_floorPlanId_fkey" FOREIGN KEY ("floorPlanId") REFERENCES "floor_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "floor_plan_element" ADD CONSTRAINT "floor_plan_element_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space" ADD CONSTRAINT "space_floorPlanId_fkey" FOREIGN KEY ("floorPlanId") REFERENCES "floor_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space" ADD CONSTRAINT "space_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "bookable_asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_bookableAssetId_fkey" FOREIGN KEY ("bookableAssetId") REFERENCES "bookable_asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
