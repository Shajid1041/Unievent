"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AdminEventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/events");
            const data = await res.json();
            if (data.success) {
                setEvents(data.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch events:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        try {
            const res = await fetch(`/api/events/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (data.success) {
                alert("Event deleted successfully!");
                setEvents(events.filter((item) => item._id !== id));
            } else {
                alert(data.message || "Failed to delete event");
            }
        } catch (err) {
            alert("Error deleting event");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Manage Campus Events</h1>
                    <p className="text-slate-400 text-sm mt-1">View, add or remove university events</p>
                </div>
                <Link
                    href="/admin/events/new"
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/20"
                >
                    + Create New Event
                </Link>
            </div>

            {loading ? (
                <div className="text-slate-400">Loading events...</div>
            ) : events.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                    No events found. Click "+ Create New Event" to add one!
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-800/60 text-xs text-slate-400 uppercase border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">Event Details</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Date & Venue</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {events.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0 relative">
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-white">{item.title}</div>
                                                    <div className="text-xs text-slate-400 truncate max-w-xs">{item.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-medium">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs space-y-1">
                                            <div className="text-slate-200">{new Date(item.date).toLocaleDateString()}</div>
                                            <div className="text-slate-400">{item.venue}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="text-red-400 hover:text-red-300 text-xs font-semibold px-3 py-1.5 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}