"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadToImgBB } from "@/lib/uploadImage";

export default function CreateWorkshopPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        instructorName: "",
        instructorDesignation: "",
        venue: "",
        registrationFee: 0,
        registrationDeadline: "",
        maxParticipants: 50,
        organizer: "",
        prerequisites: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!imageFile) {
                throw new Error("Please select a workshop banner image!");
            }

            // Upload Banner Image using existing uploadToImgBB helper
            const bannerUrl = await uploadToImgBB(imageFile);

            // Prepare payload to match Workshop schema
            const payload = {
                title: formData.title,
                description: formData.description,
                bannerUrl,
                instructors: [
                    {
                        name: formData.instructorName,
                        designation: formData.instructorDesignation,
                    },
                ],
                prerequisites: formData.prerequisites ? formData.prerequisites.split(",").map((s) => s.trim()) : [],
                venue: formData.venue,
                registrationFee: Number(formData.registrationFee),
                registrationDeadline: formData.registrationDeadline,
                maxParticipants: Number(formData.maxParticipants),
                organizer: formData.organizer,
            };

            const res = await fetch("/api/workshops", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                alert("Workshop Created Successfully!");
                router.push("/admin/workshops");
            } else {
                setError(data.message || "Failed to create workshop");
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
                <h1 className="text-2xl font-bold text-white">Add New Workshop</h1>
                <p className="text-slate-400 text-sm mt-1">Fill out the details to schedule a university workshop</p>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Workshop Title *</label>
                    <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Next.js & Full-stack Architecture"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Instructor Name *</label>
                        <input
                            type="text"
                            name="instructorName"
                            required
                            value={formData.instructorName}
                            onChange={handleChange}
                            placeholder="e.g. Dr. Rahim Ahmed"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Instructor Designation</label>
                        <input
                            type="text"
                            name="instructorDesignation"
                            value={formData.instructorDesignation}
                            onChange={handleChange}
                            placeholder="e.g. Lead Software Engineer"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Organizer *</label>
                        <input
                            type="text"
                            name="organizer"
                            required
                            value={formData.organizer}
                            onChange={handleChange}
                            placeholder="e.g. CSE Department"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Venue / Room No *</label>
                        <input
                            type="text"
                            name="venue"
                            required
                            value={formData.venue}
                            onChange={handleChange}
                            placeholder="e.g. Lab 304, Academic Building"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Registration Fee (৳)</label>
                        <input
                            type="number"
                            name="registrationFee"
                            value={formData.registrationFee}
                            onChange={handleChange}
                            placeholder="0 for Free"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Registration Deadline *</label>
                        <input
                            type="date"
                            name="registrationDeadline"
                            required
                            value={formData.registrationDeadline}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Max Participants</label>
                        <input
                            type="number"
                            name="maxParticipants"
                            value={formData.maxParticipants}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Prerequisites (Comma Separated)</label>
                    <input
                        type="text"
                        name="prerequisites"
                        value={formData.prerequisites}
                        onChange={handleChange}
                        placeholder="e.g. HTML, CSS, JavaScript"
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
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
                    <textarea
                        name="description"
                        rows="4"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Workshop outline and details..."
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 resize-none"
                    ></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/20"
                    >
                        {loading ? "Uploading & Saving..." : "Publish Workshop"}
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