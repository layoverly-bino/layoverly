import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendTelegramNotification } from '@/lib/telegram';
import bcrypt from 'bcryptjs'; // 👈 Import bcryptjs

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      role, 
      fullName, 
      phoneNumber, 
      email, 
      password, 
      hasNationalId, 
      hasLicense, 
      hasTourismDegree, 
      languages, 
      languageLevels, 
      pricePerHour, 
      tieredRates, 
      hasVehicle, 
      vehicleDetails 
    } = body;

    if (!fullName || !phoneNumber || !password) {
      return NextResponse.json(
        { success: false, error: 'Full Name, Phone Number, and Password are required.' },
        { status: 400 }
      );
    }

    const phoneClean = phoneNumber.trim();

    // 🔒 Hash the password securely (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: fullName.trim(),
        phoneNumber: phoneClean,
        email: email ? email.toLowerCase().trim() : null,
        passwordHash: hashedPassword, // 👈 Store the hashed string
        role: 'GUIDE',
        guideProfile: {
          create: {
            registrationRole: role || 'GUIDE',
            nationalIdNumber: hasNationalId ? 'Verified via Telegram' : null,
            guideLicenseNo: role === 'GUIDE' && hasLicense ? 'Verified via Telegram' : null,
            hasTourismDegree: Boolean(hasTourismDegree),
            languages: Array.isArray(languages) ? languages : ['English'],
            languageLevels: languageLevels || {},
            pricePerHour: parseFloat(pricePerHour) || 20.0,
            tieredRates: role === 'GUIDE' ? tieredRates : null,
            hasVehicle: role === 'GUIDE' ? Boolean(hasVehicle) : false,
            vehicleDetails: role === 'GUIDE' && hasVehicle ? vehicleDetails : 'N/A',
            isVerified: false,
            isAvailable: true,
          },
        },
      },
    });

    // Send Telegram Notification
    const telegramMessage = 
      `🚨 *New Partner Registration!*\n\n` +
      `👤 *Name:* ${fullName}\n` +
      `📌 *Role:* ${role === 'GUIDE' ? 'Tour Guide' : 'Language Interpreter'}\n` +
      `📞 *Phone:* \`${phoneNumber}\`\n` +
      `🗣 *Languages:* ${languages.join(', ')}\n` +
      `🚗 *Vehicle:* ${hasVehicle ? vehicleDetails : 'None'}`;

    await sendTelegramNotification(telegramMessage);

    return NextResponse.json({ success: true, userId: newUser.id });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}