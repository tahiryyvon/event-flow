#!/usr/bin/env node

// Simple script to create a basic social media image
// This creates a data URL that you can convert to PNG

const width = 1200;
const height = 630;

const svgContent = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea"/>
      <stop offset="100%" style="stop-color:#764ba2"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#gradient)"/>
  
  <!-- Logo circle -->
  <circle cx="160" cy="180" r="50" fill="white" fill-opacity="0.95"/>
  <text x="160" y="190" text-anchor="middle" fill="#667eea" font-family="Arial" font-size="28" font-weight="bold">EF</text>
  
  <!-- Main content -->
  <text x="80" y="280" fill="white" font-family="Arial" font-size="64" font-weight="bold">EventFlow</text>
  <text x="80" y="330" fill="white" font-family="Arial" font-size="28" fill-opacity="0.9">Simple Event Scheduling</text>
  <text x="80" y="380" fill="white" font-family="Arial" font-size="20" fill-opacity="0.8">Schedule meetings and events with ease.</text>
  <text x="80" y="410" fill="white" font-family="Arial" font-size="20" fill-opacity="0.8">Professional event management platform.</text>
  
  <!-- Decorative circles -->
  <circle cx="900" cy="150" r="60" fill="white" fill-opacity="0.1"/>
  <circle cx="1000" cy="350" r="40" fill="white" fill-opacity="0.1"/>
  <circle cx="850" cy="480" r="30" fill="white" fill-opacity="0.1"/>
</svg>`;

console.log('🎨 EventFlow Social Media Image Generator');
console.log('==========================================');
console.log(`📐 Dimensions: ${width}x${height}px`);
console.log('📄 Format: SVG (convert to PNG for Twitter/Facebook)');
console.log('');
console.log('SVG Content:');
console.log('------------');
console.log(svgContent);
console.log('');
console.log('💡 To convert to PNG:');
console.log('1. Copy the SVG content above');
console.log('2. Save it as "og-image.svg" in the public folder');
console.log('3. Use an online SVG to PNG converter');
console.log('4. Set output size to 1200x630px');
console.log('5. Save result as "og-image.png" in public folder');
console.log('');
console.log('🌐 Online converters:');
console.log('- https://convertio.co/svg-png/');
console.log('- https://cloudconvert.com/svg-to-png');
console.log('- https://www.freeconvert.com/svg-to-png');