import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper function to dispatch alerts to your Telegram Bot/Channel
async function sendTelegramNotification(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram Notification Skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured in environment variables.');
    return;
  }

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
  } catch (err) {
    console.error('Failed to send Telegram alert:', err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { travelerName, travelerPhone, travelerEmail, guideId, hours, totalPrice, languages } = body;

    if (!guideId) {
      return NextResponse.json(
        { success: false, error: 'Guide ID is required.' },
        { status: 400 }
      );
    }

    const cleanName = travelerName && travelerName.trim() ? travelerName.trim() : 'Layover Traveler';
    const cleanPhone = travelerPhone ? travelerPhone.trim() : null;

    // 1. Check if the guide is already booked on an active or pending request
    const existingConflict = await prisma.booking.findFirst({
      where: {
        guideId: guideId,
        status: { in: ['PENDING', 'ACCEPTED'] },
      },
    });

    if (existingConflict) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'This guide currently has an active or pending booking assignment. Please choose another available partner.' 
        },
        { status: 409 }
      );
    }

    // 2. Find or create Traveler User record
    let travelerUser = await prisma.user.findFirst({
      where: {
        OR: [
          ...(cleanPhone ? [{ phoneNumber: cleanPhone }] : []),
          ...(travelerEmail ? [{ email: travelerEmail.toLowerCase().trim() }] : []),
        ],
      },
    });

    if (!travelerUser) {
      travelerUser = await prisma.user.create({
        data: {
          name: cleanName,
          phoneNumber: cleanPhone,
          email: travelerEmail ? travelerEmail.toLowerCase().trim() : null,
          passwordHash: 'traveler2026',
          role: 'TRAVELER',
        },
      });
    } else if (cleanName !== 'Layover Traveler') {
      travelerUser = await prisma.user.update({
        where: { id: travelerUser.id },
        data: { name: cleanName, ...(cleanPhone ? { phoneNumber: cleanPhone } : {}) },
      });
    }

    // 3. Fetch target Guide Profile
    const guideProfile = await prisma.guide.findFirst({
      where: {
        OR: [
          { id: guideId },
          { userId: guideId },
        ],
      },
      include: {
        user: true,
      },
    });

    if (!guideProfile) {
      return NextResponse.json(
        { success: false, error: 'Selected guide profile was not found.' },
        { status: 404 }
      );
    }

    // 4. Create Booking
    const booking = await prisma.booking.create({
      data: {
        travelerId: travelerUser.id,
        guideId: guideProfile.id,
        hours: parseFloat(hours) || 5.0,
        totalPrice: parseFloat(totalPrice) || (parseFloat(hours) || 5.0) * guideProfile.pricePerHour,
        status: 'PENDING',
        languages: Array.isArray(languages) ? languages : ['English'],
      },
      include: {
        traveler: true,
        guide: {
          include: {
            user: true,
          },
        },
      },
    });

    // 5. Trigger Telegram alert for manual coordination & dispatcher review
    const alertMessage = 
      `🚨 *NEW LAYOVERLY BOOKING REQUEST*\n\n` +
      `👤 *Traveler:* ${booking.traveler.name}\n` +
      `📞 *Phone:* ${booking.traveler.phoneNumber || 'N/A'}\n` +
      `⏱️ *Duration:* ${booking.hours} Hours\n` +
      `💵 *Price:* $${booking.totalPrice}\n` +
      `🧭 *Assigned Partner:* ${booking.guide.user.name} (${booking.guide.user.phoneNumber || 'No phone'})\n` +
      `🗣️ *Languages:* ${booking.languages.join(', ')}\n\n` +
      `_Review or re-assign this request from your Admin Command Center._`;

    await sendTelegramNotification(alertMessage);

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Create Booking Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

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
    console.error('Fetch Bookings Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, newGuideId, status } = body;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required.' },
        { status: 400 }
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        ...(newGuideId ? { guideId: newGuideId } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        traveler: true,
        guide: {
          include: {
            user: true,
          },
        },
      },
    });

    // Send Telegram alert on booking update/re-assignment
    const updateAlert = 
      `🔄 *LAYOVERLY BOOKING UPDATED*\n\n` +
      `👤 *Traveler:* ${updatedBooking.traveler.name}\n` +
      `📌 *Status:* ${updatedBooking.status}\n` +
      `🧭 *Current Partner:* ${updatedBooking.guide.user.name} (${updatedBooking.guide.user.phoneNumber || 'N/A'})`;

    await sendTelegramNotification(updateAlert);

    return NextResponse.json({ 
      success: true, 
      booking: updatedBooking,
      notificationMessage: `Tourist ${updatedBooking.traveler.name} notified: Guide assigned to ${updatedBooking.guide.user.name} (${updatedBooking.guide.user.phoneNumber}).` 
    });
  } catch (error) {
    console.error('Update Booking Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}