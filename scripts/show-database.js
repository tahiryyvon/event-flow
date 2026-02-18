const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function showDatabase() {
  try {
    console.log('📊 EventFlow Database Contents')
    console.log('=' .repeat(50))
    
    // Get all users
    const users = await prisma.user.findMany({
      include: {
        accounts: true,
        sessions: true,
        organizedEvents: true,
        bookings: {
          include: {
            event: true
          }
        }
      }
    })
    
    console.log('\n👥 USERS:')
    if (users.length === 0) {
      console.log('   No users found')
    } else {
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name || 'No name'} (${user.email})`)
        console.log(`      Role: ${user.role}`)
        console.log(`      ID: ${user.id}`)
        console.log(`      Created: ${user.createdAt.toISOString()}`)
        console.log(`      Image: ${user.image || 'No image'}`)
        console.log(`      Password: ${user.password ? '***SET***' : 'No password (OAuth only)'}`)
        console.log(`      Email Verified: ${user.emailVerified ? user.emailVerified.toISOString() : 'Not verified'}`)
        
        if (user.accounts.length > 0) {
          console.log(`      Linked Accounts:`)
          user.accounts.forEach(account => {
            console.log(`        - ${account.provider} (${account.type})`)
          })
        }
        
        if (user.sessions.length > 0) {
          console.log(`      Active Sessions: ${user.sessions.length}`)
        }
        
        if (user.organizedEvents.length > 0) {
          console.log(`      Organized Events: ${user.organizedEvents.length}`)
        }
        
        if (user.bookings.length > 0) {
          console.log(`      Bookings Made: ${user.bookings.length}`)
        }
        console.log('')
      })
    }
    
    // Get all events
    const events = await prisma.event.findMany({
      include: {
        organizer: true,
        bookings: {
          include: {
            user: true
          }
        }
      }
    })
    
    console.log('📅 EVENTS:')
    if (events.length === 0) {
      console.log('   No events found')
    } else {
      events.forEach((event, index) => {
        console.log(`   ${index + 1}. ${event.title}`)
        console.log(`      Organizer: ${event.organizer.name} (${event.organizer.email})`)
        console.log(`      Date: ${event.date.toISOString()}`)
        console.log(`      Duration: ${event.duration} minutes`)
        console.log(`      Description: ${event.description || 'No description'}`)
        console.log(`      Location: ${event.location || 'No location'}`)
        console.log(`      Max Participants: ${event.maxParticipants || 'Unlimited'}`)
        console.log(`      Public Link: /book/${event.id}`)
        console.log(`      Created: ${event.createdAt.toISOString()}`)
        
        if (event.bookings.length > 0) {
          console.log(`      Bookings (${event.bookings.length}):`)
          event.bookings.forEach(booking => {
            console.log(`        - ${booking.user.name} (${booking.user.email}) - ${booking.status}`)
            console.log(`          Booked: ${booking.createdAt.toISOString()}`)
          })
        } else {
          console.log(`      Bookings: None yet`)
        }
        console.log('')
      })
    }
    
    // Get all bookings
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        event: {
          include: {
            organizer: true
          }
        }
      }
    })
    
    console.log('🎟️ BOOKINGS:')
    if (bookings.length === 0) {
      console.log('   No bookings found')
    } else {
      bookings.forEach((booking, index) => {
        console.log(`   ${index + 1}. ${booking.user.name} → ${booking.event.title}`)
        console.log(`      Participant: ${booking.user.email}`)
        console.log(`      Event Organizer: ${booking.event.organizer.email}`)
        console.log(`      Status: ${booking.status}`)
        console.log(`      Booked At: ${booking.createdAt.toISOString()}`)
        console.log(`      Event Date: ${booking.event.date.toISOString()}`)
        console.log('')
      })
    }
    
    // Get all accounts (OAuth connections)
    const accounts = await prisma.account.findMany({
      include: {
        user: true
      }
    })
    
    console.log('🔗 OAUTH ACCOUNTS:')
    if (accounts.length === 0) {
      console.log('   No OAuth accounts found')
    } else {
      accounts.forEach((account, index) => {
        console.log(`   ${index + 1}. ${account.provider} account for ${account.user.email}`)
        console.log(`      Type: ${account.type}`)
        console.log(`      Provider Account ID: ${account.providerAccountId}`)
        console.log(`      Has Refresh Token: ${account.refresh_token ? 'Yes' : 'No'}`)
        console.log('')
      })
    }
    
    // Get all sessions
    const sessions = await prisma.session.findMany({
      include: {
        user: true
      }
    })
    
    console.log('🔐 ACTIVE SESSIONS:')
    if (sessions.length === 0) {
      console.log('   No active sessions')
    } else {
      sessions.forEach((session, index) => {
        console.log(`   ${index + 1}. Session for ${session.user.email}`)
        console.log(`      Expires: ${session.expires.toISOString()}`)
        console.log(`      Session Token: ${session.sessionToken.substring(0, 20)}...`)
        console.log('')
      })
    }
    
    // Summary
    console.log('📈 SUMMARY:')
    console.log(`   Total Users: ${users.length}`)
    console.log(`   Total Events: ${events.length}`)
    console.log(`   Total Bookings: ${bookings.length}`)
    console.log(`   Total OAuth Accounts: ${accounts.length}`)
    console.log(`   Total Active Sessions: ${sessions.length}`)
    
    console.log('\n' + '='.repeat(50))
    
  } catch (error) {
    console.error('❌ Error querying database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

showDatabase()