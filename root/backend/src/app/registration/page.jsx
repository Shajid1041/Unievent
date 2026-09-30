"use client";

import { useEffect, useState } from "react";
import RegistrationModal from "@/components/RegistrationModal";

export default function RegistrationPage() {
    const [activeTab, setActiveTab] = useState("Event"); // 'Event' or 'Workshop'
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch Items based on active tab
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // dynamic endpoint based on tab (e.g., /api/events or /api/workshops)
                const endpoint = activeTab === "Event" ? "/api/events" : "/api/workshops";
                const res = await fetch(endpoint);
                const data = await res.json();

                if (data.success) {
                    setItems(data.data || []);
                } else {
                    setItems([]);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 pt-30 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="text-center space-y-3">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        Upcoming Events & Workshops
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
                        Select an event or workshop below and register using your student details.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex justify-center">
                    <div className="bg-slate-900 border border-slate-800 p-1 rounded-2xl inline-flex gap-1">
                        <button
                            onClick={() => setActiveTab("Event")}
                            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "Event"
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                                    : "text-slate-400 hover:text-white"
                                }`}
                        >
                            🎉 Events
                        </button>
                        <button
                            onClick={() => setActiveTab("Workshop")}
                            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "Workshop"
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                                    : "text-slate-400 hover:text-white"
                                }`}
                        >
                            🛠️ Workshops
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div
                                key={n}
                                className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 animate-pulse space-y-4"
                            >
                                <div className="h-6 bg-slate-800 rounded w-3/4"></div>
                                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                                <div className="h-16 bg-slate-800 rounded"></div>
                                <div className="h-10 bg-slate-800 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                        No active {activeTab.toLowerCase()}s found at the moment.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <div
                                key={item._id}
                                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all flex flex-col justify-between shadow-xl"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                                            {activeTab}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {item.registrationFee ? (
                                                <span className="text-amber-400 font-semibold">{item.registrationFee}Taka</span>
                                            ) : (
                                                <span className="text-emerald-400 font-semibold">Free</span>
                                            )}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white line-clamp-1">
                                        {item?.title || "Untitled"}
                                    </h3>

                                    <p className="text-xs text-slate-400 line-clamp-3">
                                        {item?.description || "No description provided."}
                                    </p>

                                    {item?.date && (
                                        <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-2">
                                            📅 <span>{new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleOpenModal(item)}
                                    className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/20"
                                >
                                    Register Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Registration Modal Integration */}
                {selectedItem && (
                    <RegistrationModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        targetItem={selectedItem}
                        categoryType={activeTab}
                    />
                )}
            </div>
        </div>
    );
}