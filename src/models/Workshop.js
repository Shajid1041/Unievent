import mongoose from "mongoose";

const WorkshopSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        bannerUrl: { type: String, required: true }, // ImgBB URL
        instructors: [
            {
                name: { type: String, required: true },
                designation: { type: String },
                organization: { type: String },
            },
        ],
        prerequisites: [{ type: String }],
        venue: { type: String, required: true },
        registrationFee: { type: Number, default: 0 },
        registrationDeadline: { type: Date, required: true },
        maxParticipants: { type: Number },
        certificateProvided: { type: Boolean, default: true },
        organizer: { type: String, required: true },
        status: {
            type: String,
            enum: ["upcoming", "ongoing", "completed", "cancelled"],
            default: "upcoming",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Workshop || mongoose.model("Workshop", WorkshopSchema);