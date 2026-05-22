"use client"

import FullCalendar, { ToolbarInput, EventInput } from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/classic"; // YOUR THEME
import dayGridPlugin from "@fullcalendar/react/daygrid";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
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
    events: EventInput[],
    initialView: string
}

export default function Calendar({ events, initialView }: CalendarProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    return (
        <FullCalendar
            plugins={[themePlugin, dayGridPlugin]}
            initialView={initialView}
            colorScheme={resolvedTheme}
            headerToolbar={toolbarInput}
            events={events}
        />
    )
}