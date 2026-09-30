import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        eventCategory: { type: String },
        imageUrl: { type: String, required: true }, // ImgBB URL
        caption: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);