"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Calendar, Loader2 } from "lucide-react";
import {
    HeatCalendar,
    HeatCalendarGrid,
    HeatCalendarLegend,
    HeatCalendarTooltip,
} from "@/components/ui/heat-calendar";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function EventHeatCalendar() {
    const [loading, setLoading] = useState(true);

    // বর্তমান মাস + পরবর্তী ২ মাস (মোট ৩ মাস) আলাদা বক্সে জেনারেট করার লজিক
    const monthsData = useMemo(() => {
        const today = new Date();
        const months = [];

        // offset 0 (Current Month), offset 1 (Next Month), offset 2 (Next 2nd Month)
        for (let offset = 0; offset <= 2; offset++) {
            const d = new Date(today.getFullYear(), today.getMonth() + offset, 1);
            const year = d.getFullYear();
            const month = d.getMonth();

            months.push({
                year,
                month,
                monthName: d.toLocaleString("en-US", { month: "short" }),
                totalDays: new Date(year, month + 1, 0).getDate(),
                startDay: new Date(year, month, 1).getDay(),
                matrix: Array.from({ length: 5 }, () => Array(7).fill(0)),
            });
        }

        return months;
    }, []);

    const [matrices, setMatrices] = useState(() =>
        monthsData.map((m) => m.matrix)
    );

    useEffect(() => {
        async function fetchEvents() {
            try {
                const res = await fetch("/api/events");
                const json = await res.json();

                if (json.success && Array.isArray(json.data)) {
                    processThreeMonthsData(json.data);
                }
            } catch (err) {
                console.error("Failed to load events for Heatmap", err);
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, [monthsData]);

    /**
     * বর্তমান মাস এবং পরবর্তী ২ মাসের Event Processing Logic
     */
    const processThreeMonthsData = (eventList) => {
        const countsByDate = {};
        eventList.forEach((evt) => {
            if (!evt.date) return;
            const dateKey = new Date(evt.date).toISOString().split("T")[0];
            countsByDate[dateKey] = (countsByDate[dateKey] || 0) + 1;
        });

        const updatedMatrices = monthsData.map((mInfo) => {
            const newMatrix = Array.from({ length: 5 }, () => Array(7).fill(0));

            for (let day = 1; day <= mInfo.totalDays; day++) {
                const targetDate = new Date(mInfo.year, mInfo.month, day);
                const dateStr = targetDate.toLocaleDateString("sv-SE");

                const eventCount = countsByDate[dateStr] || 0;

                const position = mInfo.startDay + (day - 1);
                const weekIndex = Math.floor(position / 7);
                const dayIndex = position % 7;

                if (weekIndex < 5) {
                    if (eventCount === 1) {
                        newMatrix[weekIndex][dayIndex] = 2; // Low
                    } else if (eventCount >= 2 && eventCount <= 3) {
                        newMatrix[weekIndex][dayIndex] = 5; // Medium
                    } else if (eventCount >= 4) {
                        newMatrix[weekIndex][dayIndex] = 9; // High
                    } else {
                        newMatrix[weekIndex][dayIndex] = 0;
                    }
                }
            }

            return newMatrix;
        });

        setMatrices(updatedMatrices);
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-6 rounded-xl border bg-slate-900 text-card-foreground shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-semibold text-white text-lg">
                        Upcoming 3-Month Activity
                    </h3>
                </div>
                <div className="text-xs text-slate-400 flex gap-3">
                    <span>🟢 Low (1)</span>
                    <span>🔵 Medium (2-3)</span>
                    <span>🔴 High (4+)</span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
            ) : (
                <div className="flex flex-col items-center p-2">
                    {/* 3-Month Side by Side Separate Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        {monthsData.map((mInfo, mIndex) => (
                            <div
                                key={mIndex}
                                className="flex flex-col items-center bg-slate-800/40 p-4 rounded-lg border border-slate-800"
                            >
                                {/* Month Title */}
                                <h4 className="text-sm font-semibold text-emerald-400 mb-3">
                                    {mInfo.monthName} {mInfo.year}
                                </h4>

                                {/* Calendar Grid with Day Labels */}
                                <div className="flex gap-2.5">
                                    {/* Days Name Column */}
                                    <div className="flex flex-col gap-1.5 text-[10px] text-slate-400 font-medium justify-between py-0.5">
                                        {DAYS.map((day, idx) => (
                                            <span key={idx} className="h-3.5 leading-3.5">
                                                {day}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Heat Calendar Grid */}
                                    <HeatCalendar
                                        unit="events"
                                        weeks={5}
                                        maxCount={10}
                                        values={matrices[mIndex]}
                                    >
                                        <HeatCalendarGrid>
                                            <HeatCalendarTooltip />
                                        </HeatCalendarGrid>
                                    </HeatCalendar>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 w-full flex justify-end">
                        <HeatCalendarLegend />
                    </div>
                </div>
            )}
        </div>
    );
}