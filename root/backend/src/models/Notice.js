import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        category: {
            type: String,
            enum: ["Academic", "Administrative", "Exam", "Event", "General"],
            default: "General",
        },
        publishedBy: { type: String, default: "Admin Office" },
        attachmentUrl: { type: String }, // PDF or Image Link if uploaded
        isPinned: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.models.Notice || mongoose.model("Notice", NoticeSchema);