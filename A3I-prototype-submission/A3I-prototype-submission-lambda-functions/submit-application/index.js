const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const dynamoClient = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const s3Client = new S3Client({ region: 'us-east-1' });

const BUCKET_NAME = process.env.BUCKET_NAME || 'agaa-docs-ak-1772860173';

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { sessionId, schemeId, formData, documents = [], language = 'en' } = body;
        
        if (!sessionId || !schemeId || !formData) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'sessionId, schemeId, and formData are required' })
            };
        }

        // Language translations for form labels
        const translations = {
            en: {
                title: 'AGAA - Government Application Form',
                applicationId: 'Application ID',
                scheme: 'Scheme',
                date: 'Date',
                status: 'Submitted',
                personalInfo: 'Personal Information',
                documents: 'Documents',
                filesAttached: 'file(s) attached',
                footer1: 'This application was generated using AGAA - AI-Powered Government Application Assistant',
                footer2: 'For queries, please contact the respective government department'
            },
            hi: {
                title: 'AGAA - सरकारी आवेदन फॉर्म',
                applicationId: 'आवेदन आईडी',
                scheme: 'योजना',
                date: 'तारीख',
                status: 'सबमिट किया गया',
                personalInfo: 'व्यक्तिगत जानकारी',
                documents: 'दस्तावेज़',
                filesAttached: 'फ़ाइल(एं) संलग्न',
                footer1: 'यह आवेदन AGAA - AI-संचालित सरकारी आवेदन सहायक का उपयोग करके तैयार किया गया था',
                footer2: 'प्रश्नों के लिए, कृपया संबंधित सरकारी विभाग से संपर्क करें'
            },
            ta: {
                title: 'AGAA - அரசு விண்ணப்ப படிவம்',
                applicationId: 'விண்ணப்ப ஐடி',
                scheme: 'திட்டம்',
                date: 'தேதி',
                status: 'சமர்ப்பிக்கப்பட்டது',
                personalInfo: 'தனிப்பட்ட தகவல்',
                documents: 'ஆவணங்கள்',
                filesAttached: 'கோப்பு(கள்) இணைக்கப்பட்டுள்ளன',
                footer1: 'இந்த விண்ணப்பம் AGAA - AI-இயங்கும் அரசு விண்ணப்ப உதவியாளரைப் பயன்படுத்தி உருவாக்கப்பட்டது',
                footer2: 'கேள்விகளுக்கு, தயவுசெய்து சம்பந்தப்பட்ட அரசு துறையைத் தொடர்பு கொள்ளவும்'
            }
        };

        const t = translations[language] || translations.en;

        const applicationId = `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const userId = formData.email || `user-${Date.now()}`;

        // Save application to DynamoDB
        await docClient.send(new PutCommand({
            TableName: 'agaa-applications',
            Item: {
                applicationId,
                userId,
                sessionId,
                schemeId,
                formData,
                documents,
                status: 'submitted',
                createdAt: Date.now(),
                updatedAt: Date.now()
            }
        }));

        // Generate formatted HTML document
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${t.title}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
        .header { text-align: center; border-bottom: 3px solid #5cb85c; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #5cb85c; margin: 0; }
        .header p { color: #666; margin: 5px 0; }
        .section { margin: 20px 0; }
        .section h2 { color: #5cb85c; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
        .field { display: flex; margin: 10px 0; padding: 10px; background: #f7fafc; border-radius: 5px; }
        .field-label { font-weight: bold; width: 250px; color: #4a5568; }
        .field-value { flex: 1; color: #2d3748; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; color: #666; }
        .status { display: inline-block; background: #48bb78; color: white; padding: 5px 15px; border-radius: 20px; }
        .credits { margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 10px; text-align: center; }
        .credits p { margin: 5px 0; color: #4a5568; }
        .credits .team { font-weight: bold; color: #5cb85c; font-size: 1.1rem; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🇮🇳 ${t.title}</h1>
        <p><strong>${t.applicationId}:</strong> ${applicationId}</p>
        <p><strong>${t.scheme}:</strong> ${schemeId}</p>
        <p><strong>${t.date}:</strong> ${new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : 'en-IN', { dateStyle: 'long' })}</p>
        <p><span class="status">${t.status}</span></p>
    </div>
    
    <div class="section">
        <h2>${t.personalInfo}</h2>
        ${Object.entries(formData).map(([key, value]) => `
        <div class="field">
            <div class="field-label">${formatFieldName(key)}:</div>
            <div class="field-value">${value}</div>
        </div>
        `).join('')}
    </div>
    
    <div class="section">
        <h2>${t.documents}</h2>
        <p>${documents.length} ${t.filesAttached}</p>
    </div>
    
    <div class="footer">
        <p>${t.footer1}</p>
        <p>${t.footer2}</p>
        <div class="credits">
            <p>Conceptualized by</p>
            <p class="team">Arunkumar & Aditya</p>
            <p style="font-weight: 600; color: #5cb85c;">Team A3I</p>
            <p style="font-size: 0.9rem;">(Arun, Aditya & Artificial Intelligence)</p>
        </div>
    </div>
</body>
</html>
        `.trim();

        // Helper function to format field names
        function formatFieldName(fieldName) {
            return fieldName
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();
        }

        // Save HTML to S3
        await s3Client.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `applications/${applicationId}/form.html`,
            Body: htmlContent,
            ContentType: 'text/html',
            ContentDisposition: `attachment; filename="AGAA-Application-${applicationId}.html"`
        }));

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
                applicationId,
                status: 'submitted',
                message: 'Application submitted successfully',
                downloadUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/applications/${applicationId}/form.html`
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Internal server error', details: error.message })
        };
    }
};
