"use client"

import {
    IconCreditCard,
    IconDotsVertical,
    IconLogout,
    IconNotification,
    IconUserCircle,
} from "@tabler/icons-react"

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Show, UserAvatar, UserButton, useUser } from "@clerk/nextjs"

export function NavUser({ }: {}) {
    const { isMobile } = useSidebar()
    const { isSignedIn, user, isLoaded } = useUser()
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton>
                    <Show when="signed-in">
                        <UserAvatar />
                        {(isLoaded && isSignedIn) && <div className="grid flex-1 text-left text-sm leading-tight"><span className="truncate font-medium">{user.fullName}</span>
                            <span className="truncate text-xs">{user.primaryEmailAddress?.emailAddress}</span>
                        </div>
                        }
                    </Show>
                </SidebarMenuButton>

            </SidebarMenuItem>
        </SidebarMenu>
    )
}
