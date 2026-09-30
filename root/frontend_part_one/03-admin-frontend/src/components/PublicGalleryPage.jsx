"use client";

import { useEffect, useState } from "react";
import ParallaxUnfurlingGallery from "@/components/ui/3d-parallax-unfurling-gallery";
import { Loader2, Filter } from "lucide-react";

export default function PublicGalleryPage() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        fetch("/api/gallery")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setPhotos(data.data);
                }
            })
            .catch((err) => console.error("Failed to load gallery:", err))
            .finally(() => setLoading(false));
    }, []);

    // ক্যাটাগরি ফিল্টার
    const categories = [
        "All",
        ...Array.from(new Set(photos.map((p) => p.eventCategory).filter(Boolean))),
    ];

    const filteredPhotos = photos.filter((item) =>
        selectedCategory === "All" ? true : item.eventCategory === selectedCategory
    );

    return (
        <div className="relative w-full min-h-screen bg-slate-900/60 text-white">
            
            

            {/* লোডিং স্টেট */}
            {loading ? (
                <div className="h-screen w-full flex items-center justify-center flex-col gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                    <p className="text-sm text-zinc-400">Loading 3D Gallery...</p>
                </div>
            ) : (
                /* ৩ডি গ্যালারি উপাদান */
                <ParallaxUnfurlingGallery images={filteredPhotos} />
            )}
        </div>
    );
}