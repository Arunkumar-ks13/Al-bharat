# AGAA Prototype - Wireframes Documentation

**Team A3I** (Arunkumar, Aditya & Artificial Intelligence)  
**AI for Bharat Hackathon 2026**

---

## 📱 **Interactive Wireframes Viewer**

**File:** `wireframes-complete.html`

**How to Use:**
1. Open `wireframes-complete.html` in any web browser
2. Navigate through 6 screens using the tab buttons
3. View ASCII wireframes and detailed descriptions
4. Understand the complete user flow

---

## 🎯 **User Flow (6 Screens)**

### **Screen 1: Home / Landing**
- Language selection (English, Hindi, Tamil)
- Welcome message with rocket icon 🚀
- "Get Started" call-to-action
- Trust indicators

### **Screen 2: Describe Situation**
- Free-text input for user needs
- Keyword detection for routing
- Shows supported use cases (Scholarship & Farmer)
- Progress indicator (10%)

### **Screen 3: Eligibility Check** (Scholarship Flow Only)
- 10 eligibility questions
- Dropdown and text inputs
- Income, education, family details
- Progress indicator (20%)

### **Screen 4: Recommended Schemes**
- AI-analyzed eligibility results
- List of matching schemes (up to 11)
- Priority indicators (⭐ for special categories)
- Scheme details (amount, eligibility)
- Progress indicator (50%)

### **Screen 5: Form Review**
- AI-generated form with pre-filled fields
- All fields editable
- Personal, family, educational, bank details
- Progress indicator (75%)

### **Screen 6: Confirmation**
- Success message with checkmark ✓
- Unique application ID
- Download link for filled application
- Submission instructions (Online & Offline)
- Next steps & support information
- Team credits
- Progress indicator (100%)

---

## 🎨 **Design System**

### **Color Palette**
- **Primary:** #a8e6cf (Pista Green - Growth & Development)
- **Secondary:** #7ed6a8 (Dark Green - Success)
- **Accent:** #5cb85c (Action Green)
- **Background:** #F5F5F5 (Light Gray)
- **Text:** #2d3748 (Dark Gray)

### **Typography**
- **Font Family:** -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Base Size:** 16px
- **Headings:** 1.8rem - 2.5rem
- **Body:** 1rem

### **Spacing**
- **Container Padding:** 40px (desktop), 20px (mobile)
- **Section Margin:** 30px
- **Element Padding:** 12px - 20px

---

## 📐 **Design Principles**

1. **Mobile-First:** Optimized for 320px+ screens
2. **Simple:** Minimal cognitive load
3. **Visual:** Icons and colors for clarity
4. **Progressive:** Step-by-step guidance
5. **Accessible:** WCAG 2.1 AA compliant

---

## ✨ **Key Features**

### **Multi-Language Support**
- English, Hindi, Tamil
- Language selector on home screen
- Can change language anytime

### **Dual Use Cases**
- **Scholarship Flow:** Full AWS backend with AI
- **Farmer Flow:** Client-side only (simpler)

### **Progress Indicators**
- Visual progress bar on each screen
- Shows completion percentage
- Helps users understand journey length

### **AI-Powered (Scholarship)**
- Eligibility analysis
- Scheme recommendation
- Form auto-fill
- Multi-language processing

### **Responsive Design**
- Works on mobile, tablet, desktop
- Touch-friendly buttons (min 44x44px)
- Adaptive layouts

---

## 🔄 **User Journey Flow**

```
Home → Describe → Eligibility → Schemes → Form Review → Confirmation
 ↓        ↓           ↓            ↓          ↓             ↓
10%      20%         50%          75%        100%        Success
```

### **Scholarship Flow (11 schemes)**
- Uses AWS Backend (Lambda + Bedrock + DynamoDB)
- AI-powered eligibility and form generation
- ~3.3 seconds end-to-end

### **Farmer Flow (6 schemes)**
- Client-side JavaScript only
- Pre-defined schemes and templates
- ~0.6 seconds end-to-end

---

## 📊 **Screen Specifications**

| Screen | Purpose | Key Elements | Progress |
|--------|---------|--------------|----------|
| 1. Home | Entry point | Language, CTA | 0% |
| 2. Describe | Route users | Text input, keywords | 10% |
| 3. Eligibility | Collect data | 10 questions | 20% |
| 4. Schemes | Show matches | AI recommendations | 50% |
| 5. Form Review | Verify data | Editable fields | 75% |
| 6. Confirmation | Success | App ID, download | 100% |

---

## 🎯 **For Hackathon Judges**

### **Highlights:**
1. ✅ Clean, intuitive 6-screen flow
2. ✅ Mobile-first responsive design
3. ✅ Multi-language support (3 languages)
4. ✅ Dual use cases (Scholarship & Farmer)
5. ✅ Progress indicators throughout
6. ✅ AI-powered form generation
7. ✅ Accessible design principles
8. ✅ Clear next steps and support info

### **Innovation:**
- Keyword-based routing to appropriate flow
- AI-powered eligibility analysis
- Smart form pre-filling
- Hybrid approach (AI + Client-side)

---

## 📁 **Files Included**

1. **wireframes-complete.html** - Interactive viewer ⭐ **USE THIS**
2. **wireframes.md** - Detailed markdown documentation
3. **WIREFRAMES-INFO.md** - This summary document

---

## 🌐 **How to Present**

### **Option 1: Live Demo**
- Open `wireframes-complete.html` in browser
- Navigate through screens
- Explain user flow

### **Option 2: Screenshots**
- Take screenshots of each screen
- Create presentation slides
- Show progression

### **Option 3: Link Submission**
- Host the HTML file online
- Provide link in hackathon submission
- Judges can view interactively

---

## 📞 **Contact**

**Team A3I**  
Arunkumar & Aditya  
(Arun, Aditya & Artificial Intelligence)

**Live Prototype:** http://agaa-frontend-1772860549.s3-website-us-east-1.amazonaws.com

---

**Last Updated:** March 8, 2026


---

## 🆕 Updated Features in Wireframes (March 9, 2026)

### New UI Elements
1. **Validation Feedback** - Colored message boxes below form fields
   - Red: Errors (must fix)
   - Yellow: Warnings (suggestions)
   - Blue: Info (helpful tips)
   - Green: Success (valid input)

2. **Tamil Language Support** - All UI elements support Tamil
   - Language selector includes தமிழ்
   - Forms display in Tamil
   - Validation messages in Tamil

3. **Service-Specific Forms** - Different fields for different services
   - Education: Institution, Course, Marks, etc.
   - Farmer: Land Survey, Crop Type, District, etc.

### Wireframe Updates
While the static wireframes remain unchanged, the live system now includes:
- Real-time validation indicators
- Tamil language UI
- Service-specific field sets
- Intelligent validation feedback

**View Live:** http://agaa-frontend-1772860549.s3-website-us-east-1.amazonaws.com

**Last Updated:** March 9, 2026
