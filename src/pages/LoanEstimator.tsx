import { useState } from 'react';
import { IndianRupee, ChevronLeft, CheckCircle2, XCircle, Shield, Clock, FileText, Loader2, Info } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getLoanOffers, formatINR, calculateEMI } from '../lib/calculations';
import { supabase } from '../lib/supabase';

const TENURE_OPTIONS = [5, 7, 10, 12, 15];

export default function LoanEstimator() {
  const { setCurrentPage, user, profile } = useApp();
  const [loanAmountL, setLoanAmountL] = useState(40);
  const [hasCollateral, setHasCollateral] = useState(false);
  const [familyIncomeL, setFamilyIncomeL] = useState(10);
  const [selectedTenure, setSelectedTenure] = useState(10);
  const [university, setUniversity] = useState('');
  const [program, setProgram] = useState('');
  const [country, setCountry] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [applying, setApplying] = useState<string | null>(null);
  const [applied, setApplied] = useState<Set<string>>(new Set());

  const loanAmountINR = loanAmountL * 100000;
  const familyIncomeINR = familyIncomeL * 100000;
  const offers = getLoanOffers({ loanAmountINR, hasCollateral, familyIncomeINR });

  async function handleApply(lender: string) {
    if (!user) return;
    setApplying(lender);
    await supabase.from('loan_inquiries').insert({
      user_id: user.id,
      university: university || 'Not specified',
      program: program || (profile?.target_field || 'Not specified'),
      country: country || (profile?.target_countries?.[0] || 'Not specified'),
      estimated_cost_usd: loanAmountL * 1200,
      loan_amount_requested: loanAmountINR,
      status: 'applied',
    });
    setApplied(a => new Set([...a, lender]));
    setApplying(null);
  }

  const eligibleOffers = offers.filter(o => o.eligible);

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => setCurrentPage('dashboard')} className="p-2 hover:bg-white rounded-lg border border-slate-200 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm">
            <IndianRupee className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Education Loan Estimator</h1>
            <p className="text-slate-500 text-sm">Compare personalized loan offers from top NBFCs & banks</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Inputs */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Your Requirements</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">Loan Amount</label>
                    <span className="text-lg font-extrabold text-teal-700">₹{loanAmountL} Lakhs</span>
                  </div>
                  <input type="range" min="5" max="150" step="5" value={loanAmountL} onChange={e => setLoanAmountL(parseInt(e.target.value))} className="w-full accent-teal-600" />
                  <div className="flex justify-between text-xs text-slate-400 mt-1"><span>₹5L</span><span>₹150L</span></div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">Annual Family Income</label>
                    <span className="text-sm font-bold text-slate-700">₹{familyIncomeL} Lakhs/yr</span>
                  </div>
                  <input type="range" min="3" max="50" step="1" value={familyIncomeL} onChange={e => setFamilyIncomeL(parseInt(e.target.value))} className="w-full accent-teal-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Repayment Tenure</label>
                  <div className="flex gap-2">
                    {TENURE_OPTIONS.map(t => (
                      <button key={t} onClick={() => setSelectedTenure(t)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${selectedTenure === t ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                        {t}yr
                      </button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer" onClick={() => setHasCollateral(!hasCollateral)}>
                  <div className={`w-10 h-6 rounded-full transition-colors relative ${hasCollateral ? 'bg-teal-600' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${hasCollateral ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                  <span className="text-sm text-slate-700">I have collateral / property</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Study Details (Optional)</h3>
              <div className="space-y-3">
                <input value={university} onChange={e => setUniversity(e.target.value)} placeholder="Target university" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                <input value={program} onChange={e => setProgram(e.target.value)} placeholder="Program / course" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>

            <button onClick={() => setCalculated(true)} className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" /> Check Eligibility (No CIBIL Impact)
            </button>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
              <p className="font-semibold mb-1 flex items-center gap-2"><Info className="w-4 h-4" /> Tax Benefit u/s 80E</p>
              <p className="text-blue-600 text-xs">The entire interest paid on education loan is deductible. No upper limit. Benefit applies for 8 years from start of repayment.</p>
            </div>
          </div>

          {/* Right: Offers */}
          <div className="lg:col-span-3 space-y-4">
            {!calculated && (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
                <IndianRupee className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Set your loan requirements and check eligibility to see personalized offers</p>
              </div>
            )}

            {calculated && (
              <>
                <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-teal-100 text-sm">You qualify for</div>
                      <div className="text-3xl font-extrabold">{eligibleOffers.length} loan offer{eligibleOffers.length !== 1 ? 's' : ''}</div>
                    </div>
                    <CheckCircle2 className="w-12 h-12 text-teal-300" />
                  </div>
                  <div className="mt-3 text-sm text-teal-100">
                    Best rate: {Math.min(...eligibleOffers.map(o => o.interestRate)).toFixed(1)}% p.a. |
                    Lowest EMI: {formatINR(Math.min(...eligibleOffers.map(o => calculateEMI(loanAmountINR, o.interestRate, selectedTenure))))}
                  </div>
                </div>

                {offers.map((offer, i) => {
                  const emi = calculateEMI(loanAmountINR, offer.interestRate, selectedTenure);
                  const totalPayable = emi * selectedTenure * 12;
                  const totalInterest = totalPayable - loanAmountINR;
                  const isApplied = applied.has(offer.lender);
                  return (
                    <div key={i} className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${offer.eligible ? 'border-slate-100 hover:border-teal-200 hover:shadow-md' : 'border-slate-100 opacity-60'}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-slate-900 text-lg">{offer.lender}</h3>
                            {!offer.collateralRequired && <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-medium">No Collateral</span>}
                          </div>
                          {!offer.eligible && <span className="flex items-center gap-1 text-xs text-red-600"><XCircle className="w-3.5 h-3.5" /> Not eligible for current profile</span>}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-extrabold text-teal-700">{offer.interestRate}%</div>
                          <div className="text-xs text-slate-500">p.a.</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                          <div className="font-bold text-slate-900 text-sm">{formatINR(emi)}</div>
                          <div className="text-xs text-slate-500">Monthly EMI</div>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                          <div className="font-bold text-slate-900 text-sm">{formatINR(Math.min(offer.maxAmount, loanAmountINR))}</div>
                          <div className="text-xs text-slate-500">Loan amount</div>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                          <div className="font-bold text-slate-900 text-sm">{offer.tenureYears}yr max</div>
                          <div className="text-xs text-slate-500">Max tenure</div>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3 mb-4 text-xs text-slate-600">
                        <div className="flex justify-between mb-1"><span>Total interest</span><span className="font-medium">{formatINR(totalInterest)}</span></div>
                        <div className="flex justify-between"><span>Total payable</span><span className="font-semibold text-slate-800">{formatINR(totalPayable)}</span></div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {offer.features.map((f, j) => <span key={j} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg"><CheckCircle2 className="w-3 h-3" />{f}</span>)}
                      </div>

                      {offer.eligible && (
                        <button
                          onClick={() => handleApply(offer.lender)}
                          disabled={!!applying || isApplied}
                          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${isApplied ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}
                        >
                          {applying === offer.lender ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</> :
                           isApplied ? <><CheckCircle2 className="w-4 h-4" />Application Submitted!</> :
                           <><FileText className="w-4 h-4" />Apply Now — Get Callback</>}
                        </button>
                      )}
                    </div>
                  );
                })}

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700">
                  <p className="font-semibold mb-1 flex items-center gap-2"><Clock className="w-4 h-4" /> Disbursement Timeline</p>
                  <p>Pre-admission letter: 7–15 days | Post-admission offer letter: 3–7 days | Complete docs required before visa stamping</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
