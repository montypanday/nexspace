"use server"

import Calendar from "@/components/calendar"
import { TabsIcons } from "@/components/nav-tabs";

export default async function ShowBookingsPage() {

    return <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
        <main className="flex gap-4 min-h-screen w-full flex-col items-center justify-start mt-6 px-16 bg-white dark:bg-black sm:items-start">
            <TabsIcons />
            <div className="w-full h-svh">
                <Calendar initialView="dayGridMonth" />
            </div>
        </main>
    </div>
}