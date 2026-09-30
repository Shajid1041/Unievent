import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notice from "@/models/Notice";

export async function GET() {
    try {
        await dbConnect();
        const notices = await Notice.find({}).sort({ isPinned: -1, createdAt: -1 });
        return NextResponse.json({ success: true, data: notices }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();

        const { title, description, category, publishedBy, attachmentUrl, isPinned } = body;

        if (!title || !description) {
            return NextResponse.json(
                { success: false, message: "Title and Description are required!" },
                { status: 400 }
            );
        }

        const slug =
            title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "") +
            "-" +
            Date.now();

        const newNotice = await Notice.create({
            title,
            slug,
            description,
            category,
            publishedBy,
            attachmentUrl,
            isPinned,
        });

        return NextResponse.json(
            { success: true, message: "Notice created successfully!", data: newNotice },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}