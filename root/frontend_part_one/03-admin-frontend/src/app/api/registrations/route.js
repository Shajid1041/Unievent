import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Registration from "@/models/Registration";

// GET: All registrations OR filter by categoryType (Event / Workshop)
export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const categoryType = searchParams.get("categoryType"); // "Event" or "Workshop"

        const query = categoryType ? { categoryType } : {};
        const registrations = await Registration.find(query)
            .populate("targetId")
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: registrations }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// POST: Create a new Registration
export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        // const admin = await verifyAdminToken(request);
        // if (!admin) {
        //     return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        // }

        const {
            categoryType,
            targetId,
            targetTitle,
            studentName,
            studentId,
            department,
            batch,
            email,
            phone,
            paymentStatus,
            transactionId,
            additionalInfo,
        } = body;

        // Required fields validation
        if (
            !categoryType ||
            !targetId ||
            !targetTitle ||
            !studentName ||
            !studentId ||
            !department ||
            !batch ||
            !email ||
            !phone
        ) {
            return NextResponse.json(
                { success: false, message: "Please fill in all required fields!" },
                { status: 400 }
            );
        }

        const newRegistration = await Registration.create({
            categoryType,
            targetId,
            targetTitle,
            studentName,
            studentId,
            department,
            batch,
            email,
            phone,
            paymentStatus: paymentStatus || "Free",
            transactionId,
            additionalInfo,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Registration successful!",
                data: newRegistration,
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}