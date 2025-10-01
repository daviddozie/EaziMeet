"use client"

import * as React from "react"
import { CalendarIcon, X } from "lucide-react"
import { format, parse, isValid } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type Calendar28Props = {
    value?: string
    onChange: (value: string) => void
}

function formatDate(date: Date | undefined) {
    if (!date) return ""
    return format(date, "MMMM dd, yyyy")
}

export function Calendar28({ value, onChange }: Calendar28Props) {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(
        value ? new Date(value) : undefined
    )
    const [month, setMonth] = React.useState<Date | undefined>(date)

    React.useEffect(() => {
        if (date) {
            onChange(formatDate(date))
        }
    }, [date, onChange])

    const handleInputChange = (inputValue: string) => {
        onChange(inputValue)
        const parsed = parse(inputValue, "MMMM dd, yyyy", new Date())
        if (isValid(parsed)) {
            setDate(parsed)
            setMonth(parsed)
        }
    }

    return (
        <div className="relative flex gap-2 w-full">
            <Input
                id="date"
                value={value || ""}
                placeholder="June 01, 2025"
                className=" pr-16 h-12 bg-[#0c1d36] border-none text-slate-200 rounded-lg"
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                        e.preventDefault()
                        setOpen(true)
                    }
                    if (e.key === "Enter") {
                        const parsed = parse(value || "", "MMMM dd, yyyy", new Date())
                        if (isValid(parsed)) {
                            setDate(parsed)
                            setMonth(parsed)
                            setOpen(false)
                        }
                    }
                }}
            />

            {/* Clear button */}
            {value && (
                <Button
                    variant="ghost"
                     className="absolute top-[55%] right-10 size-6 -translate-y-1/2 p-0 text-slate-300 hover:text-slate-300 hover:bg-[#0c1d36] cursor-pointer"
                    onClick={() => {
                        onChange("")
                        setDate(undefined)
                    }}
                >
                    <X className="size-3.5" />
                    <span className="sr-only">Clear date</span>
                </Button>
            )}

            {/* Calendar button */}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date-picker"
                        variant="ghost"
                        className="absolute top-[55%] right-2 size-6 -translate-y-1/2 p-0 text-slate-300 hover:text-slate-300 hover:bg-[#0c1d36] cursor-pointer"
                    >
                        <CalendarIcon className="size-3.5" />
                        <span className="sr-only">Select date</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[280px] overflow-hidden p-0"
                    align="end"
                    alignOffset={-8}
                    sideOffset={10}
                >
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        month={month}
                        onMonthChange={setMonth}
                        onSelect={(selectedDate) => {
                            if (!selectedDate) return
                            setDate(selectedDate)
                            onChange(formatDate(selectedDate))
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
