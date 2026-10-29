import { NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !message) {
      return NextResponse.json({ success: false, error: 'Name and message are required.' }, { status: 400 });
    }

    const telegramMessage = 
      `✉️ *New Contact Inquiry!*\n\n` +
      `👤 *From:* ${name} (${email || 'No email provided'})\n` +
      `📌 *Subject:* ${subject || 'General Inquiry'}\n\n` +
      `💬 *Message:* \n${message}`;

    await sendTelegramNotification(telegramMessage);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send message.' }, { status: 500 });
  }
}