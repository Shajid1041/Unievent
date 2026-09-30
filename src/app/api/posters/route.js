import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb"; // আপনার প্রজেক্টের MongoDB সংযোগ ফাইল
import Poster from "@/models/Poster";

// ১. GET: সব পোস্টার ফেচ করা (সবচেয়ে কাছের ইভেন্ট আগে দেখাবে)
export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        // ক্যাটাগরি ফিল্টার থাকলে সেটি অনুযায়ী সার্চ করবে
        const query = category && category !== "All" ? { category } : {};

        // startDate অনুযায়ী Ascending (আগে যেটি শুরু হবে সেটি আগে দেখাবে)
        const posters = await Poster.find(query).sort({ startDate: 1 });

        return NextResponse.json(
            { success: true, data: posters },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message || "Failed to fetch posters" },
            { status: 500 }
        );
    }
}

// ২. POST: নতুন পোস্টার সেভ করা
export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { title, category, startDate, location, imageUrl, description } = body;

        if (!title || !category || !startDate || !imageUrl) {
            return NextResponse.json(
                { success: false, message: "Missing required fields." },
                { status: 400 }
            );
        }

        const newPoster = await Poster.create({
            title,
            category,
            startDate: new Date(startDate),
            location,
            imageUrl,
            description,
        });

        return NextResponse.json(
            { success: true, message: "Poster created successfully", data: newPoster },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message || "Failed to create poster" },
            { status: 500 }
        );
    }
}

// ৩. DELETE: ID অনুযায়ী পোস্টার মুছে ফেলা
export async function DELETE(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Poster ID is required" },
                { status: 400 }
            );
        }

        const deletedPoster = await Poster.findByIdAndDelete(id);

        if (!deletedPoster) {
            return NextResponse.json(
                { success: false, message: "Poster not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Poster deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message || "Failed to delete poster" },
            { status: 500 }
        );
    }
}