"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function HeatCalendarLegend({ className }) {
    return (
        <div className={cn("flex items-center justify-end gap-1.5 mt-3 text-xs text-muted-foreground", className)}>
            <span>Less</span>
            <div className="h-3 w-3 rounded-sm bg-muted/40" />
            <div className="h-3 w-3 rounded-sm bg-emerald-200 dark:bg-emerald-950/80" />
            <div className="h-3 w-3 rounded-sm bg-emerald-400 dark:bg-emerald-700" />
            <div className="h-3 w-3 rounded-sm bg-emerald-600 dark:bg-emerald-500" />
            <span>More</span>
        </div>
    );
}