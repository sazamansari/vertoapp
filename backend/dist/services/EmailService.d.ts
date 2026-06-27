export declare class EmailService {
    private static sendEmail;
    static sendOTPEmail(email: string, userName: string, otp: string): Promise<boolean>;
    static sendTaskAssignedEmail(email: string, memberName: string, projectName: string, taskTitle: string, priority: string, dueDate: Date, description: string): Promise<boolean>;
    static sendTaskReviewEmail(adminEmail: string, adminName: string, taskName: string, memberName: string): Promise<boolean>;
    static sendTaskCompletedEmail(adminEmail: string, adminName: string, taskName: string, memberName: string, completionTime: Date): Promise<boolean>;
}
//# sourceMappingURL=EmailService.d.ts.map