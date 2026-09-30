"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminWorkshopsPage() {
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWorkshops = async () => {
        try {
            const res = await fetch("/api/workshops");
            const data = await res.json();
            if (data.success) {
                setWorkshops(data.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch workshops:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkshops();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this workshop?")) return;

        try {
            const res = await fetch(`/api/workshops/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (data.success) {
                alert("Workshop deleted successfully!");
                setWorkshops(workshops.filter((item) => item._id !== id));
            } else {
                alert(data.message || "Failed to delete workshop");
            }
        } catch (err) {
            alert("Error deleting workshop");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Manage Workshops</h1>
                    <p className="text-slate-400 text-sm mt-1">View, add or remove university workshops</p>
                </div>
                <Link
                    href="/admin/workshops/new"
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/20"
                >
                    + Add New Workshop
                </Link>
            </div>

            {loading ? (
                <div className="text-slate-400">Loading workshops...</div>
            ) : workshops.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                    No workshops found. Click "+ Add New Workshop" to create one!
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-800/60 text-xs text-slate-400 uppercase border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">Workshop Info</th>
                                    <th className="px-6 py-4">Instructor & Venue</th>
                                    <th className="px-6 py-4">Fee & Deadline</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {workshops.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0 relative">
                                                    <img
                                                        src={item.bannerUrl}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-white">{item.title}</div>
                                                    <div className="text-xs text-slate-400">Organizer: {item.organizer}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs space-y-1">
                                            <div className="text-slate-200 font-medium">
                                                {item.instructors?.[0]?.name || "N/A"}
                                            </div>
                                            <div className="text-slate-400">{item.venue}</div>
                                        </td>
                                        <td className="px-6 py-4 text-xs space-y-1">
                                            <div className="text-indigo-400 font-semibold">
                                                {item.registrationFee > 0 ? `৳${item.registrationFee}` : "Free"}
                                            </div>
                                            <div className="text-slate-400">
                                                Until: {item.registrationDeadline ? new Date(item.registrationDeadline).toLocaleDateString() : "N/A"}
                                            </div>
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