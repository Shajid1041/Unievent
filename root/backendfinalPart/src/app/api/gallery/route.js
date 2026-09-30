import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Gallery from "@/models/Gallery";

export async function GET() {
    try {
        await dbConnect();
        const photos = await Gallery.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: photos }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { title, eventCategory, imageUrl, caption } = body;

        if (!title || !imageUrl) {
            return NextResponse.json(
                { success: false, message: "Title and Image URL are required." },
                { status: 400 }
            );
        }

        const newPhoto = await Gallery.create({ title, eventCategory, imageUrl, caption });
        return NextResponse.json({ success: true, data: newPhoto }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
        }

        await Gallery.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Photo deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}