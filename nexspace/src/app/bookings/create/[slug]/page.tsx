"use server"

import { BookingForm } from "@/components/form/booking-form";
import { TabsIcons } from "@/components/nav-tabs";
import { getCurrentUser } from "@/data/auth";
import { getSpace } from "@/data/space";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const space = await getSpace(slug)
    const user = await getCurrentUser()

    return <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
        <main className="flex gap-4 min-h-screen w-full flex-col items-center justify-start mt-6 px-16 bg-white dark:bg-black sm:items-start">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                <BookingForm space={space} user={user} />
            </div>
        </main>
    </div>
}