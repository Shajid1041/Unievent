"use client";

import { useEffect, useState } from "react";

export default function PublicGalleryPage() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        fetch("/api/gallery")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setPhotos(data.data);
            })
            .finally(() => setLoading(false));
    }, []);

    // ক্যাটাগরি ফিল্টার তৈরি করা
    const categories = ["All", ...Array.from(new Set(photos.map((p) => p.eventCategory).filter(Boolean)))];

    const filteredPhotos = photos.filter((item) =>
        selectedCategory === "All" ? true : item.eventCategory === selectedCategory
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
            <div className="max-w-6xl pt-18 mx-auto space-y-8">
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Photo Gallery
                    </h1>
                    <p className="text-slate-400 max-w-lg mx-auto text-sm">
                        Memories and highlights from our recent events and workshops.
                    </p>
                </div>

                {/* Category Filters */}
                {categories.length > 1 && (
                    <div className="flex justify-center flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${selectedCategory === cat
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* Gallery Grid */}
                {loading ? (
                    <div className="text-center py-16 text-slate-500">Loading photo gallery...</div>
                ) : filteredPhotos.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">No photos available.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPhotos.map((item) => (
                            <div
                                key={item._id}
                                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition group"
                            >
                                <div className="aspect-video relative bg-slate-950 overflow-hidden">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                </div>
                                <div className="p-4 space-y-1">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-slate-200 text-sm truncate">{item.title}</h3>
                                        {item.eventCategory && (
                                            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded uppercase font-medium">
                                                {item.eventCategory}
                                            </span>
                                        )}
                                    </div>
                                    {item.caption && <p className="text-xs text-slate-400 line-clamp-2">{item.caption}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}