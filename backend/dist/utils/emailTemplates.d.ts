export declare const generateOTPEmail: (userName: string, otp: string) => string;
export declare const generateTaskAssignedEmail: (memberName: string, projectName: string, taskTitle: string, priority: string, dueDate: Date, description: string) => string;
export declare const generateTaskReviewEmail: (adminName: string, taskName: string, memberName: string) => string;
export declare const generateTaskCompletedEmail: (adminName: string, taskName: string, memberName: string, completionTime: Date) => string;
//# sourceMappingURL=emailTemplates.d.ts.map