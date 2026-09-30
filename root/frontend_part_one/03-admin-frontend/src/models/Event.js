import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        subtitle: { type: String },
        description: { type: String, required: true },
        category: { type: String, required: true },
        imageUrl: { type: String, required: true }, // ImgBB URL
        date: { type: Date, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        venue: { type: String, required: true },
        chiefGuest: { type: String },
        organizer: { type: String, required: true },
        organizerContact: { type: String, required: true },
        registrationRequired: { type: Boolean, default: false },
        registrationFee: { type: Number, default: 0 },
        registrationType: { type: String, enum: ["internal", "external"], default: "internal" },
        registrationLink: { type: String },
        registrationDeadline: { type: Date },
        maxParticipants: { type: Number },
        status: {
            type: String,
            enum: ["upcoming", "ongoing", "completed", "cancelled"],
            default: "upcoming",
        },
        featured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);