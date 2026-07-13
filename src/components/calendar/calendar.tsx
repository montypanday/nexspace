"use client"

import FullCalendar, { ToolbarInput, EventInput } from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/classic"; // YOUR THEME
import dayGridPlugin from "@fullcalendar/react/daygrid";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BookingDto } from "@/features/bookings/types";
// import multiMonthPlugin from '@fullcalendar/multimonth'
// import timeGridPlugin from '@fullcalendar/timegrid'
// import listPlugin from '@fullcalendar/list';

const toolbarInput: ToolbarInput = {
    left: 'prev,next today', // Action buttons on the left
    center: 'title',        // Title in the center
    // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek,dayGridWeek,dayGridDay,multiMonthYear,multiMonthYear' // View switcher buttons on the right
    right: 'dayGridMonth'
}

interface CalendarProps {
    initialView: string
}

function getEventInputs(bookings: BookingDto[]): EventInput[] {
    return bookings.map((booking) => ({
        id: booking.id,
        title: booking.title,
        start: booking.startTs,
        end: booking.endTs,
        allDay: booking.allDay,
        url: booking.url ?? undefined
    }))
}

export default function Calendar({ initialView }: CalendarProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // FullCalendar calls this function every time the user changes views or shifts dates
    const fetchEvents = async (fetchInfo: any) => {
        try {
            const startDate: string = encodeURIComponent(fetchInfo.startStr)
            const endDate: string = encodeURIComponent(fetchInfo.endStr)
            const response = await fetch(
                `/api/bookings?startDate=${startDate}&endDate=${endDate}`
            );
            if (!response.ok) throw new Error("Failed to fetch events");
            const data = await response.json();
            return getEventInputs(data)
        } catch (error) {
            console.error(error);
            return []; // Return empty array on failure to prevent calendar crashes
        }
    };

    if (!mounted) return null;

    return (
        <FullCalendar
            plugins={[themePlugin, dayGridPlugin]}
            initialView={initialView}
            colorScheme={resolvedTheme}
            headerToolbar={toolbarInput}
            events={fetchEvents} // Dynamically fetches from client side
            selectable={true}
            height="100%"
            timeZone="local"
            // Safely capture fetching updates without triggering infinite loops
            datesSet={(dateInfo) => {
                // Both fields return standard JavaScript Date objects
                console.log("Start Date:", dateInfo.start);
                console.log("End Date:", dateInfo.end);

                // ISO8601 String representations (useful for API requests)
                console.log("Start ISO String:", dateInfo.startStr);
                console.log("End ISO String:", dateInfo.endStr);
            }}
        />
    )
}