import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Idea from "@/models/Idea";

export async function GET() {
    try {
        await connectDB();
        const ideas = await Idea.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: ideas });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        const { title, category, description, rolesNeeded, authorName, authorEmail, authorContact } = body;

        if (!title || !category || !description || !authorName || !authorEmail) {
            return NextResponse.json(
                { success: false, message: "Please fill in all required fields." },
                { status: 400 }
            );
        }

        const newIdea = await Idea.create({
            title,
            category,
            description,
            rolesNeeded: Array.isArray(rolesNeeded) ? rolesNeeded : rolesNeeded.split(",").map((r) => r.trim()),
            authorName,
            authorEmail,
            authorContact,
        });

        return NextResponse.json(
            { success: true, message: "Idea posted successfully!", data: newIdea },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
// DELETE: ID দিয়ে নির্দিষ্ট আইডিয়া মুছে ফেলা
export async function DELETE(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Idea ID is required" },
                { status: 400 }
            );
        }

        const deletedIdea = await Idea.findByIdAndDelete(id);

        if (!deletedIdea) {
            return NextResponse.json(
                { success: false, message: "Idea post not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Idea post deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message || "Failed to delete idea" },
            { status: 500 }
        );
    }
}