"use client";

import { useEffect, useState } from "react";
import ProgramWiseRegistrations from "@/components/ProgramWiseRegistrations";

export default function ProgramRegistrationsPage() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRegistrations = async () => {
        try {
            const res = await fetch("/api/registrations");
            const data = await res.json();
            if (data.success) {
                setRegistrations(data.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch registrations:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    // Status Update Handler (Approve / Reject)
    const handleStatusChange = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/registrations/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentStatus: newStatus }),
            });

            const data = await res.json();
            if (data.success) {
                setRegistrations((prev) =>
                    prev.map((item) =>
                        item._id === id ? { ...item, paymentStatus: newStatus } : item
                    )
                );
            } else {
                alert(data.message || "Failed to update status");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred while updating status.");
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-white">Program Wise Registrations</h1>
                <p className="text-slate-400 text-sm">
                    View and manage applicants categorized specifically by Event or Workshop.
                </p>
            </div>

            {loading ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                    Loading registrations data...
                </div>
            ) : (
                <ProgramWiseRegistrations
                    registrations={registrations}
                    onStatusChange={handleStatusChange}
                />
            )}
        </div>
    );
}