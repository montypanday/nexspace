-- AlterTable
ALTER TABLE "space" ADD COLUMN     "floorId" TEXT;

-- AddForeignKey
ALTER TABLE "space" ADD CONSTRAINT "space_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "floor"("floorId") ON DELETE SET NULL ON UPDATE CASCADE;
