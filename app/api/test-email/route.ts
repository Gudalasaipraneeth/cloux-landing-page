import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    // Initialize Resend client inside the function to avoid build-time errors
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    // Get email from request body, fallback to your email
    const body = await request.json().catch(() => ({}));
    const { email } = body;
    const testEmail = email || 'saigudala188@gmail.com';

    console.log('🧪 Testing email send to:', testEmail);

    const { data, error } = await resend.emails.send({
      from: 'Cloux Test <hello@cloux.co>',
      to: testEmail,
      subject: '🎉 Domain Verification Test - Cloux',
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1A202C;">🎉 Success! Your domain is working!</h2>
          <p style="color: #4A5568; font-size: 16px;">
            This email was sent from your custom domain <strong>cloux.co</strong>
          </p>
          <p style="color: #4A5568; font-size: 16px;">
            <strong>Sent to:</strong> ${testEmail}
          </p>
          <div style="background-color: #F0FBF4; border: 1px solid #2F855A; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="color: #2F855A; font-weight: 600; margin: 0;">
              ✅ Your email system is ready for production!
            </p>
          </div>
          <p style="color: #666; font-size: 14px;">
            Sent at: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('❌ Email error:', error);
      return NextResponse.json({ error }, { status: 400 })
    }

    console.log('✅ Email sent successfully:', data);
    return NextResponse.json({ 
      success: true,
      message: `Test email sent to ${testEmail}!`, 
      emailId: data?.id || 'unknown',
      sentTo: testEmail
    })

  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    )
  }
}
