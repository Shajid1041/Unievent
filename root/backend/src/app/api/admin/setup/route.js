import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        await dbConnect();

        // Check if an admin already exists
        const adminCount = await Admin.countDocuments({});
        if (adminCount > 0) {
            return NextResponse.json(
                { success: false, message: "Admin account already initialized!" },
                { status: 400 }
            );
        }

        const email = process.env.ADMIN_EMAIL || "admin@university.edu";
        const rawPassword = process.env.ADMIN_PASSWORD || "admin123456";

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawPassword, salt);

        const newAdmin = await Admin.create({
            name: "Super Admin",
            email: email,
            password: hashedPassword,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Initial Admin created successfully!",
                data: { name: newAdmin.name, email: newAdmin.email },
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}