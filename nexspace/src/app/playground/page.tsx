"use server"

import Calendar from "@/components/calendar"
import { CoordinatePicker } from "@/components/coordinate-picker";
import { FootprintDrawer } from "@/components/footprint-drawer";
import { AddLocation } from "@/components/form/add-location";
import { TabsIcons } from "@/components/nav-tabs";

export default async function Page() {

    return <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
        <main className="flex gap-4 min-h-screen w-full flex-col items-center justify-start mt-6 px-16 bg-white dark:bg-black sm:items-start">
            {/* <FootprintDrawer /> */}
        </main>
    </div>
}