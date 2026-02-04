#!/usr/bin/env node

console.log('🔍 Google OAuth Debug Tool');
console.log('==========================\n');

// Read environment variables
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthUrl = process.env.NEXTAUTH_URL;

console.log('📋 Current Configuration:');
console.log(`   GOOGLE_CLIENT_ID: ${clientId ? `${clientId.substring(0, 20)}...` : '❌ Missing'}`);
console.log(`   GOOGLE_CLIENT_SECRET: ${clientSecret ? `${clientSecret.substring(0, 10)}...` : '❌ Missing'}`);
console.log(`   NEXTAUTH_URL: ${nextAuthUrl || '❌ Missing'}\n`);

console.log('🔧 Required Google Console Settings:');
console.log('   Go to: https://console.cloud.google.com/');
console.log('   Navigate to: APIs & Services > Credentials\n');

console.log('🎯 Authorized JavaScript Origins:');
console.log('   Add these EXACT URLs in Google Console:');
console.log('   ✓ http://localhost:3000');
console.log('   ✓ https://your-app.vercel.app\n');

console.log('🔄 Authorized Redirect URIs:');
console.log('   Add these EXACT URLs in Google Console:');
console.log('   ✓ http://localhost:3000/api/auth/callback/google');
console.log('   ✓ https://your-app.vercel.app/api/auth/callback/google\n');

console.log('⚠️  Common Issues:');
console.log('   1. Redirect URI mismatch (most common cause)');
console.log('   2. Missing trailing slashes');
console.log('   3. HTTP vs HTTPS mismatch');
console.log('   4. Wrong domain in Vercel deployment\n');

console.log('🔍 Check Your Google Console:');
console.log('   1. Open your OAuth 2.0 Client ID settings');
console.log('   2. Verify Authorized JavaScript origins');
console.log('   3. Verify Authorized redirect URIs');
console.log('   4. Make sure they match exactly (case sensitive)\n');

if (nextAuthUrl) {
    const callbackUrl = `${nextAuthUrl}/api/auth/callback/google`;
    console.log(`🎯 Expected Callback URL: ${callbackUrl}`);
    console.log('   This MUST be added to Google Console redirect URIs\n');
}

console.log('💡 Quick Fix Steps:');
console.log('   1. Go to Google Cloud Console');
console.log('   2. Select your project');
console.log('   3. Go to APIs & Services > Credentials');
console.log('   4. Edit your OAuth 2.0 Client ID');
console.log('   5. Add the callback URLs shown above');
console.log('   6. Save and try again\n');

console.log('🚨 If still not working:');
console.log('   - Wait 5-10 minutes for Google changes to propagate');
console.log('   - Clear browser cache and cookies');
console.log('   - Try incognito/private browsing mode\n');