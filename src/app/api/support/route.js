import { NextResponse } from 'next/server';
import { SupportRequest } from '@/lib/models/SupportRequest';
import mongoose from 'mongoose';

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const body = await req.json();

    const support = new SupportRequest({
      topic: body.topic,
      email: body.email,
      subject: body.subject,
      description: body.description,
    });

    await support.save();

    return NextResponse.json({ message: 'Support request submitted successfully' });
  } catch (error) {
    console.error('Error submitting support request:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
