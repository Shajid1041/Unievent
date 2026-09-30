import mongoose from "mongoose";

const PosterSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: [
                "Cultural",
                "Contest",
                "Sports",
                "Fest",
                "Seminar",
                "Guests",
                "Project",
                "Others",
            ],
        },
        startDate: {
            type: Date,
            required: [true, "Event starting date is required"],
        },
        location: {
            type: String,
            default: "",
        },
        imageUrl: {
            type: String,
            required: [true, "Poster image URL is required"],
        },
        description: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true, // createdAt এবং updatedAt অটোমেটিক সেভ হবে
    }
);

export default mongoose.models.Poster || mongoose.model("Poster", PosterSchema);