import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Registration from "@/models/Registration";

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("query");

        if (!query || query.trim().length === 0) {
            return NextResponse.json(
                { success: false, message: "Please provide a Student ID or Email." },
                { status: 400 }
            );
        }

        const searchRegex = new RegExp(query.trim(), "i");
        const results = await Registration.find({
            $or: [{ studentId: searchRegex }, { email: searchRegex }],
        }).sort({ createdAt: -1 });

        return NextResponse.json(
            { success: true, count: results.length, data: results },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}