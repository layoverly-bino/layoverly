export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 font-sans">
      <div className="max-w-3xl mx-auto px-4 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-slate-700 text-xs leading-relaxed">
        <h1 className="text-2xl font-black text-slate-900 border-b pb-4">Terms of Service</h1>

        <p>
          Welcome to <strong>Layoverly.et</strong>. By accessing our marketplace platform or booking a layover guide in Addis Ababa, you agree to these terms.
        </p>

        <h2 className="text-sm font-black text-slate-900 uppercase">1. Layover Marketplace Model</h2>
        <p>
          Layoverly.et functions as a peer-to-peer platform connecting international transit travelers at Bole International Airport with independent, vetted tour guides and interpreters.
        </p>

        <h2 className="text-sm font-black text-slate-900 uppercase">2. Transit Visa & Flight Responsibilities</h2>
        <p>
          Travelers are responsible for verifying their eligibility for transit visas or transit clearance into Addis Ababa prior to exiting the terminal.
        </p>

        <h2 className="text-sm font-black text-slate-900 uppercase">3. Partner Verification</h2>
        <p>
          All local guides and interpreters register with confirmed identification and tour licenses. Partners set their own rates across layover duration tiers (3 hours to 8 hours).
        </p>
      </div>
    </div>
  );
}