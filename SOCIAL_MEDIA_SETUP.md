# Social Media Images for EventFlow

## Open Graph / Twitter Card Requirements

### Image Specifications:
- **Size**: 1200x630 pixels (Twitter/Facebook recommended)
- **Format**: PNG, JPG, or WEBP (SVG not supported)
- **File size**: Less than 5MB
- **Aspect ratio**: 1.91:1 (recommended)

### Current Setup:
- Open Graph meta tags added to `src/app/layout.tsx`
- Twitter Card meta tags configured
- Placeholder image path: `/og-image.png`

### To Create the Final Image:

1. **Option 1 - Use the HTML template:**
   - Open `public/og-template.html` in a browser
   - Take a screenshot at 1200x630 resolution
   - Save as `public/og-image.png`

2. **Option 2 - Use design tools:**
   - Canva, Figma, or Photoshop
   - Use dimensions 1200x630px
   - Include EventFlow branding
   - Save as PNG format

3. **Option 3 - Convert SVG to PNG:**
   - Use online converters or tools like ImageMagick
   - Convert `public/og-image.svg` to PNG at 1200x630

### Quick Fix:
For now, you can use any 1200x630 PNG image and name it `og-image.png` in the public folder.

### Testing:
- Test with Facebook Debugger: https://developers.facebook.com/tools/debug/
- Test with Twitter Card Validator: https://cards-dev.twitter.com/validator
- Use your full Vercel URL when testing

### Files Updated:
- ✅ `src/app/layout.tsx` - Added comprehensive Open Graph and Twitter Card meta tags
- ✅ `public/og-image.svg` - SVG template (for reference)
- ✅ `public/og-template.html` - HTML template for easy screenshot conversion