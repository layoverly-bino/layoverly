'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, MapPin, Star, Car, Globe, User, 
  Plane, Calendar, Phone, Luggage, DollarSign, CheckCircle2, ShieldCheck, Accessibility 
} from 'lucide-react';
import BookingModal from '@/components/BookingModal';

export default function ExplorePage() {
  // Step 1: Traveler Identification
  const [fullName, setFullName] = useState('');
  const [citizenship, setCitizenship] = useState('');
  const [messagingPhone, setMessagingPhone] = useState('');

  // Step 1: Flight & Layover Logistics
  const [layoverDate, setLayoverDate] = useState('');
  const [inboundFlight, setInboundFlight] = useState('');
  const [inboundTime, setInboundTime] = useState('');
  const [outboundFlight, setOutboundFlight] = useState('');
  const [outboundTime, setOutboundTime] = useState('');
  const [hours, setHours] = useState(5);

  // Sub-row Logistics & PWD Support
  const [groupSize, setGroupSize] = useState('1 Passenger');
  const [luggageNeeds, setLuggageNeeds] = useState('Cabin Bags Only');
  const [terminal, setTerminal] = useState('Terminal 2 (International Arrivals)');
  const [visaArranged, setVisaArranged] = useState(true);
  const [needsPhysicalAssistance, setNeedsPhysicalAssistance] = useState(false);

  // Role Filtering & Database State
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'ALL' | 'GUIDE' | 'INTERPRETER'>('ALL');
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuideForBooking, setSelectedGuideForBooking] = useState<any | null>(null);

  useEffect(() => {
    async function fetchVerifiedGuides() {
      setLoading(true);
      try {
        const res = await fetch('/api/guides');
        const data = await res.json();
        if (res.ok && data.success) {
          setGuides(data.guides);
        }
      } catch (err) {
        console.error('Failed to load guides', err);
      } finally {
        setLoading(false);
      }
    }
    fetchVerifiedGuides();
  }, []);

  const getGuidePriceForDuration = (guide: any) => {
    if (guide.guideProfile?.registrationRole === 'INTERPRETER') {
      const hourlyRate = guide.guideProfile?.pricePerHour || 20;
      return hourlyRate * hours;
    }

    const tiers = guide.guideProfile?.tieredRates;
    const durationKey = `${hours}h`;

    if (tiers && tiers[durationKey]) {
      return tiers[durationKey];
    }

    const baseRate = guide.guideProfile?.pricePerHour || 20;
    return baseRate * hours;
  };

  const filteredGuides = guides.filter((g) => {
    const role = g.guideProfile?.registrationRole || 'GUIDE';
    if (selectedRoleFilter !== 'ALL' && role !== selectedRoleFilter) return false;
    return true;
  });

  const handleGuideSelect = (guide: any, calculatedPrice: number) => {
    if (!fullName || !messagingPhone) {
      alert('Please fill in your Full Name and WhatsApp/Telegram Number before selecting a guide.');
      return;
    }
    if (!layoverDate || !inboundFlight) {
      alert('Please provide your flight details so your guide can track arrival delays.');
      return;
    }
    setSelectedGuideForBooking({ ...guide, calculatedPrice });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-emerald-950 text-white p-8 rounded-3xl shadow-md border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4" /> Addis Ababa Bole International Airport (ADD)
            </div>
            <h1 className="text-3xl font-black">Layover Tour Customization</h1>
            <p className="text-emerald-200 text-sm mt-1">Direct partner connection. Compare individual rates & book verified local guides.</p>
          </div>
        </div>

        {/* Step 1: Traveler Identification & Layover Details Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          
          {/* Section 1: Identification */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase text-[#064e3b] tracking-wider border-b-2 border-emerald-900/20 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-[#064e3b]" /> 1. Traveler Identification
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Citizenship / Country</label>
                <input
                  type="text"
                  required
                  value={citizenship}
                  onChange={(e) => setCitizenship(e.target.value)}
                  placeholder="e.g. United States"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-800" /> WhatsApp / Telegram #
                </label>
                <input
                  type="tel"
                  required
                  value={messagingPhone}
                  onChange={(e) => setMessagingPhone(e.target.value)}
                  placeholder="e.g. +14155552671"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Flight Logistics */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-black uppercase text-[#064e3b] tracking-wider border-b-2 border-emerald-900/20 pb-2 flex items-center gap-2">
              <Plane className="w-4 h-4 text-[#064e3b]" /> 2. Flight & Layover Logistics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Layover Date */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Layover Date</label>
                <input
                  type="date"
                  value={layoverDate}
                  onChange={(e) => setLayoverDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 transition-all"
                />
              </div>

              {/* Inbound Flight # & Time (Wider time box to avoid AM/PM clipping) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Inbound Flight # & Time</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inboundFlight}
                    onChange={(e) => setInboundFlight(e.target.value)}
                    placeholder="ET 501"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 transition-all"
                  />
                  <input
                    type="time"
                    value={inboundTime}
                    onChange={(e) => setInboundTime(e.target.value)}
                    className="w-32 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 transition-all shrink-0"
                  />
                </div>
              </div>

              {/* Outbound Flight # & Time (Wider time box) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Outbound Flight # & Time</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={outboundFlight}
                    onChange={(e) => setOutboundFlight(e.target.value)}
                    placeholder="ET 708"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 transition-all"
                  />
                  <input
                    type="time"
                    value={outboundTime}
                    onChange={(e) => setOutboundTime(e.target.value)}
                    className="w-32 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 transition-all shrink-0"
                  />
                </div>
              </div>

            </div>

            {/* Layover Duration Slider */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 mt-4">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800 uppercase">
                <span>Layover Duration Window</span>
                <span className="text-emerald-950 font-black text-sm">{hours} Hours</span>
              </div>
              <input
                type="range"
                min="3"
                max="8"
                step="1"
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
            </div>

            {/* Requested Logistics & PWD Sub-row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200">
              {/* Group Size */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Group Size</label>
                <select
                  value={groupSize}
                  onChange={(e) => setGroupSize(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                >
                  <option value="1 Passenger">1 Passenger</option>
                  <option value="2 Passengers">2 Passengers</option>
                  <option value="3+ Passengers (Van Needed)">3+ Passengers (Van Needed)</option>
                </select>
              </div>

              {/* Luggage Needs */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Luggage Needs</label>
                <select
                  value={luggageNeeds}
                  onChange={(e) => setLuggageNeeds(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                >
                  <option value="Cabin Bags Only">Cabin Bags Only</option>
                  <option value="Large Checked Bags (Trunk Needed)">Large Checked Bags (Trunk Needed)</option>
                </select>
              </div>

              {/* Terminal Dropdown */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Terminal</label>
                <select
                  value={terminal}
                  onChange={(e) => setTerminal(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                >
                  <option value="Terminal 2 (International Arrivals)">Terminal 2 (International Arrivals)</option>
                  <option value="Terminal 1 (Domestic/Regional)">Terminal 1 (Domestic/Regional)</option>
                </select>
              </div>

              {/* Visa Checkbox & PWD Special Needs */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-800 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visaArranged}
                    onChange={(e) => setVisaArranged(e.target.checked)}
                    className="accent-emerald-800 rounded cursor-pointer"
                  />
                  Transit Visa Arranged
                </label>

                <label className="flex items-center gap-2 text-xs text-emerald-950 font-black cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needsPhysicalAssistance}
                    onChange={(e) => setNeedsPhysicalAssistance(e.target.checked)}
                    className="accent-emerald-800 rounded cursor-pointer"
                  />
                  <Accessibility className="w-4 h-4 text-emerald-800 shrink-0" />
                  Physical Assistance Needed (PWD)
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* Step 2: Guide & Interpreter Directory Listing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase text-slate-900 tracking-wider">
              Step 2: Choose Your Preferred Guide / Interpreter ({filteredGuides.length} Available)
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Role:</span>
              {(['ALL', 'GUIDE', 'INTERPRETER'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRoleFilter(role)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedRoleFilter === role
                      ? 'bg-emerald-950 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {role === 'ALL' ? 'All Partners' : role === 'GUIDE' ? 'Guides' : 'Interpreters'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-xs text-slate-500 font-semibold">Loading verified local partners...</div>
          ) : filteredGuides.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-500 text-sm font-medium">
              No active partners found matching your filter criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map((guide) => {
                const calculatedPrice = getGuidePriceForDuration(guide);
                const isInterpreter = guide.guideProfile?.registrationRole === 'INTERPRETER';

                return (
                  <div key={guide.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-6 hover:border-emerald-700 transition-all">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black text-lg">
                            {guide.name[0]}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-base">{guide.name}</h3>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                              isInterpreter 
                                ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}>
                              {isInterpreter ? 'Language Interpreter' : 'Certified Tour Guide'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-emerald-700" />
                          <span>Spoken: <strong className="text-slate-800">{guide.guideProfile?.languages?.join(', ') || 'English'}</strong></span>
                        </div>

                        {!isInterpreter && (
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-emerald-700" />
                            <span>Vehicle: <strong className="text-slate-800">{guide.guideProfile?.hasVehicle ? guide.guideProfile.vehicleDetails : 'No vehicle provided'}</strong></span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          {hours}h Total Rate
                        </span>
                        <div className="text-2xl font-black text-emerald-950">${calculatedPrice} USD</div>
                      </div>
                      <button
                        onClick={() => handleGuideSelect(guide, calculatedPrice)}
                        className="px-5 py-3 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider cursor-pointer"
                      >
                        Select & Book
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal: Step 3 Checkout, Passport Photo Verification & Payment */}
        {selectedGuideForBooking && (
          <BookingModal
            guide={selectedGuideForBooking}
            tourDetails={{
              fullName,
              citizenship,
              messagingPhone,
              hours,
              layoverDate,
              inboundFlight,
              inboundTime,
              outboundFlight,
              outboundTime,
              groupSize,
              luggageNeeds,
              terminal,
              visaArranged,
              needsPhysicalAssistance,
            }}
            calculatedPrice={selectedGuideForBooking.calculatedPrice}
            onClose={() => setSelectedGuideForBooking(null)}
          />
        )}

      </div>
    </div>
  );
}