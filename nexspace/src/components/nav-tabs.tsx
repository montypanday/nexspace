'use client'
import { CalendarIcon, GroupIcon } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function TabsIcons() {
    const pathname = usePathname()
    return (
        <Tabs value={pathname} >
            <TabsList>
                <TabsTrigger value="/" >
                    <Link href="/" className="flex items-center gap-2">
                        <GroupIcon className="h-4 w-4" />
                        Organizations
                    </Link>
                </TabsTrigger>
                <TabsTrigger value="/bookings">
                    <Link href="/bookings" className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        My Bookings
                    </Link>
                </TabsTrigger>
            </TabsList>
        </Tabs>
    )
}
