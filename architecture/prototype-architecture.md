# AGAA Prototype Architecture - AWS Implementation

## Overview

This document describes a **simplified, cost-effective AWS architecture** specifically designed for the hackathon prototype. This architecture prioritizes quick deployment, low cost, and demonstration capability over production-grade scalability.

**Estimated Cost: $15-25/month**

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER DEVICES                            │
│              (Mobile Browsers, Desktop Browsers)                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AWS AMPLIFY HOSTING                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Static Website (React App)                              │  │
│  │  - HTML, CSS, JavaScript                                 │  │
│  │  - Multi-language support (EN/HI/TA)                     │  │
│  │  - Responsive UI                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                    (CDN + SSL included)                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ API Calls
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY (REST API)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Endpoints:                                              │  │
│  │  - POST /analyze-intent                                  │  │
│  │  - POST /fill-form                                       │  │
│  │  - POST /upload-document                                 │  │
│  │  - POST /generate-pdf                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Triggers
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AWS LAMBDA FUNCTIONS                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Function 1: Intent Analyzer                            │  │
│  │  - Receives user input                                   │  │
│  │  - Calls Bedrock API                                     │  │
│  │  - Returns scheme recommendations                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Function 2: Form Filler                                │  │
│  │  - Takes user data                                       │  │
│  │  - Calls Bedrock to auto-fill form                      │  │
│  │  - Validates data                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Function 3: Document Handler                           │  │
│  │  - Uploads documents to S3                              │  │
│  │  - Validates format/size                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Function 4: PDF Generator                              │  │
│  │  - Generates application PDF                            │  │
│  │  - Stores in S3                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────┬────────────────────────┬──────────────────────────┘
             │                        │
             │ Bedrock API            │ Read/Write
             ▼                        ▼
┌──────────────────────┐    ┌──────────────────────────────────┐
│  AMAZON BEDROCK      │    │      AWS SERVICES                │
│  ┌────────────────┐  │    │  ┌────────────────────────────┐ │
│  │ Claude 3 Haiku │  │    │  │  DynamoDB                  │ │
│  │                │  │    │  │  - Applications table      │ │
│  │ - Intent       │  │    │  │  - Sessions table          │ │
│  │   Analysis     │  │    │  │  - Schemes table           │ │
│  │ - Form Auto-   │  │    │  └────────────────────────────┘ │
│  │   Fill         │  │    │  ┌────────────────────────────┐ │
│  │ - Validation   │  │    │  │  S3 Bucket                 │ │
│  └────────────────┘  │    │  │  - Uploaded documents      │ │
│                      │    │  │  - Generated PDFs          │ │
└──────────────────────┘    │  └────────────────────────────┘ │
                            │  ┌────────────────────────────┐ │
                            │  │  CloudWatch Logs           │ │
                            │  │  - Lambda logs             │ │
                            │  │  - API Gateway logs        │ │
                            │  └────────────────────────────┘ │
                            └──────────────────────────────────┘
```

---

## Component Details

### 1. AWS Amplify Hosting
**Purpose:** Host the React frontend application

**Features:**
- Automatic HTTPS/SSL
- Global CDN distribution
- Git-based deployments
- Custom domain support
- Environment variables

**Configuration:**
```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

**Cost:** $0.15/GB served + $0.01/build minute  
**Estimated:** ~$5/month for prototype

---

### 2. Amazon API Gateway
**Purpose:** REST API endpoints for frontend-backend communication

**Endpoints:**

| Method | Endpoint | Lambda Function | Purpose |
|--------|----------|-----------------|---------|
| POST | /api/analyze-intent | IntentAnalyzer | Analyze user input, recommend schemes |
| POST | /api/fill-form | FormFiller | Auto-fill application form |
| POST | /api/upload-document | DocumentHandler | Upload and validate documents |
| POST | /api/generate-pdf | PDFGenerator | Generate application PDF |
| GET | /api/schemes | SchemeRetriever | Get scheme details |

**Configuration:**
- CORS enabled for Amplify domain
- API Key authentication (simple for prototype)
- Request/response logging
- Throttling: 100 requests/second

**Cost:** $3.50 per million API calls  
**Estimated:** ~$1/month for prototype

---

### 3. AWS Lambda Functions
**Purpose:** Serverless backend logic

#### Function 1: Intent Analyzer
```javascript
// Runtime: Node.js 18.x
// Memory: 512 MB
// Timeout: 30 seconds

exports.handler = async (event) => {
    const { userInput, language } = JSON.parse(event.body);
    
    // Call Bedrock API
    const bedrockResponse = await invokeBedrockModel({
        modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        prompt: `Analyze this scholarship request and recommend schemes: ${userInput}`,
        maxTokens: 500
    });
    
    // Query DynamoDB for matching schemes
    const schemes = await querySchemes(bedrockResponse.keywords);
    
    return {
        statusCode: 200,
        body: JSON.stringify({ schemes, analysis: bedrockResponse })
    };
};
```

#### Function 2: Form Filler
```javascript
// Runtime: Node.js 18.x
// Memory: 512 MB
// Timeout: 30 seconds

exports.handler = async (event) => {
    const { userData, schemeId } = JSON.parse(event.body);
    
    // Get form structure from DynamoDB
    const formStructure = await getFormStructure(schemeId);
    
    // Call Bedrock to auto-fill
    const filledForm = await invokeBedrockModel({
        modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        prompt: `Fill this form with user data: ${JSON.stringify(userData)}`,
        maxTokens: 1000
    });
    
    // Save to DynamoDB
    await saveApplication(filledForm);
    
    return {
        statusCode: 200,
        body: JSON.stringify({ filledForm })
    };
};
```

#### Function 3: Document Handler
```javascript
// Runtime: Node.js 18.x
// Memory: 256 MB
// Timeout: 60 seconds

exports.handler = async (event) => {
    const { fileData, documentType, applicationId } = JSON.parse(event.body);
    
    // Validate file
    if (!validateFile(fileData)) {
        return { statusCode: 400, body: 'Invalid file' };
    }
    
    // Upload to S3
    const s3Key = `documents/${applicationId}/${documentType}/${Date.now()}.pdf`;
    await s3.putObject({
        Bucket: 'agaa-documents',
        Key: s3Key,
        Body: Buffer.from(fileData, 'base64'),
        ContentType: 'application/pdf'
    });
    
    // Save reference in DynamoDB
    await saveDocumentReference(applicationId, s3Key);
    
    return {
        statusCode: 200,
        body: JSON.stringify({ documentUrl: s3Key })
    };
};
```

#### Function 4: PDF Generator
```javascript
// Runtime: Node.js 18.x
// Memory: 1024 MB
// Timeout: 60 seconds
// Layer: Puppeteer layer for PDF generation

exports.handler = async (event) => {
    const { applicationId } = JSON.parse(event.body);
    
    // Get application data from DynamoDB
    const application = await getApplication(applicationId);
    
    // Generate PDF using Puppeteer
    const pdfBuffer = await generatePDF(application);
    
    // Upload to S3
    const s3Key = `pdfs/${applicationId}/application.pdf`;
    await s3.putObject({
        Bucket: 'agaa-documents',
        Key: s3Key,
        Body: pdfBuffer,
        ContentType: 'application/pdf'
    });
    
    return {
        statusCode: 200,
        body: JSON.stringify({ 
            pdfUrl: `https://agaa-documents.s3.amazonaws.com/${s3Key}`,
            confirmationNumber: generateConfirmationNumber()
        })
    };
};
```

**Cost:** $0.20 per 1M requests + $0.0000166667 per GB-second  
**Estimated:** ~$2/month for prototype

---

### 4. Amazon Bedrock
**Purpose:** AI model for intent analysis and form auto-fill

**Model:** Claude 3 Haiku (`anthropic.claude-3-haiku-20240307-v1:0`)

**Why Claude 3 Haiku:**
- Cost-effective: $0.25 per 1M input tokens, $1.25 per 1M output tokens
- Fast response time (~1-2 seconds)
- Good quality for form filling
- Multi-language support (English, Hindi, Tamil)

**Usage Pattern:**
```javascript
const AWS = require('aws-sdk');
const bedrock = new AWS.BedrockRuntime({ region: 'us-east-1' });

async function invokeBedrockModel({ modelId, prompt, maxTokens }) {
    const params = {
        modelId: modelId,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: maxTokens,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        })
    };
    
    const response = await bedrock.invokeModel(params).promise();
    return JSON.parse(response.body.toString());
}
```

**Cost:** ~$0.30 per 1,000 form fills  
**Estimated:** ~$3/month for prototype (100 forms)

---

### 5. Amazon DynamoDB
**Purpose:** NoSQL database for application data

**Tables:**

#### Applications Table
```javascript
{
    TableName: 'agaa-applications',
    KeySchema: [
        { AttributeName: 'applicationId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
        { AttributeName: 'applicationId', AttributeType: 'S' },
        { AttributeName: 'userId', AttributeType: 'S' },
        { AttributeName: 'createdAt', AttributeType: 'N' }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: 'UserIdIndex',
            KeySchema: [
                { AttributeName: 'userId', KeyType: 'HASH' },
                { AttributeName: 'createdAt', KeyType: 'RANGE' }
            ]
        }
    ],
    BillingMode: 'PAY_PER_REQUEST'
}
```

#### Schemes Table
```javascript
{
    TableName: 'agaa-schemes',
    KeySchema: [
        { AttributeName: 'schemeId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
        { AttributeName: 'schemeId', AttributeType: 'S' },
        { AttributeName: 'category', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: 'CategoryIndex',
            KeySchema: [
                { AttributeName: 'category', KeyType: 'HASH' }
            ]
        }
    ],
    BillingMode: 'PAY_PER_REQUEST'
}
```

#### Sessions Table
```javascript
{
    TableName: 'agaa-sessions',
    KeySchema: [
        { AttributeName: 'sessionId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
        { AttributeName: 'sessionId', AttributeType: 'S' }
    ],
    TimeToLiveSpecification: {
        Enabled: true,
        AttributeName: 'expiresAt'
    },
    BillingMode: 'PAY_PER_REQUEST'
}
```

**Cost:** Pay-per-request pricing  
**Estimated:** ~$2/month for prototype

---

### 6. Amazon S3
**Purpose:** Object storage for documents and PDFs

**Buckets:**

#### agaa-documents
```javascript
{
    Bucket: 'agaa-documents',
    ACL: 'private',
    CorsConfiguration: {
        CorsRules: [
            {
                AllowedOrigins: ['https://your-amplify-domain.amplifyapp.com'],
                AllowedMethods: ['GET', 'PUT', 'POST'],
                AllowedHeaders: ['*'],
                MaxAgeSeconds: 3000
            }
        ]
    },
    LifecycleConfiguration: {
        Rules: [
            {
                Id: 'DeleteOldDocuments',
                Status: 'Enabled',
                ExpirationInDays: 90
            }
        ]
    }
}
```

**Folder Structure:**
```
agaa-documents/
├── documents/
│   ├── {applicationId}/
│   │   ├── income-certificate/
│   │   ├── aadhaar/
│   │   └── education-certificate/
└── pdfs/
    └── {applicationId}/
        └── application.pdf
```

**Cost:** $0.023 per GB stored + $0.09 per GB transferred  
**Estimated:** ~$1/month for prototype

---

### 7. Amazon CloudWatch
**Purpose:** Logging and monitoring

**Features:**
- Lambda function logs
- API Gateway access logs
- Custom metrics
- Alarms for errors

**Cost:** $0.50 per GB ingested  
**Estimated:** ~$1/month for prototype

---

## Data Flow

### User Journey Flow

```
1. User opens website
   └─> Amplify serves React app

2. User enters information
   └─> Frontend calls API Gateway
       └─> API Gateway triggers IntentAnalyzer Lambda
           └─> Lambda calls Bedrock API
               └─> Bedrock analyzes intent
           └─> Lambda queries DynamoDB for schemes
       └─> Returns scheme recommendations

3. User selects scheme
   └─> Frontend calls API Gateway
       └─> API Gateway triggers FormFiller Lambda
           └─> Lambda calls Bedrock API
               └─> Bedrock auto-fills form
           └─> Lambda saves to DynamoDB
       └─> Returns filled form

4. User uploads documents
   └─> Frontend calls API Gateway
       └─> API Gateway triggers DocumentHandler Lambda
           └─> Lambda validates file
           └─> Lambda uploads to S3
           └─> Lambda saves reference in DynamoDB
       └─> Returns document URL

5. User submits application
   └─> Frontend calls API Gateway
       └─> API Gateway triggers PDFGenerator Lambda
           └─> Lambda retrieves data from DynamoDB
           └─> Lambda generates PDF
           └─> Lambda uploads PDF to S3
           └─> Lambda updates DynamoDB
       └─> Returns confirmation number and PDF URL
```

---

## Deployment Steps

### Step 1: Set Up AWS Account
```bash
# Install AWS CLI
brew install awscli  # macOS
# or
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS credentials
aws configure
```

### Step 2: Deploy DynamoDB Tables
```bash
# Create tables using AWS CLI
aws dynamodb create-table --cli-input-json file://dynamodb-applications.json
aws dynamodb create-table --cli-input-json file://dynamodb-schemes.json
aws dynamodb create-table --cli-input-json file://dynamodb-sessions.json

# Seed schemes data
aws dynamodb batch-write-item --request-items file://seed-schemes.json
```

### Step 3: Create S3 Bucket
```bash
# Create bucket
aws s3 mb s3://agaa-documents --region us-east-1

# Set CORS policy
aws s3api put-bucket-cors --bucket agaa-documents --cors-configuration file://s3-cors.json

# Set lifecycle policy
aws s3api put-bucket-lifecycle-configuration --bucket agaa-documents --lifecycle-configuration file://s3-lifecycle.json
```

### Step 4: Deploy Lambda Functions
```bash
# Package Lambda functions
cd lambda/intent-analyzer
npm install
zip -r function.zip .

# Deploy using AWS CLI
aws lambda create-function \
    --function-name agaa-intent-analyzer \
    --runtime nodejs18.x \
    --role arn:aws:iam::ACCOUNT_ID:role/lambda-execution-role \
    --handler index.handler \
    --zip-file fileb://function.zip \
    --timeout 30 \
    --memory-size 512

# Repeat for other Lambda functions
```

### Step 5: Set Up API Gateway
```bash
# Create REST API
aws apigateway create-rest-api --name agaa-api

# Create resources and methods
# (Use AWS Console or CloudFormation for easier setup)
```

### Step 6: Deploy Frontend to Amplify
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

### Step 7: Enable Bedrock Access
```bash
# Request model access in AWS Console
# Go to: Bedrock > Model access > Request access
# Select: Claude 3 Haiku

# Grant Lambda permissions
aws iam attach-role-policy \
    --role-name lambda-execution-role \
    --policy-arn arn:aws:iam::aws:policy/AmazonBedrockFullAccess
```

---

## Environment Variables

### Lambda Functions
```javascript
// Set in Lambda configuration
{
    "DYNAMODB_APPLICATIONS_TABLE": "agaa-applications",
    "DYNAMODB_SCHEMES_TABLE": "agaa-schemes",
    "DYNAMODB_SESSIONS_TABLE": "agaa-sessions",
    "S3_BUCKET": "agaa-documents",
    "BEDROCK_MODEL_ID": "anthropic.claude-3-haiku-20240307-v1:0",
    "BEDROCK_REGION": "us-east-1"
}
```

### Amplify Frontend
```javascript
// amplify/backend/amplify-meta.json
{
    "API_ENDPOINT": "https://your-api-id.execute-api.us-east-1.amazonaws.com/prod",
    "API_KEY": "your-api-key",
    "REGION": "us-east-1"
}
```

---

## Cost Breakdown (Monthly)

| Service | Usage | Cost |
|---------|-------|------|
| AWS Amplify | 5 GB transfer, 10 builds | $5 |
| API Gateway | 10,000 requests | $0.04 |
| Lambda | 10,000 invocations, 512MB, 5s avg | $2 |
| Bedrock (Claude 3 Haiku) | 100 forms, ~500 tokens each | $3 |
| DynamoDB | 10,000 reads, 5,000 writes | $2 |
| S3 | 1 GB storage, 5 GB transfer | $1 |
| CloudWatch | 1 GB logs | $1 |
| **Total** | | **~$14-15/month** |

**Note:** Costs may vary based on actual usage. AWS Free Tier covers some services for the first 12 months.

---

## Security Considerations

### 1. API Security
- Use API Keys for authentication
- Enable CORS only for Amplify domain
- Implement rate limiting (100 req/sec)

### 2. Data Security
- S3 bucket is private (no public access)
- DynamoDB encryption at rest enabled
- Lambda environment variables encrypted

### 3. IAM Roles
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:Query",
                "dynamodb:Scan"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/agaa-*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::agaa-documents/*"
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

---

## Monitoring & Debugging

### CloudWatch Dashboards
Create a dashboard to monitor:
- Lambda invocation count
- Lambda error rate
- API Gateway 4xx/5xx errors
- Bedrock API latency
- DynamoDB throttles

### Alarms
Set up alarms for:
- Lambda errors > 5 in 5 minutes
- API Gateway 5xx errors > 10 in 5 minutes
- Bedrock API failures

### Logging
```javascript
// In Lambda functions
console.log('Processing request:', JSON.stringify(event));
console.error('Error occurred:', error);

// View logs
aws logs tail /aws/lambda/agaa-intent-analyzer --follow
```

---

## Limitations & Trade-offs

### Prototype Limitations
1. **No authentication** - Uses simple API keys
2. **No caching** - Every request hits Bedrock
3. **No offline mode** - Requires internet connection
4. **Limited error handling** - Basic error messages
5. **No status tracking** - Can't track application status
6. **Single region** - Deployed in us-east-1 only

### Production Upgrades Needed
1. Add Cognito for user authentication
2. Add ElastiCache for caching
3. Add CloudFront for global CDN
4. Add RDS for relational data
5. Add Step Functions for workflows
6. Add SQS for async processing
7. Multi-region deployment

---

## Testing

### Local Testing
```bash
# Test Lambda functions locally
sam local invoke IntentAnalyzer --event test-event.json

# Test API Gateway locally
sam local start-api
```

### Integration Testing
```bash
# Test API endpoints
curl -X POST https://your-api.execute-api.us-east-1.amazonaws.com/prod/api/analyze-intent \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{"userInput": "I need scholarship for engineering", "language": "en"}'
```

---

## Quick Start Commands

```bash
# 1. Clone repository
git clone https://github.com/your-repo/agaa-prototype.git
cd agaa-prototype

# 2. Deploy backend
cd infrastructure
./deploy-backend.sh

# 3. Deploy frontend
cd ../frontend
npm install
amplify publish

# 4. Test
curl https://your-amplify-domain.amplifyapp.com
```

---

## Support & Resources

- **AWS Amplify Docs:** https://docs.amplify.aws/
- **AWS Lambda Docs:** https://docs.aws.amazon.com/lambda/
- **Amazon Bedrock Docs:** https://docs.aws.amazon.com/bedrock/
- **DynamoDB Docs:** https://docs.aws.amazon.com/dynamodb/

---

**This architecture is optimized for hackathon demonstration and can handle 100-500 users comfortably at minimal cost.**


---

## 🆕 Implementation Updates (March 9, 2026)

### Actual Deployed System
The prototype has been enhanced with additional features:

**Lambda Functions (4 total):**
1. **process-user-input** - AI processing with Tamil keyword support (உழவர்)
2. **generate-form** - Form generation with service-specific fields
3. **submit-application** - PDF generation and submission
4. **validate-field** - Real-time intelligent validation (NEW)

**API Endpoints (4 total):**
- POST /process-user-input
- POST /generate-form
- POST /submit-application
- POST /validate-field (NEW - with CORS support)

**Key Features:**
- ✅ Tamil keyword "உழவர்" (Uzhavar) for farmer detection
- ✅ Intelligent validation with AWS Bedrock
- ✅ CORS-enabled APIs for seamless validation
- ✅ Service-specific forms (education vs farmer)
- ✅ Multi-language support (English, Hindi, Tamil)

**Metrics:**
- Total Code: ~2,600 lines
- Lambda Functions: 4
- API Endpoints: 4
- Supported Languages: 3

**Live Demo:** http://agaa-frontend-1772860549.s3-website-us-east-1.amazonaws.com

**Last Updated:** March 9, 2026
