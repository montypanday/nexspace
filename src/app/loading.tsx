import { TabsIcons } from "@/components/nav-tabs";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
    // Or a custom loading skeleton component
    return <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
        <main className="flex gap-4 min-h-screen w-full flex-col items-center justify-start mt-6 px-16 bg-white dark:bg-black sm:items-start">
            <TabsIcons />
            <div className="grid w-full min-h-screen place-items-center">
                <Spinner className="size-10" />
            </div>
        </main>
    </div>
}