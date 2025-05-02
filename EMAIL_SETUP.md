# Email Verification Setup Guide

This guide will help you set up real email verification using Nodemailer for your UrbanIQ application.

## Using Free Email Services

You can use your existing Gmail, Outlook, or Yahoo email account to send verification emails. This approach is:
- Free to use
- Simple to set up
- Perfect for smaller applications or development

## Setup Instructions

### 1. Choose an Email Provider

You can use any of these email services:
- Gmail
- Outlook/Hotmail
- Yahoo Mail
- Any other email provider that supports SMTP

### 2. Gmail Setup (Recommended)

For Gmail, you'll need to set up an "App Password":

1. Make sure you have 2-Step Verification enabled for your Google account
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification if not already enabled

2. Create an App Password
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "App" → "Other (Custom name)"
   - Enter "UrbanIQ Verification" and click "Generate"
   - Google will display a 16-character password - copy this password

3. Use this app password (not your regular Gmail password) in your application

### 3. Outlook Setup

For Outlook/Hotmail:

1. Use your regular email and password
2. If you have two-factor authentication enabled, you'll need to create an app password:
   - Go to [Outlook Account Security](https://account.live.com/proofs/Manage)
   - Select "Security" → "Advanced security options"
   - Under "App passwords", select "Create a new app password"

### 4. Configure Your Application

1. Create a `.env.local` file in the root of your project
2. Add the following environment variables:

```
# Email Configuration
EMAIL_SERVICE=Gmail     # or "Outlook" or "Yahoo"
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your-app-password

# Other configuration variables
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
DATABASE_URL=your_database_connection_string
```

3. Restart your development server

### 5. Test Your Configuration

The easiest way to test your configuration is to use the included test script:

```
npm install nodemailer dotenv
node test-email.mjs your-test-email@example.com
```

This will:
1. Send a test email to the address you specify
2. Show you the verification code that was sent
3. Help diagnose any issues with your configuration

## Troubleshooting

### Gmail Issues

- **"Less secure app access" error**: You must use an App Password as described above
- **Email not sending**: Make sure you're using the App Password, not your regular Gmail password
- **Rate limits**: Gmail has a sending limit of 500 emails per day for free accounts

### Outlook/Hotmail Issues

- **Authentication errors**: Double-check your email and password
- **Account locked**: Some suspicious activity might lock your account; check your email for security alerts
- **Sending limits**: Outlook has a sending limit of 300 emails per day

### General Issues

- **Connection errors**: Check your internet connection and firewall settings
- **Email in spam folder**: Check your spam/junk folder for the verification email
- **Server errors**: Check the console logs for detailed error messages

## Production Considerations

For a production environment:

1. Consider using a dedicated email service like SendGrid, Mailgun, or Amazon SES for:
   - Higher sending limits
   - Better deliverability
   - More detailed analytics

2. Update your environment variables with your production settings

3. Always store your email credentials securely:
   - Never commit your `.env.local` file to version control
   - Use environment variables in your hosting platform
   - Consider using a secrets manager for larger applications

## Automatic Fallback to Test Emails

If you don't configure real email credentials, the system will automatically use Ethereal Email for testing:
- Test emails won't actually be delivered to real inboxes
- Preview links will be displayed in the console
- Perfect for development and testing without setting up real emails 