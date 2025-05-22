import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createTransporter } from '@/lib/email';

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(3, { message: "Subject is required" }),
  inquiryType: z.string().min(1, { message: "Please select an inquiry type" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

// Admin email address - you can update this directly or set it in your environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'your-actual-email@example.com'; // Replace with your actual email

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate form data
    const result = contactFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({
        success: false, 
        error: result.error.issues[0].message
      }, { status: 400 });
    }
    
    const { name, email, subject, inquiryType, message } = result.data;
    
    // Set up email transport
    const transporter = await createTransporter();
    
    // Get formatted date
    const formattedDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Create HTML template for admin notification
    const adminHtmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
          /* Reset styles */
          body, html {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.5;
            color: #333;
          }
          
          /* Container */
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
          }
          
          /* Header */
          .header {
            background-color: #000000;
            color: #ffffff !important;
            padding: 30px;
            text-align: center;
          }
          
          .logo {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 1px;
            margin: 0;
            color: #ffffff !important;
          }
          
          /* Content */
          .content {
            padding: 30px;
          }
          
          h1 {
            color: #000000;
            font-size: 22px;
            margin-top: 0;
            margin-bottom: 20px;
            font-weight: 600;
          }
          
          .notification-banner {
            background-color: #f2f2f2;
            border-left: 4px solid #000;
            padding: 12px 15px;
            margin-bottom: 20px;
            font-size: 14px;
          }
          
          .message-card {
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            overflow: hidden;
            margin-bottom: 25px;
          }
          
          .message-header {
            background-color: #f8f8f8;
            padding: 15px;
            border-bottom: 1px solid #e0e0e0;
          }
          
          .message-header p {
            margin: 0;
            font-size: 14px;
            color: #666;
          }
          
          .message-header strong {
            color: #333;
          }
          
          .field {
            padding: 0 15px;
            margin: 15px 0;
          }
          
          .field-label {
            font-weight: 600;
            font-size: 14px;
            color: #555;
            margin-bottom: 5px;
          }
          
          .field-value {
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 4px;
            font-size: 14px;
            line-height: 1.6;
          }
          
          .field-value.message {
            white-space: pre-wrap;
            color: #333;
          }
          
          .customer-info {
            margin-top: 20px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 6px;
          }
          
          .customer-info h2 {
            margin-top: 0;
            font-size: 16px;
            color: #333;
            margin-bottom: 10px;
          }
          
          .customer-info p {
            margin: 5px 0;
            font-size: 14px;
          }
          
          .customer-info p strong {
            display: inline-block;
            min-width: 80px;
          }
          
          /* Footer */
          .footer {
            background-color: #f8f8f8;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e0e0e0;
          }
          
          .reply-btn {
            display: inline-block;
            background-color: #000000;
            color: #ffffff !important;
            text-decoration: none;
            padding: 10px 24px;
            border-radius: 9999px;
            margin: 20px 0;
            font-weight: 500;
            font-size: 14px;
          }
          
          .timestamp {
            color: #999;
            font-size: 12px;
            text-align: right;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header" style="background-color: #000000; padding: 30px; text-align: center;">
            <h1 class="logo" style="color: #ffffff; font-size: 24px; font-weight: bold; letter-spacing: 1px; margin: 0;">UrbanIQ</h1>
          </div>
          
          <div class="content">
            <h1>New Contact Form Submission</h1>
            
            <div class="notification-banner">
              You've received a new message from your website's contact form.
            </div>
            
            <div class="message-card">
              <div class="message-header">
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Type:</strong> ${inquiryType}</p>
              </div>
              
              <div class="field">
                <div class="field-label">Message:</div>
                <div class="field-value message">${message}</div>
              </div>
            </div>
            
            <div class="customer-info">
              <h2>Customer Information</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            </div>
            
            <a href="mailto:${email}?subject=Re: ${subject}" class="reply-btn" style="display: inline-block; background-color: #000000; color: #ffffff !important; text-decoration: none; padding: 10px 24px; border-radius: 9999px; margin: 20px 0; font-weight: 500; font-size: 14px;">Reply to Customer</a>
            
            <div class="timestamp">
              Received on ${formattedDate}
            </div>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} UrbanIQ. All rights reserved.</p>
            <p>This email is automated and sent directly from your contact form.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const autoReplyHtmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Contacting UrbanIQ</title>
        <style>
          /* Reset styles */
          body, html {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.5;
            color: #333;
          }
          
          /* Container */
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
          }
          
          /* Header */
          .header {
            background-color: #000000;
            color: #ffffff !important;
            padding: 30px;
            text-align: center;
          }
          
          .logo {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 1px;
            margin: 0;
            color: #ffffff !important;
          }
          
          /* Content */
          .content {
            padding: 30px;
          }
          
          h1 {
            color: #000000;
            font-size: 22px;
            margin-top: 0;
            margin-bottom: 20px;
            font-weight: 600;
          }
          
          p {
            margin: 15px 0;
            font-size: 15px;
            color: #444;
          }
          
          .confirmation-card {
            background-color: #f9f9f9;
            border-left: 3px solid #000000;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
          }
          
          .confirmation-message {
            margin: 0;
            font-weight: 500;
          }
          
          .summary-card {
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            padding: 20px;
            margin: 25px 0;
          }
          
          .summary-title {
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 16px;
          }
          
          .summary-item {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
            display: flex;
          }
          
          .summary-item:last-child {
            border-bottom: none;
          }
          
          .summary-label {
            font-weight: 500;
            width: 100px;
            flex-shrink: 0;
            color: #555;
          }
          
          .summary-value {
            color: #333;
          }
          
          .team-signature {
            margin-top: 30px;
          }
          
          /* Footer */
          .footer {
            background-color: #f8f8f8;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e0e0e0;
          }
          
          .social-links {
            margin: 15px 0;
            text-align: center;
          }
          
          .social-links a {
            display: inline-block;
            margin: 0 8px;
            color: #666;
            text-decoration: none;
            font-size: 13px;
          }
          
          .support-links {
            margin-top: 15px;
            text-align: center;
          }
          
          .support-links a {
            display: inline-block;
            margin: 0 10px;
            color: #333;
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
          }
          
          .cta-button {
            display: inline-block;
            background-color: #000000;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 9999px;
            margin: 20px 0;
            font-weight: 500;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header" style="background-color: #000000; padding: 30px; text-align: center;">
            <h1 class="logo" style="color: #ffffff; font-size: 24px; font-weight: bold; letter-spacing: 1px; margin: 0;">UrbanIQ</h1>
          </div>
          
          <div class="content">
            <h1>Thank You for Contacting Us</h1>
            
            <p>Hello ${name},</p>
            
            <p>Thank you for reaching out to UrbanIQ. We've received your message and want to let you know that it's important to us.</p>
            
            <div class="confirmation-card">
              <p class="confirmation-message">Your message has been received and is now in our system. A member of our team will review it and get back to you shortly.</p>
            </div>
            
            <div class="summary-card">
              <h3 class="summary-title">Your Message Summary</h3>
              
              <div class="summary-item">
                <div class="summary-label">Subject:</div>
                <div class="summary-value">${subject}</div>
              </div>
              
              <div class="summary-item">
                <div class="summary-label">Type:</div>
                <div class="summary-value">${inquiryType}</div>
              </div>
              
              <div class="summary-item">
                <div class="summary-label">Date:</div>
                <div class="summary-value">${formattedDate}</div>
              </div>
            </div>
            
            <p>In the meantime, you might find answers to common questions in our support center. Our help documentation covers frequently asked questions and provides detailed product information.</p>
            
            <a href="https://urbaniq.vercel.app/support" class="cta-button" style="display: inline-block; background-color: #000000; color: #ffffff !important; text-decoration: none; padding: 12px 25px; border-radius: 9999px; margin: 20px 0; font-weight: 500; text-align: center;">Visit Our Support Center</a>
            
            <div class="team-signature">
              <p>Thank you for your interest in UrbanIQ,</p>
              <p>The UrbanIQ Team</p>
            </div>
          </div>
          
          <div class="footer">
            <div class="social-links">
              <a href="https://facebook.com/urbaniq">Facebook</a>
              <a href="https://twitter.com/urbaniq">Twitter</a>
              <a href="https://instagram.com/urbaniq">Instagram</a>
              <a href="https://linkedin.com/company/urbaniq">LinkedIn</a>
            </div>
            
            <p>This is an automated email. Please do not reply directly.</p>
            
            <div class="support-links">
              <a href="https://urbaniq.vercel.app/faq">FAQ</a>
              <a href="https://urbaniq.vercel.app/contact">Contact</a>
              <a href="https://urbaniq.vercel.app/privacy">Privacy</a>
            </div>
            
            <p>&copy; ${new Date().getFullYear()} UrbanIQ. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Send email to admin
    try {
      const adminEmailResult = await transporter.sendMail({
        from: process.env.EMAIL_USER || 'UrbanIQ <no-reply@urbaniq.com>',
        to: ADMIN_EMAIL,
        subject: `New Contact Form Submission: ${subject}`,
        html: adminHtmlTemplate,
        replyTo: email // Allow replying directly to the sender
      });
      
      console.log('✅ Admin notification email sent:', adminEmailResult.messageId);
    } catch (error) {
      console.error('❌ Error sending admin notification email:', error);
      // We'll continue even if admin email fails so user still gets confirmation
    }
    
    // Send auto-reply to user
    try {
      const userEmailResult = await transporter.sendMail({
        from: process.env.EMAIL_USER || 'UrbanIQ <no-reply@urbaniq.com>',
        to: email,
        subject: 'Thank You for Contacting UrbanIQ',
        html: autoReplyHtmlTemplate,
      });
      
      console.log('✅ User confirmation email sent:', userEmailResult.messageId);
    } catch (error) {
      console.error('❌ Error sending user confirmation email:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to send confirmation email. Please try again later.' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Your message has been sent! We'll get back to you shortly." 
    });
    
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send your message. Please try again later.' 
    }, { status: 500 });
  }
} 