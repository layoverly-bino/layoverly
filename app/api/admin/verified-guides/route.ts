import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const verifiedGuides = await prisma.user.findMany({
      where: {
        role: 'GUIDE',
        guideProfile: {
          isVerified: true,
        },
      },
      include: {
        guideProfile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, verifiedGuides });
  } catch (error) {
    console.error('Error fetching verified guides:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch verified guides' },
      { status: 500 }
    );
  }
}