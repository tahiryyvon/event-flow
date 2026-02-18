import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetDatabase() {
  try {
    console.log('🗑️ Starting database cleanup...')
    
    // Delete all data in dependency order (foreign keys first)
    console.log('Deleting bookings...')
    const deletedBookings = await prisma.booking.deleteMany({})
    console.log(`✅ Deleted ${deletedBookings.count} bookings`)
    
    console.log('Deleting events...')
    const deletedEvents = await prisma.event.deleteMany({})
    console.log(`✅ Deleted ${deletedEvents.count} events`)
    
    console.log('Deleting sessions...')
    const deletedSessions = await prisma.session.deleteMany({})
    console.log(`✅ Deleted ${deletedSessions.count} sessions`)
    
    console.log('Deleting accounts...')
    const deletedAccounts = await prisma.account.deleteMany({})
    console.log(`✅ Deleted ${deletedAccounts.count} accounts`)
    
    console.log('Deleting users...')
    const deletedUsers = await prisma.user.deleteMany({})
    console.log(`✅ Deleted ${deletedUsers.count} users`)
    
    console.log('🎉 Database cleanup completed successfully!')
    console.log('\n📋 Summary:')
    console.log(`- Users: ${deletedUsers.count}`)
    console.log(`- Accounts: ${deletedAccounts.count}`)
    console.log(`- Sessions: ${deletedSessions.count}`)
    console.log(`- Events: ${deletedEvents.count}`)
    console.log(`- Bookings: ${deletedBookings.count}`)
    console.log('\n✨ Your database is now clean and ready for fresh testing!')
    
  } catch (error) {
    console.error('❌ Error cleaning database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetDatabase()