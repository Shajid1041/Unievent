"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import {
    Home,
    Image,
    Lightbulb,
    UserPlus,
    SearchCheck,
    Menu,
    X,
    Sparkles,
    ArrowRight,
    ChevronRight,
    GalleryHorizontal,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// নেভিগেশন লিংক কনফিগারেশন
const NAV_LINKS = [
    { name: "Home", href: "/", icon: Home },
    { name: "Event Posters", href: "/posters", icon: Image, badge: "Live" },
    { name: "Ideas Hub", href: "/ideas", icon: Lightbulb },
    { name: "Registration", href: "/registration", icon: UserPlus },
    { name: "Check Status", href: "/check-status", icon: SearchCheck },
    { name: "Gallery", href: "/gallery", icon: GalleryHorizontal },
];

export default function Header({ activePath: customActivePath, setActivePath }) {
    const currentPathname = usePathname();
    // Props হিসেবে প্রোভাইড করা না থাকলে Next.js hook থেকে activePath নেবে
    const activePath = customActivePath || currentPathname;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [hoveredPath, setHoveredPath] = useState(null);

    // GSAP এর জন্য Refs
    const navRef = useRef(null);
    const logoRef = useRef(null);
    const navItemsRef = useRef(null);
    const actionBtnRef = useRef(null);

    


    // স্ক্রোল ইফেক্ট
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // GSAP Entrance Animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

            timeline
                .fromTo(
                    navRef.current,
                    { y: -50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6 }
                )
                .fromTo(
                    logoRef.current,
                    { opacity: 0, x: -15 },
                    { opacity: 1, x: 0, duration: 0.4 },
                    "-=0.3"
                )
                .fromTo(
                    navItemsRef.current?.children || [],
                    { opacity: 0, y: -10 },
                    { opacity: 1, y: 0, duration: 0.3, stagger: 0.06 },
                    "-=0.2"
                )
                .fromTo(
                    actionBtnRef.current,
                    { opacity: 0, scale: 0.9 },
                    { opacity: 1, scale: 1, duration: 0.3 },
                    "-=0.2"
                );
        });

        return () => ctx.revert();
    }, []);

    const handleNavClick = (href) => {
        if (setActivePath) setActivePath(href);
        setIsMobileMenuOpen(false);
    };
    if (currentPathname.startsWith("/admin")) return <></>;
    return (
        <header
            ref={navRef}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-2.5 sm:py-3" : "py-4 sm:py-5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className={`relative rounded-2xl border transition-all duration-300 backdrop-blur-xl ${isScrolled
                            ? "bg-slate-950/85 border-slate-800/80 shadow-2xl shadow-purple-950/20"
                            : "bg-slate-900/60 border-slate-800/50 shadow-lg shadow-black/40"
                        }`}
                >
                    <div className="flex items-center justify-between px-4 sm:px-6 py-2.5">
                        {/* Logo */}
                        <Link
                            href="/"
                            onClick={() => handleNavClick("/")}
                            ref={logoRef}
                            className="flex items-center gap-2.5 group cursor-pointer"
                        >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">
                                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1">
                                    Uni
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                                        Events
                                    </span>
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:inline-block">
                                    Campus Activity Hub
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <nav
                            ref={navItemsRef}
                            className="hidden lg:flex items-center gap-1 bg-slate-950/50 border border-slate-800/60 p-1.5 rounded-xl"
                            onMouseLeave={() => setHoveredPath(null)}
                        >
                            {NAV_LINKS.map((link) => {
                                const Icon = link.icon;
                                const isActive = activePath === link.href;
                                const isHovered = hoveredPath === link.href;

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => handleNavClick(link.href)}
                                        onMouseEnter={() => setHoveredPath(link.href)}
                                        className="relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 flex items-center gap-2 cursor-pointer select-none"
                                    >
                                        {/* Hover Glow */}
                                        {isHovered && !isActive && (
                                            <motion.div
                                                layoutId="hover-bg"
                                                className="absolute inset-0 bg-slate-800/60 rounded-lg"
                                                transition={{
                                                    type: "spring",
                                                    bounce: 0.2,
                                                    duration: 0.3,
                                                }}
                                            />
                                        )}

                                        {/* Active Route Pill */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-pill"
                                                className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 rounded-lg shadow-md shadow-indigo-500/20"
                                                transition={{
                                                    type: "spring",
                                                    bounce: 0.2,
                                                    duration: 0.4,
                                                }}
                                            />
                                        )}

                                        <span className="relative z-10 flex items-center gap-1.5">
                                            <Icon
                                                className={`w-3.5 h-3.5 transition-colors ${isActive
                                                        ? "text-white"
                                                        : isHovered
                                                            ? "text-purple-300"
                                                            : "text-slate-400"
                                                    }`}
                                            />
                                            <span
                                                className={
                                                    isActive
                                                        ? "text-white"
                                                        : isHovered
                                                            ? "text-slate-200"
                                                            : "text-slate-400"
                                                }
                                            >
                                                {link.name}
                                            </span>

                                            {link.badge && (
                                                <span
                                                    className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${isActive
                                                            ? "bg-white/20 text-white"
                                                            : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                                        }`}
                                                >
                                                    {link.badge}
                                                </span>
                                            )}
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>

                        
                    </div>

                    {/* Mobile Drawer */}
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="lg:hidden overflow-hidden border-t border-slate-800/80 rounded-b-2xl bg-slate-950/95 backdrop-blur-2xl px-4 py-4 space-y-2"
                            >
                                <div className="flex flex-col gap-1.5">
                                    {NAV_LINKS.map((link, idx) => {
                                        const Icon = link.icon;
                                        const isActive = activePath === link.href;

                                        return (
                                            <motion.div
                                                key={link.href}
                                                initial={{ opacity: 0, x: -15 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05, duration: 0.2 }}
                                            >
                                                <Link
                                                    href={link.href}
                                                    onClick={() => handleNavClick(link.href)}
                                                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                                                            ? "bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white shadow-md shadow-purple-900/30"
                                                            : "text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent hover:border-slate-800"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Icon
                                                            className={`w-4 h-4 ${isActive ? "text-white" : "text-purple-400"
                                                                }`}
                                                        />
                                                        <span>{link.name}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {link.badge && (
                                                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                                                {link.badge}
                                                            </span>
                                                        )}
                                                        <ChevronRight
                                                            className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-600"
                                                                }`}
                                                        />
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: NAV_LINKS.length * 0.05 + 0.05,
                                    }}
                                    className="pt-3 border-t border-slate-800/80"
                                >
                                    <Link
                                        href="/registration"
                                        onClick={() => handleNavClick("/registration")}
                                        className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-950/40 flex items-center justify-center gap-2 transition active:scale-95"
                                    >
                                        <span>Register For Events</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}