"use client";

import { useEffect, useState } from "react";
import { uploadToImgBB } from "@/lib/uploadImage";

export default function AdminGalleryPage() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        eventCategory: "",
        caption: "",
    });

    const fetchPhotos = async () => {
        try {
            const res = await fetch("/api/gallery");
            const data = await res.json();
            if (data.success) setPhotos(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (!imageFile) {
                alert("Please select an image file!");
                setSubmitting(false);
                return;
            }

            // 1. Upload Image using uploadToImgBB helper
            const imageUrl = await uploadToImgBB(imageFile);

            // 2. Prepare payload
            const payload = {
                title: formData.title,
                eventCategory: formData.eventCategory,
                caption: formData.caption,
                imageUrl,
            };

            // 3. Save to database
            const res = await fetch("/api/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setFormData({ title: "", eventCategory: "", caption: "" });
                setImageFile(null);
                e.target.reset(); // Reset form inputs including file input
                fetchPhotos();
            } else {
                alert(data.message || "Failed to add photo");
            }
        } catch (err) {
            console.error(err);
            alert(err.message || "Something went wrong!");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this photo?")) return;
        try {
            const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setPhotos((prev) => prev.filter((item) => item._id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 p-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Image Gallery Management</h1>
                <p className="text-slate-400 text-sm">Upload images to feature in your event gallery.</p>
            </div>

            {/* Upload Form */}
            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h2 className="text-lg font-semibold text-white">Add New Photo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="Photo Title *"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                    <select
                        name="eventCategory"
                        value={formData.eventCategory}
                        onChange={handleChange}
                        required
                        className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                        <option value="" disabled className="bg-slate-900 text-slate-400">
                            Select Event Category *
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
                    <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/20 file:text-indigo-300 hover:file:bg-indigo-600/30 file:cursor-pointer cursor-pointer bg-slate-950 border border-slate-800 rounded-xl focus:outline-none"
                    />
                    <input
                        type="text"
                        name="caption"
                        placeholder="Caption (Optional)"
                        value={formData.caption}
                        onChange={handleChange}
                        className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition disabled:opacity-50"
                >
                    {submitting ? "Uploading..." : "Add Photo"}
                </button>
            </form>

            {/* Photos Grid */}
            {loading ? (
                <div className="text-center text-slate-400 py-10">Loading photos...</div>
            ) : photos.length === 0 ? (
                <div className="text-center text-slate-400 py-10">No photos added yet.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {photos.map((item) => (
                        <div key={item._id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group">
                            <div className="aspect-video relative bg-slate-950">
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                                        {item.eventCategory && (
                                            <span className="text-xs text-indigo-400 font-medium uppercase">{item.eventCategory}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="px-3 py-1 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white text-xs font-medium rounded-lg transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                                {item.caption && <p className="text-xs text-slate-400">{item.caption}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}