# Firebase Storage Setup Guide

To fix the CORS errors and enable file uploads, you need to set up Firebase Storage:

## Step 1: Enable Firebase Storage
1. Go to https://console.firebase.google.com/project/afromaster-ed786/storage
2. Click "Get Started"
3. Choose a location (preferably close to your users, e.g., `us-central1` for US users)
4. Start in test mode (we'll update rules later)

## Step 2: Deploy Storage Rules
After enabling Storage, run:
```bash
npx firebase deploy --only storage
```

## Step 3: Verify Setup
The storage rules will allow:
- Authenticated users to upload/download their own files
- Public read access to mastered tracks (for sharing)
- Secure access control for all other files

## Current Issues Fixed:
✅ Fixed charset typo in index.html
✅ Removed Tailwind CDN (production warning)
✅ Installed proper Tailwind CSS with PostCSS
✅ Created Firebase Storage rules
✅ Updated Firebase configuration
✅ Fixed build process

## Remaining Steps:
1. Enable Firebase Storage in console
2. Deploy storage rules
3. Test file uploads

The app should now work without CORS errors once Firebase Storage is enabled!
