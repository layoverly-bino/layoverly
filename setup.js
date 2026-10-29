const fs = require('fs');
const path = require('path');

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Created: ' + filePath);
}

// 1. Prisma Schema
writeFile('prisma/schema.prisma', 
'datasource db {\n' +
'  provider = "postgresql"\n' +
'  url      = env("DATABASE_URL")\n' +
'}\n\n' +
'generator client {\n' +
'  provider = "prisma-client-js"\n' +
'}\n\n' +
'enum Role {\n' +
'  TRAVELER\n' +
'  GUIDE\n' +
'  ADMIN\n' +
'}\n\n' +
'enum BookingStatus {\n' +
'  PENDING\n' +
'  ACCEPTED\n' +
'  COMPLETED\n' +
'  CANCELLED\n' +
'}\n\n' +
'model User {\n' +
'  id              String           @id @default(uuid())\n' +
'  email           String           @unique\n' +
'  passwordHash    String\n' +
'  role            Role             @default(TRAVELER)\n' +
'  createdAt       DateTime         @default(now())\n' +
'  updatedAt       DateTime         @updatedAt\n' +
'  travelerProfile TravelerProfile?\n' +
'  guideProfile    GuideProfile?\n' +
'}\n\n' +
'model TravelerProfile {\n' +
'  id             String    @id @default(uuid())\n' +
'  userId         String    @unique\n' +
'  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n' +
'  name           String\n' +
'  citizenship    String?\n' +
'  interests      String[]\n' +
'  hoursAvailable Float\n' +
'  bookings       Booking[]\n' +
'}\n\n' +
'model GuideProfile {\n' +
'  id           String    @id @default(uuid())\n' +
'  userId       String    @unique\n' +
'  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n' +
'  name         String\n' +
'  languages    String[]\n' +
'  rating       Float     @default(5.0)\n' +
'  hasCar       Boolean   @default(false)\n' +
'  vehicleType  String?\n' +
'  isVerified   Boolean   @default(false)\n' +
'  isAvailable  Boolean   @default(true)\n' +
'  bookings     Booking[]\n' +
'}\n\n' +
'model Booking {\n' +
'  id         String        @id @default(uuid())\n' +
'  travelerId String\n' +
'  traveler   TravelerProfile @relation(fields: [travelerId], references: [id])\n' +
'  guideId    String\n' +
'  guide      GuideProfile  @relation(fields: [guideId], references: [id])\n' +
'  status     BookingStatus @default(PENDING)\n' +
'  price      Decimal       @db.Decimal(10, 2)\n' +
'  createdAt  DateTime      @default(now())\n' +
'  review     Review?\n' +
'}\n\n' +
'model Review {\n' +
'  id        String   @id @default(uuid())\n' +
'  bookingId String   @unique\n' +
'  booking   Booking  @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n' +
'  rating    Int\n' +
'  comment   String?\n' +
'  createdAt DateTime @default(now())\n' +
'}\n'
);

// 2. Package.json
writeFile('package.json', JSON.stringify({
  "name": "layoverly",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@prisma/client": "^5.10.0",
    "clsx": "^2.1.0",
    "lucide-react": "^0.344.0",
    "next": "14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwind-merge": "^2.2.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.11.24",
    "@types/react": "^18.2.61",
    "@types/react-dom": "^18.2.19",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "prisma": "^5.10.0",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3"
  }
}, null, 2));

// 3. Global CSS
writeFile('app/globals.css', 
'@tailwind base;\n' +
'@tailwind components;\n' +
'@tailwind utilities;\n\n' +
':root {\n' +
'  --foreground-rgb: 15, 23, 42;\n' +
'  --background-rgb: 255, 255, 255;\n' +
'}\n\n' +
'body {\n' +
'  color: rgb(var(--foreground-rgb));\n' +
'  background: rgb(var(--background-rgb));\n' +
'  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;\n' +
'}\n'
);

// 4. Root Layout
writeFile('app/layout.tsx',
'import "./globals.css";\n' +
'import Navbar from "@/components/Navbar";\n' +
'import Footer from "@/components/Footer";\n\n' +
'export const metadata = {\n' +
'  title: "Layoverly | Turn Your Layover Into An Adventure",\n' +
'  description: "Connect with verified local personal tour guides during your airport layover without downloading any app.",\n' +
'};\n\n' +
'export default function RootLayout({ children }: { children: React.ReactNode }) {\n' +
'  return (\n' +
'    <html lang="en">\n' +
'      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">\n' +
'        <Navbar />\n' +
'        <main className="flex-grow">{children}</main>\n' +
'        <Footer />\n' +
'      </body>\n' +
'    </html>\n' +
'  );\n' +
'}\n'
);

// 5. Landing Page
writeFile('app/page.tsx',
'import Link from "next/link";\n' +
'import { Sparkles, Clock, ShieldCheck, ArrowRight } from "lucide-react";\n\n' +
'export default function LandingPage() {\n' +
'  return (\n' +
'    <div className="min-h-screen bg-slate-50">\n' +
'      <section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-b from-indigo-900 via-indigo-800 to-slate-900 text-white">\n' +
'        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px]"></div>\n' +
'        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">\n' +
'          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold mb-6 text-indigo-200">\n' +
'            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Instant Layover Matchmaker • Zero App Downloads\n' +
'          </div>\n' +
'          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-tight">\n' +
'            Turn Your Airport Layover Into An <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Adventure</span>\n' +
'          </h1>\n' +
'          <p className="mt-6 text-lg sm:text-xl text-indigo-200 max-w-2xl mx-auto font-normal">\n' +
'            Matched instantly with vetted local personal tour guides based on your exact layover hours, interests, and languages.\n' +
'          </p>\n' +
'          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">\n' +
'            <Link\n' +
'              href="/explore"\n' +
'              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 group"\n' +
'            >\n' +
'              Start One-Time Tour Session\n' +
'              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />\n' +
'            </Link>\n' +
'            <Link\n' +
'              href="/dashboard/guide"\n' +
'              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-base transition-all"\n' +
'            >\n' +
'              Become a Local Guide\n' +
'            </Link>\n' +
'          </div>\n' +
'        </div>\n' +
'      </section>\n' +
'    </div>\n' +
'  );\n' +
'}\n'
);

// 6. Navbar Component
writeFile('components/Navbar.tsx',
'"use client";\n\n' +
'import Link from "next/link";\n' +
'import { Compass, Sparkles, UserCheck, ShieldCheck, MessageSquare } from "lucide-react";\n' +
'import { useState } from "react";\n' +
'import ChatModal from "./ChatModal";\n\n' +
'export default function Navbar() {\n' +
'  const [isChatOpen, setIsChatOpen] = useState(false);\n\n' +
'  return (\n' +
'    <>\n' +
'      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">\n' +
'        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">\n' +
'          <Link href="/" className="flex items-center space-x-2">\n' +
'            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">\n' +
'              <Compass className="w-6 h-6" />\n' +
'            </div>\n' +
'            <span className="text-xl font-black tracking-tight text-indigo-600">Layoverly</span>\n' +
'          </Link>\n' +
'          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">\n' +
'            <Link href="/explore" className="hover:text-indigo-600">Explore</Link>\n' +
'            <Link href="/dashboard/guide" className="hover:text-indigo-600">Guide Portal</Link>\n' +
'            <Link href="/dashboard/admin" className="hover:text-indigo-600">Admin</Link>\n' +
'          </nav>\n' +
'          <button onClick={() => setIsChatOpen(true)} className="p-2.5 rounded-full text-slate-600 hover:bg-slate-100">\n' +
'            <MessageSquare className="w-5 h-5" />\n' +
'          </button>\n' +
'        </div>\n' +
'      </header>\n' +
'      {isChatOpen && <ChatModal onClose={() => setIsChatOpen(false)} />}\n' +
'    </>\n' +
'  );\n' +
'}\n'
);

// 7. Footer Component
writeFile('components/Footer.tsx',
'export default function Footer() {\n' +
'  return (\n' +
'    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">\n' +
'      <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">\n' +
'        &copy; {new Date().getFullYear()} Layoverly Inc. All rights reserved.\n' +
'      </div>\n' +
'    </footer>\n' +
'  );\n' +
'}\n'
);

// 8. Chat Modal Component
writeFile('components/ChatModal.tsx',
'"use client";\n\n' +
'import { useState } from "react";\n' +
'import { X, Send } from "lucide-react";\n\n' +
'export default function ChatModal({ onClose }: { onClose: () => void }) {\n' +
'  const [messages, setMessages] = useState([\n' +
'    { sender: "guide", text: "Hey there! Excited for your layover!" }\n' +
'  ]);\n' +
'  const [input, setInput] = useState("");\n\n' +
'  const handleSend = (e: React.FormEvent) => {\n' +
'    e.preventDefault();\n' +
'    if (!input.trim()) return;\n' +
'    setMessages(prev => [...prev, { sender: "traveler", text: input }]);\n' +
'    setInput("");\n' +
'  };\n\n' +
'  return (\n' +
'    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">\n' +
'      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full h-[500px] flex flex-col overflow-hidden">\n' +
'        <div className="flex items-center justify-between px-4 py-3 bg-indigo-600 text-white">\n' +
'          <h4 className="font-semibold text-sm">Elena (Verified Guide)</h4>\n' +
'          <button onClick={onClose}><X className="w-5 h-5" /></button>\n' +
'        </div>\n' +
'        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">\n' +
'          {messages.map((m, i) => (\n' +
'            <div key={i} className={`flex ${m.sender === "traveler" ? "justify-end" : "justify-start"}`}>\n' +
'              <div className={`px-4 py-2.5 rounded-2xl text-sm ${m.sender === "traveler" ? "bg-indigo-600 text-white" : "bg-white text-slate-800 border"}`}>\n' +
'                {m.text}\n' +
'              </div>\n' +
'            </div>\n' +
'          ))}\n' +
'        </div>\n' +
'        <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2">\n' +
'          <input\n' +
'            type="text"\n' +
'            value={input}\n' +
'            onChange={(e) => setInput(e.target.value)}\n' +
'            placeholder="Type message..."\n' +
'            className="flex-1 px-4 py-2 text-sm border rounded-xl"\n' +
'          />\n' +
'          <button type="submit" className="p-2.5 bg-indigo-600 text-white rounded-xl"><Send className="w-4 h-4" /></button>\n' +
'        </form>\n' +
'      </div>\n' +
'    </div>\n' +
'  );\n' +
'}\n'
);

console.log("Layoverly setup script completed successfully!");