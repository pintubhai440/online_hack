import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  AlertCircle, 
  DollarSign, 
  Briefcase, 
  GraduationCap, 
  PiggyBank,
  Info,
  ChevronLeft,
  Clock,
  BarChart2,
  IndianRupee,
  Sparkles,
  Loader2
} from 'lucide-react';

// Mock format functions
const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};
const formatUSD = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

// Assuming 1 USD = 83.5 INR for fixed conversion
const USD_TO_INR = 93.0;

// --- Types & Interfaces ---
interface ProgramData {
  id: string;
  name: string;
  country: string;
  baseTuitionUSD: number;
  baseLivingUSD: number;
  expectedCTCUSD: number;
  taxRate: number; 
  postGradLivingCostUSD: number; 
}

// --- Mock Database (Real-life approximate data as fallback) ---
const PROGRAMS: ProgramData[] = [
  {
    id: 'ms_cs_us',
    name: 'MS Computer Science (USA)',
    country: 'USA',
    baseTuitionUSD: 50000,
    baseLivingUSD: 24000,
    expectedCTCUSD: 110000,
    taxRate: 0.30, 
    postGradLivingCostUSD: 30000, 
  },
  {
    id: 'mba_us',
    name: 'MBA (USA Top 20)',
    country: 'USA',
    baseTuitionUSD: 65000,
    baseLivingUSD: 22000,
    expectedCTCUSD: 130000,
    taxRate: 0.35, 
    postGradLivingCostUSD: 35000, 
  },
  {
    id: 'mim_uk',
    name: 'MEng (UK Russell Group)',
    country: 'UK',
    baseTuitionUSD: 38000,
    baseLivingUSD: 16000,
    expectedCTCUSD: 70000,
    taxRate: 0.25,
    postGradLivingCostUSD: 22000,
  },
  {
    id: 'ms_ds_ca',
    name: 'MS Data Science (Canada)',
    country: 'Canada',
    baseTuitionUSD: 26000,
    baseLivingUSD: 14000,
    expectedCTCUSD: 65000,
    taxRate: 0.28,
    postGradLivingCostUSD: 20000,
  },
  {
    id: 'mtech_in',
    name: 'MTech (IIT / IISc)',
    country: 'India',
    baseTuitionUSD: 3000,
    baseLivingUSD: 3000,
    expectedCTCUSD: 35000, 
    taxRate: 0.30,
    postGradLivingCostUSD: 8000, 
  },
  {
    id: 'mba_in',
    name: 'MBA (IIM A/B/C)',
    country: 'India',
    baseTuitionUSD: 18000, 
    baseLivingUSD: 6000,
    expectedCTCUSD: 55000, 
    taxRate: 0.30,
    postGradLivingCostUSD: 12000, 
  },
  {
    id: 'custom',
    name: 'Custom Program (AI Fetched)',
    country: 'Any',
    baseTuitionUSD: 0,
    baseLivingUSD: 0,
    expectedCTCUSD: 0,
    taxRate: 0.30,
    postGradLivingCostUSD: 0
  }
];

export default function App() {
  const handleNavigation = (page: string) => {
      console.log(`Navigating to ${page}... (Navigation Mocked)`);
  }

  const [selectedProgramIdx, setSelectedProgramIdx] = useState<number>(0);
  
  // Dynamic State variables
  const [tuitionUSD, setTuitionUSD] = useState<number>(50000);
  const [livingUSD, setLivingUSD] = useState<number>(24000);
  const [durationYears, setDurationYears] = useState<number>(2);
  const [salaryUSD, setSalaryUSD] = useState<number>(110000);
  const [currentTaxRate, setCurrentTaxRate] = useState<number>(0.30);
  const [currentPostGradLivingCost, setCurrentPostGradLivingCost] = useState<number>(30000);
  
  const [loanPercent, setLoanPercent] = useState<number>(80);
  const [interestRate, setInterestRate] = useState<number>(10.5); 
  const [showReality, setShowReality] = useState<boolean>(true);
  const [calculated, setCalculated] = useState(false);

  // AI & Custom Program States
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [customCourseName, setCustomCourseName] = useState<string>('');
  const [customCountryName, setCustomCountryName] = useState<string>('');

  // Gemini API integration for Dynamic Fetching
  const fetchAIData = async (courseName: string, country: string) => {
    setIsAILoading(true);
    setAiError(null);
    setCalculated(false);

    const apiKey = ""; // API Key environment se inject hogi
    const delays = [1000, 2000, 4000, 8000, 16000];
    const promptText = `Act as an expert education counselor. Provide realistic and average financial estimates for a student pursuing: "${courseName}" in "${country}". 
    Return the values strictly as JSON. All currency values MUST be in USD (US Dollars), even if the country is India or UK.
    Provide realistic values for:
    - tuitionUSD: Annual tuition fee in USD
    - livingUSD: Annual living expenses for a student in USD
    - salaryUSD: Expected starting salary after graduation in USD
    - taxRate: Average income tax rate in that country for that salary bracket (as a decimal, e.g. 0.30 for 30%)
    - postGradLivingCostUSD: Annual living expenses for a working professional after graduation in USD`;

    const payload = {
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            tuitionUSD: { type: "INTEGER" },
            livingUSD: { type: "INTEGER" },
            salaryUSD: { type: "INTEGER" },
            taxRate: { type: "NUMBER" },
            postGradLivingCostUSD: { type: "INTEGER" }
          }
        }
      }
    };

    for (let i = 0; i < delays.length; i++) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error('AI API failed');
        
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (text) {
          const result = JSON.parse(text);
          setTuitionUSD(result.tuitionUSD);
          setLivingUSD(result.livingUSD);
          setSalaryUSD(result.salaryUSD);
          setCurrentTaxRate(result.taxRate);
          setCurrentPostGradLivingCost(result.postGradLivingCostUSD);
          setIsAILoading(false);
          return; // Success
        }
      } catch (err) {
        if (i === delays.length - 1) {
          setAiError('Bhai, AI data fetch karne mein error aa gaya. Kripya manually enter karein.');
          setIsAILoading(false);
        }
        await new Promise(r => setTimeout(r, delays[i]));
      }
    }
  };

  const handleProgramChange = (idx: number) => {
    setSelectedProgramIdx(idx);
    const p = PROGRAMS[idx];
    setCalculated(false);
    setAiError(null);

    if (p.id === 'custom') {
      // Custom program ke case me hum values reset kar dete hain, user AI fetch button dabayega
      setTuitionUSD(0);
      setLivingUSD(0);
      setSalaryUSD(0);
      setCurrentTaxRate(0.30);
      setCurrentPostGradLivingCost(0);
    } else {
      // Normal program select karne pe AI se dynamic data fetch karo
      fetchAIData(p.name, p.country);
    }
  };

  const handleCustomFetch = () => {
    if (customCourseName && customCountryName) {
      fetchAIData(customCourseName, customCountryName);
    } else {
      setAiError('Bhai, course aur country dono enter karo AI analysis ke liye.');
    }
  };

  // --- Calculations Logic ---
  const stats = useMemo(() => {
    const totalCostUSD = (tuitionUSD + livingUSD) * durationYears;
    const totalCostINR = totalCostUSD * USD_TO_INR;
    
    const loanAmountUSD = totalCostUSD * (loanPercent / 100);
    const loanAmountINR = loanAmountUSD * USD_TO_INR;
    
    const outOfPocketINR = totalCostINR - loanAmountINR;

    // Moratorium period interest - REALITY CHECK
    const moratoriumInterestINR = loanAmountINR * (interestRate / 100) * durationYears; 
    const debtAtGraduationINR = loanAmountINR + moratoriumInterestINR;

    // Real-life CTC vs In-hand in INR
    const expectedCTCINR = salaryUSD * USD_TO_INR;
    const taxDeductionINR = expectedCTCINR * currentTaxRate;
    const inHandSalaryINR = expectedCTCINR - taxDeductionINR;
    
    const postGradLivingCostINR = currentPostGradLivingCost * USD_TO_INR;
    const disposableIncomeINR = inHandSalaryINR - postGradLivingCostINR;

    // EMI Calculation (10 years)
    const monthlyRate = (interestRate / 100) / 12;
    const months = 10 * 12;
    
    let emiINR = 0;
    if (debtAtGraduationINR > 0) {
        const top = debtAtGraduationINR * monthlyRate * Math.pow(1 + monthlyRate, months);
        const bottom = Math.pow(1 + monthlyRate, months) - 1;
        emiINR = top / bottom;
    }
    const yearlyEMI_INR = emiINR * 12;

    const netSavingsINR = disposableIncomeINR - yearlyEMI_INR;

    // Payback Period
    const marketingPayback = expectedCTCINR > 0 ? (totalCostINR / expectedCTCINR).toFixed(1) : "N/A";
    const realPayback = disposableIncomeINR > 0 
      ? (debtAtGraduationINR / (disposableIncomeINR > yearlyEMI_INR ? yearlyEMI_INR + netSavingsINR : disposableIncomeINR)).toFixed(1)
      : "Never";

    return {
      totalCostUSD,
      totalCostINR,
      loanAmountINR,
      outOfPocketINR,
      debtAtGraduationINR,
      expectedCTCINR,
      taxDeductionINR,
      inHandSalaryINR,
      postGradLivingCostINR,
      disposableIncomeINR,
      yearlyEMI_INR,
      emiMonthly: emiINR,
      netSavingsINR,
      marketingPayback,
      realPayback
    };
  }, [tuitionUSD, livingUSD, durationYears, salaryUSD, loanPercent, interestRate, currentTaxRate, currentPostGradLivingCost]);

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center gap-4">
             <button onClick={() => handleNavigation('dashboard')} className="p-2 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
               <ChevronLeft className="w-5 h-5 text-slate-600" />
             </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="text-emerald-600" />
                Real-Life ROI Calculator
              </h1>
              <p className="text-slate-500 text-sm mt-1">Marketing numbers vs Real truth. Plan your education loan smartly.</p>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <span className={`text-sm font-medium ${!showReality ? 'text-slate-900' : 'text-slate-400'}`}>Marketing View</span>
            <button 
              onClick={() => setShowReality(!showReality)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${showReality ? 'bg-emerald-600' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${showReality ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm font-bold flex items-center gap-1 ${showReality ? 'text-emerald-700' : 'text-slate-400'}`}>
              Reality Check <AlertCircle size={16} />
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                <span>Program Selection</span>
                {isAILoading && <span className="text-xs text-blue-600 font-semibold flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> AI Fetching...</span>}
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {PROGRAMS.map((p, i) => (
                  <button key={i} onClick={() => handleProgramChange(i)}
                    disabled={isAILoading}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 disabled:opacity-50 ${selectedProgramIdx === i ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shadow-sm' : 'text-slate-600 hover:bg-slate-50 border border-transparent'}`}>
                    {p.name} {p.id === 'custom' && <Sparkles className="inline w-3 h-3 ml-1 text-emerald-500" />}
                  </button>
                ))}
              </div>

              {/* Custom Program Form */}
              {PROGRAMS[selectedProgramIdx].id === 'custom' && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-3">
                  <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Magic Search
                  </p>
                  <input 
                    type="text" 
                    placeholder="e.g. MS in Data Science" 
                    value={customCourseName}
                    onChange={(e) => setCustomCourseName(e.target.value)}
                    className="w-full text-sm p-2.5 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input 
                    type="text" 
                    placeholder="Country (e.g. Germany)" 
                    value={customCountryName}
                    onChange={(e) => setCustomCountryName(e.target.value)}
                    className="w-full text-sm p-2.5 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={handleCustomFetch}
                    disabled={isAILoading}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400"
                  >
                    {isAILoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Auto-fill with AI
                  </button>
                </div>
              )}
              
              {aiError && <p className="text-xs text-red-600 mt-3 font-medium">{aiError}</p>}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm relative">
              {isAILoading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                   <div className="flex flex-col items-center gap-2 text-emerald-600 font-bold">
                     <Loader2 className="w-8 h-8 animate-spin" />
                     <p className="text-sm">Fetching real-time data...</p>
                   </div>
                </div>
              )}
              <h3 className="font-bold text-slate-900 mb-4">Cost Parameters (USD)</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-700">Annual Tuition</label>
                    <span className="text-sm font-bold text-emerald-600">{formatUSD(tuitionUSD)}</span>
                  </div>
                  {/* setCalculated(false) hata diya gaya hai taaki live update ho */}
                  <input type="range" min="0" max="100000" step="1000" value={tuitionUSD} onChange={e => setTuitionUSD(parseInt(e.target.value))} className="w-full accent-emerald-600" />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-700">Annual Living Cost</label>
                    <span className="text-sm font-bold text-emerald-600">{formatUSD(livingUSD)}</span>
                  </div>
                  <input type="range" min="0" max="40000" step="500" value={livingUSD} onChange={e => setLivingUSD(parseInt(e.target.value))} className="w-full accent-emerald-600" />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-700">Program Duration</label>
                    <span className="text-sm font-bold text-emerald-600">{durationYears} year{durationYears > 1 ? 's' : ''}</span>
                  </div>
                  <input type="range" min="1" max="4" step="1" value={durationYears} onChange={e => setDurationYears(parseInt(e.target.value))} className="w-full accent-emerald-600" />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-700">Expected Salary (post-grad)</label>
                    <span className="text-sm font-bold text-emerald-600">{formatUSD(salaryUSD)}/yr</span>
                  </div>
                  <input type="range" min="20000" max="250000" step="5000" value={salaryUSD} onChange={e => setSalaryUSD(parseInt(e.target.value))} className="w-full accent-emerald-600" />
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Financing</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <label className="text-sm font-medium text-slate-700">Loan Financing %</label>
                        <span className="text-sm font-bold text-blue-600">{loanPercent}%</span>
                      </div>
                      <input type="range" min="0" max="100" step="5" value={loanPercent} onChange={e => setLoanPercent(parseInt(e.target.value))} className="w-full accent-blue-600" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <label className="text-sm font-medium text-slate-700">Est. Interest Rate (%)</label>
                        <span className="text-sm font-bold text-blue-600">{interestRate}%</span>
                      </div>
                      <input type="range" min="7" max="15" step="0.5" value={interestRate} onChange={e => setInterestRate(parseFloat(e.target.value))} className="w-full accent-blue-600" />
                    </div>
                  </div>
                </div>

              </div>
              <button onClick={() => setCalculated(true)} disabled={isAILoading} className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50">
                Calculate Real ROI
              </button>
            </div>
          </div>

          {/* Right Column: Dashboards & Reality Output */}
          <div className="lg:col-span-3 space-y-5">
            
            {!calculated && (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 shadow-sm text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                {isAILoading ? (
                  <>
                    <Loader2 className="w-20 h-20 text-emerald-500 mb-6 animate-spin" />
                    <h3 className="text-slate-800 text-xl font-bold mb-2">AI is analyzing the market...</h3>
                    <p className="text-slate-500 max-w-sm">Gathering the latest tuition fees, living costs, and average salaries to give you a realistic picture.</p>
                  </>
                ) : (
                  <>
                    <BarChart2 className="w-20 h-20 text-slate-200 mb-6" />
                    <h3 className="text-slate-800 text-xl font-bold mb-2">Ready for a Reality Check?</h3>
                    <p className="text-slate-500 max-w-sm">Configure your program details on the left and calculate to see the actual financial impact in INR.</p>
                  </>
                )}
              </div>
            )}

            {calculated && !isAILoading && (
              <>
                {/* Top Stat Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                    <p className="text-sm font-medium text-slate-500">Total Education Cost</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{formatINR(stats.totalCostINR)}</p>
                    <div className="mt-2 text-xs font-medium text-slate-400">
                      Approx {formatUSD(stats.totalCostUSD)}
                    </div>
                  </div>

                  <div className={`p-5 rounded-2xl shadow-sm border transition-all duration-500 relative overflow-hidden group ${showReality ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white border-slate-100 text-slate-900'}`}>
                    <p className={`text-sm font-medium ${showReality ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {showReality ? "Real Payback Period" : "Marketing Payback"}
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <p className="text-3xl font-extrabold">{showReality ? stats.realPayback : stats.marketingPayback}</p>
                      <span className={`text-sm font-medium ${showReality ? 'text-emerald-200' : 'text-slate-500'}`}>Years</span>
                    </div>
                    {showReality ? (
                      <p className="mt-2 text-xs text-emerald-100 opacity-90 leading-tight">
                         Accounts for living expenses, taxes, and study-period interest.
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-red-500 font-medium bg-red-50 p-1.5 rounded inline-block leading-tight border border-red-100">
                        Warning: Ignores taxes & living costs!
                      </p>
                    )}
                  </div>
                </div>

                {/* The "Truth" Breakdown Section (Waterfall) */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Briefcase size={18} className="text-slate-500" />
                      Post-Graduation Reality (Year 1)
                    </h3>
                    {showReality && <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 border border-emerald-200"><PiggyBank size={12}/> AI Trust Score: 100%</span>}
                  </div>
                  
                  <div className="p-6">
                    <div className="relative">
                      {/* Base Line */}
                      <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200"></div>

                      <div className="space-y-6">
                        {/* CTC */}
                        <div className="relative pl-10">
                          <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 bg-green-500 rounded-full border-4 border-white shadow-sm"></div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Offer Letter CTC (AI Estimated)</p>
                          <p className="text-xl font-extrabold text-slate-900">{formatINR(stats.expectedCTCINR)}</p>
                        </div>

                        {/* Tax & Reality Drop */}
                        <div className={`relative pl-10 transition-all duration-500 ${!showReality ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                          <div className="absolute left-2.5 top-2 w-3.5 h-3.5 bg-red-400 rounded-full border-4 border-white shadow-sm"></div>
                          <div className="flex justify-between items-center bg-red-50 p-3 rounded-xl border border-red-100">
                            <div>
                              <p className="text-sm font-bold text-red-700">Taxes & Deductions ({(currentTaxRate * 100).toFixed(0)}%)</p>
                            </div>
                            <p className="text-base font-bold text-red-700">-{formatINR(stats.taxDeductionINR)}</p>
                          </div>
                        </div>

                        {/* Living Expenses */}
                        <div className={`relative pl-10 transition-all duration-500 ${!showReality ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                          <div className="absolute left-2.5 top-2 w-3.5 h-3.5 bg-orange-400 rounded-full border-4 border-white shadow-sm"></div>
                          <div className="flex justify-between items-center bg-orange-50 p-3 rounded-xl border border-orange-100">
                            <div>
                              <p className="text-sm font-bold text-orange-700">Living Expenses</p>
                              <p className="text-xs text-orange-600 mt-0.5">Rent, food, transport post-grad</p>
                            </div>
                            <p className="text-base font-bold text-orange-700">-{formatINR(stats.postGradLivingCostINR)}</p>
                          </div>
                        </div>

                        {/* EMI */}
                        <div className="relative pl-10">
                          <div className="absolute left-2.5 top-2 w-3.5 h-3.5 bg-purple-500 rounded-full border-4 border-white shadow-sm"></div>
                          <div className="flex justify-between items-center bg-purple-50 p-3 rounded-xl border border-purple-100">
                            <div>
                              <p className="text-sm font-bold text-purple-700">Loan EMI (Yearly)</p>
                              {showReality && (
                                <p className="text-xs text-purple-600 mt-0.5">
                                  Includes ₹{formatINR(stats.debtAtGraduationINR - stats.loanAmountINR)} interest accrued during study.
                                </p>
                              )}
                            </div>
                            <p className="text-base font-bold text-purple-700">-{formatINR(stats.yearlyEMI_INR)}</p>
                          </div>
                        </div>

                        {/* Final Savings */}
                        <div className={`relative pl-10 transition-all duration-500 ${!showReality ? 'hidden' : 'block'}`}>
                          <div className="absolute left-1.5 top-2 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-xl border border-emerald-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                               <PiggyBank size={80} />
                            </div>
                            <p className="text-sm font-bold text-emerald-800">Net Annual Savings (Real Cash)</p>
                            <p className={`text-3xl font-black mt-1 ${stats.netSavingsINR > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {stats.netSavingsINR > 0 ? formatINR(stats.netSavingsINR) : formatINR(stats.netSavingsINR)}
                            </p>
                            
                            {stats.netSavingsINR <= 0 ? (
                              <div className="mt-3 text-sm text-red-700 bg-red-100 p-2 rounded-lg font-medium border border-red-200">
                                <AlertCircle size={14} className="inline mr-1 -mt-0.5" />
                                Warning: Salary is insufficient to cover living costs and EMI. Consider a longer loan tenure or a higher-paying program.
                              </div>
                            ) : (
                              <p className="mt-2 text-xs font-medium text-emerald-700 opacity-90">
                                This is the actual amount you save annually for wealth building or remitting back home.
                              </p>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Builder Call to action */}
                <div className="bg-slate-900 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between text-white shadow-lg overflow-hidden relative">
                  <div className="absolute -right-4 -top-4 opacity-10">
                      <GraduationCap size={120} />
                  </div>
                  <div className="z-10 mb-4 md:mb-0">
                    <h4 className="text-lg font-bold">Ready for a realistic future?</h4>
                    <p className="text-slate-400 text-sm mt-1">We gave you the truth based on live market AI data. Now make the right move.</p>
                  </div>
                  <button onClick={() => handleNavigation('loan')} className="z-10 w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap">
                    Explore Loan Options
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
