"use client";

import { useState } from "react";

export default function RegistrationModal({ isOpen, onClose, targetItem, categoryType }) {
    // targetItem represents the Event or Workshop object passed from the parent page
    const [formData, setFormData] = useState({
        studentName: "",
        studentId: "",
        department: "",
        batch: "",
        email: "",
        phone: "",
        paymentStatus: targetItem?.isPaid ? "Pending" : "Free",
        transactionId: "",
        additionalInfo: "",
    });

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    if (!isOpen || !targetItem) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        const payload = {
            categoryType: categoryType, // "Event" or "Workshop"
            targetId: targetItem._id,
            targetTitle: targetItem.title,
            ...formData,
        };

        try {
            const res = await fetch("/api/registrations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                setSuccessMsg("Registration successful! Thank you.");
                setTimeout(() => {
                    setSuccessMsg("");
                    onClose();
                }, 2000);
            } else {
                setErrorMsg(data.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setErrorMsg("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-200 my-8">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
                >
                    ✕
                </button>

                {/* Modal Header */}
                <div className="mb-6">
                    <span className="inline-block px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold rounded-full uppercase mb-2">
                        Register for {categoryType}
                    </span>
                    <h2 className="text-xl font-bold text-white">{targetItem.title}</h2>
                </div>

                {/* Success / Error Notifications */}
                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
                        {errorMsg}
                    </div>
                )}
                {successMsg && (
                    <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl">
                        {successMsg}
                    </div>
                )}

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                Student Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="studentName"
                                required
                                value={formData.studentName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                Student ID <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="studentId"
                                required
                                value={formData.studentId}
                                onChange={handleChange}
                                placeholder="202400123"
                                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                Department <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="department"
                                required
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="CSE"
                                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                Batch <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="batch"
                                required
                                value={formData.batch}
                                onChange={handleChange}
                                placeholder="60th"
                                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                Email Address <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="student@univ.edu"
                                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                Phone Number <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="01700000000"
                                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Conditional Payment Transaction Field */}
                    {targetItem?.isPaid && (
                        <div>
                            <label className="block text-xs font-medium text-amber-400 mb-1">
                                Transaction ID (Paid Event)
                            </label>
                            <input
                                type="text"
                                name="transactionId"
                                value={formData.transactionId}
                                onChange={handleChange}
                                placeholder="e.g. bKash TxID / Nagad TxID"
                                className="w-full px-3.5 py-2 bg-slate-950 border border-amber-500/30 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                            Additional Information (Optional)
                        </label>
                        <textarea
                            name="additionalInfo"
                            rows={2}
                            value={formData.additionalInfo}
                            onChange={handleChange}
                            placeholder="Any specific query or requirements..."
                            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-slate-400 hover:text-white transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                        >
                            {loading ? "Submitting..." : "Confirm Registration"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}