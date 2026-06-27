export const generateOTPEmail = (userName: string, otp: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your Email</title>
    <style>
      body {
        font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f7f6;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      }
      .header {
        background-color: #4F46E5;
        padding: 30px 20px;
        text-align: center;
        color: white;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
      .content {
        padding: 40px 30px;
        color: #333333;
        line-height: 1.6;
      }
      .otp-box {
        background-color: #F3F4F6;
        border-radius: 6px;
        padding: 20px;
        text-align: center;
        margin: 30px 0;
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 4px;
        color: #111827;
      }
      .footer {
        background-color: #F9FAFB;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #6B7280;
        border-top: 1px solid #E5E7EB;
      }
      .warning {
        font-size: 14px;
        color: #DC2626;
        text-align: center;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to Evolvian</h1>
      </div>
      <div class="content">
        <p>Hello <strong>${userName}</strong>,</p>
        <p>Welcome to our platform. To complete your registration, please verify your email address.</p>
        <p>Your verification code is:</p>
        
        <div class="otp-box">${otp}</div>
        
        <p>This OTP will expire in <strong>5 minutes</strong>.</p>
        <p class="warning">Do not share this OTP with anyone.</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Evolvian. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

export const generateTaskAssignedEmail = (memberName: string, projectName: string, taskTitle: string, priority: string, dueDate: Date, description: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Inter', sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
      .header { background-color: #4F46E5; padding: 20px; text-align: center; color: white; }
      .content { padding: 30px; color: #333; line-height: 1.6; }
      .task-card { background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; padding: 20px; margin: 20px 0; }
      .detail-row { margin-bottom: 10px; }
      .label { font-weight: 600; color: #6B7280; display: inline-block; width: 100px; }
      .btn { display: inline-block; background-color: #4F46E5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: 600; margin-top: 20px; }
      .footer { background-color: #F9FAFB; padding: 20px; text-align: center; font-size: 14px; color: #6B7280; border-top: 1px solid #E5E7EB; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header"><h2>New Task Assigned</h2></div>
      <div class="content">
        <p>Hello <strong>${memberName}</strong>,</p>
        <p>A new task has been assigned to you.</p>
        
        <div class="task-card">
          <div class="detail-row"><span class="label">Project:</span> ${projectName}</div>
          <div class="detail-row"><span class="label">Task:</span> ${taskTitle}</div>
          <div class="detail-row"><span class="label">Priority:</span> ${priority}</div>
          <div class="detail-row"><span class="label">Due Date:</span> ${dueDate.toLocaleDateString()}</div>
          <div class="detail-row"><span class="label">Description:</span></div>
          <p style="margin-top: 5px; color: #4B5563;">${description}</p>
        </div>
        
        <div style="text-align: center;">
          <a href="#" class="btn">Login to Dashboard</a>
        </div>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Evolvian. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

export const generateTaskReviewEmail = (adminName: string, taskName: string, memberName: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Inter', sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
      .header { background-color: #F59E0B; padding: 20px; text-align: center; color: white; }
      .content { padding: 30px; color: #333; line-height: 1.6; }
      .highlight { color: #F59E0B; font-weight: 600; }
      .footer { background-color: #F9FAFB; padding: 20px; text-align: center; font-size: 14px; color: #6B7280; border-top: 1px solid #E5E7EB; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header"><h2>Task Ready for Review</h2></div>
      <div class="content">
        <p>Hello <strong>${adminName}</strong>,</p>
        <p>Task "<strong>${taskName}</strong>" has been moved to <span class="highlight">Review</span> by <strong>${memberName}</strong>.</p>
        <p>Please review the task in the dashboard.</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Evolvian. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

export const generateTaskCompletedEmail = (adminName: string, taskName: string, memberName: string, completionTime: Date) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Inter', sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
      .header { background-color: #10B981; padding: 20px; text-align: center; color: white; }
      .content { padding: 30px; color: #333; line-height: 1.6; }
      .details { background-color: #F3F4F6; padding: 15px; border-radius: 6px; margin-top: 20px; }
      .footer { background-color: #F9FAFB; padding: 20px; text-align: center; font-size: 14px; color: #6B7280; border-top: 1px solid #E5E7EB; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header"><h2>Task Completed</h2></div>
      <div class="content">
        <p>Hello <strong>${adminName}</strong>,</p>
        <p>Task "<strong>${taskName}</strong>" has been completed.</p>
        <div class="details">
          <p><strong>Completed by:</strong> ${memberName}</p>
          <p><strong>Completion Time:</strong> ${completionTime.toLocaleString()}</p>
        </div>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Evolvian. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};
