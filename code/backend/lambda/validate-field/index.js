const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const bedrock = new BedrockRuntimeClient({ region: 'us-east-1' });

exports.handler = async (event) => {
    // Handle OPTIONS preflight request
    if (event.httpMethod === 'OPTIONS' || event.requestContext?.http?.method === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            body: ''
        };
    }

    try {
        const body = JSON.parse(event.body);
        const { fieldName, fieldValue, formContext = {}, language = 'en' } = body;
        
        if (!fieldName || !fieldValue) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'fieldName and fieldValue are required' })
            };
        }

        // Build context-aware validation prompt
        const prompt = buildValidationPrompt(fieldName, fieldValue, formContext, language);

        // Call AWS Bedrock for intelligent validation
        const response = await bedrock.send(new InvokeModelCommand({
            modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify({
                anthropic_version: 'bedrock-2023-05-31',
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                max_tokens: 500,
                temperature: 0.3 // Low temperature for consistent validation
            })
        }));

        const result = JSON.parse(new TextDecoder().decode(response.body));
        const aiResponse = result.content[0].text;

        // Parse AI response
        const validation = parseValidationResponse(aiResponse);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(validation)
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ 
                error: 'Internal server error', 
                details: error.message,
                isValid: true, // Fail open - don't block user if AI fails
                message: ''
            })
        };
    }
};

function buildValidationPrompt(fieldName, fieldValue, formContext, language) {
    const languageMap = {
        en: 'English',
        hi: 'Hindi',
        ta: 'Tamil'
    };
    
    const contextInfo = Object.keys(formContext).length > 0 
        ? `\n\nForm Context:\n${JSON.stringify(formContext, null, 2)}`
        : '';

    return `You are an intelligent form validation assistant for a government scholarship application system in India.

Field Name: ${fieldName}
Field Value: ${fieldValue}
Language: ${languageMap[language] || 'English'}${contextInfo}

Your task:
1. Validate if the field value is appropriate and correct
2. Check for common errors (typos, format issues, unrealistic values)
3. Provide helpful suggestions or corrections if needed
4. Consider Indian context (names, locations, education system, etc.)
5. Be encouraging and helpful, not critical

Respond in JSON format:
{
  "isValid": true/false,
  "severity": "error" | "warning" | "info" | "success",
  "message": "Your helpful message here",
  "suggestion": "Suggested correction (if any)",
  "additionalInfo": "Extra helpful information (optional)"
}

Rules:
- If value is clearly wrong, set isValid: false, severity: "error"
- If value might be wrong but acceptable, set isValid: true, severity: "warning"
- If value is good but you have helpful tips, set isValid: true, severity: "info"
- If value is excellent, set isValid: true, severity: "success"
- Keep messages short (under 100 characters)
- Be culturally sensitive and respectful
- Respond in ${languageMap[language] || 'English'}

Examples:
- Field: "fatherOccupation", Value: "Farmer" → Suggest farmer welfare schemes
- Field: "annualIncome", Value: "1500000" → Warn about scholarship income limits
- Field: "studyField", Value: "Mbbs" → Correct to "MBBS" and mention medical scholarships
- Field: "fullName", Value: "john" → Suggest proper capitalization "John"
- Field: "mobileNumber", Value: "12345" → Error: Invalid format, need 10 digits`;
}

function parseValidationResponse(aiResponse) {
    try {
        // Try to extract JSON from response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                isValid: parsed.isValid !== false, // Default to true
                severity: parsed.severity || 'info',
                message: parsed.message || '',
                suggestion: parsed.suggestion || null,
                additionalInfo: parsed.additionalInfo || null
            };
        }
        
        // Fallback if JSON parsing fails
        return {
            isValid: true,
            severity: 'info',
            message: aiResponse.substring(0, 100),
            suggestion: null,
            additionalInfo: null
        };
    } catch (error) {
        console.error('Error parsing AI response:', error);
        return {
            isValid: true,
            severity: 'info',
            message: '',
            suggestion: null,
            additionalInfo: null
        };
    }
}
