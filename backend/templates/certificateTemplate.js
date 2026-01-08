/**
 * Professional Certificate Template Configuration
 * This file stores the certificate design template that can be customized
 * 
 * Design based on professional standards with gold borders and blue accents
 * Similar to VIT Chennai certificate style
 */

export const certificateTemplate = {
  name: "Professional Gold Certificate",
  version: "1.0",
  description: "Professional certificate template with gold borders and institutional styling",
  
  // Layout Settings
  layout: {
    orientation: "landscape",
    size: "A4",
    margins: {
      top: 30,
      right: 30,
      bottom: 30,
      left: 30
    }
  },

  // Color Scheme
  colors: {
    gold: "#D4AF37",
    darkBlue: "#00008B",
    black: "#1a1a1a",
    gray: "#333333",
    lightGray: "#999999",
    white: "#FFFFFF"
  },

  // Border Settings
  borders: {
    outer: {
      color: "#D4AF37",
      width: 12
    },
    inner: {
      color: "#D4AF37",
      width: 2
    }
  },

  // Header Configuration
  header: {
    logoSize: 50, // Reduced from 100
    schoolNameFontSize: 20,
    schoolNameColor: "#00008B",
    schoolNameFont: "Helvetica-Bold",
    subtitleFontSize: 10,
    subtitleColor: "#333333",
    subtitleFont: "Helvetica",
    subtitleText: "Professional Learning Platform"
  },

  // Title Section
  title: {
    text: "Certificate of Achievement",
    fontSize: 48,
    color: "#D4AF37",
    font: "Helvetica-Bold",
    align: "center"
  },

  // Body Text
  bodyText: {
    intro: "This is to certify that",
    studentQualifier: "a dedicated learner at Learnix Academy",
    achievement: "has successfully completed the course",
    congratulations: {
      line1: "With honors and distinction for demonstrating exceptional commitment",
      line2: "to learning excellence and professional development."
    }
  },

  // Student Name Section
  studentName: {
    fontSize: 36,
    color: "#00008B",
    font: "Helvetica-Bold",
    align: "center"
  },

  // Course Name Section
  courseName: {
    fontSize: 28,
    color: "#D4AF37",
    font: "Helvetica-Bold",
    align: "center"
  },

  // Signature Section
  signatures: {
    leftLabel: "Instructor Signature",
    centerLabel: "Date",
    rightLabel: "Director",
    fontSize: 11,
    lineColor: "#000000",
    lineWidth: 1
  },

  // Footer
  footer: {
    certificateIdFont: "Helvetica",
    certificateIdFontSize: 8,
    certificateIdColor: "#999999",
    taglineFont: "Helvetica-Oblique",
    taglineFontSize: 9,
    taglineColor: "#D4AF37",
    taglineText: "Excellence in Learning | Professional Growth"
  },

  // Text Styling Defaults
  textDefaults: {
    bodyFont: "Helvetica",
    bodyFontSize: 12,
    bodyFontColor: "#1a1a1a",
    bodyAlign: "center"
  },

  // Spacing
  spacing: {
    afterHeader: 70,
    afterTitle: 60,
    betweenSections: 1.5,
    beforeSignatures: 1
  }
};

/**
 * How to use this template:
 * 
 * 1. Import in certificateController.js:
 *    import { certificateTemplate } from '../templates/certificateTemplate.js';
 * 
 * 2. Access template properties:
 *    const colors = certificateTemplate.colors;
 *    const title = certificateTemplate.title;
 * 
 * 3. To customize:
 *    - Modify colors directly in this file
 *    - Update font sizes and styles
 *    - Change spacing and layout
 *    - Add new sections as needed
 * 
 * 4. Template includes:
 *    - Color scheme (gold and blue professional theme)
 *    - Border styling (double gold borders)
 *    - Header with reduced logo (50x50 instead of 100x60)
 *    - Professional fonts and sizing
 *    - Signature lines with proper spacing
 *    - Footer with certificate ID and tagline
 */

export default certificateTemplate;
