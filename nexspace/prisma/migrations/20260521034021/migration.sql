-- CreateTable
CREATE TABLE "user" (
    "userId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "user_organization" (
    "userId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_organization_pkey" PRIMARY KEY ("userId","orgId")
);

-- CreateTable
CREATE TABLE "organization" (
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "externalId" TEXT NOT NULL,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("orgId")
);

-- CreateTable
CREATE TABLE "location" (
    "locationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "tz" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orgId" TEXT NOT NULL,

    CONSTRAINT "location_pkey" PRIMARY KEY ("locationId")
);

-- CreateTable
CREATE TABLE "building" (
    "buildingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "locationId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,

    CONSTRAINT "building_pkey" PRIMARY KEY ("buildingId")
);

-- CreateTable
CREATE TABLE "floor" (
    "floorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,

    CONSTRAINT "floor_pkey" PRIMARY KEY ("floorId")
);

-- CreateTable
CREATE TABLE "space" (
    "spaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,

    CONSTRAINT "space_pkey" PRIMARY KEY ("spaceId")
);

-- CreateTable
CREATE TABLE "booking" (
    "bookingId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startTs" TIMESTAMP(3) NOT NULL,
    "endTs" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("bookingId")
);

-- CreateIndex
CREATE INDEX "user_externalId_idx" ON "user"("externalId");

-- CreateIndex
CREATE INDEX "organization_externalId_idx" ON "organization"("externalId");

-- CreateIndex
CREATE INDEX "location_orgId_idx" ON "location"("orgId");

-- CreateIndex
CREATE INDEX "building_locationId_orgId_idx" ON "building"("locationId", "orgId");

-- CreateIndex
CREATE INDEX "floor_buildingId_orgId_idx" ON "floor"("buildingId", "orgId");

-- CreateIndex
CREATE INDEX "booking_orgId_idx" ON "booking"("orgId");

-- CreateIndex
CREATE INDEX "booking_spaceId_startTs_endTs_idx" ON "booking"("spaceId", "startTs", "endTs");

-- CreateIndex
CREATE INDEX "booking_orgId_userId_startTs_endTs_idx" ON "booking"("orgId", "userId", "startTs", "endTs");

-- AddForeignKey
ALTER TABLE "user_organization" ADD CONSTRAINT "user_organization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_organization" ADD CONSTRAINT "user_organization_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organization"("orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organization"("orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "building" ADD CONSTRAINT "building_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("locationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "building" ADD CONSTRAINT "building_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organization"("orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "floor" ADD CONSTRAINT "floor_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "building"("buildingId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "floor" ADD CONSTRAINT "floor_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organization"("orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space" ADD CONSTRAINT "space_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organization"("orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organization"("orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "space"("spaceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
