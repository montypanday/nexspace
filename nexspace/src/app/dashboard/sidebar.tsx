"use client"

import * as React from "react"
import {
    IconCamera,
    IconChartBar,
    IconDashboard,
    IconDatabase,
    IconFileAi,
    IconFileDescription,
    IconFileWord,
    IconFolder,
    IconHelp,
    IconInnerShadowTop,
    IconListDetails,
    IconReport,
    IconSearch,
    IconSettings,
    IconUsers,
} from "@tabler/icons-react"

import {
    Sidebar as UISidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import { Calendar } from "lucide-react"

const data = {
    navMain: [
        {
            title: "My bookings",
            url: "#",
            icon: Calendar,
        }
    ],
    navClouds: [],
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: IconSettings,
        }
    ],
    documents: [],
}

export function Sidebar({ ...props }: React.ComponentProps<typeof UISidebar>) {
    return (
        <UISidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            render={<a href="#">
                                <IconInnerShadowTop className="size-5!" />
                                <span className="text-base font-semibold">Nexspace</span>
                            </a>}
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >

                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </UISidebar>
    )
}