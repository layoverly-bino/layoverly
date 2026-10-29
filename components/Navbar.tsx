'use client';

import Link from 'next/link';
import { Compass, Plane, UserCheck, MessageSquare, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-emerald-950 text-white border-b border-emerald-800/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Plane className="w-6 h-6 transform -rotate-45" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Layoverly
          </span>
        </Link>

        {/* Public Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-emerald-100">
          <Link href="/explore" className="hover:text-amber-400 transition-colors">
            Book a Tour
          </Link>
          
          <Link href="/guide-register" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            Become a Guide
          </Link>

          <Link href="/dashboard/guide" className="hover:text-amber-400 transition-colors">
            Guide Portal
          </Link>

          <Link href="/contact" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            Contact Us
          </Link>
        </nav>

        {/* Instant Session CTA */}
        <div className="flex items-center space-x-3">
          <Link
            href="/explore"
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-emerald-950 font-extrabold text-sm shadow-md transition-all"
          >
            Instant Guest Session
          </Link>
        </div>

      </div>
    </header>
  );
}