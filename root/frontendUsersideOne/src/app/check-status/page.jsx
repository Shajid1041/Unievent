"use client";

import { useState } from "react";

export default function StudentStatusCheckPage() {
    const [searchInput, setSearchInput] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchInput.trim()) return;

        setLoading(true);
        setSearched(true);

        try {
            const res = await fetch(`/api/registrations/check?query=${encodeURIComponent(searchInput)}`);
            const data = await res.json();
            if (data.success) {
                setResults(data.data);
            } else {
                setResults([]);
            }
        } catch (err) {
            console.error(err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center justify-start pt-30">
            <div className="max-w-xl w-full space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Check Registration Status
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Enter your Student ID or Registered Email to track your application.
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        required
                        placeholder="Student ID or Email..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition disabled:opacity-50"
                    >
                        {loading ? "Searching..." : "Check Status"}
                    </button>
                </form>

                {/* Results Section */}
                {searched && (
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-8 text-slate-500">Searching records...</div>
                        ) : results && results.length > 0 ? (
                            results.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                                                {item.categoryType}
                                            </span>
                                            <h3 className="font-semibold text-lg text-white mt-0.5">{item.targetTitle}</h3>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold ${item.paymentStatus === "Paid"
                                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                    : item.paymentStatus === "Rejected"
                                                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                }`}
                                        >
                                            {item.paymentStatus === "Paid"
                                                ? "APPROVED"
                                                : item.paymentStatus === "Rejected"
                                                    ? "REJECTED"
                                                    : "PENDING"}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                                        <div><span className="text-slate-500">Name:</span> {item.studentName}</div>
                                        <div><span className="text-slate-500">Student ID:</span> {item.studentId}</div>
                                        <div><span className="text-slate-500">Dept:</span> {item.department}</div>
                                        <div>
                                            <span className="text-slate-500">Date:</span>{" "}
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                                No registration found for "{searchInput}". Please double-check your ID or Email.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}