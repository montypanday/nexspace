// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/app/generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool: Pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const org1 = await prisma.organization.upsert({
        where: { orgId: 'ff415cb4-0ac6-4820-bd6b-ec3b5007a06d' },
        update: {},
        create: {
            orgId: 'ff415cb4-0ac6-4820-bd6b-ec3b5007a06d',
            name: 'LutherOne',
            externalId: 'org_3DybMuAy1iXFtFkhL37IYjeMNnB'
        }
    })

    const user1 = await prisma.user.upsert({
        where: { userId: 'da0b0ec6-653e-4a5d-a4c7-427cca7b48ba' },
        update: {},
        create: {
            userId: 'da0b0ec6-653e-4a5d-a4c7-427cca7b48ba',
            externalId: 'user_3DyapzGryaTcASKHIsEB5hSl6G3',
            organizations: {
                create: [
                    { organization: { connect: { orgId: org1.orgId } } }
                ]
            }
        }
    })

    const location1 = await prisma.location.upsert({
        where: { locationId: '2fa5ac71-3db4-4c1d-a838-7905777d8399' },
        update: {},
        create: {
            locationId: '2fa5ac71-3db4-4c1d-a838-7905777d8399',
            orgId: org1.orgId,
            name: 'HQ',
            address: '123 Main St',
            tz: 'Australia/Melbourne'
        }
    })

    const building1 = await prisma.building.upsert({
        where: { buildingId: '00af06df-4864-42a5-baf1-a582346a51d9' },
        update: {},
        create: {
            buildingId: '00af06df-4864-42a5-baf1-a582346a51d9',
            orgId: org1.orgId,
            locationId: location1.locationId,
            name: 'Building DA',
            address: '123 Main St'
        }
    })

    const floor1 = await prisma.floor.upsert({
        where: { floorId: '00af06df-4864-42a5-baf1-a582346a51d9' },
        update: {},
        create: {
            floorId: '00af06df-4864-42a5-baf1-a582346a51d9',
            orgId: org1.orgId,
            buildingId: building1.buildingId,
            name: 'Level 1'
        }
    })

    const spaces = await prisma.$transaction([
        prisma.space.create({ data: { spaceId: 'e8388736-e624-4a86-a64d-b5e98816e44a', orgId: org1.orgId, floorId: floor1.floorId, name: 'D-301' } }),
        prisma.space.create({ data: { spaceId: '338d8d48-5ea5-4395-8def-e7206e345390', orgId: org1.orgId, floorId: floor1.floorId, name: 'D-302' } }),
        prisma.space.create({ data: { spaceId: '4f4641ff-e9c5-48f6-b741-ead304b9a036', orgId: org1.orgId, floorId: floor1.floorId, name: 'Quiet' } })
    ])

    const startDate1 = new Date();
    const endDate1 = new Date();
    endDate1.setHours(endDate1.getHours() + 8);

    const bookings = await prisma.$transaction([

        prisma.booking.create({
            data:
            {
                bookingId: '27f8061a-a671-4ec8-88f8-4c959afe211d',
                orgId: org1.orgId,
                spaceId: 'e8388736-e624-4a86-a64d-b5e98816e44a',
                userId: user1.userId,
                startTs: startDate1,
                endTs: endDate1
            }
        })
    ])

    console.log({ org1, user1, location1, building1, floor1, spaces, bookings })
}

main().catch(e => { console.error(e); process.exit(1) }).finally(async () => prisma.$disconnect())
