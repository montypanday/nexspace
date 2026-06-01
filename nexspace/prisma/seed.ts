import { hashPassword } from '@/lib/utils';
import { prisma } from '@/prisma';

async function main() {

    const hashedPassword = await hashPassword("password123");

    const org1 = await prisma.organization.upsert({
        where: { id: 'ff415cb4-0ac6-4820-bd6b-ec3b5007a06d' },
        update: {},
        create: {
            id: 'ff415cb4-0ac6-4820-bd6b-ec3b5007a06d',
            name: 'Nexspace',
        }
    })

    const user1 = await prisma.user.upsert({
        where: { id: 'da0b0ec6-653e-4a5d-a4c7-427cca7b48ba' },
        update: {},
        create: {
            id: 'da0b0ec6-653e-4a5d-a4c7-427cca7b48ba',
            email: 'admin@nexspace.com',
            password: hashedPassword,
            organizations: {
                create: [
                    { orgId: org1.id }
                ]
            }
        }
    })

    const location1 = await prisma.location.upsert({
        where: { id: '2fa5ac71-3db4-4c1d-a838-7905777d8399' },
        update: {},
        create: {
            id: '2fa5ac71-3db4-4c1d-a838-7905777d8399',
            orgId: org1.id,
            name: 'HQ',
            address: '123 Main St',
            tz: 'Australia/Melbourne'
        }
    })

    const building1 = await prisma.building.upsert({
        where: { id: '00af06df-4864-42a5-baf1-a582346a51d9' },
        update: {},
        create: {
            id: '00af06df-4864-42a5-baf1-a582346a51d9',
            orgId: org1.id,
            locationId: location1.id,
            name: 'Building DA',
            address: '123 Main St'
        }
    })

    const floor1 = await prisma.floor.upsert({
        where: { id: '00af06df-4864-42a5-baf1-a582346a51d9' },
        update: {},
        create: {
            id: '00af06df-4864-42a5-baf1-a582346a51d9',
            orgId: org1.id,
            buildingId: building1.id,
            name: 'Level 1'
        }
    })

    const spaces = await prisma.$transaction([
        prisma.space.create({ data: { id: 'e8388736-e624-4a86-a64d-b5e98816e44a', orgId: org1.id, floorId: floor1.id, name: 'D-301' } }),
        prisma.space.create({ data: { id: '338d8d48-5ea5-4395-8def-e7206e345390', orgId: org1.id, floorId: floor1.id, name: 'D-302' } }),
        prisma.space.create({ data: { id: '4f4641ff-e9c5-48f6-b741-ead304b9a036', orgId: org1.id, floorId: floor1.id, name: 'Quiet Room 101' } })
    ])

    const startDate1 = new Date();
    startDate1.setHours(9, 0, 0, 0);
    const endDate1 = new Date();
    endDate1.setHours(startDate1.getHours() + 8);

    const booking1 = await prisma.booking.create({
        data:
        {
            id: '27f8061a-a671-4ec8-88f8-4c959afe211d',
            orgId: org1.id,
            spaceId: 'e8388736-e624-4a86-a64d-b5e98816e44a',
            userId: user1.id,
            title: 'Desk Booking',
            startTs: startDate1,
            endTs: endDate1
        }
    });

    const startDate2 = new Date();
    startDate2.setDate(startDate2.getDate() + 7)
    startDate2.setHours(9, 0, 0, 0);
    const endDate2 = new Date();
    endDate2.setDate(startDate2.getDate())
    endDate2.setHours(startDate2.getHours() + 8);

    const booking2 = await prisma.booking.create({
        data:
        {
            id: 'fc183310-16b4-4212-90c0-e17f11c71f39',
            orgId: org1.id,
            spaceId: 'e8388736-e624-4a86-a64d-b5e98816e44a',
            userId: user1.id,
            title: 'Desk Booking (All Day)',
            startTs: startDate2,
            endTs: endDate2,
            allDay: true
        }
    })

    // Event date in last calendar month
    const startDate3 = new Date();
    startDate3.setMonth(startDate3.getMonth() - 1)
    startDate3.setHours(9, 0, 0, 0);
    const endDate3 = new Date();
    endDate3.setDate(startDate3.getDate());
    endDate3.setHours(startDate3.getHours() + 8);

    const booking3 = prisma.booking.create({
        data:
        {
            id: 'f3ae50d1-2c4f-4363-9471-c443dba97525',
            orgId: org1.id,
            spaceId: 'e8388736-e624-4a86-a64d-b5e98816e44a',
            userId: user1.id,
            title: 'Desk Booking (All Day)',
            startTs: startDate3,
            endTs: endDate3,
            allDay: true
        }
    })

    const bookings = [booking1, booking2, booking3]

    console.log({ org1, user1, location1, building1, floor1, spaces, bookings })
}

main().catch(e => { console.error(e); process.exit(1) }).finally(async () => prisma.$disconnect())
