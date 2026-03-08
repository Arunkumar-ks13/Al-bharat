const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const dynamoClient = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const bedrockClient = new BedrockRuntimeClient({ region: 'us-east-1' });

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { userInput, language = 'en' } = body;
        
        if (!userInput) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'userInput is required' })
            };
        }

        // Create session
        const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Use Bedrock to analyze user input and recommend schemes
        const prompt = `You are an AI assistant helping Indian citizens find government schemes.

User input: "${userInput}"
Language: ${language}

Based on this input, identify:
1. User category (student/farmer/senior citizen/general)
2. Relevant government schemes (focus on scholarships for students)
3. Key information needed for application

Respond in JSON format:
{
  "category": "student|farmer|senior|general",
  "recommendedSchemes": ["scheme1", "scheme2"],
  "requiredInfo": ["field1", "field2"]
}`;

        const bedrockPayload = {
            anthropic_version: 'bedrock-2023-05-31',
            max_tokens: 1000,
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
        let analysis;
        try {
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {
                category: 'general',
                recommendedSchemes: ['General Scholarship'],
                requiredInfo: ['name', 'age', 'income']
            };
        } catch (e) {
            analysis = {
                category: 'general',
                recommendedSchemes: ['General Scholarship'],
                requiredInfo: ['name', 'age', 'income']
            };
        }

        // Save session
        await docClient.send(new PutCommand({
            TableName: 'agaa-sessions',
            Item: {
                sessionId,
                userInput,
                language,
                analysis,
                createdAt: Date.now(),
                ttl: Math.floor(Date.now() / 1000) + 86400 // 24 hours
            }
        }));

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
                sessionId,
                analysis,
                message: 'User input processed successfully'
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
