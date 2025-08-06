import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    // Initialize Resend client inside the function to avoid build-time errors
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const body = await request.json()
    const { email } = signupSchema.parse(body)

    // Check if email already exists
    const existingSignup = await prisma.signup.findUnique({
      where: { email }
    })

    if (existingSignup) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Save to database
    const signup = await prisma.signup.create({
      data: {
        email,
        createdAt: new Date(),
      }
    })

    // Send confirmation email to user
    const fromEmail = process.env.NODE_ENV === 'production' 
      ? 'Cloux Team <hello@cloux.co>' 
      : 'Cloux Team <onboarding@resend.dev>'
    
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Cloux - Registration Confirmed',
      headers: {
        'X-Entity-Ref-ID': signup.id.toString(),
        'List-Unsubscribe': '<mailto:unsubscribe@cloux.co>',
      },
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2C5282; font-size: 28px; margin: 0;">Cloux</h1>
            <p style="color: #718096; font-size: 14px; margin: 5px 0 0 0;">AI-Powered Credentialing Platform</p>
          </div>
          
          <h2 style="color: #1A202C; font-size: 22px; margin-bottom: 20px;">Registration Confirmed</h2>
          
          <p style="color: #4A5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hello,
          </p>
          
          <p style="color: #4A5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for registering with Cloux. We have successfully received your information and added you to our platform updates.
          </p>
          
          <div style="background-color: #F7FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #2C5282; margin: 0 0 15px 0; font-size: 18px;">Next Steps</h3>
            <ul style="color: #4A5568; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>We will review your registration within 24 hours</li>
              <li>Our team will contact you to discuss your requirements</li>
              <li>You will receive priority consideration for our program</li>
            </ul>
          </div>
          
          <p style="color: #4A5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            If you have any questions, please reply to this email or contact our support team.
          </p>
          
          <p style="color: #4A5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Best regards,<br>
            The Cloux Team
          </p>
          
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
            <p style="color: #A0AEC0; font-size: 12px; margin: 0;">
              Cloux, Inc. | AI-Powered Credentialing Solutions
            </p>
            <p style="color: #A0AEC0; font-size: 12px; margin: 5px 0 0 0;">
              This email was sent to ${email} because you registered on our platform.
            </p>
          </div>
        </div>
      `,
    })

    // Send notification email to admin
    if (process.env.ADMIN_EMAIL) {
      const fromEmail = process.env.NODE_ENV === 'production' 
        ? 'Cloux Notifications <notifications@cloux.co>' 
        : 'Cloux Notifications <onboarding@resend.dev>'
      
      await resend.emails.send({
        from: fromEmail,
        to: process.env.ADMIN_EMAIL,
        subject: 'New Pilot Program Signup - Cloux',
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1A202C;">New Pilot Program Signup</h2>
            <p style="color: #4A5568; font-size: 16px;">
              <strong>Email:</strong> ${email}<br>
              <strong>Signed up:</strong> ${new Date().toLocaleString()}<br>
              <strong>ID:</strong> ${signup.id}
            </p>
            
            <div style="background-color: #F0FBF4; border: 1px solid #2F855A; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="color: #2F855A; font-weight: 600; margin: 0;">
                🎉 Follow up with this lead within 24 hours!
              </p>
            </div>
          </div>
        `,
      })
    }

    // Get total count for admin notification
    const totalSignups = await prisma.signup.count()

    return NextResponse.json({ 
      message: 'Signup successful',
      totalSignups 
    })

  } catch (error) {
    console.error('Signup error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}