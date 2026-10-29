import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Retrieve all guides pending verification
export async function GET() {
  try {
    const pendingGuides = await prisma.user.findMany({
      where: {
        role: 'GUIDE',
        guideProfile: {
          isVerified: false,
        },
      },
      include: {
        guideProfile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, pendingGuides });
  } catch (error) {
    console.error('Error fetching pending guides:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pending guides' },
      { status: 500 }
    );
  }
}

// POST: Approve a guide (set isVerified to true)
export async function POST(request: Request) {
  try {
    const { guideId } = await request.json();

    if (!guideId) {
      return NextResponse.json(
        { success: false, error: 'Guide ID is required' },
        { status: 400 }
      );
    }

    await prisma.guide.update({
      where: { id: guideId },
      data: { isVerified: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error approving guide:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to approve guide' },
      { status: 500 }
    );
  }
}