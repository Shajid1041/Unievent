"use client";

import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const ImageCard = ({ src, title, onLoad }) => {
    return (
        <div className="w-full h-[200px] sm:h-[300px] md:h-[400px] flex-shrink-0 bg-[#111] transition-transform duration-300 hover:scale-[1.02] cursor-pointer relative will-change-transform backface-hidden preserve-3d group rounded-lg overflow-hidden ">
            <img
                src={src}
                alt={title || "Gallery Asset"}
                loading="lazy"
                onLoad={onLoad}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            />
            {title && (
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-950 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-xs sm:text-sm font-medium text-white truncate">{title}</p>
                </div>
            )}
        </div>
    );
};

const FALLBACK_IMAGES = [
    { src: "https://images.unsplash.com/photo-1550614000-4b95d4ed798a?auto=format&fit=crop&w=600&q=80" },
    { src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80" },
    { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80" },
    { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" },
];

export default function ParallaxUnfurlingGallery({ images = FALLBACK_IMAGES }) {
    const containerRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const loadedCountRef = useRef(0);

    const handleItemLoad = useCallback(() => {
        loadedCountRef.current += 1;
        if (!isReady && loadedCountRef.current >= 1) setIsReady(true);
    }, [isReady]);

    useEffect(() => {
        const t = setTimeout(() => setIsReady(true), 1200);
        return () => clearTimeout(t);
    }, []);

    const galleryList = useMemo(() => {
        if (!images || images.length === 0) return FALLBACK_IMAGES;
        return images;
    }, [images]);

    const colMedia = useMemo(() => {
        const col1Base = galleryList.filter((_, i) => i % 4 === 0);
        const col2Base = galleryList.filter((_, i) => i % 4 === 1);
        const col3Base = galleryList.filter((_, i) => i % 4 === 2);
        const col4Base = galleryList.filter((_, i) => i % 4 === 3);

        return {
            col1: [...col1Base, ...col1Base, ...col1Base],
            col2: [...col2Base, ...col2Base, ...col2Base],
            col3: [...col3Base, ...col3Base, ...col3Base],
            col4: [...col4Base, ...col4Base, ...col4Base],
        };
    }, [galleryList]);

    // স্ক্রল ট্র্যাকিং সরাসরি টার্গেট কনটেইনার দিয়ে উইন্ডো লেভেলে করা হয়েছে
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 25,
        restDelta: 0.001,
    });

    // ব্যানার সাইজ অ্যানিমেশন
    const bannerWidth = useTransform(smoothProgress, [0, 0.15], ["90vw", "100vw"]);
    const bannerHeight = useTransform(smoothProgress, [0, 0.15], ["80vh", "100vh"]);
    const bannerRadius = useTransform(smoothProgress, [0, 0.15], ["48px", "0px"]);
    const bannerBorderWidth = useTransform(smoothProgress, [0, 0.15], ["1px", "0px"]);

    // ৩ডি রোটেশন ও ট্রান্সফর্ম অ্যানিমেশন
    const rotateY = useTransform(smoothProgress, [0.15, 1], [-45, -5]);
    const rotateX = useTransform(smoothProgress, [0.15, 1], [25, 2]);
    const rotateZ = useTransform(smoothProgress, [0.15, 1], [15, 0]);
    const translateZ = useTransform(smoothProgress, [0.15, 1], [-800, 0]);

    // কলামগুলোর প্যারালাক্স ভার্টিক্যাল অ্যানিমেশন
    const yCol1 = useTransform(smoothProgress, [0.15, 1], ["0%", "-50%"]);
    const yCol2 = useTransform(smoothProgress, [0.15, 1], ["-50%", "10%"]);
    const yCol3 = useTransform(smoothProgress, [0.15, 1], ["0%", "-40%"]);
    const yCol4 = useTransform(smoothProgress, [0.15, 1], ["-40%", "20%"]);

    return (
        <div className="w-full bg-slate-950">
            <section
                ref={containerRef}
                className="relative w-full h-[500vh] bg-slate-950 text-white font-sans"
            >
                <div className="sticky top-0 h-screen w-full flex justify-center items-center overflow-hidden">
                    <motion.div
                        style={{
                            width: bannerWidth,
                            height: bannerHeight,
                            borderRadius: bannerRadius,
                            borderWidth: bannerBorderWidth,
                            borderColor: "#2c2738",
                        }}
                        className="relative bg-slate-950 overflow-hidden flex items-center justify-center max-w-[1920px] mx-auto will-change-transform backface-hidden preserve-3d"
                    >
                        <div
                            className="absolute inset-0 flex justify-center items-center pointer-events-none"
                            style={{ perspective: "1000px" }}
                        >
                            {/* শ্যাডো মাস্কিং */}
                            <div className="absolute inset-0 z-20 shadow-[inset_0_100px_150px_-50px_rgba(0,0,20,1),inset_0_-100px_150px_-50px_rgba(0,0,20,1)]" />
                            <div className="absolute inset-0 z-20 shadow-[inset_150px_0_150px_-50px_rgba(0,0,20,1),inset_-150px_0_150px_-50px_rgba(0,0,20,1)]" />

                            {/* ৩ডি প্যারালাক্স ম্যাট্রিক্স */}
                            <motion.div
                                style={{
                                    rotateX,
                                    rotateY,
                                    rotateZ,
                                    z: translateZ,
                                    transformStyle: "preserve-3d",
                                }}
                                className="flex gap-4 md:gap-6 justify-center items-center w-[120vw] h-[150vh] origin-center opacity-100 will-change-transform backface-hidden"
                            >
                                <motion.div style={{ y: yCol1 }} className="flex flex-col gap-4 md:gap-6 w-[22vw] min-w-[200px] pointer-events-auto">
                                    {colMedia.col1.map((item, index) => (
                                        <ImageCard
                                            key={`col1-${index}`}
                                            src={item.imageUrl || item.src || ""}
                                            title={item.title}
                                            onLoad={handleItemLoad}
                                        />
                                    ))}
                                </motion.div>

                                <motion.div style={{ y: yCol2 }} className="flex flex-col gap-4 md:gap-6 w-[22vw] min-w-[200px] pointer-events-auto">
                                    {colMedia.col2.map((item, index) => (
                                        <ImageCard
                                            key={`col2-${index}`}
                                            src={item.imageUrl || item.src || ""}
                                            title={item.title}
                                            onLoad={handleItemLoad}
                                        />
                                    ))}
                                </motion.div>

                                <motion.div style={{ y: yCol3 }} className="flex flex-col gap-4 md:gap-6 w-[22vw] min-w-[200px] pointer-events-auto">
                                    {colMedia.col3.map((item, index) => (
                                        <ImageCard
                                            key={`col3-${index}`}
                                            src={item.imageUrl || item.src || ""}
                                            title={item.title}
                                            onLoad={handleItemLoad}
                                        />
                                    ))}
                                </motion.div>

                                <motion.div style={{ y: yCol4 }} className="flex flex-col gap-4 md:gap-6 w-[22vw] min-w-[200px] pointer-events-auto">
                                    {colMedia.col4.map((item, index) => (
                                        <ImageCard
                                            key={`col4-${index}`}
                                            src={item.imageUrl || item.src || ""}
                                            title={item.title}
                                            onLoad={handleItemLoad}
                                        />
                                    ))}
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}