"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CountdownTimer from "@/components/CountdownTimer";

export default function AdminPostersPage() {
    const [posters, setPosters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const fetchPosters = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/posters");
            const data = await res.json();
            if (data.success) {
                setPosters(data.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch posters:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosters();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this poster?")) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/posters?id=${id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (data.success) {
                setPosters((prev) => prev.filter((item) => item._id !== id));
            } else {
                alert(data.message || "Failed to delete poster.");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong while deleting.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="p-6 space-y-8">
            {/* Header with Create Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Poster Management</h1>
                    <p className="text-slate-400 text-sm">
                        View, manage, and remove event posters and announcements.
                    </p>
                </div>
                <Link
                    href="/admin/posters/create"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                >
                    <span>➕</span> Add New Poster
                </Link>
            </div>

            {/* Content Section */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 animate-pulse"
                        >
                            <div className="aspect-video bg-slate-800 rounded-xl"></div>
                            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                            <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : posters.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl max-w-lg mx-auto space-y-3">
                    <div className="text-4xl">📌</div>
                    <h3 className="text-lg font-semibold text-white">No posters created yet</h3>
                    <p className="text-slate-400 text-xs">
                        Create your first event poster to display announcements with a countdown timer.
                    </p>
                    <Link
                        href="/admin/posters/create"
                        className="inline-block mt-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
                    >
                        Create Poster
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posters.map((poster) => (
                        <div
                            key={poster._id}
                            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group flex flex-col justify-between"
                        >
                            <div className="p-4 space-y-3">
                                {/* Image Box */}
                                <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden relative">
                                    <img
                                        src={poster.imageUrl}
                                        alt={poster.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800">
                                        {poster.category}
                                    </span>
                                </div>

                                {/* Details */}
                                <div>
                                    <h3 className="font-bold text-white text-base leading-snug">
                                        {poster.title}
                                    </h3>
                                    {poster.location && (
                                        <p className="text-xs text-slate-400 mt-1">
                                            📍 {poster.location}
                                        </p>
                                    )}
                                </div>

                                {/* Live Countdown */}
                                <div>
                                    <p className="text-[11px] text-slate-400 font-medium">Event Time:</p>
                                    <p className="text-xs text-slate-300 font-medium mb-1">
                                        📅 {new Date(poster.startDate).toLocaleString()}
                                    </p>
                                    <CountdownTimer startDate={poster.startDate} />
                                </div>

                                {poster.description && (
                                    <p className="text-xs text-slate-400 line-clamp-2">
                                        {poster.description}
                                    </p>
                                )}
                            </div>

                            {/* Action / Delete Button */}
                            <div className="p-4 pt-0 border-t border-slate-800/60 mt-2 flex items-center justify-between">
                                <span className="text-[11px] text-slate-500">
                                    Added: {new Date(poster.createdAt).toLocaleDateString()}
                                </span>
                                <button
                                    onClick={() => handleDelete(poster._id)}
                                    disabled={deletingId === poster._id}
                                    className="px-3.5 py-1.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 text-xs font-semibold rounded-xl transition disabled:opacity-50 flex items-center gap-1"
                                >
                                    {deletingId === poster._id ? "Deleting..." : "🗑️ Delete"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}