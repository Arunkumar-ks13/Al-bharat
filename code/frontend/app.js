// AGAA Frontend - AWS Backend Integration
const API_BASE_URL = 'https://phxb8mfmqk.execute-api.us-east-1.amazonaws.com/prod';

// Global state
let currentLanguage = 'en';
let sessionId = null;
let selectedScheme = null;
let formData = {};

// Language selection
function selectLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('.btn-language').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    showToast(`Language selected: ${lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'தமிழ்'}`);
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

// Process user input with AI
async function processUserInput() {
    const userInput = document.getElementById('user-input').value.trim();
    
    if (!userInput) {
        showToast('Please enter your requirements', 'error');
        return;
    }

    showLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/process-input`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userInput,
                language: currentLanguage
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to process input');
        }

        sessionId = data.sessionId;
        const analysis = data.analysis;

        // Display recommended schemes
        const schemesList = document.getElementById('schemes-list');
        schemesList.innerHTML = analysis.recommendedSchemes.map((scheme, index) => `
            <div class="scheme-card ${index === 0 ? 'selected' : ''}" onclick="selectScheme('${scheme}', ${index})">
                <div class="scheme-icon">📋</div>
                <div class="scheme-info">
                    <h3>${scheme}</h3>
                    <p>Category: ${analysis.category}</p>
                </div>
                <div class="scheme-check">✓</div>
            </div>
        `).join('');

        selectedScheme = analysis.recommendedSchemes[0];
        
        showLoading(false);
        goToScreen('screen-schemes');
        showToast('AI analysis complete!');

    } catch (error) {
        showLoading(false);
        showToast(error.message || 'Error processing input', 'error');
        console.error('Error:', error);
    }
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

    showLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/generate-form`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId,
                schemeId: selectedScheme,
                userDetails: {}
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate form');
        }

        formData = data.formData;

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
                documents: []
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to submit application');
        }

        // Display confirmation
        document.getElementById('application-id').textContent = data.applicationId;
        document.getElementById('download-link').href = data.downloadUrl;

        showLoading(false);
        goToScreen('screen-confirmation');
        showToast('Application submitted successfully!');

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
    document.getElementById('user-input').value = '';
    goToScreen('screen-home');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('AGAA Frontend initialized');
    console.log('API Base URL:', API_BASE_URL);
});
