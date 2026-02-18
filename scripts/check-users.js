const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        accounts: true,
        bookings: true,
      }
    });
    
    console.log('📊 Current Users in Database:');
    console.log(`Total users: ${users.length}`);
    
    if (users.length > 0) {
      users.forEach((user, index) => {
        console.log(`\nUser ${index + 1}:`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Name: ${user.name || 'N/A'}`);
        console.log(`  Role: ${user.role || 'N/A'}`);
        console.log(`  Accounts: ${user.accounts.length}`);
        console.log(`  Bookings: ${user.bookings.length}`);
      });
    } else {
      console.log('No users found in database');
    }
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();