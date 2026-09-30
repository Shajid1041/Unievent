import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
    try {
        const { ideaTitle, authorEmail, authorName, responderName, responderEmail, responderContact, message } = await req.json();

        if (!authorEmail || !responderEmail || !message) {
            return NextResponse.json(
                { success: false, message: "Missing required fields." },
                { status: 400 }
            );
        }

        // Nodemailer Config (আপনার SMTP বিবরণ দিয়ে পরিবর্তন করে নিন)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // e.g. your app email
                pass: process.env.EMAIL_PASS, // App password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: authorEmail,
            subject: `🚀 New Collaborator Request for "${ideaTitle}"`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f5; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 24px; border-radius: 12px;">
                        <h2 style="color: #4f46e5;">Hello ${authorName},</h2>
                        <p>Great news! Someone wants to collaborate with you on your project idea <strong>"${ideaTitle}"</strong>.</p>
                        
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 16px 0;" />
                        
                        <h3 style="margin-bottom: 8px;">Collaborator Details:</h3>
                        <p><strong>Name:</strong> ${responderName}</p>
                        <p><strong>Email:</strong> ${responderEmail}</p>
                        ${responderContact ? `<p><strong>Contact/WhatsApp:</strong> ${responderContact}</p>` : ""}
                        
                        <h3 style="margin-top: 16px; margin-bottom: 8px;">Message / Pitch:</h3>
                        <blockquote style="background: #f9fafb; padding: 12px; border-left: 4px solid #4f46e5; margin: 0;">
                            ${message}
                        </blockquote>

                        <p style="margin-top: 20px; font-size: 14px; color: #666;">
                            You can reply directly to this email or contact them via <strong>${responderEmail}</strong> to start working together!
                        </p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({
            success: true,
            message: "Response sent successfully via email!",
        });
    } catch (error) {
        console.error("Email error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to send email response." },
            { status: 500 }
        );
    }
}