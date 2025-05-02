# Setting up Google OAuth for UrbanIQ

This guide walks you through setting up Google OAuth for authentication in your UrbanIQ application.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" at the top of the page, then click "New Project"
3. Name your project (e.g., "UrbanIQ") and click "Create"
4. Select your new project from the project selector

## Step 2: Configure OAuth Consent Screen

1. In the left sidebar, navigate to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type (unless you have a Google Workspace organization) and click "Create"
3. Fill in the required information:
   - App name: "UrbanIQ"
   - User support email: Your email address
   - Developer contact information: Your email address
4. Click "Save and Continue"
5. On the "Scopes" page, click "Add or Remove Scopes" and add:
   - `userinfo.email`
   - `userinfo.profile`
   - `openid`
6. Click "Save and Continue"
7. Add test users if needed, then click "Save and Continue"
8. Review your settings and click "Back to Dashboard"

## Step 3: Create OAuth Client ID

1. In the left sidebar, navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" and select "OAuth client ID"
3. Application type: "Web application"
4. Name: "UrbanIQ Web Client"
5. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production URL (e.g., `https://your-app-domain.com`)
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-app-domain.com/api/auth/callback/google` (for production)
7. Click "Create"
8. A popup will show your client ID and client secret - save these securely

## Step 4: Add Credentials to Your Project

1. Create or edit your `.env.local` file in the root of your project
2. Add the following environment variables:

```
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

## Step 5: Verify Implementation

1. Run your development server
2. Navigate to the login page
3. Click "Sign in with Google"
4. You should be able to authenticate using your Google account

## Troubleshooting

If you encounter issues:

1. Check that your redirect URIs match exactly in both your Google Cloud Console and your NextAuth configuration
2. Ensure your environment variables are loaded correctly
3. Verify that the Google OAuth provider is properly configured in your NextAuth setup
4. Check browser console and server logs for specific error messages

## Moving to Production

When deploying to production:

1. Update your Google Cloud project's redirect URIs with your production URLs
2. Update your environment variables on your production server
3. Publish your OAuth consent screen if you want to allow all users to sign in (rather than just test users) 