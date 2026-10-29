'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Star, 
  Calendar, 
  Power, 
  ShieldCheck, 
  Clock, 
  Lock, 
  LogOut, 
  KeyRound, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export default function GuideDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const [guideData, setGuideData] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(true);

  // Password Change States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  // Mock initial bookings for verified guides
  const [bookings, setBookings] = useState([
    {
      id: 'b-101',
      travelerName: 'Sarah Jenkins',
      citizenship: 'United States',
      hours: 5,
      price: 100.0,
      status: 'PENDING',
      interests: ['Food & Dining', 'History'],
      phoneNumber: '+14155552671',
      flightDetails: 'ET 500 (Arr: 07:15 AM)',
    },
    {
      id: 'b-102',
      travelerName: 'Liam Chen',
      citizenship: 'Canada',
      hours: 8,
      price: 160.0,
      status: 'ACCEPTED',
      interests: ['Architecture', 'Shopping'],
      phoneNumber: '+14165550192',
      flightDetails: 'ET 302 (Arr: 12:30 PM)',
    },
  ]);

  // Check existing session on load
  useEffect(() => {
    const session = sessionStorage.getItem('layoverly_guide_auth');
    const storedGuide = sessionStorage.getItem('layoverly_guide_user');
    
    if (session === 'true' && storedGuide) {
      setIsAuthenticated(true);
      try {
        setGuideData(JSON.parse(storedGuide));
      } catch (e) {
        console.error('Failed to parse guide user data', e);
      }
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success && (data.user.role === 'GUIDE' || data.user.role === 'ADMIN')) {
        sessionStorage.setItem('layoverly_guide_auth', 'true');
        sessionStorage.setItem('layoverly_guide_user', JSON.stringify(data.user));
        setGuideData(data.user);
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'Access denied. Valid guide phone number and password required.');
      }
    } catch (err) {
      setAuthError('Unable to connect to database server.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('layoverly_guide_auth');
    sessionStorage.removeItem('layoverly_guide_user');
    setIsAuthenticated(false);
    setGuideData(null);
  };

  const handleAcceptBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'ACCEPTED' } : b))
    );
  };

  const handleDeclineBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'DECLINED' } : b))
    );
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    try {
      const res = await fetch('/api/guide/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: guideData.id,
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordMessage('✅ Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setPasswordMessage(`❌ ${data.error || 'Failed to update password.'}`);
      }
    } catch (err) {
      setPasswordMessage('❌ Network error updating password.');
    }
  };

  // Prevent flash of content while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm font-semibold">
        Verifying security clearance...
      </div>
    );
  }

  // 🔒 HARD GUARD: Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-900 rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Guide Portal Sign In</h1>
            <p className="text-xs text-slate-500 font-medium">Enter your registered phone number or username for layoverly.et</p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl text-center leading-relaxed">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-800" /> Phone Number / Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. +251911234567 or guide"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-amber-400" /> Log In to Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Guide Dashboard View
  return (
    <div className="min-h-screen bg-slate-50 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner Profile
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900">
              {guideData?.name || 'Guide'}'s Portal
            </h1>
            <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-800" /> Bole International Airport (ADD) Hub •{' '}
              <span className="font-mono text-slate-700 font-semibold">{guideData?.phoneNumber || '+251 91 123 4567'}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl">
              <Power className={`w-5 h-5 ${isAvailable ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Status</span>
                <span className="text-sm font-extrabold text-slate-800">
                  {isAvailable ? 'Accepting Layovers' : 'Offline'}
                </span>
              </div>
              <button
                onClick={() => setIsAvailable(!isAvailable)}
                className={`ml-2 w-12 h-7 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  isAvailable ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                    isAvailable ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="p-3 bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 rounded-2xl transition-all border border-slate-200 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Earnings</span>
            <div className="text-3xl font-black text-slate-900 mt-2">$1,455.00</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rating</span>
            <div className="text-3xl font-black text-slate-900 mt-2 flex items-center gap-2">
              4.9 <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Tours</span>
            <div className="text-3xl font-black text-slate-900 mt-2">32 Trips</div>
          </div>
        </div>

        {/* Tour Assignments Queue */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-800" /> Assigned Layover Bookings
            </h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {bookings.length} Direct Requests
            </span>
          </div>

          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{booking.travelerName}</span>
                    <span className="text-xs text-slate-500 font-medium">({booking.citizenship})</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        booking.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : booking.status === 'DECLINED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-4">
                    <span>⏱️ Duration: <strong className="text-slate-900">{booking.hours} Hours</strong></span>
                    <span>✈️ Flight: <strong className="text-slate-900">{booking.flightDetails}</strong></span>
                    <span>📞 Contact: <strong className="text-emerald-800 font-mono">{booking.phoneNumber}</strong></span>
                  </div>

                  <div className="text-xs text-slate-500">
                    Interests: {booking.interests.join(', ')}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-200 pt-3 md:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Payout</span>
                    <span className="text-xl font-black text-slate-900">${booking.price}</span>
                  </div>

                  {booking.status === 'PENDING' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAcceptBooking(booking.id)}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Accept
                      </button>
                      <button
                        onClick={() => handleDeclineBooking(booking.id)}
                        className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" /> Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Password Management Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 max-w-xl">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-800" /> Security: Change Password
          </h3>
          {passwordMessage && (
            <div className={`p-3 rounded-xl text-xs font-bold ${passwordMessage.includes('✅') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
              {passwordMessage}
            </div>
          )}
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">New Secure Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <button type="submit" className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer">
              Update Password
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}