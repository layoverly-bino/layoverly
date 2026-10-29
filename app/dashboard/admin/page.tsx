'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  LogOut, 
  KeyRound, 
  Phone, 
  Car, 
  Globe, 
  CheckCircle2, 
  X, 
  Search, 
  UserCheck, 
  ShoppingBag, 
  UserPlus, 
  Send,
  Users,
  PlusCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Tab State: 'orders' | 'queue' | 'verified' | 'admins'
  const [activeTab, setActiveTab] = useState<'orders' | 'queue' | 'verified' | 'admins'>('orders');

  // Data States
  const [pendingGuides, setPendingGuides] = useState<any[]>([]);
  const [verifiedGuides, setVerifiedGuides] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [fetchingData, setFetchingData] = useState(false);

  // Filter States for Verified Guides & Interpreters
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [vehicleFilter, setVehicleFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL'); // 'ALL' | 'GUIDE' | 'INTERPRETER'
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal States
  const [selectedGuide, setSelectedGuide] = useState<any | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [reassignGuideId, setReassignGuideId] = useState<string>('');
  const [notificationAlert, setNotificationAlert] = useState<string | null>(null);

  // New Admin Form States
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminMessage, setAdminMessage] = useState('');

  useEffect(() => {
    const session = sessionStorage.getItem('layoverly_admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
      fetchAllData();
    }
    setIsLoading(false);
  }, []);

  const fetchAllData = async () => {
    setFetchingData(true);
    try {
      const [pendingRes, verifiedRes, bookingsRes] = await Promise.all([
        fetch('/api/admin/pending-guides'),
        fetch('/api/admin/verified-guides'),
        fetch('/api/bookings'),
      ]);

      const pendingData = await pendingRes.json();
      const verifiedData = await verifiedRes.json();
      const bookingsData = await bookingsRes.json();

      if (pendingRes.ok && pendingData.success) setPendingGuides(pendingData.pendingGuides);
      if (verifiedRes.ok && verifiedData.success) setVerifiedGuides(verifiedData.verifiedGuides);
      if (bookingsRes.ok && bookingsData.success) setBookings(bookingsData.bookings);
    } catch (e) {
      console.error('Error loading admin portal data:', e);
    } finally {
      setFetchingData(false);
    }
  };

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

      if (res.ok && data.success && data.user.role === 'ADMIN') {
        sessionStorage.setItem('layoverly_admin_auth', 'true');
        setIsAuthenticated(true);
        fetchAllData();
      } else {
        setAuthError(data.error || 'Access denied. Valid Admin credentials required.');
      }
    } catch (err) {
      setAuthError('Unable to connect to database server.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('layoverly_admin_auth');
    setIsAuthenticated(false);
  };

  const handleApproveGuide = async (guideProfileId: string) => {
    try {
      const res = await fetch('/api/admin/pending-guides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guideId: guideProfileId }),
      });

      if (res.ok) {
        setSelectedGuide(null);
        fetchAllData();
      } else {
        alert('Failed to approve partner.');
      }
    } catch (err) {
      alert('Error connecting to database.');
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminMessage('');
    try {
      const res = await fetch('/api/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: adminName, email: adminEmail, phoneNumber: adminPhone, password: adminPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminMessage('✅ Admin account successfully created!');
        setAdminName(''); setAdminEmail(''); setAdminPhone(''); setAdminPassword('');
      } else {
        setAdminMessage(`❌ Error: ${data.error || 'Failed to create admin'}`);
      }
    } catch (err) {
      setAdminMessage('❌ Network error creating admin account.');
    }
  };

  const handleExecuteReassignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !reassignGuideId) return;

    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          newGuideId: reassignGuideId,
          status: 'ACCEPTED',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setNotificationAlert(data.notificationMessage || 'Guide successfully re-assigned!');
        setSelectedBooking(null);
        setReassignGuideId('');
        fetchAllData();
      } else {
        alert('Failed to re-assign guide.');
      }
    } catch (err) {
      alert('Error updating database record.');
    }
  };

  const filteredVerifiedGuides = verifiedGuides.filter((guide) => {
    const matchesSearch =
      guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (guide.phoneNumber && guide.phoneNumber.includes(searchQuery));

    const matchesLanguage =
      selectedLanguage === 'ALL' ||
      guide.guideProfile?.languages?.some((lang: string) =>
        lang.toLowerCase().includes(selectedLanguage.toLowerCase())
      );

    const matchesVehicle =
      vehicleFilter === 'ALL' ||
      (vehicleFilter === 'YES' && guide.guideProfile?.hasVehicle) ||
      (vehicleFilter === 'NO' && !guide.guideProfile?.hasVehicle);

    const matchesRole =
      roleFilter === 'ALL' ||
      guide.guideProfile?.registrationRole === roleFilter;

    return matchesSearch && matchesLanguage && matchesVehicle && matchesRole;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm font-semibold">
        Verifying security clearance...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-900 rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Admin Command Center</h1>
            <p className="text-xs text-slate-500 font-medium">Restricted executive portal. Password required.</p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Username / Email / Phone</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@layoverly.com"
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
              className="w-full py-4 bg-emerald-950 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-amber-400" /> Authenticate & Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> Executive Governance Portal
            </div>
            <h1 className="text-3xl font-black">Admin Command Center</h1>
            <p className="text-emerald-200 text-sm mt-0.5">layoverly.et System Oversight</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-emerald-900/80 p-1.5 rounded-2xl border border-emerald-800">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders' ? 'bg-amber-400 text-emerald-950 shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
            >
              Tour Orders ({bookings.length})
            </button>

            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'queue' ? 'bg-amber-400 text-emerald-950 shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
            >
              Approval Queue ({pendingGuides.length})
            </button>

            <button
              onClick={() => setActiveTab('verified')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'verified' ? 'bg-amber-400 text-emerald-950 shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
            >
              Verified Partners ({verifiedGuides.length})
            </button>

            <button
              onClick={() => setActiveTab('admins')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'admins' ? 'bg-amber-400 text-emerald-950 shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
            >
              Staff Admins
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 bg-emerald-950 hover:bg-rose-900 text-white rounded-xl transition-all border border-emerald-800 ml-1 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tourist Notification Banner */}
        {notificationAlert && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-700" /> {notificationAlert}
            </span>
            <button onClick={() => setNotificationAlert(null)} className="text-emerald-700 hover:underline cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: TOUR ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-800" /> Incoming Tour Orders
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspect incoming tour requests and re-assign verified guides when necessary.
                </p>
              </div>
              <button onClick={fetchAllData} className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer">
                Refresh Orders
              </button>
            </div>

            {fetchingData ? (
              <div className="text-center py-8 text-xs text-slate-500 font-semibold">Loading orders...</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-sm font-medium">
                No orders submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-base">
                          {booking.traveler?.name || 'Traveler'}
                        </span>
                        <span className="text-xs text-slate-500">({booking.hours}h Layover)</span>
                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-full">
                          {booking.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-4">
                        {booking.traveler?.phoneNumber && (
                          <span>Traveler Contact: <strong className="font-mono text-slate-900">{booking.traveler.phoneNumber}</strong></span>
                        )}
                        <span>Assigned Partner: <strong className="text-slate-900">{booking.guide?.user?.name || 'Unassigned'}</strong></span>
                        <span>Partner Phone: <strong className="font-mono text-emerald-800">{booking.guide?.user?.phoneNumber || 'N/A'}</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="px-4 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 self-start md:self-auto cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4 text-amber-400" /> Re-assign Partner
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VERIFIED GUIDES & INTERPRETERS */}
        {activeTab === 'verified' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-700" /> Verified Active Guides & Interpreters Directory
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Filter approved partners by role, language, and vehicle availability.</p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
                {filteredVerifiedGuides.length} Active Match(es)
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name or phone..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Role Filter */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 outline-none w-full cursor-pointer"
                >
                  <option value="ALL">All Roles</option>
                  <option value="GUIDE">Tour Guides</option>
                  <option value="INTERPRETER">Interpreters</option>
                </select>
              </div>

              {/* Language Filter */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-xl">
                <Globe className="w-4 h-4 text-emerald-800" />
                <span className="text-[11px] font-bold text-slate-400 uppercase">Lang:</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 outline-none w-full cursor-pointer"
                >
                  <option value="ALL">All Languages</option>
                  <option value="English">English</option>
                  <option value="French">French</option>
                  <option value="Amharic">Amharic</option>
                  <option value="Spanish">Spanish</option>
                  <option value="German">German</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </div>

              {/* Vehicle Filter */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-xl">
                <Car className="w-4 h-4 text-emerald-800" />
                <span className="text-[11px] font-bold text-slate-400 uppercase">Vehicle:</span>
                <select
                  value={vehicleFilter}
                  onChange={(e) => setVehicleFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 outline-none w-full cursor-pointer"
                >
                  <option value="ALL">All Partners</option>
                  <option value="YES">Vehicle Provided</option>
                  <option value="NO">No Vehicle</option>
                </select>
              </div>
            </div>

            {filteredVerifiedGuides.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-sm font-medium">
                No active partners found matching your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredVerifiedGuides.map((guide) => (
                  <div
                    key={guide.id}
                    onClick={() => setSelectedGuide(guide)}
                    className="p-5 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-200 transition-all cursor-pointer space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">{guide.name}</h3>
                          <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase ${
                            guide.guideProfile?.registrationRole === 'INTERPRETER' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {guide.guideProfile?.registrationRole || 'GUIDE'}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-emerald-800">{guide.phoneNumber || 'Phone N/A'}</span>
                      </div>
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="font-medium">Languages: {guide.guideProfile?.languages?.join(', ') || 'English'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="font-medium">
                          {guide.guideProfile?.hasVehicle
                            ? `Vehicle: ${guide.guideProfile.vehicleDetails}`
                            : 'No vehicle provided'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: APPROVAL QUEUE */}
        {activeTab === 'queue' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Pending Guide & Interpreter Registrations</h2>
                <p className="text-xs text-slate-500 mt-0.5">Click any applicant to inspect details and approve.</p>
              </div>
              <button onClick={fetchAllData} className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer">
                Refresh Queue
              </button>
            </div>

            {pendingGuides.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-sm font-medium">
                No pending registrations right now.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingGuides.map((guide) => (
                  <div
                    key={guide.id}
                    onClick={() => setSelectedGuide(guide)}
                    className="p-4 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-200 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">{guide.name}</span>
                        <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase ${
                          guide.guideProfile?.registrationRole === 'INTERPRETER' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {guide.guideProfile?.registrationRole || 'GUIDE'}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-emerald-800 font-bold">{guide.phoneNumber}</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApproveGuide(guide.guideProfile?.id);
                      }}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: STAFF ADMIN CREATION */}
        {activeTab === 'admins' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 max-w-2xl mx-auto">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-purple-700" /> Create Administrator Account
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Provision secure staff credentials for executive management oversight.</p>
            </div>

            {adminMessage && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                adminMessage.includes('✅') 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {adminMessage}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. Staff Member"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-purple-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="staff@layoverly.et"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-purple-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  placeholder="+2519........"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-purple-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-purple-700 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    title={showAdminPassword ? 'Hide password' : 'Show password'}
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md transition-all text-sm cursor-pointer"
              >
                Create Admin Account
              </button>
            </form>
          </div>
        )}

        {/* Modal: Re-assign Alternate Guide */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-100 space-y-6">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Order Dispatch
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">
                    Manage Order: {selectedBooking.traveler?.name || 'Layover Traveler'}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700 block">Initial Assigned Partner:</span>
                  <p className="text-slate-900 font-extrabold text-sm">
                    {selectedBooking.guide?.user?.name || 'Unassigned'} (Phone: {selectedBooking.guide?.user?.phoneNumber || 'N/A'})
                  </p>
                </div>

                <form onSubmit={handleExecuteReassignment} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Select Verified Replacement Guide / Interpreter
                    </label>
                    <select
                      required
                      value={reassignGuideId}
                      onChange={(e) => setReassignGuideId(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                    >
                      <option value="">-- Choose Alternate Verified Partner --</option>
                      {verifiedGuides.map((g) => (
                        <option key={g.guideProfile?.id || g.id} value={g.guideProfile?.id || g.id}>
                          {g.name} [{g.guideProfile?.registrationRole || 'GUIDE'}] • {g.phoneNumber || 'No Phone'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedBooking(null)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-amber-400" /> Confirm & Notify Tourist
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Guide / Interpreter Profile Detail */}
        {selectedGuide && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-100 space-y-6">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {selectedGuide.guideProfile?.registrationRole === 'INTERPRETER' ? 'Interpreter Details' : 'Guide Details'}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">{selectedGuide.name}</h3>
                </div>
                <button onClick={() => setSelectedGuide(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-800" />
                    <span className="font-bold text-slate-900">Phone (Login):</span>
                    <span className="font-mono text-emerald-800 font-bold">{selectedGuide.phoneNumber || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-800" />
                    <span className="font-bold text-slate-900">Languages:</span>{' '}
                    <strong>{selectedGuide.guideProfile?.languages?.join(', ') || 'English'}</strong>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-emerald-800" /> Vehicle Information
                  </span>
                  <p className="text-slate-600">
                    {selectedGuide.guideProfile?.hasVehicle
                      ? `Vehicle Provided: ${selectedGuide.guideProfile.vehicleDetails}`
                      : 'No vehicle provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button onClick={() => setSelectedGuide(null)} className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer">
                  Close
                </button>
                {!selectedGuide.guideProfile?.isVerified && (
                  <button
                    onClick={() => handleApproveGuide(selectedGuide.guideProfile?.id)}
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve Partner Account
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}