# Certificate Template Documentation

## Overview
The certificate system now uses a professional, customizable template stored in the codebase. This allows for easy modification and version control of certificate designs.

## Template Location
- **File**: `backend/templates/certificateTemplate.js`
- **Usage**: Imported in `backend/Controllers/certificateController.js`

## Template Features

### Design Elements
- **Professional Gold Borders**: Double-layered gold (#D4AF37) borders for elegance
- **Institutional Color Scheme**: Dark blue (#00008B) for authority and trust
- **Reduced Logo Size**: 50x50 pixels for balanced proportions
- **Landscape Orientation**: A4 horizontal format for better visual impact

### Components

#### 1. Header Section
- Institution logo (50x50 pixels)
- School name in dark blue
- Subtitle text
- QR code placeholder area

#### 2. Title Section
- "Certificate of Achievement" in large gold text
- Centered positioning for emphasis

#### 3. Body Content
- Student name in dark blue (36pt)
- Course name in gold (28pt)
- Achievement statement
- Congratulations message

#### 4. Signature Section
- Three signature lines:
  - Left: Instructor Signature
  - Center: Date of Completion
  - Right: Director
- Professional line styling

#### 5. Footer
- Certificate ID with issue date
- Institutional tagline
- Professional branding

## Customization Guide

### Changing Colors
Edit `colors` object in `certificateTemplate.js`:
```javascript
colors: {
  gold: "#D4AF37",        // Primary accent color
  darkBlue: "#00008B",    // Secondary accent
  black: "#1a1a1a",       // Text color
  // ... modify as needed
}
```

### Adjusting Font Sizes
Modify individual section configurations:
```javascript
header: {
  schoolNameFontSize: 20,  // Change this value
  subtitleFontSize: 10
}
```

### Changing Text Content
Update the `bodyText` object:
```javascript
bodyText: {
  intro: "This is to certify that",
  achievement: "has successfully completed the course",
  // ... customize as needed
}
```

### Modifying Spacing
Edit the `spacing` object:
```javascript
spacing: {
  afterHeader: 70,
  afterTitle: 60,
  betweenSections: 1.5,
  beforeSignatures: 1
}
```

## Adding Custom Images

To add your institution's logo:

1. Place logo image in: `vite-project/public/logo.png`
2. The system automatically loads it if present
3. Logo size is controlled by: `header.logoSize: 50`

## Current Template Specifications

| Element | Value |
|---------|-------|
| Page Size | A4 Landscape |
| Page Margins | 30px on all sides |
| Outer Border Width | 12px (Gold) |
| Inner Border Width | 2px (Gold) |
| Title Font Size | 48pt |
| Student Name Font Size | 36pt |
| Course Name Font Size | 28pt |
| Logo Size | 50x50 pixels |
| Primary Color | #D4AF37 (Gold) |
| Secondary Color | #00008B (Dark Blue) |

## Certificate Card UI

### Light Orange Double-Shaded Card
- **Background**: Gradient from orange-100 via orange-50 to yellow-50
- **Border**: 2px orange-300 (default), changes to violet-500 on hover
- **Header**: Violet-600 to purple-600 gradient
- **Hover Effect**: Scale up with enhanced shadow and violet border

### Styling Classes
```jsx
// Default state
className="bg-gradient-to-br from-orange-100 via-orange-50 to-yellow-50 
           border-2 border-orange-300 shadow-lg"

// Hover state
className="hover:shadow-2xl hover:border-violet-500 transform hover:scale-105"
```

## Template Version History

### v1.0 (Current)
- Professional gold and blue color scheme
- Reduced logo size (50x50)
- Double-layered borders
- Signature section with proper spacing
- Certificate ID and issue date in footer
- QR code placeholder area

## Future Enhancements

Potential improvements for future versions:
- [ ] Add QR code generation for certificate verification
- [ ] Support for multiple language templates
- [ ] Watermark support
- [ ] Digital signature integration
- [ ] Template preview before generation
- [ ] Batch certificate generation
- [ ] Certificate database storage with verification

## API Integration

The template is automatically used when generating certificates:

```javascript
// Route: GET /api/certificates/generate/:userId/:courseId
// The certificateTemplate is loaded and applied automatically
```

## Notes

- Always backup the template file before major customizations
- Test PDF generation after template modifications
- Ensure font files are available on the server
- Logo must exist at the specified path or system will skip it gracefully

---

For questions or issues, contact the development team.
