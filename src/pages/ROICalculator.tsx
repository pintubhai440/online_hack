import { useState } from 'react';
import { TrendingUp, ChevronLeft, DollarSign, Clock, BarChart2, IndianRupee, Info } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { calculateROI, formatINR, formatUSD, calculateEMI } from '../lib/calculations';
import type { ROIResult } from '../types';

const PROGRAMS = [
  { label: 'MS Computer Science (USA)', tuitionUSD: 50000, livingUSD: 18000, salaryUSD: 110000 },
  { label: 'MBA (USA Top 20)', tuitionUSD: 65000, livingUSD: 22000, salaryUSD: 130000 },
  { label: 'MEng (UK Russell Group)', tuitionUSD: 38000, livingUSD: 16000, salaryUSD: 70000 },
  { label: 'MS Data Science (Canada)', tuitionUSD: 26000, livingUSD: 14000, salaryUSD: 65000 },
  { label: 'MTech (IIT / IISc)', tuitionUSD: 3000, livingUSD: 3000, salaryUSD: 35000 },
  { label: 'MBA (IIM A/B/C)', tuitionUSD: 18000, livingUSD: 6000, salaryUSD: 55000 },
  { label: 'Custom', tuitionUSD: 0, livingUSD: 0, salaryUSD: 0 },
];

export default function ROICalculator() {
  const { setCurrentPage } = useApp();
  const [selectedProgram, setSelectedProgram] = useState(0);
  const [tuitionUSD, setTuitionUSD] = useState(50000);
  const [livingUSD, setLivingUSD] = useState(18000);
  const [durationYears, setDurationYears] = useState(2);
  const [salaryUSD, setSalaryUSD] = useState(110000);
  const [loanPercent, setLoanPercent] = useState(70);
  const [result, setResult] = useState<ROIResult | null>(null);
  const [calculated, setCalculated] = useState(false);

  function handleProgramChange(idx: number) {
    setSelectedProgram(idx);
    const p = PROGRAMS[idx];
    if (idx < PROGRAMS.length - 1) {
      setTuitionUSD(p.tuitionUSD);
      setLivingUSD(p.livingUSD);
      setSalaryUSD(p.salaryUSD);
    }
  }

  function handleCalculate() {
    const totalCostUSD = (tuitionUSD + livingUSD) * durationYears;
    const loanAmountINR = totalCostUSD * 83.5 * (loanPercent / 100);
    const res = calculateROI({ tuitionUSD, livingCostUSD: livingUSD, durationYears, expectedSalaryUSD: salaryUSD, loanAmountINR });
    setResult(res);
    setCalculated(true);
  }

  const totalCostUSD = (tuitionUSD + livingUSD) * durationYears;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => setCurrentPage('dashboard')} className="p-2 hover:bg-white rounded-lg border border-slate-200 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">ROI Calculator</h1>
            <p className="text-slate-500 text-sm">Model your education investment returns</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Inputs */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Program Selection</h3>
              <div className="space-y-2">
                {PROGRAMS.map((p, i) => (
                  <button key={i} onClick={() => handleProgramChange(i)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${selectedProgram === i ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200' : 'text-slate-600 hover:bg-slate-50 border border-transparent'}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Cost Parameters</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-700">Annual Tuition</label>
                    <span className="text-sm font-bold text-blue-600">{formatUSD(tuitionUSD)}</span>
                  </div>
                  <input type="range" min="0" max="100000" step="1000" value={tuitionUSD} onChange={e => setTuitionUSD(parseInt(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-700">Annual Living Cost</label>
                    <span className="text-sm font-bold text-blue-600">{formatUSD(livingUSD)}</span>
                  </div>
                  <input type="range" min="0" max="40000" step="500" value={livingUSD} onChange={e => setLivingUSD(parseInt(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-700">Program Duration</label>
                    <span className="text-sm font-bold text-blue-600">{durationYears} year{durationYears > 1 ? 's' : ''}</span>
                  </div>
                  <input type="range" min="1" max="4" step="1" value={durationYears} onChange={e => setDurationYears(parseInt(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-700">Expected Salary (post-grad)</label>
                    <span className="text-sm font-bold text-blue-600">{formatUSD(salaryUSD)}/yr</span>
                  </div>
                  <input type="range" min="20000" max="200000" step="5000" value={salaryUSD} onChange={e => setSalaryUSD(parseInt(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-700">Loan Financing %</label>
                    <span className="text-sm font-bold text-blue-600">{loanPercent}%</span>
                  </div>
                  <input type="range" min="0" max="100" step="5" value={loanPercent} onChange={e => setLoanPercent(parseInt(e.target.value))} className="w-full accent-blue-600" />
                </div>
              </div>
              <button onClick={handleCalculate} className="w-full mt-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors">
                Calculate ROI
              </button>
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-3 space-y-5">
            {!calculated && (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm text-center">
                <BarChart2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-slate-500 font-medium">Configure your program details and click Calculate ROI</h3>
              </div>
            )}

            {calculated && result && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Total Education Cost', value: formatINR(result.totalCostINR), sub: formatUSD(result.totalCostUSD), icon: DollarSign, color: 'text-slate-600 bg-slate-50' },
                    { label: '10-Year Net Gain', value: formatINR(result.tenYearNetGainINR), sub: result.tenYearNetGainINR > 0 ? 'vs staying in India' : 'Consider carefully', icon: TrendingUp, color: result.tenYearNetGainINR > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50' },
                    { label: 'Investment Payback', value: `${result.paybackYears.toFixed(1)} yrs`, sub: 'From graduation', icon: Clock, color: 'text-amber-600 bg-amber-50' },
                    { label: 'ROI', value: `${result.roiPercentage.toFixed(0)}%`, sub: '10-year horizon', icon: BarChart2, color: result.roiPercentage > 100 ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                        <s.icon className="w-5 h-5" />
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{s.sub}</div>
                      <div className="text-slate-600 text-sm font-medium mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Loan EMI breakdown */}
                {result.emiMonthly > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-teal-600" /> Loan EMI Scenarios
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[{ tenure: 7, rate: 10.5 }, { tenure: 10, rate: 11.0 }, { tenure: 15, rate: 9.5 }].map(scenario => {
                        const loanAmt = totalCostUSD * 83.5 * (loanPercent / 100);
                        const emi = calculateEMI(loanAmt, scenario.rate, scenario.tenure);
                        return (
                          <div key={scenario.tenure} className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-lg font-extrabold text-teal-700">{formatINR(emi)}</div>
                            <div className="text-xs text-slate-500 mt-1">{scenario.tenure} yr @ {scenario.rate}%</div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-slate-400 mt-3 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      EMI starts after course completion. Tax benefit u/s 80E applies. Actual rates may vary.
                    </p>
                  </div>
                )}

                {/* Salary chart bars */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-4">Salary Comparison</h3>
                  <div className="space-y-3">
                    {[
                      { label: `Post-grad (${PROGRAMS[selectedProgram].label.includes('USA') ? 'USA' : 'Abroad'})`, salary: salaryUSD, max: 200000 },
                      { label: 'Avg India IT salary', salary: 20000, max: 200000 },
                      { label: 'IIT/IIM graduate (India)', salary: 38000, max: 200000 },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">{item.label}</span>
                          <span className="font-semibold text-slate-900">{formatUSD(item.salary)}/yr</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${(item.salary / item.max) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => setCurrentPage('loan')} className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors">
                  Explore Education Loan Options
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
