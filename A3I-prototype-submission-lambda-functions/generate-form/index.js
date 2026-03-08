const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const dynamoClient = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const bedrockClient = new BedrockRuntimeClient({ region: 'us-east-1' });

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { sessionId, schemeId, userDetails } = body;
        
        if (!sessionId || !schemeId) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'sessionId and schemeId are required' })
            };
        }

        // Get session data
        const sessionResponse = await docClient.send(new GetCommand({
            TableName: 'agaa-sessions',
            Key: { sessionId }
        }));

        if (!sessionResponse.Item) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'Session not found' })
            };
        }

        const session = sessionResponse.Item;

        // Use Bedrock to generate form data
        const prompt = `You are an AI assistant helping fill government scholarship application forms.

User input: "${session.userInput}"
Scheme: ${schemeId}
User details: ${JSON.stringify(userDetails || {})}
Language: ${session.language}

Generate a filled application form with these fields:
- Full Name
- Date of Birth
- Gender
- Category (General/OBC/SC/ST)
- Annual Family Income
- Address
- Mobile Number
- Email
- Educational Qualification
- Institution Name
- Course/Class
- Year of Study
- Marks/Percentage
- Bank Account Number
- IFSC Code
- Reason for Application

Fill in reasonable values based on the user input. For missing information, use placeholder text like "[Please provide]".

Respond in JSON format:
{
  "formData": {
    "fullName": "...",
    "dateOfBirth": "...",
    ...
  },
  "missingFields": ["field1", "field2"]
}`;

        const bedrockPayload = {
            anthropic_version: 'bedrock-2023-05-31',
            max_tokens: 2000,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        };

        const bedrockCommand = new InvokeModelCommand({
            modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
            body: JSON.stringify(bedrockPayload)
        });

        const bedrockResponse = await bedrockClient.send(bedrockCommand);
        const responseBody = JSON.parse(new TextDecoder().decode(bedrockResponse.body));
        const aiResponse = responseBody.content[0].text;
        
        // Parse AI response
        let formResult;
        try {
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            formResult = jsonMatch ? JSON.parse(jsonMatch[0]) : {
                formData: {},
                missingFields: []
            };
        } catch (e) {
            formResult = {
                formData: {},
                missingFields: []
            };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
                sessionId,
                schemeId,
                formData: formResult.formData,
                missingFields: formResult.missingFields,
                message: 'Form generated successfully'
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
