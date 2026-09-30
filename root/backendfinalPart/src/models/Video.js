import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        videoUrl: { type: String, required: true },
        thumbnailUrl: { type: String }, // ImgBB URL
        category: { type: String },
        description: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Video || mongoose.model("Video", VideoSchema);