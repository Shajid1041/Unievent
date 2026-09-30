"use client";

import { useState, useEffect } from "react";
import CountdownTimer from "@/components/CountdownTimer";

const CATEGORIES = [
    "All",
    "Cultural",
    "Contest",
    "Sports",
    "Fest",
    "Seminar",
    "Guests",
    "Project",
    "Others",
];

export default function PublicPostersPage() {
    const [posters, setPosters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPoster, setSelectedPoster] = useState(null); // Modal-এর জন্য

    const fetchPosters = async (category) => {
        setLoading(true);
        try {
            const url = category && category !== "All"
                ? `/api/posters?category=${category}`
                : "/api/posters";
            const res = await fetch(url);
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
        fetchPosters(activeCategory);
    }, [activeCategory]);

    // ক্লায়েন্ট-সাইড সার্চ ফিল্টারিং
    const filteredPosters = posters.filter((poster) =>
        poster.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poster.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className=" min-h-screen bg-slate-950 text-white pt-30 pb-20 px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Header Section */}
            <div className="max-w-4xl mx-auto text-center space-y-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                    Upcoming Events & Announcements
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                    Event <span className="text-indigo-500">Posters</span>
                </h1>
                <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
                    Stay updated with all upcoming events, contests, seminars, and cultural programs.
                </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="max-w-6xl mx-auto space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Category Filter Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${activeCategory === cat
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search Box */}
                    <input
                        type="text"
                        placeholder="Search event title or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-64 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                </div>
            </div>

            {/* Posters Grid */}
            <div className="max-w-6xl mx-auto">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-4 space-y-3 animate-pulse">
                                <div className="aspect-video bg-slate-800 rounded-xl"></div>
                                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                                <div className="h-12 bg-slate-800/60 rounded-xl"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredPosters.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-2xl max-w-lg mx-auto space-y-3">
                        <div className="text-4xl">📌</div>
                        <h3 className="text-lg font-semibold text-white">No posters found</h3>
                        <p className="text-slate-400 text-xs">
                            {activeCategory !== "All"
                                ? `No upcoming events found in "${activeCategory}" category.`
                                : "There are currently no active event posters available."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosters.map((poster) => (
                            <div
                                key={poster._id}
                                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden group transition duration-300 flex flex-col justify-between"
                            >
                                <div className="space-y-3 p-4">
                                    {/* Image with Zoom Click */}
                                    <div
                                        onClick={() => setSelectedPoster(poster)}
                                        className="aspect-video bg-slate-950 rounded-xl overflow-hidden cursor-pointer relative group/img"
                                    >
                                        <img
                                            src={poster.imageUrl}
                                            alt={poster.title}
                                            className="w-full h-full object-cover group-hover/img:scale-105 transition duration-500"
                                        />
                                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center text-xs font-semibold text-white">
                                            🔍 Click to View Full Image
                                        </div>
                                    </div>

                                    {/* Event Details */}
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                                            {poster.category}
                                        </span>
                                        <h3 className="text-base font-bold text-white mt-2 group-hover:text-indigo-400 transition">
                                            {poster.title}
                                        </h3>
                                        {poster.location && (
                                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                <span>📍</span> {poster.location}
                                            </p>
                                        )}
                                    </div>

                                    {/* Live Countdown Timer Component */}
                                    <div>
                                        <p className="text-[11px] text-slate-400 font-medium">Starts In:</p>
                                        <CountdownTimer startDate={poster.startDate} />
                                    </div>

                                    {poster.description && (
                                        <p className="text-xs text-slate-400 line-clamp-2">{poster.description}</p>
                                    )}
                                </div>

                                <div className="p-4 pt-0">
                                    <button
                                        onClick={() => setSelectedPoster(poster)}
                                        className="w-full py-2 bg-slate-950 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-500 text-xs font-medium text-slate-300 hover:text-white rounded-xl transition"
                                    >
                                        View Poster Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Poster Lightbox Modal */}
            {selectedPoster && (
                <div
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedPoster(null)}
                >
                    <div
                        className="bg-slate-900 border border-slate-800 max-w-2xl w-full rounded-2xl overflow-hidden p-6 space-y-4 max-h-[90vh] overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedPoster(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold bg-slate-950 border border-slate-800 rounded-full w-8 h-8 flex items-center justify-center"
                        >
                            ✕
                        </button>

                        <div className="rounded-xl overflow-hidden bg-slate-950">
                            <img
                                src={selectedPoster.imageUrl}
                                alt={selectedPoster.title}
                                className="w-full max-h-[60vh] object-contain mx-auto"
                            />
                        </div>

                        <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                                {selectedPoster.category}
                            </span>
                            <h2 className="text-xl font-bold text-white">{selectedPoster.title}</h2>
                            {selectedPoster.location && (
                                <p className="text-xs text-slate-400">📍 Location: {selectedPoster.location}</p>
                            )}
                            <p className="text-xs text-slate-400">
                                📅 Event Time: {new Date(selectedPoster.startDate).toLocaleString()}
                            </p>
                            {selectedPoster.description && (
                                <p className="text-xs text-slate-300 pt-2 border-t border-slate-800">
                                    {selectedPoster.description}
                                </p>
                            )}
                        </div>

                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                            <CountdownTimer startDate={selectedPoster.startDate} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}