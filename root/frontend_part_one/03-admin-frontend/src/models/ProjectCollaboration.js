import mongoose from "mongoose";

const ProjectCollaborationSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        requiredSkills: [{ type: String, required: true }],
        lookingFor: { type: String, required: true },
        teamLeaderName: { type: String, required: true },
        department: { type: String, required: true },
        batch: { type: String, required: true },
        contactEmail: { type: String, required: true },
        contactPhone: { type: String },
        status: { type: String, enum: ["open", "closed"], default: "open" },
    },
    { timestamps: true }
);

export default mongoose.models.ProjectCollaboration ||
    mongoose.model("ProjectCollaboration", ProjectCollaborationSchema);