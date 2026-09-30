"use client";

import { useEffect, useState } from "react";

export default function AdminRegistrationsPage() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("All"); // All, Event, Workshop
    const [statusFilter, setStatusFilter] = useState("All"); // All, Pending, Paid, Free, Rejected
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const fetchRegistrations = async () => {
        try {
            const res = await fetch("/api/registrations");
            const data = await res.json();
            if (data.success) {
                setRegistrations(data.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch registrations:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    // Status Update Handler (Approve / Reject)
    const handleStatusChange = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            const res = await fetch(`/api/registrations/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentStatus: newStatus }),
            });

            const data = await res.json();
            if (data.success) {
                setRegistrations((prev) =>
                    prev.map((item) =>
                        item._id === id ? { ...item, paymentStatus: newStatus } : item
                    )
                );
            } else {
                alert(data.message || "Failed to update status");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred while updating status.");
        } finally {
            setUpdatingId(null);
        }
    };

    // Filter & Search Logic
    const filteredData = registrations.filter((item) => {
        const matchesType =
            filterType === "All" ||
            item.categoryType?.toLowerCase() === filterType.toLowerCase();

        const matchesStatus =
            statusFilter === "All" || item.paymentStatus === statusFilter;

        const matchesSearch =
            item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.targetTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesType && matchesStatus && matchesSearch;
    });

    // Export to CSV Function
    const exportToCSV = () => {
        if (filteredData.length === 0) {
            alert("No data available to export!");
            return;
        }

        const headers = [
            "Student Name,Student ID,Email,Phone,Department,Batch,Category,Target Title,Payment Status,Transaction ID,Additional Info,Reg Date\n",
        ];

        const rows = filteredData.map(
            (item) =>
                `"${item.studentName || ""}","${item.studentId || ""}","${item.email || ""}","${item.phone || ""}","${item.department || ""}","${item.batch || ""}","${item.categoryType || ""}","${item.targetTitle || ""}","${item.paymentStatus || ""}","${item.transactionId || "N/A"}","${item.additionalInfo || "N/A"}","${new Date(item.createdAt).toLocaleDateString()}"\n`
        );

        const blob = new Blob([...headers, ...rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `registrations_${filterType.toLowerCase()}_${Date.now()}.csv`;
        a.click();
    };

    return (
        <div className="space-y-6">
            {/* Header & Export Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Student Registrations</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Track, approve, and manage registrations for events and workshops
                    </p>
                </div>

                <button
                    onClick={exportToCSV}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 self-start sm:self-auto"
                >
                    📥 Export CSV
                </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="md:col-span-2">
                    <input
                        type="text"
                        placeholder="Search by Student Name, ID, TxID, Email, Dept, Title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                </div>

                <div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                    >
                        <option value="All">All Categories</option>
                        <option value="Event">Events Only</option>
                        <option value="Workshop">Workshops Only</option>
                    </select>
                </div>

                <div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">⏳ Pending Approval</option>
                        <option value="Paid">✅ Paid / Approved</option>
                        <option value="Free">🎁 Free</option>
                        <option value="Rejected">❌ Rejected</option>
                    </select>
                </div>
            </div>

            {/* Registrations Table */}
            {loading ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                    Loading registrations...
                </div>
            ) : filteredData.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                    No registrations found matching your criteria.
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-800/60 text-xs text-slate-400 uppercase border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">Student Details</th>
                                    <th className="px-6 py-4">Category & Program</th>
                                    <th className="px-6 py-4">Dept & Batch</th>
                                    <th className="px-6 py-4">Payment Status</th>
                                    <th className="px-6 py-4">Additional Info</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredData.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-800/40 transition-colors">
                                        {/* Student Info */}
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-white">{item.studentName}</div>
                                            <div className="text-xs text-indigo-400 font-mono">ID: {item.studentId}</div>
                                            <div className="text-xs text-slate-400">{item.email}</div>
                                            <div className="text-xs text-slate-400">{item.phone}</div>
                                        </td>

                                        {/* Category & Program Title */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase mb-1.5 ${item.categoryType === "Event"
                                                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                    }`}
                                            >
                                                {item.categoryType}
                                            </span>
                                            <div className="text-slate-200 font-medium text-xs max-w-xs truncate">
                                                {item.targetTitle}
                                            </div>
                                        </td>

                                        {/* Dept & Batch */}
                                        <td className="px-6 py-4 text-xs space-y-0.5">
                                            <div className="text-slate-200 font-medium">{item.department}</div>
                                            <div className="text-slate-400">Batch: {item.batch}</div>
                                        </td>

                                        {/* Payment Status & Transaction ID */}
                                        <td className="px-6 py-4 space-y-1">
                                            <div>
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block ${item.paymentStatus === "Paid"
                                                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                                            : item.paymentStatus === "Pending"
                                                                ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                                                                : item.paymentStatus === "Rejected"
                                                                    ? "bg-red-500/10 border border-red-500/20 text-red-400"
                                                                    : "bg-slate-800 text-slate-400"
                                                        }`}
                                                >
                                                    {item.paymentStatus}
                                                </span>
                                            </div>
                                            {item.transactionId && (
                                                <div className="text-[11px] text-amber-300 font-mono bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded inline-block">
                                                    TxID: {item.transactionId}
                                                </div>
                                            )}
                                        </td>

                                        {/* Additional Info */}
                                        <td className="px-6 py-4 text-xs text-slate-400 max-w-xs truncate">
                                            {item.additionalInfo || "N/A"}
                                        </td>

                                        {/* Registration Date */}
                                        <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                                            {new Date(item.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </td>

                                        {/* Approve / Reject Actions */}
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {item.paymentStatus !== "Paid" && (
                                                    <button
                                                        disabled={updatingId === item._id}
                                                        onClick={() => handleStatusChange(item._id, "Paid")}
                                                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition disabled:opacity-50"
                                                    >
                                                        Approve
                                                    </button>
                                                )}

                                                {item.paymentStatus !== "Rejected" && (
                                                    <button
                                                        disabled={updatingId === item._id}
                                                        onClick={() => handleStatusChange(item._id, "Rejected")}
                                                        className="px-2.5 py-1 bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-red-300 hover:text-white text-xs font-medium rounded-lg transition disabled:opacity-50"
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