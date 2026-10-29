import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch all tour bookings for Admin review
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        traveler: true,
        guide: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST: Re-assign guide or update booking status
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, newGuideId, status } = body;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        ...(newGuideId ? { guideId: newGuideId } : {}),
        ...(status ? { status } : { status: 'ACCEPTED' }),
      },
      include: {
        guide: {
          include: {
            user: true,
          },
        },
        traveler: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      booking: updatedBooking,
      notificationMessage: `Tourist ${updatedBooking.traveler.name} notified: Guide assigned to ${updatedBooking.guide.user.name} (${updatedBooking.guide.user.phoneNumber}).`
    });
  } catch (error) {
    console.error('Error re-assigning guide:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to re-assign guide' },
      { status: 500 }
    );
  }
}