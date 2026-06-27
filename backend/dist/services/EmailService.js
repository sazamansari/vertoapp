"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const client_ses_1 = require("@aws-sdk/client-ses");
const emailTemplates_1 = require("../utils/emailTemplates");
const sesClient = new client_ses_1.SESClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});
const FROM_EMAIL = process.env.AWS_SES_FROM_EMAIL || 'noreply@evolvian.com';
class EmailService {
    static async sendEmail(to, subject, htmlBody) {
        if (!process.env.AWS_ACCESS_KEY_ID) {
            console.warn('AWS SES is not configured. Mocking email send to:', to);
            console.warn('Subject:', subject);
            return true;
        }
        const command = new client_ses_1.SendEmailCommand({
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: htmlBody,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject,
                },
            },
            Source: FROM_EMAIL,
        });
        try {
            await sesClient.send(command);
            console.log(`Email sent successfully to ${to}`);
            return true;
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
    static async sendOTPEmail(email, userName, otp) {
        const subject = 'Verify your Email';
        const htmlBody = (0, emailTemplates_1.generateOTPEmail)(userName, otp);
        return this.sendEmail(email, subject, htmlBody);
    }
    static async sendTaskAssignedEmail(email, memberName, projectName, taskTitle, priority, dueDate, description) {
        const subject = 'New Task Assigned';
        const htmlBody = (0, emailTemplates_1.generateTaskAssignedEmail)(memberName, projectName, taskTitle, priority, dueDate, description);
        return this.sendEmail(email, subject, htmlBody);
    }
    static async sendTaskReviewEmail(adminEmail, adminName, taskName, memberName) {
        const subject = 'Task Ready for Review';
        const htmlBody = (0, emailTemplates_1.generateTaskReviewEmail)(adminName, taskName, memberName);
        return this.sendEmail(adminEmail, subject, htmlBody);
    }
    static async sendTaskCompletedEmail(adminEmail, adminName, taskName, memberName, completionTime) {
        const subject = 'Task Completed';
        const htmlBody = (0, emailTemplates_1.generateTaskCompletedEmail)(adminName, taskName, memberName, completionTime);
        return this.sendEmail(adminEmail, subject, htmlBody);
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=EmailService.js.map