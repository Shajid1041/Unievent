"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadToImgBB } from "@/lib/uploadImage";

export default function CreateEventPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        description: "",
        category: "Technical",
        date: "",
        startTime: "",
        endTime: "",
        venue: "",
        organizer: "",
        organizerContact: "",
        registrationRequired: false,
        registrationFee: 0,
        registrationType: "internal",
        registrationLink: "",
        registrationDeadline: "",
        maxParticipants: "",
        chiefGuest: "",
        featured: false,
    });

    const [imageFile, setImageFile] = useState(null);
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
            if (!imageFile) {
                throw new Error("Please select an event banner image!");
            }

            // 1. Upload Image
            const imageUrl = await uploadToImgBB(imageFile);

            // 2. Prepare Payload with correct Data Types
            const payload = {
                ...formData,
                imageUrl,
                registrationFee: Number(formData.registrationFee) || 0,
                maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : undefined,
                registrationDeadline: formData.registrationDeadline || undefined,
            };

            // 3. API Call
            const res = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                alert("Event Created Successfully!");
                router.push("/admin/events");
            } else {
                setError(data.message || "Failed to create event");
            }
        } catch (err) {
            setError(err.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div>
                <h1 className="text-2xl font-bold text-white">Create New Event</h1>
                <p className="text-slate-400 text-sm mt-1">Publish a new event on the university portal</p>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
                {/* Title & Subtitle */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Event Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Annual Tech Fest 2026"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Subtitle</label>
                        <input
                            type="text"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            placeholder="e.g. Innovation for Future"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                {/* Category & Chief Guest */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Category *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="Technical">Technical</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Sports">Sports</option>
                            <option value="Academic">Academic</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Chief Guest</label>
                        <input
                            type="text"
                            name="chiefGuest"
                            value={formData.chiefGuest}
                            onChange={handleChange}
                            placeholder="e.g. Prof. Dr. John Doe"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                {/* Organizer Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Organizer *</label>
                        <input
                            type="text"
                            name="organizer"
                            required
                            value={formData.organizer}
                            onChange={handleChange}
                            placeholder="e.g. Computer Club"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Organizer Contact/Email *</label>
                        <input
                            type="text"
                            name="organizerContact"
                            required
                            value={formData.organizerContact}
                            onChange={handleChange}
                            placeholder="e.g. club@university.edu"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                {/* Date, Start Time & End Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Event Date *</label>
                        <input
                            type="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Start Time *</label>
                        <input
                            type="text"
                            name="startTime"
                            required
                            value={formData.startTime}
                            onChange={handleChange}
                            placeholder="e.g. 10:00 AM"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">End Time *</label>
                        <input
                            type="text"
                            name="endTime"
                            required
                            value={formData.endTime}
                            onChange={handleChange}
                            placeholder="e.g. 04:00 PM"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                {/* Venue & Image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Venue Location *</label>
                        <input
                            type="text"
                            name="venue"
                            required
                            value={formData.venue}
                            onChange={handleChange}
                            placeholder="e.g. Central Auditorium"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Banner Image *</label>
                        <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                        />
                    </div>
                </div>

                {/* Registration Section */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-4">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="registrationRequired"
                            name="registrationRequired"
                            checked={formData.registrationRequired}
                            onChange={handleChange}
                            className="w-4 h-4 accent-indigo-600 rounded"
                        />
                        <label htmlFor="registrationRequired" className="text-sm font-medium text-slate-300 cursor-pointer">
                            Registration Required for this Event
                        </label>
                    </div>

                    {formData.registrationRequired && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Registration Fee (USD/$)</label>
                                <input
                                    type="number"
                                    name="registrationFee"
                                    value={formData.registrationFee}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Max Participants</label>
                                <input
                                    type="number"
                                    name="maxParticipants"
                                    value={formData.maxParticipants}
                                    onChange={handleChange}
                                    placeholder="e.g. 100"
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Registration Link</label>
                                <input
                                    type="text"
                                    name="registrationLink"
                                    value={formData.registrationLink}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Event Description *</label>
                    <textarea
                        name="description"
                        rows="4"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Write a detailed description about the event..."
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 resize-none"
                    ></textarea>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/20"
                    >
                        {loading ? "Uploading & Saving..." : "Publish Event"}
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