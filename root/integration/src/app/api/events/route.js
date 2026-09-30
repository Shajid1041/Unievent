import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
// import { verifyAdminToken } from "@/lib/auth";

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const status = searchParams.get("status");
        const search = searchParams.get("search");

        let query = {};
        if (category) query.category = category;
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { venue: { $regex: search, $options: "i" } },
            ];
        }

        const events = await Event.find(query).sort({ date: 1 });
        return NextResponse.json({ success: true, count: events.length, data: events });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        // const admin = await verifyAdminToken(request);
        // if (!admin) {
        //     return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
        // }
        const body = await request.json();

        // Slug Generator
        const slug =
            (body.title || "event")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "") +
            "-" +
            Date.now();

        const newEvent = await Event.create({
            ...body,
            slug,
        });

        return NextResponse.json(
            { success: true, message: "Event created successfully!", data: newEvent },
            { status: 201 }
        );
    } catch (error) {
        console.error("Mongoose Validation Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to create event. Check required fields."
            },
            { status: 400 }
        );
    }
}