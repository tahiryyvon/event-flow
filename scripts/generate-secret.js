#!/usr/bin/env node

const crypto = require('crypto');

// Generate a secure random secret for NextAuth
const secret = crypto.randomBytes(32).toString('base64');

console.log('\n🔐 Generated NextAuth Secret:');
console.log('================================');
console.log(secret);
console.log('================================');
console.log('\n📝 Add this to your environment variables:');
console.log(`NEXTAUTH_SECRET="${secret}"`);
console.log('\n🚀 For Vercel:');
console.log('1. Go to your Vercel project dashboard');
console.log('2. Settings → Environment Variables');
console.log('3. Add NEXTAUTH_SECRET with the value above');
console.log('4. Set environment to: Production, Preview, Development');
console.log('\n✅ Keep this secret secure and never share it publicly!\n');