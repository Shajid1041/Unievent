"use client";

import { useState, useEffect } from "react";

export default function CountdownTimer({ startDate }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isStarted: false,
    });

    useEffect(() => {
        if (!startDate) return;

        const calculateTimeLeft = () => {
            const difference = new Date(startDate) - new Date();

            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isStarted: true });
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
                isStarted: false,
            });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [startDate]);

    if (timeLeft.isStarted) {
        return (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold px-4 py-2 rounded-xl text-center text-sm">
                🎉 Event Has Started!
            </div>
        );
    }

    return (
        <div className="grid grid-cols-4 gap-2 text-center my-3">
            {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Mins", value: timeLeft.minutes },
                { label: "Secs", value: timeLeft.seconds },
            ].map((item, i) => (
                <div key={i} className="bg-slate-950 border border-slate-800 p-2 rounded-xl">
                    <span className="block text-lg font-bold text-indigo-400">
                        {String(item.value).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">{item.label}</span>
                </div>
            ))}
        </div>
    );
}