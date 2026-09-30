"use client";

import React, { createContext, useContext, useMemo } from "react";

export const HeatCalendarContext = createContext(null);

export function useHeatCalendarModel(props) {
    const {
        values = [],
        weeks = 16,
        unit = "contributions",
        maxCount = 10,
        ...rest
    } = props;

    return useMemo(
        () => ({
            values,
            weeks,
            unit,
            maxCount,
            ...rest,
        }),
        [values, weeks, unit, maxCount, rest]
    );
}

export function useHeatCalendar() {
    const context = useContext(HeatCalendarContext);
    if (!context) {
        throw new Error("useHeatCalendar must be used within HeatCalendar");
    }
    return context;
}