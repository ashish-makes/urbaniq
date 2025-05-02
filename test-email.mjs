#!/usr/bin/env node

/**
 * This is a standalone test script to verify your Nodemailer configuration works correctly.
 * It will send a test email to the address you specify.
 * 
 * Usage:
 * 1. Set up your .env.local file with EMAIL_USER and EMAIL_PASSWORD
 * 2. Run: node test-email.mjs your-test-email@example.com
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Find the project root and load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '.env.local');

if (fs.existsSync(envPath)) {
  console.log(`Loading environment from ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.log('.env.local not found, checking for .env');
  dotenv.config();
}

// Get recipient email from command line argument
const recipient = process.argv[2];
if (!recipient) {
  console.error('❌ Please provide a recipient email address as an argument.');
  console.error('   Usage: node test-email.mjs your-test-email@example.com');
  process.exit(1);
}

// Generate a test verification code
const testCode = Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Creates a transporter for sending emails
 */
async function createTransporter() {
  // Check if we have email credentials
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('Email credentials not found in environment, using Ethereal test account');
    
    // Generate test SMTP service account from ethereal.email
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
  
  // Use the configured email service (Gmail by default)
  console.log(`Using email service: ${process.env.EMAIL_SERVICE || 'Gmail'}`);
  
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

// Create the email content
const htmlTemplate = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #333;">UrbanIQ Email Test</h1>
    <p>This is a test email to verify your Nodemailer configuration is working correctly.</p>
    <div style="background-color: #f5f5f5; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
      <div style="font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #000000;">${testCode}</div>
    </div>
    <p>If you received this email, your email configuration is correct! 🎉</p>
    <p>You can now use real email verification in your UrbanIQ application.</p>
  </div>
`;

// Plain text version
const textVersion = `
  UrbanIQ Email Test
  
  This is a test email to verify your Nodemailer configuration is working correctly.
  
  Your verification code is: ${testCode}
  
  If you received this email, your email configuration is correct!
  You can now use real email verification in your UrbanIQ application.
`;

// Send the test email
console.log(`🚀 Sending test email to ${recipient}...`);

async function sendTestEmail() {
  try {
    const transporter = await createTransporter();
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || 'UrbanIQ Test <no-reply@urbaniq.com>',
      to: recipient,
      subject: 'UrbanIQ Email Verification Test',
      text: textVersion,
      html: htmlTemplate,
    });
    
    console.log('✅ Test email sent successfully!');
    
    // If using Ethereal, provide the preview URL
    if (info.messageId && !process.env.EMAIL_USER) {
      console.log('=========================================');
      console.log('📩 EMAIL PREVIEW AVAILABLE:');
      console.log(`🔗 ${nodemailer.getTestMessageUrl(info)}`);
      console.log('Copy and paste this link in your browser to view the email');
      console.log('=========================================');
    } else {
      console.log(`📧 Check ${recipient} for the test email.`);
    }
    
    console.log(`🔑 Verification code sent: ${testCode}`);
  } catch (error) {
    console.error('❌ Error sending test email:');
    console.error(error);
    
    console.log('\nTroubleshooting tips:');
    console.log('For Gmail:');
    console.log('1. Make sure your email and password are correct');
    console.log('2. If using Gmail, enable "Less secure app access" or create an app password');
    console.log('3. For app passwords: https://myaccount.google.com/apppasswords');
    
    console.log('\nFor Outlook:');
    console.log('1. Check your credentials are correct');
    console.log('2. Make sure you\'ve allowed this app to send emails');
    
    console.log('\nFor both:');
    console.log('1. Check your internet connection');
    console.log('2. Make sure your email service isn\'t blocking the connection');
  }
}

sendTestEmail(); 