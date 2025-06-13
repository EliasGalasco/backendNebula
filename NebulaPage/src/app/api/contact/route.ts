import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // No authentication required for contact form

    const formData = await req.json();
    const { name, email, message } = formData;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Basic email format validation (optional but recommended)
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    // }

    // TODO: Implement actual processing (e.g., sending email, saving to DB)
    console.log('Received contact form submission:', { name, email, message });

    // Example of potential basic spam protection:
    // You could add a honeypot field in the form and check it here,
    // or integrate with a service like reCAPTCHA.
    // if (formData.honeypotField) {
    //   console.warn('Honeypot field detected - likely spam');
    //   return NextResponse.json({ message: 'Thank you for your message!' }, { status: 200 }); // Still send a success response to not alert spambots
    // }

    // In a real application, you would:
    // 1. Sanitize input data.
    // 2. Send an email using a service (e.g., Nodemailer, SendGrid, Mailgun).
    // 3. Optionally save the message to a database.

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ message: 'Thank you for your message!' }, { status: 200 });

  } catch (error) {
    console.error('Error processing contact form submission:', error);
    return NextResponse.json({ error: 'Failed to submit form.' }, { status: 500 });
  }
}