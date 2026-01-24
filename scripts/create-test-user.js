const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if test organizer already exists
    const existingOrganizer = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (!existingOrganizer) {
      // Create test organizer
      const hashedPassword = await bcrypt.hash('password123', 12);
      
      const organizer = await prisma.user.create({
        data: {
          name: 'Test Organizer',
          email: 'test@example.com',
          password: hashedPassword,
          role: 'ORGANIZER'
        }
      });

      console.log('Test organizer created successfully:');
      console.log('Email:', organizer.email);
      console.log('Password: password123');
      console.log('Role:', organizer.role);
    } else {
      console.log('Test organizer already exists:', existingOrganizer.email);
    }

    // Check if test participant already exists
    const existingParticipant = await prisma.user.findUnique({
      where: { email: 'participant@example.com' }
    });

    if (!existingParticipant) {
      // Create test participant
      const hashedPassword = await bcrypt.hash('password123', 12);
      
      const participant = await prisma.user.create({
        data: {
          name: 'Test Participant',
          email: 'participant@example.com',
          password: hashedPassword,
          role: 'PARTICIPANT'
        }
      });

      console.log('Test participant created successfully:');
      console.log('Email:', participant.email);
      console.log('Password: password123');
      console.log('Role:', participant.role);
    } else {
      console.log('Test participant already exists:', existingParticipant.email);
    }
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();