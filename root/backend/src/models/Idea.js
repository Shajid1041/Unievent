import mongoose from "mongoose";

const IdeaSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Project title is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: [
                "Mobile App",
                "Web App",
                "AI/ML",
                "IoT/Robotics",
                "Cyber Security",
                "Game Dev",
                "Others",
            ],
        },
        description: {
            type: String,
            required: [true, "Project description is required"],
        },
        rolesNeeded: [
            {
                type: String, // e.g., "Frontend Developer", "UI/UX Designer", "Backend"
            },
        ],
        authorName: {
            type: String,
            required: [true, "Author name is required"],
        },
        authorEmail: {
            type: String,
            required: [true, "Author email is required"],
        },
        authorContact: {
            type: String, // WhatsApp / Phone (Optional)
            default: "",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Idea || mongoose.model("Idea", IdeaSchema);