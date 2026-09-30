"use client";

import React from "react";
import { useHeatCalendar } from "./context";
import { cn } from "@/lib/utils";

function getBgClass(val) {
    if (!val || val === 0) return "bg-slate-800 hover:bg-slate-700";
    if (val <= 2) return "bg-emerald-500/40 hover:ring-2 hover:ring-emerald-400";
    if (val <= 5) return "bg-emerald-500 hover:ring-2 hover:ring-emerald-300";
    return "bg-emerald-300 hover:ring-2 hover:ring-emerald-200";
}

export function HeatCalendarGrid({ children, className }) {
    const { values = [], weeks = 16 } = useHeatCalendar();

    return (
        <div className={cn("flex gap-1.5 overflow-x-auto", className)}>
            {Array.from({ length: weeks }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1.5">
                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                        const count = values[weekIndex]?.[dayIndex] || 0;
                        return (
                            <div
                                key={dayIndex}
                                className={cn(
                                    "h-3.5 w-3.5 rounded-sm transition-colors duration-150 cursor-pointer",
                                    getBgClass(count)
                                )}
                                title={`Level: ${count}`}
                            />
                        );
                    })}
                </div>
            ))}
            {children}
        </div>
    );
}