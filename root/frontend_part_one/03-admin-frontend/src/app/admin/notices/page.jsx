"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminNoticesPage() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotices = async () => {
        try {
            const res = await fetch("/api/notices");
            const data = await res.json();
            if (data.success) {
                setNotices(data.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch notices:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this notice?")) return;

        try {
            const res = await fetch(`/api/notices/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (data.success) {
                alert("Notice deleted successfully!");
                setNotices((prev) => prev.filter((item) => item._id !== id));
            } else {
                alert(data.message || "Failed to delete notice");
            }
        } catch (err) {
            alert("Error deleting notice");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Notice Board Management</h1>
                    <p className="text-slate-400 text-sm mt-1">Publish and manage campus official notices</p>
                </div>
                <Link
                    href="/admin/notices/new"
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/20"
                >
                    + Post New Notice
                </Link>
            </div>

            {loading ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                    Loading notices...
                </div>
            ) : notices.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                    No notices found. Click "+ Post New Notice" to create one!
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-800/60 text-xs text-slate-400 uppercase border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">Notice Title</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Published Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {notices.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {item.isPinned && (
                                                    <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-medium">
                                                        Pinned 📌
                                                    </span>
                                                )}
                                                <div className="font-semibold text-white">{item.title}</div>
                                            </div>
                                            <div className="text-xs text-slate-400 truncate max-w-md mt-1">
                                                {item.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-indigo-400 rounded-lg text-xs font-medium">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-400">
                                            {new Date(item.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
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