"use client";

import { useState, useMemo } from "react";

export default function ProgramWiseRegistrations({ registrations = [], onStatusChange }) {
    const [selectedProgram, setSelectedProgram] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // ১. সকল ইউনিক প্রোগ্রামের তালিকা বের করা
    const uniquePrograms = useMemo(() => {
        const programsMap = new Map();
        registrations.forEach((item) => {
            if (item.targetTitle && !programsMap.has(item.targetTitle)) {
                programsMap.set(item.targetTitle, {
                    title: item.targetTitle,
                    category: item.categoryType || "N/A",
                });
            }
        });
        return Array.from(programsMap.values());
    }, [registrations]);

    // ২. সিলেক্টেড প্রোগ্রাম ও অন্যান্য ফিল্টার অনুযায়ী ডাটা ফিল্টার করা
    const filteredRegistrations = useMemo(() => {
        return registrations.filter((item) => {
            const matchesProgram =
                selectedProgram === "All" || item.targetTitle === selectedProgram;

            const matchesStatus =
                statusFilter === "All" || item.paymentStatus === statusFilter;

            const matchesSearch =
                item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesProgram && matchesStatus && matchesSearch;
        });
    }, [registrations, selectedProgram, statusFilter, searchTerm]);

    // ৩. সিলেক্টেড প্রোগ্রামের লাইভ স্ট্যাটিস্টিক্স হিসেব করা
    const stats = useMemo(() => {
        const programData =
            selectedProgram === "All"
                ? registrations
                : registrations.filter((item) => item.targetTitle === selectedProgram);

        const total = programData.length;
        const paid = programData.filter((i) => i.paymentStatus === "Paid").length;
        const pending = programData.filter((i) => i.paymentStatus === "Pending").length;
        const rejected = programData.filter((i) => i.paymentStatus === "Rejected").length;

        return { total, paid, pending, rejected };
    }, [registrations, selectedProgram]);

    return (
        <div className="space-y-6">
            {/* Header & Program Selector */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white">Program-Wise Registrations</h2>
                        <p className="text-sm text-slate-400">
                            Select a specific event or workshop to view its applicants.
                        </p>
                    </div>

                    {/* Program Dropdown Selector */}
                    <div className="min-w-[260px]">
                        <label className="block text-xs text-slate-400 mb-1 font-medium">
                            Select Program / Event:
                        </label>
                        <select
                            value={selectedProgram}
                            onChange={(e) => setSelectedProgram(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-950 border border-indigo-500/30 text-indigo-300 font-semibold rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                        >
                            <option value="All">🌐 All Programs ({registrations.length})</option>
                            {uniquePrograms.map((prog, index) => {
                                const count = registrations.filter(
                                    (r) => r.targetTitle === prog.title
                                ).length;
                                return (
                                    <option key={index} value={prog.title}>
                                        [{prog.category}] {prog.title} ({count})
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                {/* Selected Program Overview Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                    <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                        <span className="text-xs text-slate-400">Total Applicants</span>
                        <div className="text-xl font-bold text-white mt-1">{stats.total}</div>
                    </div>
                    <div className="bg-slate-950/60 border border-emerald-500/20 p-3 rounded-xl">
                        <span className="text-xs text-emerald-400">Approved (Paid)</span>
                        <div className="text-xl font-bold text-emerald-400 mt-1">{stats.paid}</div>
                    </div>
                    <div className="bg-slate-950/60 border border-amber-500/20 p-3 rounded-xl">
                        <span className="text-xs text-amber-400">Pending Review</span>
                        <div className="text-xl font-bold text-amber-400 mt-1">{stats.pending}</div>
                    </div>
                    <div className="bg-slate-950/60 border border-red-500/20 p-3 rounded-xl">
                        <span className="text-xs text-red-400">Rejected</span>
                        <div className="text-xl font-bold text-red-400 mt-1">{stats.rejected}</div>
                    </div>
                </div>
            </div>

            {/* Search & Status Filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="md:col-span-2">
                    <input
                        type="text"
                        placeholder="Search within selected program by Name, ID, TxID, Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                    >
                        <option value="All">All Payment Statuses</option>
                        <option value="Pending">⏳ Pending Only</option>
                        <option value="Paid">✅ Approved (Paid)</option>
                        <option value="Free">🎁 Free</option>
                        <option value="Rejected">❌ Rejected</option>
                    </select>
                </div>
            </div>

            {/* Registrations List Table */}
            {filteredRegistrations.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400 text-sm">
                    No applicants found for the selected program/criteria.
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-800/60 text-xs text-slate-400 uppercase border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">Student Info</th>
                                    <th className="px-6 py-4">Department & Batch</th>
                                    <th className="px-6 py-4">Program Title</th>
                                    <th className="px-6 py-4">Payment</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredRegistrations.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-800/40 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-white">{item.studentName}</div>
                                            <div className="text-xs text-indigo-400 font-mono">ID: {item.studentId}</div>
                                            <div className="text-xs text-slate-400">{item.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            <div className="text-slate-200">{item.department}</div>
                                            <div className="text-slate-400">Batch: {item.batch}</div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-200 max-w-xs truncate">
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-indigo-500/20 mr-2 uppercase">
                                                {item.categoryType}
                                            </span>
                                            {item.targetTitle}
                                        </td>
                                        <td className="px-6 py-4 text-xs space-y-1">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block ${item.paymentStatus === "Paid"
                                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                        : item.paymentStatus === "Pending"
                                                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                            : item.paymentStatus === "Rejected"
                                                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                                                : "bg-slate-800 text-slate-400"
                                                    }`}
                                            >
                                                {item.paymentStatus}
                                            </span>
                                            {item.transactionId && (
                                                <div className="font-mono text-slate-400 text-[11px]">
                                                    TxID: {item.transactionId}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                {item.paymentStatus !== "Paid" && (
                                                    <button
                                                        onClick={() => onStatusChange && onStatusChange(item._id, "Paid")}
                                                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                {item.paymentStatus !== "Rejected" && (
                                                    <button
                                                        onClick={() => onStatusChange && onStatusChange(item._id, "Rejected")}
                                                        className="px-2.5 py-1 bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-red-300 hover:text-white text-xs font-medium rounded-lg transition"
                                                    >
                                                        Reject
                                                    </button>
                                                )}
                                            </div>
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