import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phoneNumber, password } = body;

    if (!name || !email || !phoneNumber || !password) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phoneNumber: phoneNumber.trim(),
        passwordHash: hashedPassword,
        role: 'ADMIN',
      },
    });

    return NextResponse.json({ success: true, admin: newAdmin });
  } catch (error: any) {
    console.error('Create Admin Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Error creating admin account.' }, { status: 500 });
  }
}