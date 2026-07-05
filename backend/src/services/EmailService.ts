import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { generateOTPEmail, generateTaskAssignedEmail, generateTaskReviewEmail, generateTaskCompletedEmail } from '../utils/emailTemplates';

const sesClient = new SESClient({
  region: (process.env.AWS_REGION || 'us-east-1').trim(),
  credentials: {
    accessKeyId: (process.env.AWS_ACCESS_KEY_ID || '').trim(),
    secretAccessKey: (process.env.AWS_SECRET_ACCESS_KEY || '').trim(),
  },
});

export class EmailService {
  private static async sendEmail(to: string, subject: string, htmlBody: string) {
    if (!process.env.AWS_ACCESS_KEY_ID) {
      console.warn('AWS SES is not configured. Mocking email send to:', to);
      console.warn('Subject:', subject);
      return true;
    }

    const fromEmail = (process.env.SES_FROM_EMAIL || 'noreply@evolvian.in').trim();
    const recipientEmail = to ? to.trim() : "";

    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: [recipientEmail],
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
      Source: fromEmail,
    });

    try {
      await sesClient.send(command);
      console.log(`Email sent successfully to ${to}`);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  static async sendOTPEmail(email: string, userName: string, otp: string) {
    const subject = 'Verify your Email';
    const htmlBody = generateOTPEmail(userName, otp);
    return this.sendEmail(email, subject, htmlBody);
  }

  static async sendTaskAssignedEmail(email: string, memberName: string, projectName: string, taskTitle: string, priority: string, dueDate: Date, description: string) {
    const subject = 'New Task Assigned';
    const htmlBody = generateTaskAssignedEmail(memberName, projectName, taskTitle, priority, dueDate, description);
    return this.sendEmail(email, subject, htmlBody);
  }

  static async sendTaskReviewEmail(adminEmail: string, adminName: string, taskName: string, memberName: string) {
    const subject = 'Task Ready for Review';
    const htmlBody = generateTaskReviewEmail(adminName, taskName, memberName);
    return this.sendEmail(adminEmail, subject, htmlBody);
  }

  static async sendTaskCompletedEmail(adminEmail: string, adminName: string, taskName: string, memberName: string, completionTime: Date) {
    const subject = 'Task Completed';
    const htmlBody = generateTaskCompletedEmail(adminName, taskName, memberName, completionTime);
    return this.sendEmail(adminEmail, subject, htmlBody);
  }
}
