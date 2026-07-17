-- CreateEnum
CREATE TYPE "SpaceStatus" AS ENUM ('available', 'occupied', 'reserved', 'maintenance');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "verification_token" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_token_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "authenticator" (
    "credentialID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "authenticator_pkey" PRIMARY KEY ("userId","credentialID")
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
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "externalId" TEXT,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "tz" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orgId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "building" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "locationId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "footprints" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "building_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "floor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "activeFloorPlanId" TEXT,

    CONSTRAINT "floor_pkey" PRIMARY KEY ("id")
);

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
    "type" TEXT NOT NULL,
    "attrs" JSONB NOT NULL,
    "featureProperties" JSONB NOT NULL DEFAULT '{}',
    "floorPlanId" TEXT NOT NULL,
    "spaceId" TEXT,

    CONSTRAINT "floor_plan_element_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "space" (
    "id" TEXT NOT NULL,
    "status" "SpaceStatus" NOT NULL DEFAULT 'available',
    "orgId" TEXT NOT NULL,
    "floorId" TEXT NOT NULL,
    "floorPlanId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "space_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startTs" TIMESTAMP(3) NOT NULL,
    "endTs" TIMESTAMP(3) NOT NULL,
    "allDay" BOOLEAN NOT NULL DEFAULT false,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookableAssetId" TEXT NOT NULL,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_sessionToken_key" ON "session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "authenticator_credentialID_key" ON "authenticator"("credentialID");

-- CreateIndex
CREATE INDEX "organization_externalId_idx" ON "organization"("externalId");

-- CreateIndex
CREATE INDEX "location_orgId_idx" ON "location"("orgId");

-- CreateIndex
CREATE INDEX "building_locationId_orgId_idx" ON "building"("locationId", "orgId");

-- CreateIndex
CREATE UNIQUE INDEX "floor_activeFloorPlanId_key" ON "floor"("activeFloorPlanId");

-- CreateIndex
CREATE INDEX "floor_buildingId_orgId_idx" ON "floor"("buildingId", "orgId");

-- CreateIndex
CREATE UNIQUE INDEX "bookable_asset_floorId_name_key" ON "bookable_asset"("floorId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "floor_plan_element_spaceId_key" ON "floor_plan_element"("spaceId");

-- CreateIndex
CREATE INDEX "booking_orgId_idx" ON "booking"("orgId");

-- CreateIndex
CREATE INDEX "booking_bookableAssetId_startTs_endTs_idx" ON "booking"("bookableAssetId", "startTs", "endTs");

-- CreateIndex
CREATE INDEX "booking_orgId_userId_startTs_endTs_idx" ON "booking"("orgId", "userId", "startTs", "endTs");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_organization" ADD CONSTRAINT "user_organization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_organization" ADD CONSTRAINT "user_organization_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "building" ADD CONSTRAINT "building_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "building" ADD CONSTRAINT "building_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "floor" ADD CONSTRAINT "floor_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "building"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "floor" ADD CONSTRAINT "floor_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "floor" ADD CONSTRAINT "floor_activeFloorPlanId_fkey" FOREIGN KEY ("activeFloorPlanId") REFERENCES "floor_plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookable_asset" ADD CONSTRAINT "bookable_asset_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "floor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookable_asset" ADD CONSTRAINT "bookable_asset_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "floor_plan" ADD CONSTRAINT "floor_plan_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "floor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "floor_plan_element" ADD CONSTRAINT "floor_plan_element_floorPlanId_fkey" FOREIGN KEY ("floorPlanId") REFERENCES "floor_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "floor_plan_element" ADD CONSTRAINT "floor_plan_element_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space" ADD CONSTRAINT "space_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space" ADD CONSTRAINT "space_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "floor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space" ADD CONSTRAINT "space_floorPlanId_fkey" FOREIGN KEY ("floorPlanId") REFERENCES "floor_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space" ADD CONSTRAINT "space_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "bookable_asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_bookableAssetId_fkey" FOREIGN KEY ("bookableAssetId") REFERENCES "bookable_asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
