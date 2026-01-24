# EventFlow - Event Management MVP

A clean, scalable MVP for an event scheduling app inspired by Calendly's design and user experience.

## 🚀 Features

- **Clean Landing Page** - Professional, Calendly-inspired design
- **Role-Based Authentication** - Organizers and Participants with different dashboards
- **Event Creation** - Simple form to create events with date, time, and descriptions
- **Multi-Day Events** - Support for single-day and multi-day events (conferences, workshops)
- **Capacity Management** - Set maximum participant limits for events
- **Registration Deadlines** - Control when participants can register
- **Public Booking Pages** - Shareable links with real-time availability
- **Smart Booking Validation** - Prevents overbooking and late registrations
- **Email Notifications** - Automatic confirmations using Resend
- **Dashboard Management** - View events, capacity, and participant lists
- **Responsive Design** - Mobile-friendly interface

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Next-Auth v5
- **Styling**: Tailwind CSS
- **Email Service**: Resend
- **Validation**: Zod

## 📁 Project Structure

```
EventFlow/
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── (auth)/             # Authentication pages
│   │   │   ├── login/          # Sign in page
│   │   │   └── signup/         # Sign up page
│   │   ├── organizer/          # Organizer-only routes
│   │   │   ├── dashboard/      # Organizer dashboard
│   │   │   └── events/         # Event management
│   │   ├── book/               # Public booking pages
│   │   │   └── [eventId]/      # Event booking flow
│   │   └── api/                # API routes
│   │       ├── auth/           # Authentication endpoints
│   │       ├── events/         # Event CRUD operations
│   │       └── bookings/       # Booking management
│   ├── lib/                    # Utility functions
│   │   ├── prisma.ts           # Database client
│   │   └── email.ts            # Email utilities
│   ├── types/                  # Type definitions
│   └── middleware.ts           # Route protection
├── prisma/
│   └── schema.prisma           # Database schema
└── package.json                # Dependencies and scripts
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Resend account (for emails)

### 1. Environment Configuration

Copy `.env.example` to `.env.local` and configure:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/eventflow"

# Next Auth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Resend (Email Service)
RESEND_API_KEY="your-resend-api-key-here"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

### 2. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Optional: Open Prisma Studio
npx prisma studio
```

### 3. Development Server

```bash
# Start the development server
npm run dev

# Open http://localhost:3000
```

## 🎯 Core User Flows

### Organizer Flow

1. **Sign Up** - Create account with "Organizer" role
2. **Dashboard** - View all created events
3. **Create Event** - Set title, description, date, and time
4. **Share Link** - Get unique booking URL for participants
5. **Manage Bookings** - View participant list and details

### Participant Flow

1. **Booking Page** - Access via shared link
2. **Event Details** - View event information
3. **Book Event** - Enter name and email
4. **Confirmation** - Get confirmation with calendar download
5. **Email Notification** - Receive booking confirmation

## 📧 Email Integration

The app uses Resend for transactional emails:

- **Booking Confirmation** - Sent to participants
- **Organizer Notification** - Sent when new bookings are made
- **Calendar Integration** - ICS files for calendar apps

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import project from GitHub: `tahiryyvon/event-flow`

2. **Set Environment Variables** (Required!)
   ```bash
   # Generate secure secret
   npm run generate-secret
   ```
   Then add to Vercel:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Generated secret from above
   - `NEXTAUTH_URL` - Your Vercel app URL
   - `RESEND_API_KEY` - (optional) For emails

3. **Deploy**
   - Vercel deploys automatically on every push
   - First deployment takes 2-3 minutes

📚 **Detailed Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
NEXTAUTH_SECRET="your-32-char-secret-from-generate-script"
NEXTAUTH_URL="https://your-app.vercel.app"
RESEND_API_KEY="re_your-resend-key" # Optional
RESEND_FROM_EMAIL="noreply@yourdomain.com" # Optional
```

### Quick Commands

```bash
# Generate secure NextAuth secret
npm run generate-secret

# Create test users (after DB setup)
npm run setup:users

# Add sample events
npm run setup:data
```

## 🔮 Future Enhancements

The codebase is structured for easy feature additions:

- **Meeting Links** - Zoom/Google Meet integration
- **Recurring Events** - Weekly/monthly events
- **Calendar Integration** - Google Calendar sync
- **Time Zones** - Multi-timezone support
- **Payment Processing** - Stripe integration
- **Advanced Notifications** - SMS and webhooks
- **Event Templates** - Reusable event formats
- **Bulk Operations** - Mass event management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.