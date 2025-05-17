import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendverificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {

        const test = await resend.emails.send({
            from: 'Mystery-Message <verify@no-reply.mystery-message.in>',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        console.log(`test`, test)
        return {
            success: true,
            message: "Email sent successfully"
        }

    } catch (error) {
        console.error("Error sending verification email!", error)
        return {
            success: false,
            message: "failed to send verification email"
        }
    }
}
