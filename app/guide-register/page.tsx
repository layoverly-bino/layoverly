'use client';

import { useState } from 'react';
import { 
  UserCheck, 
  Car, 
  CheckCircle2, 
  Award, 
  Languages, 
  AlertCircle,
  DollarSign,
  Clock,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function GuideRegistrationPage() {
  // Primary Role State
  const [role, setRole] = useState<'GUIDE' | 'INTERPRETER'>('GUIDE');

  // Basic Info State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Qualification Checkboxes (Simplified - No File Uploads)
  const [hasNationalId, setHasNationalId] = useState(false);
  const [hasLicense, setHasLicense] = useState(false);
  const [hasTourismDegree, setHasTourismDegree] = useState(false);

  // Pricing State
  const [interpreterHourlyRate, setInterpreterHourlyRate] = useState<number>(20);
  const [tieredRates, setTieredRates] = useState<Record<string, number>>({
    '3h': 60,
    '4h': 75,
    '5h': 90,
    '6h': 105,
    '7h': 120,
    '8h': 135,
  });

  // Vehicle Details (Guide Only)
  const [hasVehicle, setHasVehicle] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState('');

  // Language Levels
  const [languages, setLanguages] = useState<string[]>(['English', 'Amharic']);
  const [proficiency, setProficiency] = useState<Record<string, string>>({
    English: 'Professional',
    Amharic: 'Native',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const availableLanguages = [
    'English', 'Amharic', 'French', 'German', 
    'Spanish', 'Mandarin', 'Arabic', 'Italian', 'Japanese'
  ];

  const handleLanguageToggle = (lang: string) => {
    if (languages.includes(lang)) {
      setLanguages(languages.filter((l) => l !== lang));
      const newProf = { ...proficiency };
      delete newProf[lang];
      setProficiency(newProf);
    } else {
      setLanguages([...languages, lang]);
      setProficiency({ ...proficiency, [lang]: 'Fluent' });
    }
  };

  const handleProficiencyChange = (lang: string, level: string) => {
    setProficiency({ ...proficiency, [lang]: level });
  };

  const handleTieredRateChange = (durationKey: string, value: string) => {
    setTieredRates({
      ...tieredRates,
      [durationKey]: parseFloat(value) || 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!hasNationalId) {
      setError('Please confirm you possess a valid National ID or Passport.');
      setLoading(false);
      return;
    }

    if (role === 'GUIDE' && !hasLicense) {
      setError('Certified Tour Guides must confirm holding a valid Ethiopian Tour Guide License.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/guide/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          fullName,
          phoneNumber,
          email,
          password,
          hasNationalId,
          hasLicense: role === 'GUIDE' ? hasLicense : false,
          hasTourismDegree,
          languages,
          languageLevels: proficiency,
          pricePerHour: role === 'INTERPRETER' ? interpreterHourlyRate : tieredRates['3h'] / 3,
          tieredRates: role === 'GUIDE' ? tieredRates : null,
          hasVehicle: role === 'GUIDE' ? hasVehicle : false,
          vehicleDetails: role === 'GUIDE' && hasVehicle ? vehicleDetails : null,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Registration failed. Please check your details.');
      }
    } catch (err) {
      setError('Error connecting to registration server.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 text-center space-y-4 border border-slate-100">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Application Submitted!</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Welcome to Layoverly, <strong className="text-slate-900">{fullName}</strong>! Our team will reach out via WhatsApp/Telegram to collect your quick verification documents before activation.
          </p>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2">
            <Send className="w-4 h-4 text-emerald-800" /> Telegram Support: @LayoverlySupport
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner */}
        <div className="bg-emerald-950 text-white p-8 rounded-3xl shadow-md border border-emerald-800 text-center space-y-2">
          <span className="text-[10px] font-extrabold uppercase text-amber-400 bg-emerald-900 px-3 py-1 rounded-full border border-emerald-700">
            Partner Portal
          </span>
          <h1 className="text-3xl font-black">Register as Local Partner</h1>
          <p className="text-emerald-200 text-xs max-w-md mx-auto">
            Join Layoverly’s vetted team serving transit travelers at Bole International Airport (ADD). Zero paperwork required to start!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          
          {/* SECTION 1: ROLE SELECTION */}
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase text-[#064e3b] tracking-wider border-b-2 border-emerald-900/20 pb-2">
              1. I am registering as:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div
                onClick={() => setRole('GUIDE')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                  role === 'GUIDE'
                    ? 'border-emerald-800 bg-emerald-50/60 ring-2 ring-emerald-800/20'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className={`p-3 rounded-xl ${role === 'GUIDE' ? 'bg-emerald-900 text-white' : 'bg-white text-slate-600'}`}>
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Tour Guide</h3>
                  <p className="text-[11px] text-slate-500">Duration-based pricing (3h–8h)</p>
                </div>
              </div>

              <div
                onClick={() => setRole('INTERPRETER')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                  role === 'INTERPRETER'
                    ? 'border-emerald-800 bg-emerald-50/60 ring-2 ring-emerald-800/20'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className={`p-3 rounded-xl ${role === 'INTERPRETER' ? 'bg-emerald-900 text-white' : 'bg-white text-slate-600'}`}>
                  <Languages className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Language Interpreter</h3>
                  <p className="text-[11px] text-slate-500">Hourly rate pricing</p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* SECTION 2: BASIC ACCOUNT INFORMATION */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase text-[#064e3b] tracking-wider border-b-2 border-emerald-900/20 pb-2">
              2. Basic Account Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Benyam Tadesse"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Phone Number (Login)</label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +251911234567"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. guide@layoverly.et"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: QUALIFICATIONS & CHECKBOX CONFIRMATION */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase text-[#064e3b] tracking-wider border-b-2 border-emerald-900/20 pb-2 flex items-center justify-between">
              <span>3. Professional Qualifications</span>
              <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-bold">
                Documents sent later via Telegram/WhatsApp
              </span>
            </h2>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasNationalId}
                  onChange={(e) => setHasNationalId(e.target.checked)}
                  className="w-4 h-4 accent-emerald-800 rounded cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-800">
                  I confirm I hold a valid National ID or Passport
                </span>
              </label>

              {role === 'GUIDE' && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasLicense}
                    onChange={(e) => setHasLicense(e.target.checked)}
                    className="w-4 h-4 accent-emerald-800 rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    I hold a valid Ethiopian Tour Guide License
                  </span>
                </label>
              )}

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasTourismDegree}
                  onChange={(e) => setHasTourismDegree(e.target.checked)}
                  className="w-4 h-4 accent-emerald-800 rounded cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-800" /> I hold a Degree / Diploma in Tourism, Guiding, or Languages (Optional)
                </span>
              </label>
            </div>
          </div>

          {/* SECTION 4: SERVICE RATES & PRICING STRUCTURE */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase text-[#064e3b] tracking-wider border-b-2 border-emerald-900/20 pb-2 flex items-center justify-between">
              <span>4. Expected Service Rates</span>
              <span className="text-[10px] text-emerald-800 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {role === 'GUIDE' ? 'Layover Duration Tiers' : 'Per-Hour Rate'}
              </span>
            </h2>

            {role === 'GUIDE' ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  Specify your total expected pay ($ USD) for each tour layover duration (3 to 8 hours):
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[3, 4, 5, 6, 7, 8].map((hours) => {
                    const key = `${hours}h`;
                    return (
                      <div key={key} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                        <label className="block text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-800" /> {hours} Hour Tour
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">$</span>
                          <input
                            type="number"
                            required
                            min="10"
                            value={tieredRates[key] || ''}
                            onChange={(e) => handleTieredRateChange(key, e.target.value)}
                            placeholder="60"
                            className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-700 transition-all"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-emerald-800" /> Standard Interpreter Rate ($ USD / Hour)
                </label>
                <div className="relative max-w-xs">
                  <span className="absolute left-3.5 top-3 text-xs font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    required
                    min="5"
                    value={interpreterHourlyRate}
                    onChange={(e) => setInterpreterHourlyRate(parseFloat(e.target.value) || 0)}
                    placeholder="20"
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-700 transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 5: LANGUAGES & PROFICIENCY */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase text-[#064e3b] tracking-wider border-b-2 border-emerald-900/20 pb-2">
              5. Languages & Spoken Proficiency
            </h2>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {availableLanguages.map((lang) => {
                  const isSelected = languages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageToggle(lang)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-emerald-900 text-white border-emerald-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-extrabold text-slate-800 block">Proficiency Matrix:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {languages.map((lang) => (
                  <div key={lang} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{lang}</span>
                    <select
                      value={proficiency[lang] || 'Fluent'}
                      onChange={(e) => handleProficiencyChange(lang, e.target.value)}
                      className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 outline-none cursor-pointer"
                    >
                      <option value="Native">Native</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Professional">Professional</option>
                      <option value="Intermediate">Intermediate</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 6: VEHICLE LOGISTICS (HIDDEN FOR INTERPRETERS) */}
          {role === 'GUIDE' && (
            <div className="space-y-4 pt-2">
              <h2 className="text-xs font-black uppercase text-[#064e3b] tracking-wider border-b-2 border-emerald-900/20 pb-2">
                6. Vehicle Logistics
              </h2>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasVehicle}
                    onChange={(e) => setHasVehicle(e.target.checked)}
                    className="w-4 h-4 accent-emerald-800 rounded cursor-pointer"
                  />
                  <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-emerald-800" /> I have a vehicle for airport tours
                  </span>
                </label>

                {hasVehicle && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Vehicle Model & Plate Number</label>
                    <input
                      type="text"
                      required
                      value={vehicleDetails}
                      onChange={(e) => setVehicleDetails(e.target.value)}
                      placeholder="e.g. Toyota Minivan (Code 3 - A12345)"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 transition-all"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-950 hover:bg-emerald-900 text-white font-bold rounded-2xl shadow-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Submitting Application...' : 'Submit Quick Application'}
          </button>
        </form>

      </div>
    </div>
  );
}