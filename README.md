# Rock My Auction

A modern auction platform built with Next.js, featuring AI-powered image analysis and direct S3 uploads.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Environment Setup

1. Copy the `.env.local.example` file to `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Update the `.env.local` file with your credentials:
   - Add your OpenAI API key for image analysis
   - Add your AWS credentials and S3 bucket information
   - Configure the API base URL

### AWS S3 Setup

To use the direct S3 upload feature:

1. Create an S3 bucket in your AWS account
2. Configure CORS for your bucket to allow direct uploads:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET"],
    "AllowedOrigins": ["http://localhost:3000", "https://your-production-domain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

3. Create an IAM user with appropriate S3 permissions
4. Add the credentials to your `.env.local` file

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Features

### AI-Powered Image Analysis

The application uses OpenAI's Vision API to analyze auction item images and automatically generate:

- Item titles
- Descriptions
- Category suggestions
- Estimated value
- Condition assessment
- Key features
- Suggested starting bid

### Direct S3 Upload

The application implements two methods for client-side direct uploads to S3:

1. **Pre-signed URL Method** - Secure, backend-generated upload URLs
2. **Direct PUT Method** - Simple, frontend-only implementation (demo available)

Both methods offer significant advantages:

- Reduced server load - files go directly from browser to S3
- Improved scalability - handles large files without server constraints
- Better performance - parallel uploads directly to AWS infrastructure
- Reduced bandwidth costs - no proxy through your server

### How It Works

#### Pre-signed URL Method (Main Implementation)

1. Frontend requests a pre-signed URL from the backend
2. Backend generates a time-limited URL with permission to upload
3. Frontend uploads directly to S3 using the pre-signed URL
4. After successful upload, the image URL is sent to the AI analysis service

#### Direct PUT Method (Demo Implementation)

1. Frontend constructs the S3 URL using bucket name and region
2. Frontend sends a PUT request directly to S3 with the file
3. S3 bucket must have appropriate CORS and public write permissions

View the demo at `/demo/s3-upload` to see the direct PUT method in action.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Adding Application Images 
<img width="1920" height="4035" alt="screencapture-rock-my-auction-vercel-app-2025-09-09-16_03_00" src="https://github.com/user-attachments/assets/d693a46d-a32b-4a80-973b-2b29dc2373f5" />
<img width="1920" height="3556" alt="screencapture-rock-my-auction-vercel-app-auctions-2025-09-09-16_03_25" src="https://github.com/user-attachments/assets/f9b0d13e-eec2-4429-a903-24e31ce7479c" />
<img width="1920" height="2447" alt="screencapture-rock-my-auction-vercel-app-auctions-68b7cb759ff4ec8e5849b04d-2025-09-09-16_09_49" src="https://github.com/user-attachments/assets/36ffe56f-0af3-4973-8ec3-dceeaa2ed787" />
<img width="1920" height="1580" alt="screencapture-rock-my-auction-vercel-app-dashboard-2025-09-09-16_06_16" src="https://github.com/user-attachments/assets/e292f74e-14c0-4f54-8870-940e53d3077f" />
<img width="1920" height="1127" alt="screencapture-rock-my-auction-vercel-app-admin-2025-09-09-16_06_32" src="https://github.com/user-attachments/assets/cddb7853-78d6-4dbd-b547-7c43be05b30f" />
<img width="1920" height="1580" alt="screencapture-rock-my-auction-vercel-app-dashboard-2025-09-09-16_03_47" src="https://github.com/user-attachments/assets/50dfa807-ac4a-4ab4-967b-8653034f6814" />
<img width="1920" height="5087" alt="screencapture-rock-my-auction-vercel-app-about-2025-09-09-16_04_04" src="https://github.com/user-attachments/assets/51e51e8a-70d3-459f-a580-c7985cf7a639" />
<img width="1920" height="3730" alt="screencapture-rock-my-auction-vercel-app-help-center-2025-09-09-16_04_34" src="https://github.com/user-attachments/assets/cacf57f7-41d3-4fd7-81f5-a512a30bb2a1" />
<img width="1920" height="2202" alt="screencapture-rock-my-auction-vercel-app-seller-new-auction-2025-09-09-16_05_46" src="https://github.com/user-attachments/assets/e398b226-67a5-4213-96ae-2574a0f03d05" />
