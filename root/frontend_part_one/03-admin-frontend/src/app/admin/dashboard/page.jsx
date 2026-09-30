"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        events: 0,
        workshops: 0,
        registrations: 0,
        notices: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [resE, resW, resR, resN] = await Promise.all([
                    fetch("/api/events"),
                    fetch("/api/workshops"),
                    fetch("/api/registrations"),
                    fetch("/api/notices"),
                ]);

                const dataE = await resE.json();
                const dataW = await resW.json();
                const dataR = await resR.json();
                const dataN = await resN.json();

                setStats({
                    events: dataE.count || 0,
                    workshops: dataW.count || 0,
                    registrations: dataR.count || 0,
                    notices: dataN.count || 0,
                });
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    const cards = [
        { title: "Total Events", count: stats.events, link: "/admin/events", color: "from-blue-600 to-indigo-600" },
        { title: "Active Workshops", count: stats.workshops, link: "/admin/workshops", color: "from-purple-600 to-pink-600" },
        { title: "Total Registrations", count: stats.registrations, link: "/admin/registrations", color: "from-emerald-600 to-teal-600" },
        { title: "Published Notices", count: stats.notices, link: "/admin/notices", color: "from-amber-600 to-orange-600" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-slate-400 mt-1">Welcome back! Here is what's happening across the campus platform.</p>
            </div>

            {loading ? (
                <div className="text-slate-400">Loading overview data...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-400">{card.title}</p>
                                <h3 className="text-3xl font-extrabold text-white mt-2">{card.count}</h3>
                            </div>
                            <Link
                                href={card.link}
                                className="mt-6 inline-flex items-center text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                            >
                                Manage Records &rarr;
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Action Shortcuts */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <Link
                        href="/admin/events/new"
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition"
                    >
                        + Create New Event
                    </Link>
                    <Link
                        href="/admin/workshops/new"
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-sm rounded-xl transition"
                    >
                        + Add Workshop
                    </Link>
                    <Link
                        href="/admin/notices/new"
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-sm rounded-xl transition"
                    >
                        + Publish Notice
                    </Link>
                </div>
            </div>
        </div>
    );
}