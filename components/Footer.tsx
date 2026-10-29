'use client';

import Link from 'next/link';
import { Plane, MapPin, Mail, Phone, Send, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-100 py-12 border-t border-emerald-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-black text-lg text-white">
              <div className="w-7 h-7 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-400">
                <Plane className="w-4 h-4 transform -rotate-45" />
              </div>
              <span>Layoverly<span className="text-amber-400">.et</span></span>
            </Link>
            <p className="text-emerald-300/80 leading-relaxed">
              Connecting transiting passengers at Addis Ababa Bole International Airport (ADD) with verified local tour guides and certified language interpreters.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-bold text-amber-400 bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-800 max-w-max">
              <ShieldCheck className="w-4 h-4" /> Vetted Local Partners
            </div>
          </div>

          {/* Column 2: Quick Marketplace Links */}
          <div className="space-y-3">
            <h4 className="font-extrabold uppercase text-amber-400 tracking-wider">Explore Services</h4>
            <ul className="space-y-2 text-emerald-200">
              <li>
                <Link href="/explore" className="hover:text-white transition-colors">Browse Tour Guides</Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-white transition-colors">Language Interpreters</Link>
              </li>
              <li>
                <Link href="/guide-register" className="hover:text-white transition-colors">Become a Guide / Partner</Link>
              </li>
              <li>
                <Link href="/guide-portal" className="hover:text-white transition-colors">Partner Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Airport Support */}
          <div className="space-y-3">
            <h4 className="font-extrabold uppercase text-amber-400 tracking-wider">Airport Operations</h4>
            <ul className="space-y-2 text-emerald-200">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" /> Bole Int. Airport (Terminal 1 & 2), ADD
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" /> support@layoverly.et
              </li>
              <li className="flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400 shrink-0" /> Telegram: @LayoverlySupport
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Policies */}
          <div className="space-y-3">
            <h4 className="font-extrabold uppercase text-amber-400 tracking-wider">Trust & Legal</h4>
            <ul className="space-y-2 text-emerald-200">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Help & Contact Us</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-emerald-400/80 gap-4">
          <p>&copy; {new Date().getFullYear()} Layoverly.et. All rights reserved.</p>
          <p>Designed for Layover Experiences in Addis Ababa, Ethiopia.</p>
        </div>

      </div>
    </footer>
  );
}