# Screenshot Guide for Presentation

This guide will help you capture screenshots from the interactive prototype to insert into the presentation.

## Quick Start

1. **Open the Interactive Prototype:**
   - Navigate to: `.kiro/specs/agaa-system/wireframes/prototype/index.html`
   - Open in your browser (Chrome recommended)

2. **Capture Screenshots:**
   - Use the methods below for each screen
   - Save as PNG files in: `.kiro/specs/agaa-system/presentation/screenshots/`

## Screenshot Methods

### Method 1: Browser Built-in (Recommended)

**Chrome/Edge:**
1. Press `F12` to open DevTools
2. Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
3. Type "screenshot" and select "Capture full size screenshot"
4. Image saves to Downloads folder

**Firefox:**
1. Press `F12` to open DevTools
2. Click the camera icon in the toolbar
3. Select "Save full page"

### Method 2: macOS Screenshot Tool

1. Press `Cmd+Shift+4`
2. Press `Space` to capture window
3. Click on the browser window
4. Screenshot saves to Desktop

### Method 3: Windows Snipping Tool

1. Press `Windows+Shift+S`
2. Select area to capture
3. Screenshot copies to clipboard
4. Paste into image editor and save

## Screenshots Needed

### Screen 1: Home Page
- **File name:** `01-home-page.png`
- **What to capture:** Full landing page with language selection
- **Notes:** Make sure the welcome message and "Get Started" button are visible

### Screen 2: Language Selection
- **File name:** `02-language-selection.png`
- **What to capture:** Language selection screen with all three options
- **Notes:** Ensure flags and multi-script text are clear

### Screen 3: User Information Input
- **File name:** `03-user-input.png`
- **What to capture:** Form with sample data filled in
- **Sample data to use:**
  - Name: Priya Kumar
  - Age: 19
  - Income: 45000
  - Need: "I need scholarship for engineering college education"

### Screen 4: AI Processing
- **File name:** `04-ai-processing.png`
- **What to capture:** Loading screen with progress indicators
- **Notes:** Capture while animation is showing

### Screen 5: Auto-Filled Form Review
- **File name:** `05-auto-filled-form.png`
- **What to capture:** Complete form with AI-filled data
- **Notes:** Scroll to show all fields if needed, or take multiple screenshots

### Screen 6: Document Upload
- **File name:** `06-document-upload.png`
- **What to capture:** Document upload interface
- **Notes:** Show at least one document uploaded

### Screen 7: Final Review
- **File name:** `07-final-review.png`
- **What to capture:** Review page with all sections
- **Notes:** Capture the summary view

### Screen 8: Confirmation Page
- **File name:** `08-confirmation.png`
- **What to capture:** Success page with confirmation number
- **Notes:** Make sure download buttons and next steps are visible

## Inserting Screenshots into Presentation

### Option 1: Replace Placeholders in HTML

1. Save screenshots to: `.kiro/specs/agaa-system/presentation/screenshots/`
2. Open `presentation.html` in a text editor
3. Find each `.screenshot-placeholder` div
4. Replace with:
```html
<img src="screenshots/01-home-page.png" alt="Home Page" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
```

### Option 2: Create PowerPoint Version

1. Open PowerPoint
2. Create new presentation
3. Use the HTML presentation as a guide
4. Insert screenshots using Insert → Pictures
5. Add text and formatting to match

### Option 3: Export to PDF

1. Open `presentation.html` in Chrome
2. Press `Ctrl+P` (Windows) or `Cmd+P` (Mac)
3. Select "Save as PDF"
4. Choose "Landscape" orientation
5. Save as `AGAA-Presentation.pdf`

## Tips for Best Screenshots

1. **Resolution:** Use at least 1920x1080 browser window
2. **Clean Browser:** Hide bookmarks bar and extensions
3. **Zoom Level:** Set browser zoom to 100%
4. **Consistent Size:** Keep browser window same size for all screenshots
5. **Mobile View:** For mobile screenshots, use DevTools device emulation

## Mobile Screenshots (Optional)

To capture mobile view:

1. Open DevTools (F12)
2. Click device toolbar icon (or Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar
4. Capture screenshots as above
5. Save with `-mobile` suffix (e.g., `01-home-page-mobile.png`)

## Editing Screenshots (Optional)

If you want to add annotations:

1. **Windows:** Use Paint 3D or Snip & Sketch
2. **macOS:** Use Preview or Markup
3. **Online:** Use Canva or Figma
4. **Professional:** Use Photoshop or GIMP

### Common Edits:
- Add arrows pointing to key features
- Highlight important buttons
- Add text callouts
- Blur sensitive information
- Crop to focus on specific areas

## Folder Structure

```
.kiro/specs/agaa-system/presentation/
├── presentation.html          # Main presentation file
├── SCREENSHOT_GUIDE.md        # This file
├── screenshots/               # Create this folder
│   ├── 01-home-page.png
│   ├── 02-language-selection.png
│   ├── 03-user-input.png
│   ├── 04-ai-processing.png
│   ├── 05-auto-filled-form.png
│   ├── 06-document-upload.png
│   ├── 07-final-review.png
│   └── 08-confirmation.png
└── README.md                  # Presentation overview
```

## Quick Checklist

- [ ] Open prototype in browser
- [ ] Set browser to 1920x1080 or similar
- [ ] Hide bookmarks and extensions
- [ ] Capture all 8 screens
- [ ] Save with consistent naming
- [ ] Review screenshots for clarity
- [ ] Insert into presentation
- [ ] Test presentation flow

## Troubleshooting

**Screenshot is blurry:**
- Increase browser window size
- Use higher resolution display
- Try "Capture full size screenshot" in DevTools

**Colors look different:**
- Ensure browser zoom is 100%
- Check display color profile
- Use same browser for all screenshots

**Can't capture full page:**
- Use DevTools screenshot feature
- Or take multiple screenshots and stitch together
- Or use browser extension like "Full Page Screen Capture"

## Need Help?

If you encounter issues:
1. Check browser console for errors (F12)
2. Try different browser (Chrome, Firefox, Edge)
3. Restart browser and try again
4. Check file permissions for saving screenshots

---

**Ready to present!** Once you have the screenshots, your presentation will be complete and ready for the hackathon demo.


---

## 🆕 Latest Features to Highlight (March 9, 2026)

### New Demo Points
1. **Tamil Keyword Support**
   - Screenshot: Type "உழவர்" in describe situation
   - Show: Automatic routing to farmer schemes

2. **Intelligent Validation**
   - Screenshot: Form field with real-time validation message
   - Show: Colored feedback (red/yellow/blue/green)

3. **4 Lambda Functions**
   - Screenshot: AWS Lambda console showing all 4 functions
   - Highlight: validate-field for intelligent validation

4. **CORS-Enabled APIs**
   - Screenshot: Network tab showing successful validation API calls
   - Show: No CORS errors in console

### Updated Statistics
- **Lambda Functions:** 4 (was 3)
- **API Endpoints:** 4 (was 3)
- **Code Lines:** ~2,600 (was ~2,500)
- **Features:** Tamil keywords, intelligent validation, CORS support

**Last Updated:** March 9, 2026
