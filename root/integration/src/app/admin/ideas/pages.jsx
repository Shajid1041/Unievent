"use client";

import { useState, useEffect } from "react";

export default function AdminIdeasPage() {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchIdeas = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/ideas");
            const data = await res.json();
            if (data.success) {
                setIdeas(data.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch ideas:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIdeas();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this project idea?")) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/ideas?id=${id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (data.success) {
                setIdeas((prev) => prev.filter((item) => item._id !== id));
            } else {
                alert(data.message || "Failed to delete idea.");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong while deleting.");
        } finally {
            setDeletingId(null);
        }
    };

    // ফিল্টারিং
    const filteredIdeas = ideas.filter(
        (idea) =>
            idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            idea.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            idea.authorEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 space-y-8">
            {/* Header & Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Project Ideas Moderation</h1>
                    <p className="text-slate-400 text-sm">
                        Review, monitor, and remove inappropriate student project ideas.
                    </p>
                </div>

                <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-72 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
            </div>

            {/* Ideas Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 animate-pulse"
                        >
                            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                            <div className="h-6 bg-slate-800 rounded w-3/4"></div>
                            <div className="h-16 bg-slate-800/60 rounded-xl"></div>
                        </div>
                    ))}
                </div>
            ) : filteredIdeas.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl max-w-lg mx-auto space-y-2">
                    <div className="text-4xl">💡</div>
                    <h3 className="text-lg font-semibold text-white">No ideas found</h3>
                    <p className="text-slate-400 text-xs">
                        There are no project ideas available or matching your search filter.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredIdeas.map((idea) => (
                        <div
                            key={idea._id}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
                        >
                            <div className="space-y-3">
                                <div className="flex justify-between items-start gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                                        {idea.category}
                                    </span>
                                    <span className="text-[11px] text-slate-500">
                                        Posted: {new Date(idea.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-white">{idea.title}</h3>
                                    <p className="text-xs text-indigo-300 font-medium mt-0.5">
                                        👤 Author: {idea.authorName} ({idea.authorEmail})
                                    </p>
                                    {idea.authorContact && (
                                        <p className="text-xs text-slate-400">
                                            📞 Contact: {idea.authorContact}
                                        </p>
                                    )}
                                </div>

                                <p className="text-slate-300 text-xs leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                                    {idea.description}
                                </p>

                                {idea.rolesNeeded?.length > 0 && (
                                    <div className="space-y-1">
                                        <p className="text-[11px] text-slate-400 font-medium">Looking For:</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {idea.rolesNeeded.map((role, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-[11px] bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-0.5 rounded-lg"
                                                >
                                                    🛠️️ {role}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Delete Action Bar */}
                            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                                <span className="text-[10px] text-slate-500">
                                    ID: {idea._id}
                                </span>
                                <button
                                    onClick={() => handleDelete(idea._id)}
                                    disabled={deletingId === idea._id}
                                    className="px-4 py-1.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 text-xs font-semibold rounded-xl transition disabled:opacity-50 flex items-center gap-1.5"
                                >
                                    {deletingId === idea._id ? "Deleting..." : "🗑️ Delete Post"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}