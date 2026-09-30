"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, Calendar } from "lucide-react";

export default function ProgramPoster({ program }) {
    if (!program) return null;

    return (
        <section className="w-full max-w-6xl mx-auto px-4 py-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-8 md:p-12 shadow-2xl">
                {/* Background Decorative Glow */}
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                    {/* Left Content */}
                    <div className="lg:col-span-7 space-y-5">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            <span>{program.badge}</span>
                        </div>

                        <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
                            {program.title}
                        </h2>

                        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                            {program.subtitle}
                        </p>

                        <div className="flex items-center gap-2 text-amber-400 text-xs font-medium">
                            <Calendar className="w-4 h-4" />
                            <span>{program.deadline}</span>
                        </div>

                        <div className="pt-2">
                            <Link
                                href={program.ctaLink || "#"}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-indigo-600/30"
                            >
                                <span>{program.ctaText}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Banner Image */}
                    <div className="lg:col-span-5 relative h-64 md:h-80 w-full rounded-2xl overflow-hidden border border-slate-800 shadow-lg">
                        <Image
                            src={program.imageUrl}
                            alt={program.title}
                            fill
                            className="object-cover hover:scale-105 transition duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}