"use client";

import { useState, useEffect, useRef } from "react";
import CountdownTimer from "@/components/CountdownTimer";

export default function UpcomingPostersCarousel() {
    const [posters, setPosters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPoster, setSelectedPoster] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        async function fetchUpcomingPosters() {
            setLoading(true);
            try {
                const res = await fetch("/api/posters");
                const data = await res.json();

                if (data.success && Array.isArray(data.data)) {
                    const now = new Date();

                    // ১. শুধু ভবিষ্যতের (Upcoming) ইভেন্ট ফিল্টার করা
                    // ২. সময় অনুযায়ী প্রথম থেকে শেষের দিকে সর্ট করা (Nearest event first)
                    // ৩. প্রথম ৮টি ইভেন্ট সিলেক্ট করা
                    const upcomingList = data.data
                        .filter((poster) => new Date(poster.startDate) > now)
                        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                        .slice(0, 8);

                    setPosters(upcomingList);
                }
            } catch (err) {
                console.error("Failed to fetch upcoming posters:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchUpcomingPosters();
    }, []);

    // ক্যারোসল ম্যানুয়াল স্ক্রোল কন্ট্রোল
    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;
            scrollRef.current.scrollTo({
                left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: "smooth",
            });
        }
    };

    if (!loading && posters.length === 0) {
        return null; // পোস্টার না থাকলে হোম পেজে কিছু দেখাবে না
    }

    return (
        <section className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            {/* Header with Navigation Controls */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                        🔥 Don't Miss Out
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                        Upcoming Event <span className="text-indigo-500">Posters</span>
                    </h2>
                </div>

                {/* Carousel Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                        onClick={() => scroll("left")}
                        className="p-2.5 bg-slate-900 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-500 rounded-xl text-slate-300 hover:text-white transition"
                        aria-label="Previous"
                    >
                        ◀
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="p-2.5 bg-slate-900 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-500 rounded-xl text-slate-300 hover:text-white transition"
                        aria-label="Next"
                    >
                        ▶
                    </button>
                </div>
            </div>

            {/* Carousel Content Container */}
            {loading ? (
                <div className="flex gap-6 overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="min-w-[280px] sm:min-w-[340px] bg-slate-900/50 border border-slate-800/50 rounded-2xl p-4 space-y-3 animate-pulse"
                        >
                            <div className="aspect-video bg-slate-800 rounded-xl"></div>
                            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                            <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                            <div className="h-10 bg-slate-800/60 rounded-xl"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4"
                >
                    {posters.map((poster) => (
                        <div
                            key={poster._id}
                            className="min-w-[280px] sm:min-w-[340px] max-w-[340px] bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden group transition duration-300 flex flex-col justify-between flex-shrink-0"
                        >
                            <div className="p-4 space-y-3">
                                {/* Image Overlay */}
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
                                        🔍 Click to View
                                    </div>
                                </div>

                                {/* Category & Title */}
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                                        {poster.category}
                                    </span>
                                    <h3 className="text-base font-bold text-white mt-2 line-clamp-1 group-hover:text-indigo-400 transition">
                                        {poster.title}
                                    </h3>
                                    {poster.location && (
                                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                            <span>📍</span> {poster.location}
                                        </p>
                                    )}
                                </div>

                                {/* Live Countdown Component */}
                                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                                    <p className="text-[10px] text-slate-400 font-medium mb-1">Starts In:</p>
                                    <CountdownTimer startDate={poster.startDate} />
                                </div>
                            </div>

                            {/* View Action Button */}
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

            {/* Poster Details Lightbox Modal */}
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
                            className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold bg-slate-950 border border-slate-800 rounded-full w-8 h-8 flex items-center justify-center z-10"
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
        </section>
    );
}