"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getAdminToken, getAdminData, removeAdminSession } from "@/lib/adminAuth";

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    // Login page doesn't need admin layout shell
    const isLoginPage = pathname === "/admin/login";

    useEffect(() => {
        if (isLoginPage) {
            setLoading(false);
            return;
        }

        const token = getAdminToken();
        const adminData = getAdminData();

        if (!token) {
            router.push("/admin/login");
        } else {
            setAdmin(adminData);
            setLoading(false);
        }
    }, [pathname, isLoginPage, router]);

    const handleLogout = () => {
        removeAdminSession();
        router.push("/admin/login");
    };

    if (isLoginPage) return <>{children}</>;

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500"></div>
            </div>
        );
    }

    const navItems = [
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Manage Events", href: "/admin/events" },
        { label: "Manage Workshops", href: "/admin/workshops" },
        { label: "Registrations", href: "/admin/registrations" },
        { label: "Program-Wise Registrations View", href: "/admin/program-registrations" },
        { label: "Poster Publish", href: "/admin/posters/" },
        { label: "Notice Board", href: "/admin/notices" },
        { label: "Gallery", href: "/admin/gallery" },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex">
                <div>
                    <div className="p-6 border-b border-slate-800">
                        <Link href={'/'} className="text-xl font-bold text-indigo-400">UniEvent Admin</Link>
                        <p className="text-xs text-slate-500 mt-1">Campus Hub Management</p>
                    </div>
                    <nav className="p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`block px-4 py-3 rounded-xl font-medium text-sm transition-colors ${isActive
                                            ? "bg-indigo-600 text-white"
                                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-slate-800">
                    <div className="px-4 py-2 mb-2">
                        <p className="text-sm font-semibold text-white">{admin?.name || "Admin"}</p>
                        <p className="text-xs text-slate-400">{admin?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between px-6 md:hidden">
                    <span className="font-bold text-indigo-400">UniEvent Admin</span>
                    <button onClick={handleLogout} className="text-xs text-red-400">
                        Logout
                    </button>
                </header>

                <main className="p-6 md:p-8 flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}