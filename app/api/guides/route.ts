import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const language = searchParams.get('language');

    const guides = await prisma.user.findMany({
      where: {
        role: 'GUIDE',
        guideProfile: {
          isVerified: true, // Only fetch approved guides
          ...(role && role !== 'ALL' ? { registrationRole: role } : {}),
          ...(language && language !== 'ALL' ? { languages: { has: language } } : {}),
          // 🚀 DOUBLE-BOOKING FILTER: Automatically exclude guides with pending/accepted bookings
          bookings: {
            none: {
              status: { in: ['PENDING', 'ACCEPTED'] },
            },
          },
        },
      },
      include: {
        guideProfile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, guides });
  } catch (error) {
    console.error('Error fetching verified guides:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch guides' },
      { status: 500 }
    );
  }
}