#!/usr/bin/env node

console.log('🔐 EventFlow Google OAuth Setup Guide');
console.log('=====================================\n');

// Check environment variables
const fs = require('fs');
const path = require('path');

console.log('📋 Checking Google OAuth Configuration...\n');

// Check for environment files
const envFiles = ['.env.local', '.env'];
let hasGoogleConfig = false;

for (const envFile of envFiles) {
  const envPath = path.join(process.cwd(), envFile);
  if (fs.existsSync(envPath)) {
    console.log(`✅ Found ${envFile}`);
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const hasClientId = envContent.includes('GOOGLE_CLIENT_ID');
    const hasClientSecret = envContent.includes('GOOGLE_CLIENT_SECRET');
    
    console.log(`   GOOGLE_CLIENT_ID: ${hasClientId ? '✅ Present' : '❌ Missing'}`);
    console.log(`   GOOGLE_CLIENT_SECRET: ${hasClientSecret ? '✅ Present' : '❌ Missing'}`);
    
    if (hasClientId && hasClientSecret) {
      hasGoogleConfig = true;
    }
  } else {
    console.log(`❌ ${envFile} not found`);
  }
}

console.log('\n🚀 Google OAuth Setup Instructions:');
console.log('=====================================\n');

if (!hasGoogleConfig) {
  console.log('❌ Google OAuth is NOT configured. Follow these steps:\n');
} else {
  console.log('✅ Google OAuth configuration found. If you\'re still getting errors:\n');
}

console.log('1. 🌐 Go to Google Cloud Console:');
console.log('   https://console.cloud.google.com/\n');

console.log('2. 📝 Create or Select Project:');
console.log('   - Click "Select a project" → "New Project"');
console.log('   - Name: "EventFlow" or similar');
console.log('   - Click "Create"\n');

console.log('3. 🔌 Enable Google+ API:');
console.log('   - Go to "APIs & Services" → "Library"');
console.log('   - Search for "Google+ API"');
console.log('   - Click "Enable"\n');

console.log('4. 🔑 Create OAuth 2.0 Credentials:');
console.log('   - Go to "APIs & Services" → "Credentials"');
console.log('   - Click "Create Credentials" → "OAuth 2.0 Client ID"');
console.log('   - Application type: "Web application"');
console.log('   - Name: "EventFlow OAuth Client"\n');

console.log('5. 🌍 Configure Authorized URLs:');
console.log('   JavaScript origins:');
console.log('   - http://localhost:3000 (for development)');
console.log('   - https://your-app-name.vercel.app (for production)');
console.log('');
console.log('   Redirect URIs:');
console.log('   - http://localhost:3000/api/auth/callback/google');
console.log('   - https://your-app-name.vercel.app/api/auth/callback/google\n');

console.log('6. 📋 Copy Credentials:');
console.log('   - Copy "Client ID" and "Client Secret"');
console.log('   - Add to your .env.local file:\n');

console.log('   GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"');
console.log('   GOOGLE_CLIENT_SECRET="your-client-secret"\n');

console.log('7. 🔄 Restart Development Server:');
console.log('   npm run dev\n');

console.log('🆘 Common Issues:');
console.log('================');
console.log('• Error 401 invalid_client → Check client ID/secret are correct');
console.log('• Redirect URI mismatch → Ensure callback URLs match exactly');
console.log('• Domain not authorized → Add your domain to authorized origins');
console.log('• API not enabled → Make sure Google+ API is enabled\n');

console.log('💡 For Production (Vercel):');
console.log('==========================');
console.log('1. Go to your Vercel dashboard');
console.log('2. Select your EventFlow project');
console.log('3. Go to Settings → Environment Variables');
console.log('4. Add:');
console.log('   - GOOGLE_CLIENT_ID');
console.log('   - GOOGLE_CLIENT_SECRET');
console.log('5. Redeploy your application\n');

console.log('✨ Once configured, Google sign-in will work on both:');
console.log('   - /login page (Continue with Google)');
console.log('   - /signup page (Continue with Google)');
console.log('   - New users automatically get "Participant" role\n');