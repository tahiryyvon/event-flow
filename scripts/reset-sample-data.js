const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearAndCreateEvents() {
  try {
    // Clear existing events and bookings
    console.log('Clearing existing events and bookings...');
    await prisma.booking.deleteMany({});
    await prisma.event.deleteMany({});
    
    // Get the test organizer
    const organizer = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (!organizer) {
      console.log('Test organizer not found. Please run create-test-user.js first.');
      return;
    }

    console.log('Creating sample events...');

    // Create events one by one
    const event1 = await prisma.event.create({
      data: {
        title: 'Weekly Team Standup',
        description: 'Our weekly team sync to discuss progress, blockers, and upcoming tasks.',
        startDate: new Date('2026-01-27'),
        endDate: new Date('2026-01-27'),
        startTime: new Date('2026-01-27T09:00:00'),
        endTime: new Date('2026-01-27T10:00:00'),
        isMultiDay: false,
        maxCapacity: 10,
        registrationDeadline: new Date('2026-01-26'),
        organizerId: organizer.id
      }
    });
    console.log('✓ Created:', event1.title);

    const event2 = await prisma.event.create({
      data: {
        title: 'Product Strategy Workshop',
        description: 'A comprehensive workshop to align on product roadmap and strategic priorities for Q1.',
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-02-02'),
        startTime: new Date('2026-02-01T09:00:00'),
        endTime: null,
        isMultiDay: true,
        maxCapacity: 25,
        registrationDeadline: new Date('2026-01-30'),
        organizerId: organizer.id
      }
    });
    console.log('✓ Created:', event2.title);

    const event3 = await prisma.event.create({
      data: {
        title: 'Client Presentation',
        description: 'Presenting the final design mockups and project timeline to the client.',
        startDate: new Date('2026-01-30'),
        endDate: new Date('2026-01-30'),
        startTime: new Date('2026-01-30T14:00:00'),
        endTime: new Date('2026-01-30T15:30:00'),
        isMultiDay: false,
        maxCapacity: 8,
        registrationDeadline: new Date('2026-01-29'),
        organizerId: organizer.id
      }
    });
    console.log('✓ Created:', event3.title);

    const event4 = await prisma.event.create({
      data: {
        title: 'Annual Company Retreat',
        description: 'Three-day company retreat with team building activities, workshops, and strategic planning sessions.',
        startDate: new Date('2026-03-15'),
        endDate: new Date('2026-03-17'),
        startTime: new Date('2026-03-15T08:00:00'),
        endTime: null,
        isMultiDay: true,
        maxCapacity: 50,
        registrationDeadline: new Date('2026-03-01'),
        organizerId: organizer.id
      }
    });
    console.log('✓ Created:', event4.title);

    // Create a sample booking for the participant
    const participant = await prisma.user.findUnique({
      where: { email: 'participant@example.com' }
    });

    if (participant) {
      const booking = await prisma.booking.create({
        data: {
          eventId: event1.id,
          participantName: participant.name,
          participantEmail: participant.email
        }
      });
      console.log('✓ Created sample booking for test participant');
    }

    console.log('\n🎉 Successfully created sample events and booking!');
    console.log('\nYou can now test with:');
    console.log('- Organizer: test@example.com / password123');
    console.log('- Participant: participant@example.com / password123');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearAndCreateEvents();