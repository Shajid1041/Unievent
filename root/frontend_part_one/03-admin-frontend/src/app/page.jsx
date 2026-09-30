"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Briefcase,
  Users,
  Bell,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import UpcomingPostersCarousel from "@/components/UpcomingPostersCarousel";
import { GridPulse } from "@/components/ui/grid-pulse";
import { Pointer } from "@/components/ui/pointer";
import EventHeatCalendar from "@/components/EventHeatCalendar";
import PublicGalleryPage from "@/components/PublicGalleryPage";

export default function Home() {
  const [data, setData] = useState({
    events: [],
    workshops: [],
    registrations: [],
    notices: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [eventsRes, workshopsRes, registrationsRes, noticesRes] =
          await Promise.all([
            fetch("/api/events"),
            fetch("/api/workshops"),
            fetch("/api/registrations"),
            fetch("/api/notices"),
          ]);

        const events = await eventsRes.json();
        const workshops = await workshopsRes.json();
        const registrations = await registrationsRes.json();
        const notices = await noticesRes.json();

        setData({
          events: events?.data || events || [],
          workshops: workshops?.data || workshops || [],
          registrations: registrations?.data || registrations || [],
          notices: notices?.data || notices || [],
        });
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  return (
    <div className="pt-10 min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500 selection:text-white">
      {/* 1. HERO SECTION WITH GRID PULSE BACKGROUND */}
      <section className="relative pt-20 pb-16 px-4 text-center max-w-screen mx-auto space-y-6 overflow-hidden">
        {/* Interactive Background Grid */}
        <GridPulse cell={28} ambient={3} reach={3} />

        {/* Hero Content */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Ultimate Campus Event Platform</span>
          </div>

          <h1
            data-grid-avoid
            className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight"
          >
            Discover, Learn & Connect with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
              Campus Events & Workshops
            </span>
          </h1>

          <p
            data-grid-avoid
            className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
          >
            Join university events, upskill with expert-led workshops, stay
            updated with campus notices, and collaborate with peers across
            institutions.
          </p>

          {/* DYNAMIC STATS COUNTER */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-slate-800/80">
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <h3 className="text-2xl md:text-3xl font-extrabold text-purple-400">
                {loading ? "..." : `${data.events.length}+`}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Live Events</p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <h3 className="text-2xl md:text-3xl font-extrabold text-indigo-400">
                {loading ? "..." : `${data.workshops.length}+`}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Workshops</p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <h3 className="text-2xl md:text-3xl font-extrabold text-emerald-400">
                {loading ? "..." : `${data.registrations.length}+`}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Students Joined</p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <h3 className="text-2xl md:text-3xl font-extrabold text-amber-400">
                {loading ? "..." : `${data.notices.length}+`}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Active Notices</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NOTICE TICKER / BULLETIN BOARD */}
      {data.notices.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 my-8">
          <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/20 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Bell className="w-4 h-4" />
              <span>Important Announcements & Notices</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.notices.slice(0, 2).map((notice, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 text-xs space-y-1"
                >
                  <h4 className="font-semibold text-white">
                    {notice.title || notice.subject}
                  </h4>
                  <p className="text-slate-400 line-clamp-2">
                    {notice.description || notice.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 🎯 CAROUSEL SECTION */}
      <div className="min-h-screen max-w-[90vw] mx-auto bg-slate-950">
        <UpcomingPostersCarousel />
      </div>

      {/* 3. FEATURED EVENTS SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div className="flex justify-between items-end border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              Upcoming Programs
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">
              Explore Campus Events
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            Loading events...
          </div>
        ) : data.events.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-sm">
            No events posted yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data?.events?.slice(0, 3).map((event, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-purple-500/50 transition"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full uppercase">
                    {event.category || "Event"}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {event.title || event.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {event.venue || "Campus"}
                  </span>
                  <span className="text-purple-400 font-semibold">
                    {event.date
                      ? new Date(event.date).toLocaleDateString()
                      : "Soon"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. WORKSHOPS SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div className="flex justify-between items-end border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Skill Up
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">
              Interactive Workshops
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            Loading workshops...
          </div>
        ) : data.workshops.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-sm">
            No active workshops available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.workshops.slice(0, 4).map((ws, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/50 transition"
              >
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white">
                    {ws.title || ws.topic}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {ws.description}
                  </p>
                </div>
                <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-indigo-400 font-medium">
                    Instructor: {ws.instructor || ws.speaker || "Mentor"}
                  </span>
                  <span className="text-slate-500">
                    {ws.duration || "2 Hours"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="container mx-auto py-10">
        

        {/* Heatmap Calendar Call */}
        <EventHeatCalendar />
      </div>
      <PublicGalleryPage />
      {/* <Pointer className="fill-blue-500" /> */}
    </div>
  );
}