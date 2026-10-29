export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 font-sans">
      <div className="max-w-3xl mx-auto px-4 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-slate-700 text-xs leading-relaxed">
        <h1 className="text-2xl font-black text-slate-900 border-b pb-4">Privacy Policy</h1>
        
        <p>
          At <strong>Layoverly.et</strong>, we prioritize the confidentiality and safety of travelers and local partners. This privacy policy details how information is handled when booking layover tours at Bole International Airport (ADD).
        </p>

        <h2 className="text-sm font-black text-slate-900 uppercase">1. Information We Collect</h2>
        <p>
          We collect essential details needed to arrange layover tours, including traveler name, nationality, flight details (inbound/outbound numbers and times), contact messaging information, and passport clearance photos submitted during booking.
        </p>

        <h2 className="text-sm font-black text-slate-900 uppercase">2. Use of Information</h2>
        <p>
          Traveler and flight logistics information is shared exclusively with your selected verified local tour guide or interpreter to ensure timely airport meeting dispatch and delay tracking.
        </p>

        <h2 className="text-sm font-black text-slate-900 uppercase">3. Data Retention & Security</h2>
        <p>
          Passport copies and identity verification documents submitted during checkout are stored securely in compliance with Ethiopian security and airport dispatch guidelines.
        </p>
      </div>
    </div>
  );
}