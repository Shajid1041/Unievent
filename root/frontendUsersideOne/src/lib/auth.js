import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function verifyAdminToken(request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];
    await dbConnect();

    // DB-তে Token ম্যাচ করে দেখা হচ্ছে
    const admin = await Admin.findOne({ token });
    return admin || null;
}