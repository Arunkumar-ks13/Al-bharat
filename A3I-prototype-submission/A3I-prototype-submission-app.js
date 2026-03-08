// AGAA Frontend - AWS Backend Integration with Eligibility Check
const API_BASE_URL = 'https://phxb8mfmqk.execute-api.us-east-1.amazonaws.com/prod';

// Translations
const TRANSLATIONS = {
    en: {
        title: "AGAA - AI Government Application Assistant",
        welcome: "Welcome to AGAA",
        subtitle: "Get help filling government forms with AI assistance",
        selectLanguage: "Select Language",
        getStarted: "Get Started →",
        eligibilityCheck: "Eligibility Check",
        answerQuestions: "Answer these questions to find the best scholarships for you",
        q1: "1. What is your current education level?",
        q1_school: "In School (10th/12th)",
        q1_ug: "Undergraduate (UG)",
        q1_pg: "Postgraduate (PG)",
        q1_professional: "Professional Course",
        q2: "2. What are you going to study?",
        q2_placeholder: "e.g., Engineering, Medicine, Arts",
        q3: "3. What is your family's annual income?",
        q4: "4. What is your father's occupation?",
        q4_placeholder: "e.g., Farmer, Teacher",
        q5: "5. What is your mother's occupation?",
        q5_placeholder: "e.g., Homemaker, Nurse",
        q6: "6. Are you a person with disability?",
        q7: "7. Are you a girl child?",
        q8: "8. Are you the first graduate in your family?",
        q9: "9. What amount of scholarship are you expecting?",
        q10: "10. Are you considering an educational loan?",
        yes: "Yes",
        no: "No",
        select: "Select...",
        back: "← Back",
        continue: "Continue →",
        checkEligibility: "Check Eligibility →",
        recommendedSchemes: "Recommended Schemes",
        eligibilityMessage: "Based on your eligibility, here are the schemes for you",
        generateForm: "Generate Form →",
        reviewApplication: "Review Your Application",
        reviewSubtitle: "AI has filled the form based on your input. Please review and edit if needed.",
        reviewForSubmission: "Review for Submission →",
        applicationFilled: "Application Form Filled!",
        readyToSubmit: "Your application form has been prepared and is ready for submission",
        applicationId: "Application ID:",
        status: "Status:",
        statusFilled: "Filled - Ready to Submit",
        downloadForm: "Download Form:",
        downloadLink: "Download Application (Print as PDF)",
        howToSubmit: "📋 How to Submit Your Application",
        option1: "Option 1: Online Submission",
        option2: "Option 2: Offline Submission",
        requiredDocs: "Required Documents:",
        fillAnother: "Fill Another Application",
        loanOnly: "Only scholarship",
        loanAndScholarship: "Both loan and scholarship",
        scholarshipOnly: "Only loan"
    },
    hi: {
        title: "AGAA - एआई सरकारी आवेदन सहायक",
        welcome: "AGAA में आपका स्वागत है",
        subtitle: "एआई सहायता से सरकारी फॉर्म भरने में मदद प्राप्त करें",
        selectLanguage: "भाषा चुनें",
        getStarted: "शुरू करें →",
        eligibilityCheck: "पात्रता जांच",
        answerQuestions: "आपके लिए सर्वोत्तम छात्रवृत्ति खोजने के लिए इन प्रश्नों के उत्तर दें",
        q1: "1. आपका वर्तमान शिक्षा स्तर क्या है?",
        q1_school: "स्कूल में (10वीं/12वीं)",
        q1_ug: "स्नातक (UG)",
        q1_pg: "स्नातकोत्तर (PG)",
        q1_professional: "व्यावसायिक पाठ्यक्रम",
        q2: "2. आप क्या पढ़ने जा रहे हैं?",
        q2_placeholder: "जैसे, इंजीनियरिंग, चिकित्सा, कला",
        q3: "3. आपके परिवार की वार्षिक आय क्या है?",
        q4: "4. आपके पिता का व्यवसाय क्या है?",
        q4_placeholder: "जैसे, किसान, शिक्षक",
        q5: "5. आपकी माता का व्यवसाय क्या है?",
        q5_placeholder: "जैसे, गृहिणी, नर्स",
        q6: "6. क्या आप विकलांग व्यक्ति हैं?",
        q7: "7. क्या आप बालिका हैं?",
        q8: "8. क्या आप अपने परिवार में पहले स्नातक हैं?",
        q9: "9. आप कितनी छात्रवृत्ति की उम्मीद कर रहे हैं?",
        q10: "10. क्या आप शैक्षिक ऋण पर विचार कर रहे हैं?",
        yes: "हाँ",
        no: "नहीं",
        select: "चुनें...",
        back: "← पीछे",
        continue: "जारी रखें →",
        checkEligibility: "पात्रता जांचें →",
        recommendedSchemes: "अनुशंसित योजनाएं",
        eligibilityMessage: "आपकी पात्रता के आधार पर, यहां आपके लिए योजनाएं हैं",
        generateForm: "फॉर्म बनाएं →",
        reviewApplication: "अपना आवेदन समीक्षा करें",
        reviewSubtitle: "एआई ने आपके इनपुट के आधार पर फॉर्म भर दिया है। कृपया समीक्षा करें और यदि आवश्यक हो तो संपादित करें।",
        reviewForSubmission: "सबमिशन के लिए समीक्षा करें →",
        applicationFilled: "आवेदन फॉर्म भरा गया!",
        readyToSubmit: "आपका आवेदन फॉर्म तैयार है और सबमिशन के लिए तैयार है",
        applicationId: "आवेदन आईडी:",
        status: "स्थिति:",
        statusFilled: "भरा हुआ - सबमिट करने के लिए तैयार",
        downloadForm: "फॉर्म डाउनलोड करें:",
        downloadLink: "आवेदन डाउनलोड करें (पीडीएफ के रूप में प्रिंट करें)",
        howToSubmit: "📋 अपना आवेदन कैसे जमा करें",
        option1: "विकल्प 1: ऑनलाइन सबमिशन",
        option2: "विकल्प 2: ऑफलाइन सबमिशन",
        requiredDocs: "आवश्यक दस्तावेज:",
        fillAnother: "एक और आवेदन भरें",
        loanOnly: "केवल छात्रवृत्ति",
        loanAndScholarship: "ऋण और छात्रवृत्ति दोनों",
        scholarshipOnly: "केवल ऋण"
    },
    ta: {
        title: "AGAA - AI அரசு விண்ணப்ப உதவியாளர்",
        welcome: "AGAA-க்கு வரவேற்கிறோம்",
        subtitle: "AI உதவியுடன் அரசு படிவங்களை நிரப்ப உதவி பெறுங்கள்",
        selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
        getStarted: "தொடங்கு →",
        eligibilityCheck: "தகுதி சரிபார்ப்பு",
        answerQuestions: "உங்களுக்கு சிறந்த உதவித்தொகைகளைக் கண்டறிய இந்த கேள்விகளுக்கு பதிலளிக்கவும்",
        q1: "1. உங்கள் தற்போதைய கல்வி நிலை என்ன?",
        q1_school: "பள்ளியில் (10வது/12வது)",
        q1_ug: "இளங்கலை (UG)",
        q1_pg: "முதுகலை (PG)",
        q1_professional: "தொழில்முறை பாடநெறி",
        q2: "2. நீங்கள் என்ன படிக்கப் போகிறீர்கள்?",
        q2_placeholder: "எ.கா., பொறியியல், மருத்துவம், கலை",
        q3: "3. உங்கள் குடும்பத்தின் ஆண்டு வருமானம் என்ன?",
        q4: "4. உங்கள் தந்தையின் தொழில் என்ன?",
        q4_placeholder: "எ.கா., விவசாயி, ஆசிரியர்",
        q5: "5. உங்கள் தாயின் தொழில் என்ன?",
        q5_placeholder: "எ.கா., இல்லத்தரசி, செவிலியர்",
        q6: "6. நீங்கள் மாற்றுத்திறனாளியா?",
        q7: "7. நீங்கள் பெண் குழந்தையா?",
        q8: "8. நீங்கள் உங்கள் குடும்பத்தில் முதல் பட்டதாரியா?",
        q9: "9. நீங்கள் எவ்வளவு உதவித்தொகை எதிர்பார்க்கிறீர்கள்?",
        q10: "10. நீங்கள் கல்விக் கடனைக் கருத்தில் கொள்கிறீர்களா?",
        yes: "ஆம்",
        no: "இல்லை",
        select: "தேர்ந்தெடுக்கவும்...",
        back: "← பின்",
        continue: "தொடரவும் →",
        checkEligibility: "தகுதியைச் சரிபார்க்கவும் →",
        recommendedSchemes: "பரிந்துரைக்கப்பட்ட திட்டங்கள்",
        eligibilityMessage: "உங்கள் தகுதியின் அடிப்படையில், இதோ உங்களுக்கான திட்டங்கள்",
        generateForm: "படிவத்தை உருவாக்கவும் →",
        reviewApplication: "உங்கள் விண்ணப்பத்தை மதிப்பாய்வு செய்யவும்",
        reviewSubtitle: "AI உங்கள் உள்ளீட்டின் அடிப்படையில் படிவத்தை நிரப்பியுள்ளது. தயவுசெய்து மதிப்பாய்வு செய்து தேவைப்பட்டால் திருத்தவும்.",
        reviewForSubmission: "சமர்ப்பிப்பதற்கான மதிப்பாய்வு →",
        applicationFilled: "விண்ணப்ப படிவம் நிரப்பப்பட்டது!",
        readyToSubmit: "உங்கள் விண்ணப்ப படிவம் தயாரிக்கப்பட்டு சமர்ப்பிக்க தயாராக உள்ளது",
        applicationId: "விண்ணப்ப ஐடி:",
        status: "நிலை:",
        statusFilled: "நிரப்பப்பட்டது - சமர்ப்பிக்க தயார்",
        downloadForm: "படிவத்தைப் பதிவிறக்கவும்:",
        downloadLink: "விண்ணப்பத்தைப் பதிவிறக்கவும் (PDF ஆக அச்சிடவும்)",
        howToSubmit: "📋 உங்கள் விண்ணப்பத்தை எவ்வாறு சமர்ப்பிப்பது",
        option1: "விருப்பம் 1: ஆன்லைன் சமர்ப்பிப்பு",
        option2: "விருப்பம் 2: ஆஃப்லைன் சமர்ப்பிப்பு",
        requiredDocs: "தேவையான ஆவணங்கள்:",
        fillAnother: "மற்றொரு விண்ணப்பத்தை நிரப்பவும்",
        loanOnly: "உதவித்தொகை மட்டும்",
        loanAndScholarship: "கடன் மற்றும் உதவித்தொகை இரண்டும்",
        scholarshipOnly: "கடன் மட்டும்"
    }
};

// Global state
let currentLanguage = 'en';
let sessionId = null;
let selectedScheme = null;
let formData = {};
let eligibilityAnswers = {};
let currentServiceType = null; // 'scholarship' or 'farmer'

// Tamil Nadu Farmer Welfare Schemes Database
const FARMER_SCHEMES = {
    'Agricultural Input Subsidy': {
        description: 'Subsidy for seeds, fertilizers, and pesticides',
        eligibility: 'All farmers with valid land records',
        amount: '₹10,000 - ₹25,000 per year'
    },
    'Farm Equipment Subsidy': {
        description: 'Financial assistance for purchasing farm equipment',
        eligibility: 'Small and marginal farmers',
        amount: '₹50,000 - ₹1,50,000'
    },
    'Crop Insurance Scheme': {
        description: 'Insurance coverage for crop loss due to natural calamities',
        eligibility: 'All farmers',
        amount: 'Premium subsidy up to 90%'
    },
    'Drip Irrigation Subsidy': {
        description: 'Subsidy for installing drip irrigation systems',
        eligibility: 'Farmers with minimum 1 acre land',
        amount: '₹40,000 - ₹80,000'
    },
    'Organic Farming Assistance': {
        description: 'Support for transitioning to organic farming',
        eligibility: 'Farmers willing to adopt organic methods',
        amount: '₹20,000 per acre for 3 years'
    },
    'Kisan Credit Card': {
        description: 'Low-interest credit facility for agricultural needs',
        eligibility: 'All farmers',
        amount: 'Up to ₹3 lakhs at 4% interest'
    }
};

// Tamil Nadu Scholarship Schemes Database (Simplified - No Community Class)
const SCHEMES = {
    // Priority 1: Special Category Scholarships (highest priority)
    'Scholarship for Disabled and Special Child': {
        priority: 1,
        educationLevel: ['school', 'ug', 'pg', 'professional'],
        maxIncome: 500000,
        disabled: true
    },
    'Girl Child Empowerment Scholarship': {
        priority: 1,
        educationLevel: ['school', 'ug', 'pg', 'professional'],
        maxIncome: 500000,
        girlChild: true
    },
    'First Graduate Scholarship': {
        priority: 1,
        educationLevel: ['ug', 'pg', 'professional'],
        maxIncome: 500000,
        firstGraduate: true
    },
    // Priority 2: National & State Scholarships
    'Pradhan Mantri Scholarship Scheme': {
        priority: 2,
        educationLevel: ['school', 'ug', 'pg', 'professional'],
        maxIncome: 500000
    },
    'Dr. Ambedkar Post Matric Scholarship': {
        priority: 2,
        educationLevel: ['ug', 'pg', 'professional'],
        maxIncome: 500000
    },
    'V.O. Chidambaram Pillai Scholarship': {
        priority: 2,
        educationLevel: ['ug', 'pg', 'professional'],
        maxIncome: 500000
    },
    // Priority 3: General Education Scholarships
    'Higher Education Special Scholarship': {
        priority: 3,
        educationLevel: ['ug', 'pg'],
        maxIncome: 500000
    },
    'Post Matric Scholarship Scheme': {
        priority: 3,
        educationLevel: ['ug', 'pg'],
        maxIncome: 500000
    },
    'Free Education (3 years UG Course)': {
        priority: 3,
        educationLevel: ['ug'],
        maxIncome: 500000
    },
    'Free Education - Professional Courses': {
        priority: 3,
        educationLevel: ['professional'],
        maxIncome: 500000
    },
    'School Education Scholarship': {
        priority: 3,
        educationLevel: ['school'],
        maxIncome: 500000
    }
};

// Language selection
function selectLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('.btn-language').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update all text on the page
    updatePageLanguage();
    
    showToast(`Language selected: ${lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'தமிழ்'}`);
}

// Update page language
function updatePageLanguage() {
    const t = TRANSLATIONS[currentLanguage];
    
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (t[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else {
                el.textContent = t[key];
            }
        }
    });
    
    // Update select options
    document.querySelectorAll('[data-translate-option]').forEach(el => {
        const key = el.getAttribute('data-translate-option');
        if (t[key]) {
            el.textContent = t[key];
        }
    });
}

// Screen navigation
function goToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    window.scrollTo(0, 0);
}

// Show loading overlay
function showLoading(show = true) {
    const overlay = document.getElementById('loading-overlay');
    if (show) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Show message for invalid/garbage input
function showInvalidInputMessage() {
    const messageHTML = `
        <div style="background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 600px; margin: 0 auto;">
            <div style="font-size: 4rem; margin-bottom: 20px;">❓</div>
            <h2 style="color: #f56565; margin-bottom: 20px;">Invalid Input Detected</h2>
            <p style="font-size: 1.1rem; color: #4a5568; line-height: 1.8; margin-bottom: 20px;">
                We couldn't understand what you entered. Please provide a valid field of study 
                to help us find the right scholarships for you.
            </p>
            <div style="background: #fff5f5; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f56565;">
                <p style="color: #2d3748; font-weight: 600; margin-bottom: 10px;">
                    ✏️ Examples of valid entries:
                </p>
                <ul style="list-style: none; padding: 0; color: #4a5568; text-align: left;">
                    <li>✓ Engineering</li>
                    <li>✓ Bachelor of Science</li>
                    <li>✓ Medicine</li>
                    <li>✓ Computer Science</li>
                    <li>✓ Arts and Commerce</li>
                </ul>
            </div>
            <p style="font-size: 0.95rem; color: #718096; margin-top: 20px;">
                Please go back and enter a meaningful field of study.
            </p>
            <button class="btn-primary btn-large" onclick="goToScreen('screen-eligibility')" style="margin-top: 30px;">
                ← Go Back and Try Again
            </button>
        </div>
    `;
    
    document.getElementById('eligibility-message').innerHTML = '';
    document.getElementById('schemes-list').innerHTML = messageHTML;
    goToScreen('screen-schemes');
}

// Show message for non-education related queries
function showNotEducationRelatedMessage() {
    const messageHTML = `
        <div style="background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 600px; margin: 0 auto;">
            <div style="font-size: 4rem; margin-bottom: 20px;">🎓</div>
            <h2 style="color: #667eea; margin-bottom: 20px;">Thank You for Your Interest!</h2>
            <p style="font-size: 1.1rem; color: #4a5568; line-height: 1.8; margin-bottom: 20px;">
                We appreciate you reaching out to AGAA. Currently, our system is specialized in 
                <strong>education scholarships and student financial assistance</strong>.
            </p>
            <p style="font-size: 1.1rem; color: #4a5568; line-height: 1.8; margin-bottom: 20px;">
                We are continuously working to expand our services to cover more government schemes 
                and assistance programs. Your query will help us understand the needs of our citizens better.
            </p>
            <div style="background: #f7fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p style="color: #2d3748; font-weight: 600; margin-bottom: 10px;">
                    📚 We currently help with:
                </p>
                <ul style="list-style: none; padding: 0; color: #4a5568;">
                    <li>✓ Education scholarships</li>
                    <li>✓ Student financial aid</li>
                    <li>✓ Educational loans</li>
                    <li>✓ School & college assistance</li>
                </ul>
            </div>
            <p style="font-size: 0.95rem; color: #718096; margin-top: 20px;">
                Please visit us again soon as we expand our services to assist with more government programs!
            </p>
            <button class="btn-primary btn-large" onclick="startOver()" style="margin-top: 30px;">
                ← Back to Home
            </button>
        </div>
    `;
    
    document.getElementById('eligibility-message').innerHTML = '';
    document.getElementById('schemes-list').innerHTML = messageHTML;
    goToScreen('screen-schemes');
}

// Process user's situation description
function processSituation() {
    const situation = document.getElementById('situation-input').value.trim().toLowerCase();
    
    if (!situation || situation.length < 3) {
        showToast('Please describe your situation', 'error');
        return;
    }
    
    // Keywords for scholarship/education
    const educationKeywords = [
        'scholarship', 'student', 'education', 'school', 'college', 'study', 'studying',
        'degree', 'bachelor', 'master', 'engineering', 'medicine', 'course', 'learning',
        'छात्रवृत्ति', 'छात्र', 'शिक्षा', 'पढ़ाई', // Hindi
        'உதவித்தொகை', 'மாணவர்', 'கல்வி', 'படிப்பு' // Tamil
    ];
    
    // Keywords for farmer welfare
    const farmerKeywords = [
        'farmer', 'farming', 'agriculture', 'crop', 'fertilizer', 'subsidy', 'irrigation',
        'land', 'cultivation', 'harvest', 'pesticide', 'seed', 'farm equipment',
        'किसान', 'खेती', 'कृषि', 'फसल', 'उर्वरक', // Hindi
        'விவசாயி', 'விவசாயம', 'வேளாண்மை', 'பயிர்', 'உரம்' // Tamil
    ];
    
    const isEducation = educationKeywords.some(keyword => situation.includes(keyword));
    const isFarmer = farmerKeywords.some(keyword => situation.includes(keyword));
    
    if (isEducation) {
        currentServiceType = 'scholarship';
        goToScreen('screen-eligibility');
    } else if (isFarmer) {
        currentServiceType = 'farmer';
        showFarmerSchemes();
    } else {
        // Show message for unsupported services
        showUnsupportedServiceMessage();
    }
}

// Show unsupported service message
function showUnsupportedServiceMessage() {
    const messageHTML = `
        <div style="background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 600px; margin: 0 auto;">
            <div style="font-size: 4rem; margin-bottom: 20px;">🙏</div>
            <h2 style="color: #667eea; margin-bottom: 20px;">Thank You for Your Interest!</h2>
            <p style="font-size: 1.1rem; color: #4a5568; line-height: 1.8; margin-bottom: 20px;">
                We appreciate you reaching out to AGAA. Currently, our system serves:
            </p>
            <div style="background: #f7fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p style="color: #2d3748; font-weight: 600; margin-bottom: 10px;">
                    ✅ Services We Provide:
                </p>
                <ul style="list-style: none; padding: 0; color: #4a5568;">
                    <li>🎓 Education Scholarships</li>
                    <li>🌾 Farmer Welfare Schemes</li>
                </ul>
            </div>
            <p style="font-size: 1.1rem; color: #4a5568; line-height: 1.8; margin-bottom: 20px;">
                We are continuously working to expand our services to cover more government schemes 
                and assistance programs. Your query will help us understand the needs of our citizens better.
            </p>
            <p style="font-size: 0.95rem; color: #718096; margin-top: 20px;">
                <strong>Coming Soon:</strong> Senior citizen benefits, healthcare schemes, housing assistance, and more!
            </p>
            <button class="btn-primary btn-large" onclick="goToScreen('screen-describe')" style="margin-top: 30px;">
                ← Try Again
            </button>
        </div>
    `;
    
    document.getElementById('eligibility-message').innerHTML = '';
    document.getElementById('schemes-list').innerHTML = messageHTML;
    goToScreen('screen-schemes');
}

// Show farmer schemes
function showFarmerSchemes() {
    document.getElementById('eligibility-message').innerHTML = 
        '<strong style="color: #48bb78;">Available Farmer Welfare Schemes</strong><br>' +
        '<em style="color: #667eea;">Select a scheme to view details and fill the application form</em>';
    
    const schemesList = document.getElementById('schemes-list');
    schemesList.innerHTML = Object.entries(FARMER_SCHEMES).map(([name, details], index) => `
        <div class="scheme-card ${index === 0 ? 'selected' : ''}" onclick="selectFarmerScheme('${name}', ${index})">
            <div class="scheme-icon">🌾</div>
            <div class="scheme-info">
                <h3>${name}</h3>
                <p>${details.description}</p>
                <p><strong>Eligibility:</strong> ${details.eligibility}</p>
                <p><strong>Amount:</strong> ${details.amount}</p>
            </div>
            <div class="scheme-check">✓</div>
        </div>
    `).join('');
    
    selectedScheme = Object.keys(FARMER_SCHEMES)[0];
    goToScreen('screen-schemes');
}

// Select farmer scheme
function selectFarmerScheme(scheme, index) {
    selectedScheme = scheme;
    document.querySelectorAll('.scheme-card').forEach((card, i) => {
        if (i === index) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

// Generate farmer application form
function generateFarmerForm() {
    if (!selectedScheme) {
        showToast('Please select a scheme', 'error');
        return;
    }
    
    // Pre-populate farmer form with basic fields
    formData = {
        fullName: '[Your Full Name]',
        fatherName: '[Father\'s Name]',
        aadhaarNumber: '[12-digit Aadhaar Number]',
        mobileNumber: '[10-digit Mobile Number]',
        address: '[Complete Address with Village/Town]',
        district: '[District Name]',
        taluk: '[Taluk Name]',
        village: '[Village Name]',
        surveyNumber: '[Land Survey Number]',
        landArea: '[Total Land Area in Acres]',
        cropType: '[Type of Crop Cultivated]',
        bankAccountNumber: '[Bank Account Number]',
        ifscCode: '[IFSC Code]',
        bankName: '[Bank Name]',
        branchName: '[Branch Name]'
    };
    
    // Display form fields
    const formFields = document.getElementById('form-fields');
    formFields.innerHTML = Object.entries(formData).map(([key, value]) => `
        <div class="form-group">
            <label>${formatFieldName(key)}</label>
            <input type="text" id="field-${key}" value="${value}" class="form-input">
        </div>
    `).join('');
    
    goToScreen('screen-form');
    showToast('Farmer application form ready!');
}

// Submit farmer application
function submitFarmerApplication() {
    showLoading(true);
    
    // Collect updated form data
    const updatedFormData = {};
    Object.keys(formData).forEach(key => {
        const input = document.getElementById(`field-${key}`);
        if (input) {
            updatedFormData[key] = input.value;
        }
    });
    
    // Simulate submission (in real app, this would call backend)
    setTimeout(() => {
        const applicationId = 'FARMER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        // Display confirmation
        document.getElementById('application-id').textContent = applicationId;
        
        // Update confirmation page for farmer context
        document.querySelector('#screen-confirmation h2').textContent = 'Farmer Application Filled!';
        document.querySelector('#screen-confirmation .subtitle').textContent = 
            'Your farmer welfare scheme application has been prepared and is ready for submission';
        
        // Update submission instructions for farmer schemes
        document.querySelector('.submission-instructions').innerHTML = `
            <h3>📋 How to Submit Your Application</h3>
            <div class="instruction-box">
                <p><strong>Option 1: Online Submission</strong></p>
                <p>Visit the Tamil Nadu Agriculture Department portal:</p>
                <a href="https://tnagriculture.in/common_portal/Press" target="_blank" class="portal-link">
                    https://tnagriculture.in/common_portal/Press
                </a>
                <p>Upload your filled application form and required documents.</p>
            </div>
            
            <div class="instruction-box">
                <p><strong>Option 2: Offline Submission</strong></p>
                <p>1. Download and print your application form</p>
                <p>2. Attach required documents (Aadhaar, land records, etc.)</p>
                <p>3. Visit your local Agricultural Extension Office</p>
                <p>4. Submit the printed application with documents</p>
            </div>

            <div class="instruction-box">
                <p><strong>Required Documents:</strong></p>
                <ul>
                    <li>Aadhaar Card copy</li>
                    <li>Land ownership documents (Patta/Chitta)</li>
                    <li>Survey number documents</li>
                    <li>Bank account passbook copy</li>
                    <li>Passport size photograph</li>
                    <li>Ration card copy</li>
                </ul>
            </div>
        `;
        
        showLoading(false);
        goToScreen('screen-confirmation');
        showToast('Farmer application filled successfully!');
    }, 1500);
}

// Check eligibility based on answers
function checkEligibility() {
    // Collect answers
    eligibilityAnswers = {
        educationLevel: document.getElementById('q-education-level').value,
        studyField: document.getElementById('q-study-field').value,
        annualIncome: parseInt(document.getElementById('q-annual-income').value) || 0,
        fatherOccupation: document.getElementById('q-father-occupation').value,
        motherOccupation: document.getElementById('q-mother-occupation').value,
        disabled: document.getElementById('q-disabled').value === 'yes',
        girlChild: document.getElementById('q-girl-child').value === 'yes',
        firstGraduate: document.getElementById('q-first-graduate').value === 'yes',
        expectedAmount: parseInt(document.getElementById('q-expected-amount').value) || 0,
        loanPreference: document.getElementById('q-loan').value
    };

    // Validate required fields
    if (!eligibilityAnswers.educationLevel) {
        showToast('Please select your education level', 'error');
        return;
    }
    
    if (!eligibilityAnswers.studyField || eligibilityAnswers.studyField.trim() === '') {
        showToast('Please enter what you are going to study', 'error');
        return;
    }
    
    // Check for garbage/random input
    const studyFieldTrimmed = eligibilityAnswers.studyField.trim();
    
    // Detect garbage input (too short, only numbers, random characters, etc.)
    if (studyFieldTrimmed.length < 3) {
        showToast('Please enter a valid field of study (at least 3 characters)', 'error');
        return;
    }
    
    // Check if it's only numbers or special characters
    if (/^[0-9!@#$%^&*()_+=\[\]{};':"\\|,.<>/?`~\s-]+$/.test(studyFieldTrimmed)) {
        showInvalidInputMessage();
        return;
    }
    
    // Check if it's random gibberish (no vowels or too many repeated characters)
    const hasVowels = /[aeiouAEIOU]/i.test(studyFieldTrimmed);
    const hasRepeatedChars = /(.)\1{4,}/.test(studyFieldTrimmed); // 5+ same chars in a row
    
    if (!hasVowels || hasRepeatedChars) {
        showInvalidInputMessage();
        return;
    }

    // Check if the query is education-related
    const studyFieldLower = eligibilityAnswers.studyField.toLowerCase();
    const educationKeywords = [
        'study', 'student', 'education', 'school', 'college', 'university',
        'degree', 'bachelor', 'master', 'diploma', 'course', 'engineering',
        'medicine', 'medical', 'arts', 'science', 'commerce', 'law', 'mba',
        'bba', 'bca', 'mca', 'b.sc', 'm.sc', 'b.com', 'm.com', 'b.a', 'm.a',
        'phd', 'doctorate', 'pg', 'ug', 'graduation', 'post-graduation',
        'scholarship', 'learning', 'training', 'academic', 'class', 'exam',
        'படிப்பு', 'மாணவர்', 'கல்வி', 'பள்ளி', 'கல்லூரி', // Tamil
        'पढ़ाई', 'छात्र', 'शिक्षा', 'स्कूल', 'कॉलेज' // Hindi
    ];
    
    const isEducationRelated = educationKeywords.some(keyword => 
        studyFieldLower.includes(keyword)
    );
    
    if (!isEducationRelated) {
        // Show polite message for non-education queries
        showNotEducationRelatedMessage();
        return;
    }

    console.log('Eligibility Answers:', eligibilityAnswers); // Debug log

    // Determine target education level based on what they're going to study
    let targetEducationLevel = eligibilityAnswers.educationLevel;
    const studyField = eligibilityAnswers.studyField.toLowerCase();
    
    // If in school but going to study UG/Professional courses
    if (eligibilityAnswers.educationLevel === 'school') {
        if (studyField.includes('engineering') || studyField.includes('medicine') || 
            studyField.includes('law') || studyField.includes('architecture')) {
            targetEducationLevel = 'professional';
        } else if (studyField.includes('degree') || studyField.includes('bachelor') || 
                   studyField.includes('b.sc') || studyField.includes('b.com') || 
                   studyField.includes('b.a') || studyField.includes('bba')) {
            targetEducationLevel = 'ug';
        }
    }
    
    // If in UG but going to study PG
    if (eligibilityAnswers.educationLevel === 'ug') {
        if (studyField.includes('master') || studyField.includes('m.sc') || 
            studyField.includes('m.com') || studyField.includes('m.a') || 
            studyField.includes('mba') || studyField.includes('pg')) {
            targetEducationLevel = 'pg';
        }
    }
    
    console.log('Target Education Level:', targetEducationLevel); // Debug log

    // Find matching schemes
    const matchingSchemes = [];
    
    for (const [schemeName, criteria] of Object.entries(SCHEMES)) {
        let matches = true;
        
        // Check education level using TARGET level (what they're going to study)
        if (criteria.educationLevel && !criteria.educationLevel.includes(targetEducationLevel)) {
            matches = false;
        }
        
        // Check income (all schemes have income limit now)
        if (criteria.maxIncome && eligibilityAnswers.annualIncome > criteria.maxIncome) {
            matches = false;
        }
        
        // Check special criteria (these are required if specified)
        if (criteria.disabled && !eligibilityAnswers.disabled) {
            matches = false;
        }
        if (criteria.girlChild && !eligibilityAnswers.girlChild) {
            matches = false;
        }
        if (criteria.firstGraduate && !eligibilityAnswers.firstGraduate) {
            matches = false;
        }
        
        if (matches) {
            matchingSchemes.push({ name: schemeName, priority: criteria.priority || 3 });
        }
    }

    console.log('Matching Schemes:', matchingSchemes); // Debug log

    // Sort by priority (lower number = higher priority)
    matchingSchemes.sort((a, b) => a.priority - b.priority);

    // Display results
    if (matchingSchemes.length === 0) {
        // Check if income is the only issue
        if (eligibilityAnswers.annualIncome > 500000) {
            // Income too high - suggest educational loan
            document.getElementById('eligibility-message').innerHTML = 
                '<strong style="color: #f56565;">Your family income exceeds ₹5,00,000.</strong><br>' +
                'You are not eligible for government scholarships, but we recommend educational loans.';
        } else {
            // Other criteria don't match
            document.getElementById('eligibility-message').innerHTML = 
                '<strong style="color: #f56565;">No matching scholarships found based on your criteria.</strong><br>' +
                'We recommend government bank educational loans for your studies.';
        }
        
        const schemesList = document.getElementById('schemes-list');
        schemesList.innerHTML = `
            <div class="scheme-card selected">
                <div class="scheme-icon">🏦</div>
                <div class="scheme-info">
                    <h3>Government Educational Loan</h3>
                    <p>Low-interest loans from nationalized banks</p>
                    <p><strong>Banks:</strong> State Bank of India, Canara Bank, Indian Bank</p>
                    <p><strong>Interest Rate:</strong> 7-9% per annum</p>
                    <p><strong>Loan Amount:</strong> Up to ₹20 lakhs for studies in India</p>
                </div>
                <div class="scheme-check">✓</div>
            </div>
        `;
        selectedScheme = 'Educational Loan';
    } else {
        // Show priority message if special category matched
        const hasSpecialCategory = matchingSchemes.some(s => s.priority === 1);
        const priorityMessage = hasSpecialCategory ? 
            '<br><em style="color: #667eea;">Special category scholarships shown first (Disabled/Girl Child/First Graduate)</em>' : '';
        
        document.getElementById('eligibility-message').innerHTML = 
            `<strong style="color: #48bb78;">Great news! You are eligible for ${matchingSchemes.length} scholarship(s).</strong>${priorityMessage}`;
        
        const schemesList = document.getElementById('schemes-list');
        schemesList.innerHTML = matchingSchemes.map((scheme, index) => `
            <div class="scheme-card ${index === 0 ? 'selected' : ''}" onclick="selectScheme('${scheme.name}', ${index})">
                <div class="scheme-icon">${scheme.priority === 1 ? '⭐' : '📋'}</div>
                <div class="scheme-info">
                    <h3>${scheme.name}</h3>
                    <p>For: ${targetEducationLevel.toUpperCase()} - ${eligibilityAnswers.studyField}</p>
                    <p>Income: ₹${eligibilityAnswers.annualIncome.toLocaleString()}</p>
                    ${scheme.priority === 1 ? '<p style="color: #667eea; font-weight: bold;">⭐ Priority Scholarship</p>' : ''}
                </div>
                <div class="scheme-check">✓</div>
            </div>
        `).join('');
        
        selectedScheme = matchingSchemes[0].name;
    }

    goToScreen('screen-schemes');
}

// Select scheme
function selectScheme(scheme, index) {
    selectedScheme = scheme;
    document.querySelectorAll('.scheme-card').forEach((card, i) => {
        if (i === index) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

// Generate form with AI
async function generateForm() {
    if (!selectedScheme) {
        showToast('Please select a scheme', 'error');
        return;
    }
    
    // If farmer scheme, use simple form generation
    if (currentServiceType === 'farmer') {
        generateFarmerForm();
        return;
    }

    showLoading(true);

    // Create user input from eligibility answers
    const userInput = `I am a ${eligibilityAnswers.educationLevel} student studying ${eligibilityAnswers.studyField}. ` +
        `My family's annual income is ${eligibilityAnswers.annualIncome}. ` +
        `I belong to ${eligibilityAnswers.community} community. ` +
        `Father's occupation: ${eligibilityAnswers.fatherOccupation}. ` +
        `Mother's occupation: ${eligibilityAnswers.motherOccupation}.`;

    try {
        // First, process user input to create session
        const processResponse = await fetch(`${API_BASE_URL}/process-input`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userInput,
                language: currentLanguage
            })
        });

        const processData = await processResponse.json();
        if (!processResponse.ok) throw new Error(processData.error);
        
        sessionId = processData.sessionId;

        // Then generate form
        const response = await fetch(`${API_BASE_URL}/generate-form`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId,
                schemeId: selectedScheme,
                userDetails: eligibilityAnswers
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        formData = data.formData;

        // Add additional fields from eligibility
        formData.fatherOccupation = eligibilityAnswers.fatherOccupation;
        formData.motherOccupation = eligibilityAnswers.motherOccupation;
        formData.fatherEarning = Math.floor(eligibilityAnswers.annualIncome * 0.6);
        formData.motherEarning = Math.floor(eligibilityAnswers.annualIncome * 0.4);
        formData.totalIncome = eligibilityAnswers.annualIncome;
        formData.aadhaarNumber = '[Please provide your 12-digit Aadhaar number]';

        // Display form fields
        const formFields = document.getElementById('form-fields');
        formFields.innerHTML = Object.entries(formData).map(([key, value]) => `
            <div class="form-group">
                <label>${formatFieldName(key)}</label>
                <input type="text" id="field-${key}" value="${value}" class="form-input">
            </div>
        `).join('');

        showLoading(false);
        goToScreen('screen-form');
        showToast('Form generated successfully!');

    } catch (error) {
        showLoading(false);
        showToast(error.message || 'Error generating form', 'error');
        console.error('Error:', error);
    }
}

// Submit application
async function submitApplication() {
    // If farmer application, use simple submission
    if (currentServiceType === 'farmer') {
        submitFarmerApplication();
        return;
    }
    
    showLoading(true);

    // Collect updated form data
    const updatedFormData = {};
    Object.keys(formData).forEach(key => {
        const input = document.getElementById(`field-${key}`);
        if (input) {
            updatedFormData[key] = input.value;
        }
    });

    try {
        const response = await fetch(`${API_BASE_URL}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId,
                schemeId: selectedScheme,
                formData: updatedFormData,
                documents: [],
                language: currentLanguage
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        // Display confirmation
        document.getElementById('application-id').textContent = data.applicationId;
        document.getElementById('download-link').href = data.downloadUrl;

        showLoading(false);
        goToScreen('screen-confirmation');
        showToast('Application form filled successfully!');

    } catch (error) {
        showLoading(false);
        showToast(error.message || 'Error submitting application', 'error');
        console.error('Error:', error);
    }
}

// Format field name for display
function formatFieldName(fieldName) {
    return fieldName
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

// Start over
function startOver() {
    sessionId = null;
    selectedScheme = null;
    formData = {};
    eligibilityAnswers = {};
    currentServiceType = null;
    document.querySelectorAll('input, select, textarea').forEach(el => el.value = '');
    
    // Reset confirmation page to default
    document.querySelector('#screen-confirmation h2').textContent = 'Application Form Filled!';
    document.querySelector('#screen-confirmation .subtitle').textContent = 
        'Your application form has been prepared and is ready for submission';
    
    goToScreen('screen-home');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('AGAA Frontend initialized');
    console.log('API Base URL:', API_BASE_URL);
});
