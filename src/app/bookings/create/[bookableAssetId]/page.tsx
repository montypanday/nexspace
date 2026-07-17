"use server"

import { AddBookingForm } from "@/features/bookings/components/add-booking-form";
import { getCurrentUser } from "@/features/auth/server/queries";
import { getBookableAsset } from "@/features/bookings/server/queries";

export default async function Page({
    params,
}: {
    params: Promise<{ bookableAssetId: string }>
}) {
    const { bookableAssetId } = await params
    const bookableAsset = await getBookableAsset(bookableAssetId)
    const user = await getCurrentUser()

    return <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
        <main className="flex gap-4 min-h-screen w-full flex-col items-center justify-start mt-6 px-16 bg-white dark:bg-black sm:items-start">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                {user && <AddBookingForm bookableAsset={bookableAsset} user={user} />}
            </div>
        </main>
    </div>
}