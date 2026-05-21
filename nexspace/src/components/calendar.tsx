"use client"

import FullCalendar, { ToolbarInput } from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/classic"; // YOUR THEME
import dayGridPlugin from "@fullcalendar/react/daygrid";
import { useTheme } from "next-themes";
// import multiMonthPlugin from '@fullcalendar/multimonth'
// import timeGridPlugin from '@fullcalendar/timegrid'
// import listPlugin from '@fullcalendar/list';

const toolbarInput: ToolbarInput = {
    left: 'prev,next today', // Action buttons on the left
    center: 'title',        // Title in the center
    // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek,dayGridWeek,dayGridDay,multiMonthYear,multiMonthYear' // View switcher buttons on the right
    right: 'dayGridMonth'
}

export default function Calendar() {
    const { resolvedTheme } = useTheme();
    return (
        <FullCalendar
            plugins={[themePlugin, dayGridPlugin]}
            initialView="dayGridMonth"
            colorScheme={resolvedTheme}
            headerToolbar={toolbarInput}
            events={[
                { title: "event 1", date: "2026-05-01" },
                { title: "event 2", date: "2026-05-02" },
            ]}
        />
    )
}