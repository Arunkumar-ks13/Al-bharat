# AWS CLI Setup Guide for macOS

Since you already have an AWS account, follow these steps to install and configure AWS CLI.

## Step 1: Install AWS CLI

### Option A: Using Official Installer (Recommended - No Homebrew needed)

Open your Terminal and run these commands:

```bash
# Download the installer
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"

# Install it
sudo installer -pkg AWSCLIV2.pkg -target /

# Verify installation
aws --version
```

You should see output like: `aws-cli/2.x.x Python/3.x.x Darwin/xx.x.x`

### Option B: Using Homebrew (If you want to install Homebrew)

```bash
# Install Homebrew first
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install AWS CLI
brew install awscli

# Verify installation
aws --version
```

---

## Step 2: Get Your AWS Access Keys

You need to create access keys from your AWS account:

### 2.1: Log into AWS Console

1. Go to: https://console.aws.amazon.com/
2. Sign in with your AWS account credentials

### 2.2: Create IAM User (If you don't have one)

1. In the AWS Console, search for **"IAM"** in the top search bar
2. Click on **"Users"** in the left sidebar
3. Click **"Create user"** button

### 2.3: Configure User

1. **User name:** Enter `agaa-deployer` (or any name you prefer)
2. Check **"Provide user access to the AWS Management Console"** (optional)
3. Click **"Next"**

### 2.4: Set Permissions

1. Select **"Attach policies directly"**
2. Search and check these policies:
   - `AdministratorAccess` (easiest for hackathon)
   - OR for more security, select:
     - `AWSLambdaFullAccess`
     - `AmazonDynamoDBFullAccess`
     - `AmazonS3FullAccess`
     - `AmazonAPIGatewayAdministrator`
     - `CloudWatchFullAccess`
     - `AmazonBedrockFullAccess`
3. Click **"Next"**
4. Click **"Create user"**

### 2.5: Create Access Keys

1. Click on the user you just created
2. Go to **"Security credentials"** tab
3. Scroll down to **"Access keys"** section
4. Click **"Create access key"**
5. Select **"Command Line Interface (CLI)"**
6. Check the confirmation box
7. Click **"Create access key"**

### 2.6: Save Your Keys

**IMPORTANT:** You'll see two keys:
- **Access Key ID** (looks like: `AKIAIOSFODNN7EXAMPLE`)
- **Secret Access Key** (looks like: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`)

**⚠️ CRITICAL:** Save these keys NOW! You won't be able to see the Secret Access Key again.

Options to save:
- Click **"Download .csv file"** (recommended)
- Copy both keys to a secure note

---

## Step 3: Configure AWS CLI

Once AWS CLI is installed and you have your access keys:

```bash
# Run AWS configure
aws configure
```

You'll be prompted for 4 things:

```
AWS Access Key ID [None]: PASTE_YOUR_ACCESS_KEY_ID_HERE
AWS Secret Access Key [None]: PASTE_YOUR_SECRET_ACCESS_KEY_HERE
Default region name [None]: us-east-1
Default output format [None]: json
```

**Example:**
```
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-east-1
Default output format [None]: json
```

---

## Step 4: Verify Configuration

Test that everything is working:

```bash
# This should show your AWS account information
aws sts get-caller-identity
```

**Expected output:**
```json
{
    "UserId": "AIDAXXXXXXXXXXXXXXXXX",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/agaa-deployer"
}
```

If you see this, you're all set! ✅

---

## Step 5: Enable Amazon Bedrock Access

Before running the deployment, you need to enable Bedrock:

### 5.1: Go to Bedrock Console

1. Open: https://console.aws.amazon.com/bedrock/
2. Make sure you're in **us-east-1** region (check top-right corner)

### 5.2: Request Model Access

1. Click **"Model access"** in the left sidebar
2. Click **"Manage model access"** (orange button)
3. Find **"Anthropic"** section
4. Check the box for **"Claude 3 Haiku"**
5. Scroll down and click **"Request model access"**
6. Wait for approval (usually instant - status changes to "Access granted")

---

## Step 6: Run the Deployment Script

Now you're ready to deploy!

```bash
# Navigate to your project
cd "/Users/ak/Desktop/AI for Bharat Hackathon"

# Run the deployment script
./.kiro/specs/agaa-system/deployment/quick-deploy.sh
```

The script will:
- ✅ Create DynamoDB tables
- ✅ Create S3 bucket
- ✅ Set up IAM roles
- ✅ Verify Bedrock access

---

## Troubleshooting

### Issue: "aws: command not found"
**Solution:** AWS CLI is not installed. Go back to Step 1.

### Issue: "Unable to locate credentials"
**Solution:** AWS CLI is not configured. Go back to Step 3.

### Issue: "Access Denied" errors
**Solution:** Your IAM user doesn't have the right permissions. Go back to Step 2.4 and add `AdministratorAccess` policy.

### Issue: "Bedrock access denied"
**Solution:** You haven't requested Bedrock model access. Go back to Step 5.

### Issue: "Region not found"
**Solution:** Make sure you're using `us-east-1` as the region.

---

## Quick Reference Commands

```bash
# Check AWS CLI version
aws --version

# Check AWS configuration
aws configure list

# Check your AWS identity
aws sts get-caller-identity

# List your S3 buckets
aws s3 ls

# List DynamoDB tables
aws dynamodb list-tables --region us-east-1

# Check Bedrock models
aws bedrock list-foundation-models --region us-east-1
```

---

## Security Best Practices

1. **Never share your access keys** with anyone
2. **Never commit keys to Git** (they're in `~/.aws/credentials`)
3. **Use IAM roles** in production instead of access keys
4. **Enable MFA** on your AWS account
5. **Rotate keys regularly** (every 90 days)
6. **Delete unused keys** from IAM console

---

## What's Next?

After completing these steps:

1. ✅ AWS CLI installed
2. ✅ AWS credentials configured
3. ✅ Bedrock access enabled
4. ✅ Deployment script ready

You can now run the deployment script and start building your AGAA prototype!

---

## Need Help?

If you get stuck:
- Check the error message carefully
- Review the troubleshooting section above
- Check AWS Service Health: https://status.aws.amazon.com/
- AWS Documentation: https://docs.aws.amazon.com/cli/

**Good luck! 🚀**
