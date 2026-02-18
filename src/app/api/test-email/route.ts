import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY not configured' },
      { status: 500 }
    )
  }

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@localhost.com',
      to: 'test@example.com',
      subject: 'EventFlow Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">EventFlow Test Email</h2>
          <p>This is a test email from your EventFlow application!</p>
          <p><strong>Configuration Status:</strong></p>
          <ul>
            <li>✅ Resend API Key: Configured</li>
            <li>✅ From Email: ${process.env.RESEND_FROM_EMAIL}</li>
            <li>✅ Email Service: Active</li>
          </ul>
          <p>Your email notifications are working correctly! 🎉</p>
        </div>
      `
    })

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      result
    })
  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json(
      { error: 'Failed to send test email', details: error },
      { status: 500 }
    )
  }
}