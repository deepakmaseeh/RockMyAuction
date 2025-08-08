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
