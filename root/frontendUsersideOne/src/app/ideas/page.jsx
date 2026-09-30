"use client";

import { useState, useEffect } from "react";

export default function StudentIdeasPage() {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPostModal, setShowPostModal] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState(null); // Knock/Respond Modal-এর জন্য

    // Idea Post Form State
    const [formData, setFormData] = useState({
        title: "",
        category: "Web App",
        description: "",
        rolesNeeded: "",
        authorName: "",
        authorEmail: "",
        authorContact: "",
    });
    const [submitting, setSubmitting] = useState(false);

    // Response Modal State
    const [respondData, setRespondData] = useState({
        responderName: "",
        responderEmail: "",
        responderContact: "",
        message: "",
    });
    const [sendingResponse, setSendingResponse] = useState(false);

    const fetchIdeas = async () => {
        try {
            const res = await fetch("/api/ideas");
            const data = await res.json();
            if (data.success) setIdeas(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIdeas();
    }, []);

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/ideas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                alert("Project Idea Posted Successfully!");
                setShowPostModal(false);
                setFormData({
                    title: "",
                    category: "Web App",
                    description: "",
                    rolesNeeded: "",
                    authorName: "",
                    authorEmail: "",
                    authorContact: "",
                });
                fetchIdeas();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleRespondSubmit = async (e) => {
        e.preventDefault();
        setSendingResponse(true);
        try {
            const payload = {
                ideaTitle: selectedIdea.title,
                authorEmail: selectedIdea.authorEmail,
                authorName: selectedIdea.authorName,
                ...respondData,
            };

            const res = await fetch("/api/ideas/respond", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (data.success) {
                alert(`Direct Mail sent to ${selectedIdea.authorName}! They will contact you back.`);
                setSelectedIdea(null);
                setRespondData({ responderName: "", responderEmail: "", responderContact: "", message: "" });
            } else {
                alert(data.message || "Failed to send message.");
            }
        } catch (err) {
            console.error(err);
            alert("Error sending message.");
        } finally {
            setSendingResponse(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white  p-6 md:p-12 space-y-8">
            {/* Header */}
            <div className="pt-20 max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white">Project Idea & Collaboration Hub</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Share your tech ideas and find co-founders or team collaborators for your projects.
                    </p>
                </div>
                <button
                    onClick={() => setShowPostModal(true)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition"
                >
                    💡 Share An Idea
                </button>
            </div>

            {/* Ideas List */}
            <div className="max-w-5xl mx-auto">
                {loading ? (
                    <div className="text-center text-slate-400 py-12">Loading project ideas...</div>
                ) : ideas.length === 0 ? (
                    <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <p className="text-slate-400 text-sm">No project ideas shared yet. Be the first to share one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {ideas.map((item) => (
                            <div
                                key={item._id}
                                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-indigo-500/50 transition flex flex-col justify-between"
                            >
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                                            {item.category}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            By {item.authorName}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                                    <p className="text-slate-300 text-xs leading-relaxed line-clamp-4">
                                        {item.description}
                                    </p>

                                    {item.rolesNeeded?.length > 0 && (
                                        <div className="space-y-1">
                                            <p className="text-[11px] text-slate-400 font-medium">Looking For:</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {item.rolesNeeded.map((role, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-[11px] bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-0.5 rounded-lg"
                                                    >
                                                        🛠️ {role}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setSelectedIdea(item)}
                                    className="w-full py-2.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 mt-4"
                                >
                                    📩 Knock / Express Interest
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal 1: Share Idea Form */}
            {showPostModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-2xl p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-white">Share Project Idea</h2>
                            <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <form onSubmit={handlePostSubmit} className="space-y-3">
                            <input
                                type="text"
                                placeholder="Project Title *"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                            />
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                            >
                                <option value="Mobile App">Mobile App</option>
                                <option value="Web App">Web App</option>
                                <option value="AI/ML">AI/ML</option>
                                <option value="IoT/Robotics">IoT/Robotics</option>
                                <option value="Cyber Security">Cyber Security</option>
                                <option value="Game Dev">Game Dev</option>
                                <option value="Others">Others</option>
                            </select>
                            <textarea
                                rows={3}
                                placeholder="Idea details & goals *"
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
                            ></textarea>
                            <input
                                type="text"
                                placeholder="Roles needed (e.g. React Developer, UI Designer)"
                                value={formData.rolesNeeded}
                                onChange={(e) => setFormData({ ...formData, rolesNeeded: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    placeholder="Your Name *"
                                    required
                                    value={formData.authorName}
                                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                                    className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email *"
                                    required
                                    value={formData.authorEmail}
                                    onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                                    className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition"
                            >
                                {submitting ? "Posting..." : "Post Idea"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal 2: Knock / Direct Mail Form */}
            {selectedIdea && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-2xl p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-base font-bold text-white">
                                Knock Author for "{selectedIdea.title}"
                            </h2>
                            <button onClick={() => setSelectedIdea(null)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <p className="text-xs text-slate-400">
                            Send a direct email message to <strong>{selectedIdea.authorName}</strong> detailing how you can contribute.
                        </p>

                        <form onSubmit={handleRespondSubmit} className="space-y-3">
                            <input
                                type="text"
                                placeholder="Your Full Name *"
                                required
                                value={respondData.responderName}
                                onChange={(e) => setRespondData({ ...respondData, responderName: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                            />
                            <input
                                type="email"
                                placeholder="Your Email Address *"
                                required
                                value={respondData.responderEmail}
                                onChange={(e) => setRespondData({ ...respondData, responderEmail: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                            />
                            <input
                                type="text"
                                placeholder="WhatsApp / Phone No (Optional)"
                                value={respondData.responderContact}
                                onChange={(e) => setRespondData({ ...respondData, responderContact: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                            />
                            <textarea
                                rows={4}
                                placeholder="Explain your skills and how you'd like to collaborate... *"
                                required
                                value={respondData.message}
                                onChange={(e) => setRespondData({ ...respondData, message: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
                            ></textarea>

                            <button
                                type="submit"
                                disabled={sendingResponse}
                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition"
                            >
                                {sendingResponse ? "Sending Direct Email..." : "Send Email Proposal"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}