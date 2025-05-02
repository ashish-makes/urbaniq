// This is a placeholder for email sending functionality
// In a production environment, you would use a service like SendGrid, Mailgun, etc.

import nodemailer from 'nodemailer';

/**
 * Creates a test/development transport for sending emails
 * In development, this creates a test account with Ethereal Mail
 * In production, it uses the configured email provider (Gmail, Outlook, etc.)
 */
export async function createTransporter() {
  // Check if we're in development mode and don't have email credentials
  if (process.env.NODE_ENV !== 'production' && 
      (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD)) {
    
    // Generate test SMTP service account from ethereal.email for development/testing
    const testAccount = await nodemailer.createTestAccount();
    
    console.log('=========================================');
    console.log('ETHEREAL EMAIL TEST ACCOUNT CREDENTIALS:');
    console.log(`Username: ${testAccount.user}`);
    console.log(`Password: ${testAccount.pass}`);
    console.log('You can log in at https://ethereal.email to view emails');
    console.log('=========================================');
    
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
  
  // For production or if email credentials are provided
  // This example uses Gmail, but you can use any SMTP provider
  const transportConfig = {
    // Gmail configuration
    service: process.env.EMAIL_SERVICE || 'Gmail', // Can be 'Gmail', 'Outlook', 'Yahoo', etc.
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASSWORD, // Your email password or app password
    },
  };
  
  return nodemailer.createTransport(transportConfig);
}

/**
 * Sends a verification email with OTP to the user
 */
export async function sendVerificationEmail(email: string, name: string, otp: string): Promise<void> {
  console.log(`[EMAIL SERVICE] Sending verification email to ${email}`);
  console.log(`[EMAIL SERVICE] Verification code: ${otp}`);
  
  try {
    // Create transporter
    const transporter = await createTransporter();
    
    // Create a beautiful HTML email template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }
          body {
            background-color: #f9f9f9;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
          }
          .email-card {
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
            overflow: hidden;
          }
          .email-header {
            background-color: #000000;
            padding: 30px 40px;
            text-align: center;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: white;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          .email-body {
            padding: 40px;
            color: #333333;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 20px;
            color: #000000;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
            color: #555555;
          }
          .code-container {
            background-color: #f5f5f5;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .verification-code {
            font-size: 32px;
            letter-spacing: 8px;
            font-weight: bold;
            color: #000000;
          }
          .expiry {
            margin-top: 12px;
            font-size: 14px;
            color: #777777;
          }
          .disclaimer {
            font-size: 14px;
            color: #999999;
            margin-top: 30px;
            font-style: italic;
          }
          .email-footer {
            text-align: center;
            padding: 20px;
            background-color: #f5f5f5;
            color: #999999;
            font-size: 14px;
          }
          .footer-links {
            margin-bottom: 10px;
          }
          .footer-links a {
            color: #666666;
            text-decoration: none;
            margin: 0 10px;
          }
          .footer-links a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email-card">
            <div class="email-header">
              <div class="logo">UrbanIQ</div>
            </div>
            <div class="email-body">
              <h1>Verify Your Email Address</h1>
              <p>Hi ${name},</p>
              <p>Thank you for signing up! To complete your registration, please use the verification code below:</p>
              
              <div class="code-container">
                <div class="verification-code">${otp}</div>
                <div class="expiry">This code will expire in 10 minutes</div>
              </div>
              
              <p>If you did not request this verification code, please ignore this email or contact support if you have concerns.</p>
              
              <div class="disclaimer">
                This is an automated email, please do not reply to this message.
              </div>
            </div>
            <div class="email-footer">
              <div class="footer-links">
                <a href="#">Terms</a>
                <a href="#">Privacy</a>
                <a href="#">Support</a>
              </div>
              <div>&copy; ${new Date().getFullYear()} UrbanIQ. All rights reserved.</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Plain text version as fallback
    const textVersion = `
      Verify Your Email Address
      
      Hi ${name},
      
      Thank you for signing up! To complete your registration, please use the verification code below:
      
      ${otp}
      
      This code will expire in 10 minutes.
      
      If you did not request this verification code, please ignore this email or contact support if you have concerns.
      
      This is an automated email, please do not reply to this message.
      
      © ${new Date().getFullYear()} UrbanIQ. All rights reserved.
    `;
    
    // Send the email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || 'UrbanIQ <no-reply@urbaniq.com>',
      to: email,
      subject: 'Verify Your Email Address - UrbanIQ',
      text: textVersion,
      html: htmlTemplate,
    });
    
    console.log(`[EMAIL SERVICE] Message sent: ${info.messageId}`);
    
    // If using Ethereal for testing, log the preview URL
    if (process.env.NODE_ENV !== 'production' && info.messageId) {
      console.log('=========================================');
      console.log('📩 EMAIL PREVIEW AVAILABLE:');
      console.log(`🔗 ${nodemailer.getTestMessageUrl(info)}`);
      console.log('Copy and paste this link in your browser to view the email');
      console.log('=========================================');
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('[EMAIL SERVICE] Error sending email:', error);
    
    // In development mode, continue even if email sending fails
    if (process.env.NODE_ENV !== 'production') {
      console.log('[EMAIL SERVICE] Continuing despite email error in development mode.');
      return Promise.resolve();
    }
    
    return Promise.reject(error);
  }
}

/**
 * Sends a password reset email with a reset link
 */
export async function sendPasswordResetEmail(email: string, name: string, resetLink: string): Promise<void> {
  console.log(`[EMAIL SERVICE] Sending password reset email to ${email}`);
  console.log(`[EMAIL SERVICE] Reset link: ${resetLink}`);
  
  try {
    // Create transporter
    const transporter = await createTransporter();
    
    // Create a beautiful HTML email template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }
          body {
            background-color: #f9f9f9;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
          }
          .email-card {
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
            overflow: hidden;
          }
          .email-header {
            background-color: #000000;
            padding: 30px 40px;
            text-align: center;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: white;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          .email-body {
            padding: 40px;
            color: #333333;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 20px;
            color: #000000;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
            color: #555555;
          }
          .button {
            display: inline-block;
            background-color: #000000;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 50px;
            font-weight: 500;
            margin: 20px 0;
            text-align: center;
          }
          .button:hover {
            background-color: #333333;
          }
          .expiry {
            margin-top: 12px;
            font-size: 14px;
            color: #777777;
          }
          .disclaimer {
            font-size: 14px;
            color: #999999;
            margin-top: 30px;
            font-style: italic;
          }
          .email-footer {
            text-align: center;
            padding: 20px;
            background-color: #f5f5f5;
            color: #999999;
            font-size: 14px;
          }
          .footer-links {
            margin-bottom: 10px;
          }
          .footer-links a {
            color: #666666;
            text-decoration: none;
            margin: 0 10px;
          }
          .footer-links a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email-card">
            <div class="email-header">
              <div class="logo">UrbanIQ</div>
            </div>
            <div class="email-body">
              <h1>Reset Your Password</h1>
              <p>Hi ${name},</p>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              
              <div style="text-align: center;">
                <a href="${resetLink}" class="button">Reset Password</a>
              </div>
              
              <p>This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
              
              <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
              <p style="word-break: break-all; font-size: 14px; color: #666666;">${resetLink}</p>
              
              <div class="disclaimer">
                This is an automated email, please do not reply to this message.
              </div>
            </div>
            <div class="email-footer">
              <div class="footer-links">
                <a href="#">Terms</a>
                <a href="#">Privacy</a>
                <a href="#">Support</a>
              </div>
              <div>&copy; ${new Date().getFullYear()} UrbanIQ. All rights reserved.</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Plain text version as fallback
    const textVersion = `
      Reset Your Password
      
      Hi ${name},
      
      We received a request to reset your password. To create a new password, click on the link below:
      
      ${resetLink}
      
      This link will expire in 1 hour.
      
      If you didn't request a password reset, you can safely ignore this email.
      
      © ${new Date().getFullYear()} UrbanIQ. All rights reserved.
    `;
    
    // Send the email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || 'UrbanIQ <no-reply@urbaniq.com>',
      to: email,
      subject: 'Reset Your Password - UrbanIQ',
      text: textVersion,
      html: htmlTemplate,
    });
    
    console.log(`[EMAIL SERVICE] Message sent: ${info.messageId}`);
    
    // If using Ethereal for testing, log the preview URL
    if (process.env.NODE_ENV !== 'production' && info.messageId) {
      console.log('=========================================');
      console.log('📩 EMAIL PREVIEW AVAILABLE:');
      console.log(`🔗 ${nodemailer.getTestMessageUrl(info)}`);
      console.log('Copy and paste this link in your browser to view the email');
      console.log('=========================================');
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('[EMAIL SERVICE] Error sending password reset email:', error);
    
    // In development mode, continue even if email sending fails
    if (process.env.NODE_ENV !== 'production') {
      console.log('[EMAIL SERVICE] Continuing despite email error in development mode.');
      return Promise.resolve();
    }
    
    return Promise.reject(error);
  }
} 