# AGAA Prototype - Complete Deployment Guide

This guide will walk you through deploying the AGAA prototype to AWS from scratch.

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] AWS Account (with credit card for billing)
- [ ] AWS CLI installed on your machine
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Terminal/Command Line access
- [ ] Text editor (VS Code recommended)

---

## Phase 1: AWS Account Setup

### Step 1.1: Create AWS Account (if you don't have one)

1. Go to https://aws.amazon.com/
2. Click "Create an AWS Account"
3. Follow the registration process
4. Add payment method (required, but we'll stay in free tier)
5. Verify your identity (phone verification)
6. Choose "Basic Support - Free"

### Step 1.2: Install AWS CLI

**macOS:**
```bash
# Using Homebrew
brew install awscli

# Verify installation
aws --version
```

**Windows:**
```powershell
# Download and run the installer
# https://awscli.amazonaws.com/AWSCLIV2.msi

# Verify installation
aws --version
```

**Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify installation
aws --version
```

### Step 1.3: Create IAM User with Programmatic Access

1. **Log into AWS Console:** https://console.aws.amazon.com/
2. **Go to IAM:** Search for "IAM" in the top search bar
3. **Create User:**
   - Click "Users" → "Create user"
   - Username: `agaa-deployer`
   - Check "Provide user access to the AWS Management Console" (optional)
   - Click "Next"
4. **Set Permissions:**
   - Select "Attach policies directly"
   - Search and select these policies:
     - `AdministratorAccess` (for hackathon - simplest)
     - OR for production, use these specific policies:
       - `AWSLambdaFullAccess`
       - `AmazonDynamoDBFullAccess`
       - `AmazonS3FullAccess`
       - `AmazonAPIGatewayAdministrator`
       - `CloudWatchFullAccess`
       - `AmazonBedrockFullAccess`
   - Click "Next" → "Create user"
5. **Create Access Keys:**
   - Click on the user you just created
   - Go to "Security credentials" tab
   - Scroll to "Access keys"
   - Click "Create access key"
   - Select "Command Line Interface (CLI)"
   - Check the confirmation box
   - Click "Create access key"
   - **IMPORTANT:** Download the CSV file or copy the keys NOW (you won't see them again)

### Step 1.4: Configure AWS CLI

```bash
# Run AWS configure
aws configure

# You'll be prompted for:
# AWS Access Key ID: [paste your access key]
# AWS Secret Access Key: [paste your secret key]
# Default region name: us-east-1
# Default output format: json
```

**Verify Configuration:**
```bash
# Test AWS CLI
aws sts get-caller-identity

# You should see output like:
# {
#     "UserId": "AIDAXXXXXXXXXXXXXXXXX",
#     "Account": "123456789012",
#     "Arn": "arn:aws:iam::123456789012:user/agaa-deployer"
# }
```

---

## Phase 2: Enable Amazon Bedrock

### Step 2.1: Request Model Access

1. **Go to Bedrock Console:** https://console.aws.amazon.com/bedrock/
2. **Select Region:** Make sure you're in `us-east-1` (top right corner)
3. **Request Model Access:**
   - Click "Model access" in the left sidebar
   - Click "Manage model access" (orange button)
   - Find "Anthropic" section
   - Check the box for "Claude 3 Haiku"
   - Scroll down and click "Request model access"
4. **Wait for Approval:**
   - Usually instant for Claude 3 Haiku
   - Status will change from "In progress" to "Access granted"
   - Refresh the page if needed

### Step 2.2: Test Bedrock Access

```bash
# Test Bedrock API access
aws bedrock list-foundation-models --region us-east-1

# You should see a list of models including Claude 3 Haiku
```

---

## Phase 3: Deploy Backend Infrastructure

### Step 3.1: Create DynamoDB Tables

Create a file `create-dynamodb-tables.sh`:

```bash
#!/bin/bash

echo "Creating DynamoDB tables..."

# Create Applications table
aws dynamodb create-table \
    --table-name agaa-applications \
    --attribute-definitions \
        AttributeName=applicationId,AttributeType=S \
        AttributeName=userId,AttributeType=S \
        AttributeName=createdAt,AttributeType=N \
    --key-schema \
        AttributeName=applicationId,KeyType=HASH \
    --global-secondary-indexes \
        "[
            {
                \"IndexName\": \"UserIdIndex\",
                \"KeySchema\": [
                    {\"AttributeName\":\"userId\",\"KeyType\":\"HASH\"},
                    {\"AttributeName\":\"createdAt\",\"KeyType\":\"RANGE\"}
                ],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {
                    \"ReadCapacityUnits\": 1,
                    \"WriteCapacityUnits\": 1
                }
            }
        ]" \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1

echo "Applications table created!"

# Create Schemes table
aws dynamodb create-table \
    --table-name agaa-schemes \
    --attribute-definitions \
        AttributeName=schemeId,AttributeType=S \
        AttributeName=category,AttributeType=S \
    --key-schema \
        AttributeName=schemeId,KeyType=HASH \
    --global-secondary-indexes \
        "[
            {
                \"IndexName\": \"CategoryIndex\",
                \"KeySchema\": [
                    {\"AttributeName\":\"category\",\"KeyType\":\"HASH\"}
                ],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {
                    \"ReadCapacityUnits\": 1,
                    \"WriteCapacityUnits\": 1
                }
            }
        ]" \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1

echo "Schemes table created!"

# Create Sessions table
aws dynamodb create-table \
    --table-name agaa-sessions \
    --attribute-definitions \
        AttributeName=sessionId,AttributeType=S \
    --key-schema \
        AttributeName=sessionId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1

echo "Sessions table created!"

echo "All DynamoDB tables created successfully!"
```

**Run the script:**
```bash
chmod +x create-dynamodb-tables.sh
./create-dynamodb-tables.sh
```

**Verify tables:**
```bash
aws dynamodb list-tables --region us-east-1
```

### Step 3.2: Seed Sample Schemes Data

Create a file `seed-schemes.json`:

```json
{
    "agaa-schemes": [
        {
            "PutRequest": {
                "Item": {
                    "schemeId": {"S": "scheme-001"},
                    "category": {"S": "scholarship"},
                    "name": {
                        "M": {
                            "en": {"S": "National Scholarship for EWS Students"},
                            "hi": {"S": "आर्थिक रूप से कमजोर वर्ग के छात्रों के लिए राष्ट्रीय छात्रवृत्ति"},
                            "ta": {"S": "பொருளாதார ரீதியாக பின்தங்கிய மாணவர்களுக்கான தேசிய உதவித்தொகை"}
                        }
                    },
                    "description": {
                        "M": {
                            "en": {"S": "Scholarship for economically weaker section students pursuing higher education"},
                            "hi": {"S": "उच्च शिक्षा प्राप्त करने वाले आर्थिक रूप से कमजोर वर्ग के छात्रों के लिए छात्रवृत्ति"},
                            "ta": {"S": "உயர்கல்வி பயிலும் பொருளாதார ரீதியாக பின்தங்கிய மாணவர்களுக்கான உதவித்தொகை"}
                        }
                    },
                    "benefits": {"S": "Up to ₹50,000 per year"},
                    "eligibilityIncome": {"N": "100000"},
                    "eligibilityAge": {"N": "18"},
                    "requiredDocuments": {
                        "L": [
                            {"S": "Income Certificate"},
                            {"S": "Aadhaar Card"},
                            {"S": "Educational Certificate"}
                        ]
                    }
                }
            }
        },
        {
            "PutRequest": {
                "Item": {
                    "schemeId": {"S": "scheme-002"},
                    "category": {"S": "scholarship"},
                    "name": {
                        "M": {
                            "en": {"S": "Merit-Based Engineering Scholarship"},
                            "hi": {"S": "मेधा आधारित इंजीनियरिंग छात्रवृत्ति"},
                            "ta": {"S": "தகுதி அடிப்படையிலான பொறியியல் உதவித்தொகை"}
                        }
                    },
                    "description": {
                        "M": {
                            "en": {"S": "Scholarship for meritorious students in engineering programs"},
                            "hi": {"S": "इंजीनियरिंग कार्यक्रमों में मेधावी छात्रों के लिए छात्रवृत्ति"},
                            "ta": {"S": "பொறியியல் திட்டங்களில் சிறந்த மாணவர்களுக்கான உதவித்தொகை"}
                        }
                    },
                    "benefits": {"S": "Up to ₹75,000 per year"},
                    "eligibilityIncome": {"N": "200000"},
                    "eligibilityAge": {"N": "17"},
                    "requiredDocuments": {
                        "L": [
                            {"S": "Income Certificate"},
                            {"S": "Aadhaar Card"},
                            {"S": "12th Grade Marksheet"},
                            {"S": "Admission Letter"}
                        ]
                    }
                }
            }
        }
    ]
}
```

**Load the data:**
```bash
aws dynamodb batch-write-item --request-items file://seed-schemes.json --region us-east-1
```

### Step 3.3: Create S3 Bucket

```bash
# Create bucket (bucket names must be globally unique)
# Replace 'your-unique-name' with something unique
aws s3 mb s3://agaa-documents-your-unique-name --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
    --bucket agaa-documents-your-unique-name \
    --versioning-configuration Status=Enabled \
    --region us-east-1

# Block public access (security)
aws s3api put-public-access-block \
    --bucket agaa-documents-your-unique-name \
    --public-access-block-configuration \
        "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
    --region us-east-1

echo "S3 bucket created successfully!"
```

### Step 3.4: Create IAM Role for Lambda

Create a file `lambda-trust-policy.json`:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "lambda.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
```

Create a file `lambda-execution-policy.json`:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:Query",
                "dynamodb:Scan"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/agaa-*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::agaa-documents-*/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel"
            ],
            "Resource": "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-*"
        }
    ]
}
```

**Create the role:**
```bash
# Create IAM role
aws iam create-role \
    --role-name agaa-lambda-execution-role \
    --assume-role-policy-document file://lambda-trust-policy.json

# Attach custom policy
aws iam put-role-policy \
    --role-name agaa-lambda-execution-role \
    --policy-name agaa-lambda-policy \
    --policy-document file://lambda-execution-policy.json

# Get the role ARN (save this for later)
aws iam get-role --role-name agaa-lambda-execution-role --query 'Role.Arn' --output text
```

---

## Phase 4: Deploy Lambda Functions

### Step 4.1: Create Lambda Function Code

Create directory structure:
```bash
mkdir -p lambda-functions/intent-analyzer
cd lambda-functions/intent-analyzer
npm init -y
npm install @aws-sdk/client-bedrock-runtime @aws-sdk/client-dynamodb
```

Create `index.js`:

```javascript
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");

const bedrockClient = new BedrockRuntimeClient({ region: "us-east-1" });
const dynamoClient = new DynamoDBClient({ region: "us-east-1" });

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event));
    
    try {
        const body = JSON.parse(event.body);
        const { userInput, language = 'en' } = body;
        
        // Call Bedrock to analyze intent
        const prompt = `Analyze this scholarship request and extract key information:
User input: "${userInput}"

Extract:
1. Type of scholarship needed
2. Education level
3. Field of study
4. Any specific requirements mentioned

Respond in JSON format with keys: scholarshipType, educationLevel, fieldOfStudy, requirements`;

        const bedrockParams = {
            modelId: "anthropic.claude-3-haiku-20240307-v1:0",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 500,
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        };
        
        const bedrockCommand = new InvokeModelCommand(bedrockParams);
        const bedrockResponse = await bedrockClient.send(bedrockCommand);
        const responseBody = JSON.parse(new TextDecoder().decode(bedrockResponse.body));
        
        console.log('Bedrock response:', responseBody);
        
        // Query DynamoDB for matching schemes
        const queryParams = {
            TableName: "agaa-schemes",
            IndexName: "CategoryIndex",
            KeyConditionExpression: "category = :category",
            ExpressionAttributeValues: {
                ":category": { S: "scholarship" }
            }
        };
        
        const queryCommand = new QueryCommand(queryParams);
        const schemes = await dynamoClient.send(queryCommand);
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                analysis: responseBody.content[0].text,
                schemes: schemes.Items,
                message: 'Intent analyzed successfully'
            })
        };
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: error.message
            })
        };
    }
};
```

### Step 4.2: Package and Deploy Lambda

```bash
# Package the function
zip -r function.zip index.js node_modules/

# Get your account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Deploy Lambda function
aws lambda create-function \
    --function-name agaa-intent-analyzer \
    --runtime nodejs18.x \
    --role arn:aws:iam::${ACCOUNT_ID}:role/agaa-lambda-execution-role \
    --handler index.handler \
    --zip-file fileb://function.zip \
    --timeout 30 \
    --memory-size 512 \
    --region us-east-1

echo "Lambda function deployed!"
```

### Step 4.3: Test Lambda Function

Create `test-event.json`:

```json
{
    "body": "{\"userInput\": \"I need scholarship for engineering college\", \"language\": \"en\"}"
}
```

**Test the function:**
```bash
aws lambda invoke \
    --function-name agaa-intent-analyzer \
    --payload file://test-event.json \
    --region us-east-1 \
    response.json

# View the response
cat response.json
```

---

## Phase 5: Deploy API Gateway

### Step 5.1: Create REST API

```bash
# Create API
API_ID=$(aws apigateway create-rest-api \
    --name agaa-api \
    --description "AGAA Prototype API" \
    --region us-east-1 \
    --query 'id' \
    --output text)

echo "API ID: $API_ID"

# Get root resource ID
ROOT_ID=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --region us-east-1 \
    --query 'items[0].id' \
    --output text)

echo "Root Resource ID: $ROOT_ID"
```

### Step 5.2: Create API Resources and Methods

```bash
# Create /api resource
API_RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $ROOT_ID \
    --path-part api \
    --region us-east-1 \
    --query 'id' \
    --output text)

# Create /api/analyze-intent resource
ANALYZE_RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $API_RESOURCE_ID \
    --path-part analyze-intent \
    --region us-east-1 \
    --query 'id' \
    --output text)

# Create POST method
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $ANALYZE_RESOURCE_ID \
    --http-method POST \
    --authorization-type NONE \
    --region us-east-1

# Get Lambda ARN
LAMBDA_ARN=$(aws lambda get-function \
    --function-name agaa-intent-analyzer \
    --region us-east-1 \
    --query 'Configuration.FunctionArn' \
    --output text)

# Integrate with Lambda
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $ANALYZE_RESOURCE_ID \
    --http-method POST \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/${LAMBDA_ARN}/invocations" \
    --region us-east-1

# Grant API Gateway permission to invoke Lambda
aws lambda add-permission \
    --function-name agaa-intent-analyzer \
    --statement-id apigateway-invoke \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:us-east-1:${ACCOUNT_ID}:${API_ID}/*/*" \
    --region us-east-1
```

### Step 5.3: Enable CORS

```bash
# Enable CORS for OPTIONS method
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $ANALYZE_RESOURCE_ID \
    --http-method OPTIONS \
    --authorization-type NONE \
    --region us-east-1

aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $ANALYZE_RESOURCE_ID \
    --http-method OPTIONS \
    --type MOCK \
    --request-templates '{"application/json": "{\"statusCode\": 200}"}' \
    --region us-east-1

aws apigateway put-method-response \
    --rest-api-id $API_ID \
    --resource-id $ANALYZE_RESOURCE_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters \
        "method.response.header.Access-Control-Allow-Headers=true,method.response.header.Access-Control-Allow-Methods=true,method.response.header.Access-Control-Allow-Origin=true" \
    --region us-east-1

aws apigateway put-integration-response \
    --rest-api-id $API_ID \
    --resource-id $ANALYZE_RESOURCE_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters \
        "method.response.header.Access-Control-Allow-Headers='Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',method.response.header.Access-Control-Allow-Methods='POST,OPTIONS',method.response.header.Access-Control-Allow-Origin='*'" \
    --region us-east-1
```

### Step 5.4: Deploy API

```bash
# Create deployment
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod \
    --region us-east-1

# Get API endpoint
echo "API Endpoint: https://${API_ID}.execute-api.us-east-1.amazonaws.com/prod"
```

### Step 5.5: Test API

```bash
# Test the API endpoint
curl -X POST \
    "https://${API_ID}.execute-api.us-east-1.amazonaws.com/prod/api/analyze-intent" \
    -H "Content-Type: application/json" \
    -d '{"userInput": "I need scholarship for engineering", "language": "en"}'
```

---

## Phase 6: Deploy Frontend to AWS Amplify

### Step 6.1: Install Amplify CLI

```bash
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure
```

Follow the prompts:
1. Sign in to AWS Console (opens browser)
2. Specify AWS Region: `us-east-1`
3. Create IAM user: `amplify-cli-user`
4. Attach policies: `AdministratorAccess-Amplify`
5. Enter access key and secret key

### Step 6.2: Initialize Amplify in Your Project

```bash
# Navigate to your frontend directory
cd /path/to/your/frontend

# Initialize Amplify
amplify init
```

Answer the prompts:
- Enter a name for the project: `agaa`
- Enter a name for the environment: `prod`
- Choose your default editor: `Visual Studio Code`
- Choose the type of app: `javascript`
- What javascript framework: `react`
- Source Directory Path: `src`
- Distribution Directory Path: `build`
- Build Command: `npm run build`
- Start Command: `npm start`
- Do you want to use an AWS profile? `Yes`
- Please choose the profile: `default`

### Step 6.3: Add Hosting

```bash
# Add hosting
amplify add hosting

# Choose: Hosting with Amplify Console
# Choose: Manual deployment
```

### Step 6.4: Configure API Endpoint in Frontend

Create `.env` file in your frontend:

```bash
REACT_APP_API_ENDPOINT=https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod
REACT_APP_AWS_REGION=us-east-1
```

### Step 6.5: Deploy Frontend

```bash
# Build and deploy
amplify publish

# This will:
# 1. Build your React app
# 2. Upload to Amplify
# 3. Provide you with a URL
```

---

## Phase 7: Verification and Testing

### Step 7.1: Verify All Services

```bash
# Check DynamoDB tables
aws dynamodb list-tables --region us-east-1

# Check S3 bucket
aws s3 ls

# Check Lambda functions
aws lambda list-functions --region us-east-1

# Check API Gateway
aws apigateway get-rest-apis --region us-east-1

# Check Amplify app
amplify status
```

### Step 7.2: End-to-End Test

1. Open your Amplify URL in browser
2. Enter user information
3. Check if AI analysis works
4. Verify form auto-fill
5. Test document upload
6. Generate PDF

### Step 7.3: Monitor Logs

```bash
# View Lambda logs
aws logs tail /aws/lambda/agaa-intent-analyzer --follow

# View API Gateway logs (if enabled)
aws logs tail /aws/apigateway/agaa-api --follow
```

---

## Phase 8: Cost Monitoring

### Set Up Billing Alerts

1. Go to AWS Console → Billing Dashboard
2. Click "Budgets" in left sidebar
3. Click "Create budget"
4. Choose "Cost budget"
5. Set budget amount: $20
6. Set alert threshold: 80% ($16)
7. Enter your email for notifications

---

## Troubleshooting

### Common Issues

**Issue 1: Lambda function times out**
```bash
# Increase timeout
aws lambda update-function-configuration \
    --function-name agaa-intent-analyzer \
    --timeout 60 \
    --region us-east-1
```

**Issue 2: CORS errors**
- Verify CORS is enabled in API Gateway
- Check response headers include Access-Control-Allow-Origin

**Issue 3: Bedrock access denied**
```bash
# Verify model access
aws bedrock list-foundation-models --region us-east-1

# Check IAM permissions
aws iam get-role-policy \
    --role-name agaa-lambda-execution-role \
    --policy-name agaa-lambda-policy
```

**Issue 4: DynamoDB access denied**
```bash
# Verify table exists
aws dynamodb describe-table --table-name agaa-schemes --region us-east-1

# Check IAM permissions
```

---

## Cleanup (When Done)

To avoid charges, delete all resources:

```bash
# Delete Amplify app
amplify delete

# Delete API Gateway
aws apigateway delete-rest-api --rest-api-id $API_ID --region us-east-1

# Delete Lambda functions
aws lambda delete-function --function-name agaa-intent-analyzer --region us-east-1

# Delete DynamoDB tables
aws dynamodb delete-table --table-name agaa-applications --region us-east-1
aws dynamodb delete-table --table-name agaa-schemes --region us-east-1
aws dynamodb delete-table --table-name agaa-sessions --region us-east-1

# Delete S3 bucket (must be empty first)
aws s3 rm s3://agaa-documents-your-unique-name --recursive
aws s3 rb s3://agaa-documents-your-unique-name

# Delete IAM role
aws iam delete-role-policy --role-name agaa-lambda-execution-role --policy-name agaa-lambda-policy
aws iam delete-role --role-name agaa-lambda-execution-role
```

---

## Next Steps

After successful deployment:

1. ✅ Test all features thoroughly
2. ✅ Add more Lambda functions (form-filler, document-handler, pdf-generator)
3. ✅ Implement proper error handling
4. ✅ Add CloudWatch dashboards
5. ✅ Set up CI/CD pipeline
6. ✅ Prepare demo for hackathon

---

## Support

If you encounter issues:
- Check CloudWatch Logs for errors
- Review IAM permissions
- Verify all services are in the same region (us-east-1)
- Check AWS Service Health Dashboard

**Good luck with your deployment! 🚀**
