import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema(
    {
        categoryType: {
            type: String,
            required: true,
            enum: ["Event", "Workshop"],
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "categoryType",
        },
        targetTitle: { type: String, required: true },
        studentName: { type: String, required: true },
        studentId: { type: String, required: true },
        department: { type: String, required: true },
        batch: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Free", "Rejected"], // 👈 'Rejected' যুক্ত থাকা নিশ্চিত করুন
            default: "Pending",
        },
        transactionId: { type: String },
        additionalInfo: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Registration || mongoose.model("Registration", RegistrationSchema);