# AGAA Deployment Guide

This folder contains everything you need to deploy the AGAA prototype to AWS.

## Quick Start (Recommended)

If you want to get started quickly:

```bash
# 1. Make the script executable
chmod +x quick-deploy.sh

# 2. Run the quick deployment script
./quick-deploy.sh
```

This will automatically set up:
- ✅ DynamoDB tables
- ✅ S3 bucket
- ✅ IAM roles and permissions
- ✅ Verify Bedrock access

**Time required:** ~5 minutes

---

## Full Deployment (Step-by-Step)

For complete control and understanding, follow the detailed guide:

📖 **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

This comprehensive guide covers:
- Phase 1: AWS Account Setup
- Phase 2: Enable Amazon Bedrock
- Phase 3: Deploy Backend Infrastructure
- Phase 4: Deploy Lambda Functions
- Phase 5: Deploy API Gateway
- Phase 6: Deploy Frontend to Amplify
- Phase 7: Verification and Testing
- Phase 8: Cost Monitoring

**Time required:** ~2-3 hours (first time)

---

## Prerequisites

Before you start, make sure you have:

- [ ] AWS Account (with credit card)
- [ ] AWS CLI installed (`aws --version`)
- [ ] AWS CLI configured (`aws configure`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Git installed (`git --version`)

### Install AWS CLI

**macOS:**
```bash
brew install awscli
```

**Windows:**
Download from: https://awscli.amazonaws.com/AWSCLIV2.msi

**Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### Configure AWS CLI

```bash
aws configure
# AWS Access Key ID: [your key]
# AWS Secret Access Key: [your secret]
# Default region name: us-east-1
# Default output format: json
```

---

## Deployment Options

### Option 1: Quick Deploy (Automated)
- **Best for:** Hackathon, quick demo
- **Time:** 5 minutes
- **Complexity:** Low
- **Script:** `quick-deploy.sh`

### Option 2: Manual Deploy (Step-by-Step)
- **Best for:** Learning, production setup
- **Time:** 2-3 hours
- **Complexity:** Medium
- **Guide:** `DEPLOYMENT_GUIDE.md`

### Option 3: Infrastructure as Code (Advanced)
- **Best for:** Production, team collaboration
- **Time:** 1 hour (after setup)
- **Complexity:** High
- **Tools:** AWS CDK or Terraform (not included yet)

---

## What Gets Deployed

### Backend Infrastructure
```
AWS Services:
├── DynamoDB (3 tables)
│   ├── agaa-applications
│   ├── agaa-schemes
│   └── agaa-sessions
├── S3 (1 bucket)
│   └── agaa-documents-*
├── Lambda (4 functions)
│   ├── intent-analyzer
│   ├── form-filler
│   ├── document-handler
│   └── pdf-generator
├── API Gateway (REST API)
│   └── /api/analyze-intent
├── IAM (1 role)
│   └── agaa-lambda-execution-role
└── CloudWatch (logs)
```

### Frontend
```
AWS Amplify:
├── React Application
├── CDN (CloudFront)
├── SSL Certificate
└── Custom Domain (optional)
```

---

## Cost Estimate

### Prototype/Hackathon
- **Monthly:** $15-25
- **Per demo:** ~$0.50

### Breakdown:
| Service | Cost |
|---------|------|
| AWS Amplify | $5 |
| Lambda | $2 |
| Bedrock (Claude 3 Haiku) | $3 |
| DynamoDB | $2 |
| S3 | $1 |
| API Gateway | $0.50 |
| CloudWatch | $1 |
| **Total** | **~$15/month** |

**Note:** AWS Free Tier covers some services for first 12 months.

---

## Deployment Checklist

### Before Deployment
- [ ] AWS account created
- [ ] AWS CLI installed and configured
- [ ] Bedrock access requested (Claude 3 Haiku)
- [ ] Billing alerts set up ($20 budget)

### During Deployment
- [ ] DynamoDB tables created
- [ ] S3 bucket created
- [ ] IAM roles configured
- [ ] Lambda functions deployed
- [ ] API Gateway configured
- [ ] Frontend deployed to Amplify

### After Deployment
- [ ] Test API endpoints
- [ ] Test frontend application
- [ ] Verify Bedrock integration
- [ ] Check CloudWatch logs
- [ ] Monitor costs

---

## Testing Your Deployment

### 1. Test DynamoDB
```bash
aws dynamodb list-tables --region us-east-1
```

### 2. Test S3
```bash
aws s3 ls
```

### 3. Test Lambda
```bash
aws lambda list-functions --region us-east-1
```

### 4. Test API Gateway
```bash
curl -X POST \
  "https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod/api/analyze-intent" \
  -H "Content-Type: application/json" \
  -d '{"userInput": "I need scholarship", "language": "en"}'
```

### 5. Test Frontend
Open your Amplify URL in browser and test the full flow.

---

## Troubleshooting

### Common Issues

**Issue: AWS CLI not configured**
```bash
aws configure
```

**Issue: Bedrock access denied**
- Go to AWS Console → Bedrock → Model access
- Request access to Claude 3 Haiku
- Wait for approval (usually instant)

**Issue: Lambda timeout**
```bash
aws lambda update-function-configuration \
  --function-name agaa-intent-analyzer \
  --timeout 60
```

**Issue: CORS errors**
- Verify CORS is enabled in API Gateway
- Check OPTIONS method is configured

**Issue: DynamoDB access denied**
- Check IAM role has correct permissions
- Verify table names match exactly

---

## Monitoring

### View Lambda Logs
```bash
aws logs tail /aws/lambda/agaa-intent-analyzer --follow
```

### View API Gateway Logs
```bash
aws logs tail /aws/apigateway/agaa-api --follow
```

### Check Costs
```bash
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

---

## Cleanup (Delete Everything)

When you're done with the prototype:

```bash
# Delete Amplify app
amplify delete

# Delete API Gateway
aws apigateway delete-rest-api --rest-api-id YOUR_API_ID

# Delete Lambda functions
aws lambda delete-function --function-name agaa-intent-analyzer

# Delete DynamoDB tables
aws dynamodb delete-table --table-name agaa-applications
aws dynamodb delete-table --table-name agaa-schemes
aws dynamodb delete-table --table-name agaa-sessions

# Delete S3 bucket (must be empty first)
aws s3 rm s3://YOUR_BUCKET_NAME --recursive
aws s3 rb s3://YOUR_BUCKET_NAME

# Delete IAM role
aws iam delete-role-policy --role-name agaa-lambda-execution-role --policy-name agaa-lambda-policy
aws iam delete-role --role-name agaa-lambda-execution-role
```

---

## Support Resources

### AWS Documentation
- **Amplify:** https://docs.amplify.aws/
- **Lambda:** https://docs.aws.amazon.com/lambda/
- **Bedrock:** https://docs.aws.amazon.com/bedrock/
- **DynamoDB:** https://docs.aws.amazon.com/dynamodb/
- **API Gateway:** https://docs.aws.amazon.com/apigateway/

### AWS Support
- **Free Tier:** https://aws.amazon.com/free/
- **Pricing Calculator:** https://calculator.aws/
- **Service Health:** https://status.aws.amazon.com/

### Community
- **AWS Forums:** https://forums.aws.amazon.com/
- **Stack Overflow:** Tag `amazon-web-services`
- **Reddit:** r/aws

---

## Next Steps After Deployment

1. **Test thoroughly** - Try all features
2. **Add more Lambda functions** - Form filler, document handler, PDF generator
3. **Implement error handling** - Better user experience
4. **Add monitoring** - CloudWatch dashboards
5. **Optimize costs** - Review usage patterns
6. **Prepare demo** - Practice your presentation
7. **Document learnings** - What worked, what didn't

---

## Files in This Folder

```
deployment/
├── README.md                 # This file
├── DEPLOYMENT_GUIDE.md       # Detailed step-by-step guide
└── quick-deploy.sh           # Automated deployment script
```

---

## Getting Help

If you encounter issues:

1. **Check the logs** - CloudWatch has detailed error messages
2. **Review IAM permissions** - Most issues are permission-related
3. **Verify region** - All services should be in us-east-1
4. **Check AWS Service Health** - Sometimes AWS has outages
5. **Ask for help** - AWS forums, Stack Overflow, or your team

---

**Ready to deploy? Start with `./quick-deploy.sh` or read `DEPLOYMENT_GUIDE.md`!**

Good luck! 🚀


---

## 🆕 System Updates (March 9, 2026)

### Current Deployment Status
- **Lambda Functions:** 4 (process-user-input, generate-form, submit-application, validate-field)
- **API Endpoints:** 4 (with CORS support)
- **Features:** Tamil keywords (உழவர்), intelligent validation, service-specific forms
- **Code:** ~2,600 lines
- **Status:** ✅ Production Ready

### Latest Features
1. **Tamil Keyword Support** - உழவர் (Uzhavar) for farmer detection
2. **Intelligent Validation** - Real-time AI-powered field validation
3. **CORS-Enabled APIs** - Seamless validation across browsers
4. **Service-Specific Forms** - Education vs Farmer field sets

**Live Demo:** http://agaa-frontend-1772860549.s3-website-us-east-1.amazonaws.com
