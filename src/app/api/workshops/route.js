import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Workshop from "@/models/Workshop";
// import { verifyAdminToken } from "@/lib/auth";

export async function GET() {
    try {
        await dbConnect();
        const workshops = await Workshop.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: workshops });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        // const admin = await verifyAdminToken(request);
        // if (!admin) {
        //     return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        // }

        const body = await request.json();
        const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
        const workshop = await Workshop.create({ ...body, slug });

        return NextResponse.json({ success: true, data: workshop }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}