'use client';

import Link from 'next/link';
import { ShieldCheck, Clock, CheckCircle2, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { Globe, GlobeArc, GlobeMarker } from '@/components/Globe';

const ADDIS_AIRPORT: [number, number] = [8.9778, 38.7993];

// Major global flight hubs connecting to Addis Ababa Bole International Airport
const flightMarkers: GlobeMarker[] = [
  { lat: 8.9778, lng: 38.7993, label: "Addis Ababa (Bole)" },
  { lat: 25.2532, lng: 55.3657, label: "Dubai" },
  { lat: 50.0333, lng: 8.5706, label: "Frankfurt" },
  { lat: 38.9531, lng: -77.4565, label: "Washington D.C." },
  { lat: -1.3192, lng: 36.9275, label: "Nairobi" },
  { lat: 40.0801, lng: 116.5846, label: "Beijing" },
  { lat: -26.1392, lng: 28.2460, label: "Johannesburg" },
];

const flightArcs: GlobeArc[] = [
  { from: [25.2532, 55.3657], to: ADDIS_AIRPORT }, // Dubai -> Addis
  { from: [50.0333, 8.5706], to: ADDIS_AIRPORT },  // Frankfurt -> Addis
  { from: [38.9531, -77.4565], to: ADDIS_AIRPORT },// Washington -> Addis
  { from: [-1.3192, 36.9275], to: ADDIS_AIRPORT }, // Nairobi -> Addis
  { from: [40.0801, 116.5846], to: ADDIS_AIRPORT },// Beijing -> Addis
  { from: [-26.1392, 28.2460], to: ADDIS_AIRPORT },// Johannesburg -> Addis
];

export default function LandingPage() {
  const popularSpots = [
    { name: "Entoto Park", time: "25m from Bole", icon: "🏔️" },
    { name: "National Museum", time: "18m from Bole", icon: "🏛️" },
    { name: "Coffee Ceremony", time: "10m from Bole", icon: "☕" },
    { name: "Merkato Tour", time: "20m from Bole", icon: "🛍️" },
  ];

  const topDestinations = [
    {
      title: "Entoto Natural Park",
      category: "Nature & Panoramic Skyline Views",
      transitTime: "25m from Bole",
      image: "/images/entoto.jpg",
      icon: "🏔️",
      description: "Eucalyptus forest trails, panoramic city views, and fresh mountain climate perfect for quick 3-hour layover walks."
    },
    {
      title: "National Museum of Ethiopia",
      category: "History & Heritage",
      transitTime: "18m from Bole",
      image: "/images/national-museum.jpg",
      icon: "🏛️",
      description: "Home of 'Lucy' (Dinkinesh), featuring 3.2-million-year-old hominid fossils and ancient Ethiopian royal artifacts."
    },
    {
      title: "Unity Park & Grand Palace",
      category: "Culture & Imperial History",
      transitTime: "15m from Bole",
      image: "/images/unity-park.jpg",
      icon: "👑",
      description: "Explore Emperor Menelik II's historic palace grounds, regional cultural pavilions, and lush botanical gardens."
    },
    {
      title: "Addis Mercato & Market Tour",
      category: "Culture & Commerce",
      transitTime: "20m from Bole",
      image: "/images/mercato.jpg",
      icon: "🛍️",
      description: "Experience Africa's largest open-air marketplace alongside a vetted guide for spice, coffee, and handicraft shopping."
    },
  ];

  const culturalEvents = [
    {
      title: "Authentic Ethiopian Coffee Ceremony",
      location: "Bole & Kazanchis District",
      duration: "1.5 - 2 Hours",
      image: "/images/coffee-ceremony.jpg",
      tag: "Daily Experience",
      description: "Watch fresh green coffee beans roasted over open coals, infused with frankincense aroma, and served with traditional popcorn."
    },
    {
      title: "Traditional Live Music & Azmari Bet",
      location: "Piazza & Bole Cultural Clubs",
      duration: "Evening Layovers",
      image: "/images/azmari-bet.jpg",
      tag: "Nightlife & Folklore",
      description: "Immerse yourself in live Masinko acoustic performances, shoulder-dancing (Gurage & Tigrigna style), and authentic Ethiopian cuisine."
    },
  ];

  return (
    <div className="min-h-screen bg-[#06241d] font-sans text-white overflow-hidden">
      
      {/* 3D Flight Globe Hero Section */}
      <section className="relative px-6 lg:px-16 pt-6 pb-12 lg:pb-16">
        {/* Background Subtle Photo Overlay */}
        <div className="absolute inset-0 z-0 opacity-50 bg-[url('/images/addis-skyline.jfif')] bg-cover bg-center mix-blend-overlay pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto space-y-8">
          
          {/* Centered Top Badge */}
          <div className="flex justify-center w-full">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-800/40 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-medium backdrop-blur-md shadow-md">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              ✨ Turn Your Connection at Bole Into an Adventure
            </div>
          </div>

          {/* Grid Layout for Headline & Globe */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
            
            {/* Left Column: Text Content & CTAs */}
            <div className="lg:col-span-7 space-y-5 text-left">

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Turn Your Layover Into An <br />
                <span className="text-amber-400">Adventure</span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg text-stone-300 font-normal leading-relaxed">
                Book vetted local personal guides near Bole International Airport instantly. Custom schedules matched to your exact flight departure—zero app downloads required.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                <Link
                  href="/explore"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold transition shadow-lg shadow-amber-400/20 text-center flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                >
                  Start One-Time Tour
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/guide-register"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-600/40 text-white font-bold backdrop-blur-md transition text-center text-sm uppercase tracking-wider"
                >
                  Register as Local Guide
                </Link>
              </div>

              {/* Quick Destination Pills */}
              <div className="pt-4 border-t border-emerald-800/50 flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-emerald-300/70 font-semibold w-full mb-1">
                  Popular Quick Trips From Bole:
                </span>
                {popularSpots.map((spot, idx) => (
                  <Link
                    key={idx}
                    href="/explore"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-stone-200 hover:border-amber-400/50 hover:bg-white/10 transition cursor-pointer"
                  >
                    <span>{spot.icon}</span>
                    <span className="font-bold">{spot.name}</span>
                    <span className="text-stone-400 text-[10px]">({spot.time})</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Column: Live Interactive Flight Globe */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="w-full max-w-[320px] sm:max-w-[380px] lg:max-w-md">
                <Globe
                  markers={flightMarkers}
                  arcs={flightArcs}
                  center={[9.0, 38.8]} // Centered on Addis Ababa / East Africa
                  speed={4}
                  dotColor="rgba(255, 255, 255, 0.25)"
                  accentColor="#fbbf24" // Amber accent matching theme
                  className="w-full shadow-2xl rounded-full"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Glassmorphism Feature Highlights Section */}
      <section className="pb-16 max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-amber-400/30 transition">
            <div className="w-10 h-10 bg-amber-400/10 text-amber-400 rounded-xl flex items-center justify-center mb-4 font-bold border border-amber-400/20">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Timed Layover Buffers</h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              Enter your exact connecting flight hours. We calculate transit back to the terminal so you never miss a connection.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-amber-400/30 transition">
            <div className="w-10 h-10 bg-amber-400/10 text-amber-400 rounded-xl flex items-center justify-center mb-4 font-bold border border-amber-400/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Vetted Local Guides</h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              All guides undergo background checks, vehicle inspection, and manual admin verification before accepting bookings.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-amber-400/30 transition">
            <div className="w-10 h-10 bg-amber-400/10 text-amber-400 rounded-xl flex items-center justify-center mb-4 font-bold border border-amber-400/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Instant Web Checkout</h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              No app store downloads required. Book guest sessions directly on mobile or web browsers in under two minutes.
            </p>
          </div>

        </div>
      </section>

      {/* Top Destinations Section */}
      <section className="py-16 px-6 lg:px-16 max-w-7xl mx-auto border-t border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-amber-400 text-xs uppercase tracking-widest font-bold flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5" /> Top Destinations in Addis Ababa
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Popular Layover Hotspots
            </h2>
          </div>
          <p className="text-stone-300 text-sm max-w-md mt-3 md:mt-0 leading-relaxed">
            Time-optimized excursions tailored around your connecting flight departure time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topDestinations.map((dest, idx) => (
            <div
              key={idx}
              className="group relative h-[380px] rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-xl transition-all duration-300 hover:border-amber-400/50 hover:-translate-y-1.5"
            >
              {/* Image with Dark Gradient Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${dest.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06241d] via-[#06241d]/50 to-transparent" />

              {/* Transit Time Badge */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium backdrop-blur-md shadow-md">
                  {dest.icon} {dest.transitTime}
                </span>
              </div>

              {/* Bottom Content Area */}
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10 space-y-1.5">
                <span className="text-amber-400 text-[11px] font-semibold uppercase tracking-wider block">
                  {dest.category}
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  {dest.title}
                </h3>
                <p className="text-stone-300 text-xs line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cultural Events & Experiences Section */}
      <section className="pb-20 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-amber-400 text-xs uppercase tracking-widest font-bold flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5" /> Cultural Experiences
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Immersive Cultural Layover Events
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-amber-400 hover:text-amber-300 font-bold text-sm flex items-center gap-1.5 mt-3 md:mt-0 transition"
          >
            Explore All Experiences <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {culturalEvents.map((event, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col sm:flex-row gap-6 items-center hover:border-amber-400/40 transition-all duration-300"
            >
              <div
                className="w-full sm:w-48 h-44 rounded-xl bg-cover bg-center shrink-0 border border-white/10"
                style={{ backgroundImage: `url(${event.image})` }}
              />
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[11px] font-medium">
                    {event.tag}
                  </span>
                  <span className="text-stone-400 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {event.duration}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  {event.title}
                </h3>
                <p className="text-stone-300 text-xs leading-relaxed">
                  {event.description}
                </p>
                <div className="pt-1 flex items-center text-emerald-300 text-xs font-medium gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" /> {event.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}