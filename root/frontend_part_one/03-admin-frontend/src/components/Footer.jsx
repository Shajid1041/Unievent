"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Sparkles,
    Send,
    Lock,
    Mail,
    Phone,
    MapPin,
    Heart,
    Calendar,
    ExternalLink,
    CheckCircle2,
} from "lucide-react";
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaGithub,
} from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Social Media Links
const SOCIAL_LINKS = [
    { name: "Facebook", href: "#", icon: FaFacebookF, color: "hover:text-blue-500 hover:border-blue-500/40" },
    { name: "Twitter", href: "#", icon: FaTwitter, color: "hover:text-sky-400 hover:border-sky-400/40" },
    { name: "Instagram", href: "#", icon: FaInstagram, color: "hover:text-pink-500 hover:border-pink-500/40" },
    { name: "LinkedIn", href: "#", icon: FaLinkedinIn, color: "hover:text-blue-400 hover:border-blue-400/40" },
    { name: "GitHub", href: "#", icon: FaGithub, color: "hover:text-purple-400 hover:border-purple-400/40" },
];

// Quick Navigation
const QUICK_LINKS = [
    { name: "Home", href: "/" },
    { name: "Event Posters", href: "/posters" },
    { name: "Ideas Hub", href: "/ideas" },
    { name: "Registration", href: "/registration" },
    { name: "Check Status", href: "/check-status" },
];

// Event Categories
const EVENT_CATEGORIES = [
    { name: "Tech Fest & Hackathons", href: "/posters?category=tech" },
    { name: "Cultural Nights", href: "/posters?category=cultural" },
    { name: "Sports Competitions", href: "/posters?category=sports" },
    { name: "Workshops & Seminars", href: "/posters?category=workshop" },
    { name: "Gaming Tournaments", href: "/posters?category=gaming" },
];

export default function Footer() {
    const currentPathname = usePathname();
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);
    if (currentPathname.startsWith("/admin")) return <></>;
    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setIsSubscribed(true);
            setEmail("");
            setTimeout(() => setIsSubscribed(false), 4000);
        }
    };

    return (
        <footer className="relative bg-slate-950 text-slate-300 pt-16 pb-8 overflow-hidden border-t border-slate-800/80">
            {/* Background Glow Effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Top Section: Branding + Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/60">
                    {/* Brand Info */}
                    <div className="lg:col-span-5 space-y-4">
                        <Link href="/" className="flex items-center gap-2.5 group w-fit">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
                                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-xl text-white tracking-tight flex items-center gap-1">
                                    Uni
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                                        Events
                                    </span>
                                </span>
                                <span className="text-[11px] text-slate-400 font-medium -mt-1">
                                    Campus Activity Hub
                                </span>
                            </div>
                        </Link>

                        <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                            All university events, poster competitions, and activity hubs on a single platform. Make every moment of your campus life unforgettable.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-2 pt-2 text-xs text-slate-400">
                            <div className="flex items-center gap-2.5 hover:text-slate-200 transition">
                                <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                                <span>University Campus, Central Student Center, Building B</span>
                            </div>
                            <div className="flex items-center gap-2.5 hover:text-slate-200 transition">
                                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                                <span>support@unievents.edu</span>
                            </div>
                            <div className="flex items-center gap-2.5 hover:text-slate-200 transition">
                                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                                <span>+880 1700-000000</span>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter Box */}
                    <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
                            <Calendar className="w-4 h-4" />
                            <span>Stay Updated</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                            Get updates on all the latest events first!
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400 mb-5">
                            Subscribe with your email to receive instant notifications as soon as registration for any event opens.
                        </p>

                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your university email..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-950/40 flex items-center justify-center gap-2 transition active:scale-95 shrink-0"
                            >
                                <span>Subscribe</span>
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </form>

                        {isSubscribed && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-3 flex items-center gap-2 text-xs text-emerald-400 font-medium"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Thank you! You have successfully subscribed.</span>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Middle Section: Link Columns */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-slate-800/60">
                    {/* Column 1: Navigation */}
                    <div>
                        <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase text-xs text-purple-400">
                            Quick Links
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Categories */}
                    <div>
                        <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase text-xs text-purple-400">
                            Event Types
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            {EVENT_CATEGORIES.map((cat) => (
                                <li key={cat.href}>
                                    <Link
                                        href={cat.href}
                                        className="text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Resources & Support */}
                    <div>
                        <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase text-xs text-purple-400">
                            Support & Guidelines
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
                            <li>
                                <Link href="/faq" className="hover:text-white transition">
                                    Frequently Asked Questions
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-white transition">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-white transition">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/poster-guidelines" className="hover:text-white transition">
                                    Poster Submission Rules
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Admin Portal Access */}
                    <div className="col-span-2 sm:col-span-1 bg-gradient-to-b from-slate-900/80 to-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm mb-1">
                                <Lock className="w-3.5 h-3.5 text-purple-400" />
                                <span>Admin Portal</span>
                            </div>
                            <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                                Restricted access for event organizers and administrators only.
                            </p>
                        </div>

                        {/* Admin Login Button */}
                        <Link
                            href="/admin/login"
                            className="w-full py-2 px-3 bg-slate-800/90 hover:bg-purple-600/20 border border-slate-700/80 hover:border-purple-500/50 text-slate-200 hover:text-purple-300 font-semibold text-xs rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                        >
                            <span>Admin Login</span>
                            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-purple-400" />
                        </Link>
                    </div>
                </div>

                {/* Bottom Section: Copyright + Social Media */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p className="text-center md:text-left flex items-center gap-1 flex-wrap justify-center">
                        <span>&copy; {new Date().getFullYear()} UniEvents. All rights reserved. Built with</span>
                        <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" />
                        <span>for University Students.</span>
                    </p>

                    {/* Social Icons */}
                    <div className="flex items-center gap-2">
                        {SOCIAL_LINKS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    aria-label={item.name}
                                    className={`p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 transition-all ${item.color}`}
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer>
    );
}