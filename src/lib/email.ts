import { Resend } from "resend"

let resend: Resend | null = null

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is required")
  }
  
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  
  return resend
}

interface BookingEmailData {
  eventTitle: string
  organizerName: string
  participantName: string
  participantEmail: string
  eventDate: string
  eventTime: string
  eventDescription?: string
}

export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  const {
    eventTitle,
    organizerName,
    participantName,
    participantEmail,
    eventDate,
    eventTime,
    eventDescription,
  } = data

  try {
    const resendClient = getResendClient()
    const { data: emailResult, error } = await resendClient.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "EventFlow <noreply@eventflow.com>",
      to: [participantEmail],
      subject: `Booking Confirmed: ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0ea5e9; margin: 0;">EventFlow</h1>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #10b981; margin-top: 0;">✓ Booking Confirmed</h2>
            <p>Hi ${participantName},</p>
            <p>Your booking for <strong>${eventTitle}</strong> has been confirmed!</p>
          </div>

          <div style="background-color: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #374151;">Event Details</h3>
            <p><strong>Event:</strong> ${eventTitle}</p>
            <p><strong>Organizer:</strong> ${organizerName}</p>
            <p><strong>Date:</strong> ${eventDate}</p>
            <p><strong>Time:</strong> ${eventTime}</p>
            ${eventDescription ? `<p><strong>Description:</strong> ${eventDescription}</p>` : ''}
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              If you need to make any changes or have questions, please contact ${organizerName} directly.
            </p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p>This email was sent by EventFlow. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Failed to send booking confirmation email:", error)
      throw error
    }

    console.log("Booking confirmation email sent:", emailResult)
    return emailResult
  } catch (error) {
    console.error("Error sending booking confirmation email:", error)
    throw error
  }
}

interface OrganizerNotificationData {
  eventTitle: string
  organizerName: string
  organizerEmail: string
  participantName: string
  participantEmail: string
  eventDate: string
  eventTime: string
}

export async function sendOrganizerNotificationEmail(data: OrganizerNotificationData) {
  const {
    eventTitle,
    organizerName,
    organizerEmail,
    participantName,
    participantEmail,
    eventDate,
    eventTime,
  } = data

  try {
    const resendClient = getResendClient()
    const { data: emailResult, error } = await resendClient.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "EventFlow <noreply@eventflow.com>",
      to: [organizerEmail],
      subject: `New Booking: ${participantName} booked ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0ea5e9; margin: 0;">EventFlow</h1>
          </div>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #0ea5e9; margin-top: 0;">📅 New Booking</h2>
            <p>Hi ${organizerName},</p>
            <p>Great news! Someone has booked your event <strong>${eventTitle}</strong>.</p>
          </div>

          <div style="background-color: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #374151;">Booking Details</h3>
            <p><strong>Event:</strong> ${eventTitle}</p>
            <p><strong>Participant:</strong> ${participantName}</p>
            <p><strong>Email:</strong> ${participantEmail}</p>
            <p><strong>Date:</strong> ${eventDate}</p>
            <p><strong>Time:</strong> ${eventTime}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              You can view all your bookings in your EventFlow dashboard.
            </p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p>This email was sent by EventFlow. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Failed to send organizer notification email:", error)
      throw error
    }

    console.log("Organizer notification email sent:", emailResult)
    return emailResult
  } catch (error) {
    console.error("Error sending organizer notification email:", error)
    throw error
  }
}