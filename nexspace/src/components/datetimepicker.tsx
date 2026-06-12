"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DateTimePickerProps {
    value?: Date
    onChange?: (date: Date) => void
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
    // Handle date block changes from the Calendar primitive
    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (!selectedDate) return

        const newDate = new Date(selectedDate)
        if (value) {
            newDate.setHours(value.getHours())
            newDate.setMinutes(value.getMinutes())
        }
        onChange?.(newDate)
    }

    // Handle time block changes via the native input element
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = e.target.value // Format: "HH:mm"
        if (!time) return

        const [hours, minutes] = time.split(":").map(Number)
        const newDate = value ? new Date(value) : new Date()
        newDate.setHours(hours)
        newDate.setMinutes(minutes)
        onChange?.(newDate)
    }

    return (
        <Popover>
            <PopoverTrigger render={<Button
                variant={"outline"}
                className={cn(
                    "w-full justify-start text-left font-normal",
                    !value && "text-muted-foreground"
                )}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(value, "PPP HH:mm") : <span>Pick date & time</span>}
            </Button>}>

            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 flex flex-col" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={handleDateSelect}
                />
                <div className="p-3 border-t border-border flex items-center gap-2">
                    <span className="text-xs font-medium">Time:</span>
                    <Input
                        type="time"
                        className="h-9 w-full"
                        value={value ? format(value, "HH:mm") : ""}
                        onChange={handleTimeChange}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}
