'use client';

import { useState } from 'react';
import { 
  X, ShieldCheck, CheckCircle2, Loader2, Clock, 
  UploadCloud, CreditCard, User, Globe, Phone, FileText, Accessibility
} from 'lucide-react';

interface BookingModalProps {
  guide: any;
  tourDetails: any;
  calculatedPrice: number;
  onClose: () => void;
}

export default function BookingModal({ guide, tourDetails, calculatedPrice, onClose }: BookingModalProps) {
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [loading, setLoading] = useState(false);
  const [passportFileName, setPassportFileName] = useState('');
  const [error, setError] = useState('');

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!passportFileName) {
      setError('Please upload your passport photo for airport clearance and guide meeting verification.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travelerName: tourDetails.fullName,
          travelerPhone: tourDetails.messagingPhone,
          citizenship: tourDetails.citizenship,
          guideId: guide.id,
          hours: tourDetails.hours,
          totalPrice: calculatedPrice,
          languages: guide.guideProfile?.languages || ['English'],
          flightDetails: {
            layoverDate: tourDetails.layoverDate,
            inboundFlight: tourDetails.inboundFlight,
            inboundTime: tourDetails.inboundTime,
            outboundFlight: tourDetails.outboundFlight,
            outboundTime: tourDetails.outboundTime,
            groupSize: tourDetails.groupSize,
            luggageNeeds: tourDetails.luggageNeeds,
            terminal: tourDetails.terminal,
            visaArranged: tourDetails.visaArranged,
            needsPhysicalAssistance: tourDetails.needsPhysicalAssistance,
            passportUrl: passportFileName,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Booking submission failed.');
      }

      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Error processing booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm font-sans animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-950 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">Step 3: Identity Verification & Checkout</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'checkout' ? (
          <form onSubmit={handleConfirmBooking} className="p-6 space-y-5">
            
            {/* Summary Breakdown Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-slate-900">
                <span>Selected Partner:</span>
                <span className="text-emerald-900 font-extrabold">{guide.name}</span>
              </div>
              
              <div className="flex justify-between text-slate-600">
                <span>Traveler Details:</span>
                <span className="font-semibold text-slate-800">{tourDetails.fullName || 'Traveler'} ({tourDetails.citizenship || 'N/A'})</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Contact (WhatsApp):</span>
                <span className="font-semibold text-slate-800">{tourDetails.messagingPhone || 'N/A'}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Layover & Flight:</span>
                <span>{tourDetails.hours} Hours • {tourDetails.inboundFlight || 'TBD'} ({tourDetails.terminal || 'Terminal 2'})</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Group & Luggage:</span>
                <span>{tourDetails.groupSize} • {tourDetails.luggageNeeds}</span>
              </div>

              {tourDetails.needsPhysicalAssistance && (
                <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 font-bold text-[11px] flex items-center gap-1.5 mt-1">
                  <Accessibility className="w-4 h-4 text-amber-800 shrink-0" /> Physical Assistance (PWD) requested for terminal transfer.
                </div>
              )}

              <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                <span>Total Amount Due ({tourDetails.hours} Hours):</span>
                <span className="text-emerald-900">${calculatedPrice}.00 USD</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Passport Document / Verification Picture */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Passport Photo / Verification Picture
              </label>
              <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-center hover:border-emerald-700 transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  required
                  onChange={(e) => setPassportFileName(e.target.files?.[0]?.name || 'passport_verification.jpg')}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-8 h-8 text-emerald-800 mx-auto mb-1" />
                <span className="text-xs font-bold text-slate-800 block">
                  {passportFileName ? `Attached: ${passportFileName}` : 'Click to Upload Passport Photo'}
                </span>
                <span className="text-[10px] text-slate-500">Required for airport security clearance & guide match</span>
              </div>
            </div>

            {/* Payment Method Integration (Chapa / Card) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Payment Option
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  readOnly
                  value="💳 Chapa Gateway / Visa / Mastercard ($ USD)"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-950 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Pay ${calculatedPrice} USD & Confirm Booking
            </button>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Booking Confirmed!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Thank you, <strong className="text-slate-900">{tourDetails.fullName || 'Traveler'}</strong>! Your partner <strong className="text-slate-900">{guide.name}</strong> has been notified and will monitor flight <strong className="text-emerald-800 font-mono">{tourDetails.inboundFlight || 'TBD'}</strong> for arrival at <strong className="text-slate-900">{tourDetails.terminal || 'Terminal 2'}</strong>.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 uppercase tracking-wider"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}