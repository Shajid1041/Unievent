import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Registration from "@/models/Registration";

export async function PATCH(request, { params }) {
    try {
        await dbConnect();

        // Next.js params থেকে id নেওয়ার সঠিক পদ্ধতি
        const resolvedParams = await params;
        const id = resolvedParams.id;

        const body = await request.json();
        const { paymentStatus } = body;

        const validStatuses = ["Free", "Pending", "Paid", "Rejected"];
        if (!paymentStatus || !validStatuses.includes(paymentStatus)) {
            return NextResponse.json(
                { success: false, message: "Invalid payment status provided." },
                { status: 400 }
            );
        }

        const updatedRegistration = await Registration.findByIdAndUpdate(
            id,
            { paymentStatus },
            { new: true, runValidators: true }
        );

        if (!updatedRegistration) {
            return NextResponse.json(
                { success: false, message: "Registration not found in database." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: `Status updated to ${paymentStatus}`,
                data: updatedRegistration,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}