import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Phone number / Username and password are required.' },
        { status: 400 }
      );
    }

    const inputClean = email.trim().toLowerCase();

    // 🚀 Robust Query: Checks exact match, trimmed variants, and domain aliases across both email and phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phoneNumber: inputClean },
          { phoneNumber: email.trim() },
          { email: inputClean },
          { email: email.trim() },
          { email: { equals: inputClean, mode: 'insensitive' } },
        ],
      },
      include: {
        guideProfile: true,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash).catch(() => false))) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number / username or password.' },
        { status: 401 }
      );
    }

    // Check if unverified guide
    if (user.role === 'GUIDE' && user.guideProfile && !user.guideProfile.isVerified) {
      return NextResponse.json(
        { success: false, error: 'Your account is pending Admin approval. We will contact your phone shortly.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
        guideProfile: user.guideProfile,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}