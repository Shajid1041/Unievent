import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return NextResponse.json({ success: false, message: "Invalid Email or Password" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: "Invalid Email or Password" }, { status: 401 });
        }

        // Generate simple token without external JWT library
        const token = crypto.randomBytes(32).toString("hex");
        admin.token = token;
        await admin.save();

        return NextResponse.json({
            success: true,
            token,
            admin: { name: admin.name, email: admin.email },
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}