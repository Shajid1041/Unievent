"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadToImgBB } from "@/lib/uploadImage";
import CountdownTimer from "@/components/CountdownTimer";

export default function CreatePosterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
        startDate: "", // ISO Date & Time String
        location: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (!imageFile) {
                alert("Please select a poster image!");
                setSubmitting(false);
                return;
            }

            // ১. ImgBB-তে পোস্টার আপলোড
            const imageUrl = await uploadToImgBB(imageFile);

            // ২. ডেটাবেজে পোস্ট সেভ করা
            const payload = {
                ...formData,
                imageUrl,
            };

            const res = await fetch("/api/posters", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                alert("Poster Posted Successfully!");
                router.push("/admin/posters");
            } else {
                alert(data.message || "Failed to create poster post.");
            }
        } catch (err) {
            console.error(err);
            alert(err.message || "Something went wrong!");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Create Event Poster</h1>
                <p className="text-slate-400 text-sm">Post event announcements with a live countdown timer.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                {/* Form Inputs */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Poster Title *</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g. Annual Tech Fest 2026"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Category *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                            <option value="" disabled className="bg-slate-900 text-slate-400">
                                Select Event Category
                            </option>
                            <option value="Cultural" className="bg-slate-900 text-white">Cultural</option>
                            <option value="Contest" className="bg-slate-900 text-white">Contest</option>
                            <option value="Sports" className="bg-slate-900 text-white">Sports</option>
                            <option value="Fest" className="bg-slate-900 text-white">Fest</option>
                            <option value="Seminar" className="bg-slate-900 text-white">Seminar</option>
                            <option value="Guests" className="bg-slate-900 text-white">Guests</option>
                            <option value="Project" className="bg-slate-900 text-white">Project</option>
                            <option value="Others" className="bg-slate-900 text-white">Others</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Event Starting Date & Time *</label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            required
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Venue / Location</label>
                        <input
                            type="text"
                            name="location"
                            placeholder="e.g. Auditorium Hall / Zoom Link"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Poster Image *</label>
                        <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={handleImageChange}
                            className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/20 file:text-indigo-300 hover:file:bg-indigo-600/30 file:cursor-pointer cursor-pointer bg-slate-950 border border-slate-800 rounded-xl focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            placeholder="Brief information about the event..."
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition disabled:opacity-50"
                    >
                        {submitting ? "Publishing Poster..." : "Publish Poster"}
                    </button>
                </div>

                {/* Live Preview Card */}
                <div className="space-y-3">
                    <h2 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Live Card Preview</h2>
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden p-4 space-y-3">
                        <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs text-slate-600">No Image Selected</span>
                            )}
                        </div>

                        <div>
                            {formData.category && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                                    {formData.category}
                                </span>
                            )}
                            <h3 className="text-lg font-bold text-white mt-2">
                                {formData.title || "Poster Title Here"}
                            </h3>
                            {formData.location && (
                                <p className="text-xs text-slate-400 mt-0.5">📍 {formData.location}</p>
                            )}
                        </div>

                        {/* Live Countdown Component */}
                        <div>
                            <p className="text-[11px] text-slate-400 font-medium">Starts In:</p>
                            <CountdownTimer startDate={formData.startDate} />
                        </div>

                        {formData.description && (
                            <p className="text-xs text-slate-400 line-clamp-2">{formData.description}</p>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}