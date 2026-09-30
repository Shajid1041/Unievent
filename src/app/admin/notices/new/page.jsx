"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadToImgBB } from "@/lib/uploadImage";

export default function CreateNoticePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Academic",
        publishedBy: "Admin Office",
        isPinned: false,
    });
    const [attachmentFile, setAttachmentFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let attachmentUrl = "";
            if (attachmentFile) {
                attachmentUrl = await uploadToImgBB(attachmentFile);
            }

            const res = await fetch("/api/notices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, attachmentUrl }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                alert("Notice Published Successfully!");
                router.push("/admin/notices");
            } else {
                setError(data.message || "Failed to publish notice");
            }
        } catch (err) {
            setError(err.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Post New Notice</h1>
                <p className="text-slate-400 text-sm mt-1">Publish official notice for students & faculty</p>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Notice Title *</label>
                    <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Mid-term Examination Schedule Fall 2026"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Category *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="Academic">Academic</option>
                            <option value="Administrative">Administrative</option>
                            <option value="Exam">Exam</option>
                            <option value="Event">Event</option>
                            <option value="General">General</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Published By</label>
                        <input
                            type="text"
                            name="publishedBy"
                            value={formData.publishedBy}
                            onChange={handleChange}
                            placeholder="e.g. Controller of Examinations"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Attachment (Optional Image/Banner)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAttachmentFile(e.target.files[0])}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                    />
                </div>

                <div className="flex items-center gap-3 py-2">
                    <input
                        type="checkbox"
                        id="isPinned"
                        name="isPinned"
                        checked={formData.isPinned}
                        onChange={handleChange}
                        className="w-4 h-4 accent-indigo-600 rounded"
                    />
                    <label htmlFor="isPinned" className="text-sm font-medium text-slate-300 cursor-pointer">
                        Pin this notice to top 📌
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Notice Description / Content *</label>
                    <textarea
                        name="description"
                        rows="5"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Write the detailed notice text here..."
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 resize-none"
                    ></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/20"
                    >
                        {loading ? "Publishing..." : "Publish Notice"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}