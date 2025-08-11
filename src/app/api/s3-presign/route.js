// // pages/api/s3-presign.js
// import aws from 'aws-sdk'

// const s3 = new aws.S3({
//   region: process.env.AWS_REGION,
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   signatureVersion: 'v4',
// })

// export default async function handler(req, res) {
//   if (req.method !== 'POST') return res.status(405).end()

//   const { fileName, fileType } = req.body
//   const key = `uploads/${Date.now()}-${fileName}`

//   const url = await s3.getSignedUrlPromise('putObject', {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: key,
//     Expires: 60, // URL valid for 60 seconds
//     ContentType: fileType,
//     ACL: 'public-read',
//   })

//   const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

//   res.status(200).json({ uploadUrl: url, publicUrl })
// }
