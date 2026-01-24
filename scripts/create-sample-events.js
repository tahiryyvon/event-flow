const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleEvents() {
  try {
    // Get the test organizer
    const organizer = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (!organizer) {
      console.log('Test organizer not found. Please run create-test-user.js first.');
      return;
    }

    // Check if events already exist
    const existingEvents = await prisma.event.findMany({
      where: { organizerId: organizer.id }
    });

    if (existingEvents.length > 0) {
      console.log(`${existingEvents.length} events already exist for test organizer`);
      return;
    }

    // Create sample events
    const events = [
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
        title: 'Coffee Chat with CEO',
        description: 'Informal coffee session with our CEO. A great opportunity for questions and open discussion.',
        startDate: new Date('2026-01-28'),
        endDate: new Date('2026-01-28'),
        startTime: new Date('2026-01-28T15:30:00'),
        endTime: new Date('2026-01-28T16:30:00'),
        isMultiDay: false,
        maxCapacity: 6,
        registrationDeadline: new Date('2026-01-27'),
        organizerId: organizer.id
      }
    ];

    // Create all events
    for (let i = 0; i < events.length; i++) {
      try {
        const createdEvent = await prisma.event.create({
          data: events[i]
        });
        console.log(`Created event: ${createdEvent.title}`);
      } catch (error) {
        console.error(`Error creating event ${events[i].title}:`, error.message);
      }
    }

    console.log(`Successfully created ${events.length} sample events!`);
    
    // Create a sample booking for the participant
    const participant = await prisma.user.findUnique({
      where: { email: 'participant@example.com' }
    });

    if (participant) {
      const teamStandup = await prisma.event.findFirst({
        where: { title: 'Weekly Team Standup' }
      });

      if (teamStandup) {
        const existingBooking = await prisma.booking.findFirst({
          where: {
            eventId: teamStandup.id,
            participantEmail: participant.email
          }
        });

        if (!existingBooking) {
          await prisma.booking.create({
            data: {
              eventId: teamStandup.id,
              participantName: participant.name,
              participantEmail: participant.email
            }
          });
          console.log('Created sample booking for test participant');
        }
      }
    }

  } catch (error) {
    console.error('Error creating sample events:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleEvents();