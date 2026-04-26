import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Loader2,
  FileText,
  Download,
  CheckCircle,
  X,
  ShieldCheck,
  Building,
  Target,
  ShieldAlert
} from 'lucide-react';

// 1. Vercel Environment Variables se API keys uthana
const apiKeysString = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) 
  ? import.meta.env.VITE_GEMINI_API_KEY 
  : "";
const parsedKeys = apiKeysString.split(',').map(key => key.trim()).filter(key => key.length > 0);
const apiKeys = parsedKeys.length > 0 ? parsedKeys : [""];

let currentKeyIndex = 0; 

export async function getUniversityData(promptText: string) {
  let attempts = 0;
  const maxAttempts = Math.max(5, apiKeys.length); 
  const delays = [1000, 2000, 4000, 8000, 16000];

  while (attempts < maxAttempts) {
    try {
      const currentKey = apiKeys[currentKeyIndex % apiKeys.length];
      
      if (!currentKey) {
          throw new Error("API Key missing. Vercel dashboard me VITE_GEMINI_API_KEY check karein.");
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${currentKey}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            temperature: 0.1 
          }
        })
      });
      
      if (!response.ok) {
         if (response.status === 403 || response.status === 429) {
             currentKeyIndex++; 
         }
         throw new Error(`HTTP Error: ${response.status}`);
      }

      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || "";

    } catch (error) {
      if (attempts >= maxAttempts - 1) {
        throw error; 
      }
      const delay = delays[attempts] || 2000;
      await new Promise(resolve => setTimeout(resolve, delay));
      attempts++;
    }
  }
}

// --- UPDATED AI Parser Function (Salary Fix Ke Saath) ---
export async function parseDocumentWithAI(base64Data: string, mimeType: string) {
  let attempts = 0;
  const maxAttempts = Math.max(5, apiKeys.length); 
  const delays = [1000, 2000, 4000, 8000, 16000];

  // YAHAN FIX KIYA: expected_salary_usd add kiya hai
  const promptText = `You are an expert Study Abroad Offer Letter Parser. 
  
CRITICAL GUARDRAIL: First, verify if the provided image/document is an Admission Offer Letter from a University/College. 
If it is a JOB OFFER, an irrelevant image, or a random document, YOU MUST REJECT IT by returning exactly this JSON:
{
  "error": "Invalid Document: Ye ek Job Offer ya alag document lag raha hai. Kripya kisi University ka Admission Offer Letter upload karein."
}

If and ONLY IF it is a valid University Admission Letter, extract the following information and return ONLY a raw JSON object (no markdown, no backticks):
{
  "university_name": (string, null if not found),
  "course_name": (string, null if not found),
  "tuition_fee_usd": (number, extract the annual tuition fee. If in another currency, give the rough USD equivalent number ONLY. If not explicitly found, estimate based on real-world data for this university),
  "living_cost_usd": (number, extract the estimated annual living expenses. If NOT mentioned, use your real-world knowledge to ESTIMATE the accurate annual living cost in USD for the university's city/country),
  "duration_years": (number, extract if mentioned. If NOT mentioned, use your real-world knowledge to estimate typical duration, e.g., 2 for Master's, 4 for Bachelor's),
  "expected_salary_usd": (number, use your real-world knowledge to ESTIMATE the realistic AVERAGE starting base salary in USD for a graduate from this specific program and university)
}

Output ONLY valid JSON.`;

  while (attempts < maxAttempts) {
    try {
      const currentKey = apiKeys[currentKeyIndex % apiKeys.length];
      if (!currentKey) throw new Error("API Key missing.");

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${currentKey}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [
              { text: promptText },
              { inlineData: { mimeType, data: base64Data } }
            ] 
          }],
          generationConfig: { temperature: 0.1 } 
        })
      });
      
      if (!response.ok) {
         if (response.status === 403 || response.status === 429) {
             currentKeyIndex++; 
         }
         throw new Error(`HTTP Error: ${response.status}`);
      }

      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || "";

    } catch (error) {
      if (attempts >= maxAttempts - 1) throw error;
      const delay = delays[attempts] || 2000;
      await new Promise(resolve => setTimeout(resolve, delay));
      attempts++;
    }
  }
}

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

const USD_TO_INR = 92.5;

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

const PROGRAMS: ProgramData[] = [
  { id: 'ms_cs_us', name: 'MS Computer Science (USA)', country: 'USA', baseTuitionUSD: 50000, baseLivingUSD: 24000, expectedCTCUSD: 110000, taxRate: 0.30, postGradLivingCostUSD: 30000 },
  { id: 'mba_us', name: 'MBA (USA Top 20)', country: 'USA', baseTuitionUSD: 65000, baseLivingUSD: 22000, expectedCTCUSD: 130000, taxRate: 0.35, postGradLivingCostUSD: 35000 },
  { id: 'mim_uk', name: 'MEng (UK Russell Group)', country: 'UK', baseTuitionUSD: 38000, baseLivingUSD: 16000, expectedCTCUSD: 70000, taxRate: 0.25, postGradLivingCostUSD: 22000 },
  { id: 'ms_ds_ca', name: 'MS Data Science (Canada)', country: 'Canada', baseTuitionUSD: 26000, baseLivingUSD: 14000, expectedCTCUSD: 65000, taxRate: 0.28, postGradLivingCostUSD: 20000 },
  { id: 'mtech_in', name: 'MTech (IIT / IISc)', country: 'India', baseTuitionUSD: 3000, baseLivingUSD: 3000, expectedCTCUSD: 35000, taxRate: 0.30, postGradLivingCostUSD: 8000 },
  { id: 'mba_in', name: 'MBA (IIM A/B/C)', country: 'India', baseTuitionUSD: 18000, baseLivingUSD: 6000, expectedCTCUSD: 55000, taxRate: 0.30, postGradLivingCostUSD: 12000 },
  { id: 'custom', name: 'Custom Program', country: 'Any', baseTuitionUSD: 0, baseLivingUSD: 0, expectedCTCUSD: 0, taxRate: 0.30, postGradLivingCostUSD: 0 }
];

export default function App() {
  const handleNavigation = (page: string) => {
      console.log(`Navigating to ${page}... (Navigation Mocked)`);
  }

  const [selectedProgramIdx, setSelectedProgramIdx] = useState<number>(0);
  
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

  const [customProgramName, setCustomProgramName] = useState<string>('');
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>('');

  const [showReportPreview, setShowReportPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); 

  const [isParsingDoc, setIsParsingDoc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleProgramChange = (idx: number) => {
    setSelectedProgramIdx(idx);
    const p = PROGRAMS[idx];
    setCalculated(false);
    setAiError('');

    setTuitionUSD(p.baseTuitionUSD);
    setLivingUSD(p.baseLivingUSD);
    setSalaryUSD(p.expectedCTCUSD);
    setCurrentTaxRate(p.taxRate);
    setCurrentPostGradLivingCost(p.postGradLivingCostUSD);
  };

  const fetchAIData = async () => {
    if (!customProgramName) return;
    
    setIsAILoading(true);
    setAiError(''); 
    try {
      const prompt = `You are a strict, data-driven Study Abroad Financial Analyst. Analyze the following user input: "${customProgramName}".

      CRITICAL GUARDRAIL: First, check if this input is a valid Higher Education Degree Program (e.g., MS, MBA, BSc) at a valid University or Country. 
      If the input is a Job Offer, a company name, a random string, or NOT an educational program, YOU MUST REJECT IT by returning exactly this JSON:
      {
        "error": "Invalid Input: This looks like a job or irrelevant text. Please enter a valid University Program (e.g., MS in CS at TUM Germany)."
      }

      If and ONLY IF it is a valid educational program, follow these Strict Rules to provide current (2025/2026) data:
      1. Tuition: DO NOT guess. Use the actual international student tuition fee per year.
      2. Living Cost: Must reflect the actual current cost of rent/food in that specific city/country.
      3. Salary: Provide the realistic AVERAGE starting base salary (CTC) in USD for a graduate in this specific field.
      4. Tax Rate: Accurate average income tax percentage (as a decimal, e.g., 0.35).
      
      Return ONLY a valid JSON object with NO markdown formatting. Use these exact keys:
      {
        "baseTuitionUSD": (number),
        "baseLivingUSD": (number),
        "expectedCTCUSD": (number),
        "taxRate": (number),
        "postGradLivingCostUSD": (number)
      }`;

      const responseText = await getUniversityData(prompt);
      
      if (responseText) {
        const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const aiData = JSON.parse(cleanedText);

        if (aiData.error) {
           setAiError(aiData.error);
           setIsAILoading(false);
           return; 
        }

        if (aiData.baseTuitionUSD) setTuitionUSD(aiData.baseTuitionUSD);
        if (aiData.baseLivingUSD) setLivingUSD(aiData.baseLivingUSD);
        if (aiData.expectedCTCUSD) setSalaryUSD(aiData.expectedCTCUSD);
        if (aiData.taxRate) setCurrentTaxRate(aiData.taxRate);
        if (aiData.postGradLivingCostUSD) setCurrentPostGradLivingCost(aiData.postGradLivingCostUSD);
        
        setCalculated(false); 
      }
    } catch (error: any) {
      console.error("AI Data Fetch Error:", error);
      if (error.message && error.message.includes("API Key missing")) {
         setAiError("System Configuration Error: Vercel par API key set nahi hai.");
      } else {
         setAiError("AI estimate laane me thodi dikkat aayi. Please ek baar phir try karein ya manually enter karein.");
      }
    } finally {
      setIsAILoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingDoc(true);
    setAiError('');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file); 
      
      reader.onload = async () => {
        try {
          const result = reader.result as string;
          const base64Data = result.split(',')[1];
          const mimeType = file.type;

          const responseText = await parseDocumentWithAI(base64Data, mimeType);

          if (responseText) {
            const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
            const aiData = JSON.parse(cleanedText);

            if (aiData.error) {
                setAiError(aiData.error);
                return; 
            }

            if (!aiData.university_name && !aiData.course_name && !aiData.tuition_fee_usd && !aiData.living_cost_usd) {
                setAiError("Document padha gaya, par koi University Name ya Fees nahi mili. Kya document clear hai?");
                return;
            }

            if (aiData.university_name || aiData.course_name) {
              setCustomProgramName(`${aiData.course_name || 'Program'} at ${aiData.university_name || 'University'}`);
            }
            if (aiData.tuition_fee_usd) setTuitionUSD(aiData.tuition_fee_usd);
            if (aiData.living_cost_usd) setLivingUSD(aiData.living_cost_usd);
            if (aiData.duration_years) setDurationYears(aiData.duration_years);
            
            // YAHAN FIX KIYA: Ab Salary slider bhi automatically update hoga upload par!
            if (aiData.expected_salary_usd) setSalaryUSD(aiData.expected_salary_usd);
            
            const customIdx = PROGRAMS.findIndex(p => p.id === 'custom');
            if (customIdx !== -1) {
              setSelectedProgramIdx(customIdx);
            }
            
            setCalculated(false);
          }
        } catch (err) {
          console.error("Parse Error:", err);
          setAiError("Offer letter padhne me problem hui. Kya document theek hai?");
        } finally {
          setIsParsingDoc(false);
          if (fileInputRef.current) fileInputRef.current.value = ''; 
        }
      };
      reader.onerror = () => { throw new Error("File read error"); };
    } catch (error) {
      console.error("File Read Error:", error);
      setAiError("File upload me kuch gadbad ho gayi.");
      setIsParsingDoc(false);
    }
  };

  const stats = useMemo(() => {
    const totalCostUSD = (tuitionUSD + livingUSD) * durationYears;
    const totalCostINR = totalCostUSD * USD_TO_INR;
    
    const loanAmountUSD = totalCostUSD * (loanPercent / 100);
    const loanAmountINR = loanAmountUSD * USD_TO_INR;
    
    const outOfPocketINR = totalCostINR - loanAmountINR;

    const moratoriumInterestINR = loanAmountINR * (interestRate / 100) * durationYears; 
    const debtAtGraduationINR = loanAmountINR + moratoriumInterestINR;

    const expectedCTCINR = salaryUSD * USD_TO_INR;
    const taxDeductionINR = expectedCTCINR * currentTaxRate;
    const inHandSalaryINR = expectedCTCINR - taxDeductionINR;
    
    const postGradLivingCostINR = currentPostGradLivingCost * USD_TO_INR;
    const disposableIncomeINR = inHandSalaryINR - postGradLivingCostINR;

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

    const marketingPayback = expectedCTCINR > 0 ? (totalCostINR / expectedCTCINR).toFixed(1) : "N/A";
    const realPayback = disposableIncomeINR > 0 
      ? (debtAtGraduationINR / (disposableIncomeINR > yearlyEMI_INR ? yearlyEMI_INR + netSavingsINR : disposableIncomeINR)).toFixed(1)
      : "Never";

    return {
      totalCostUSD, totalCostINR, loanAmountINR, outOfPocketINR, debtAtGraduationINR,
      expectedCTCINR, taxDeductionINR, inHandSalaryINR, postGradLivingCostINR,
      disposableIncomeINR, yearlyEMI_INR, emiMonthly: emiINR, netSavingsINR,
      marketingPayback, realPayback
    };
  }, [tuitionUSD, livingUSD, durationYears, salaryUSD, loanPercent, interestRate, currentTaxRate, currentPostGradLivingCost]);

  const activeProgramName = PROGRAMS[selectedProgramIdx].id === 'custom' 
    ? (customProgramName || 'Custom Program') 
    : PROGRAMS[selectedProgramIdx].name;

  const handleDownloadPDF = () => {
    if (!(window as any).html2pdf) {
      alert("PDF engine load ho raha hai, please 2 second wait karein...");
      return;
    }
    
    setIsDownloading(true);
    
    setTimeout(() => {
      const element = document.getElementById('pdf-report-content');
      
      const opt = {
        margin:       [12, 0, 15, 0], 
        filename:     `ROI_Report_${activeProgramName.replace(/\s+/g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          scrollY: 0, 
          scrollX: 0,
          backgroundColor: '#ffffff'
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['css', 'legacy'], avoid: ['tr', '.break-inside-avoid'] } 
      };

      (window as any).html2pdf().set(opt).from(element).save().then(() => {
        setIsDownloading(false);
      }).catch((err: any) => {
        console.error("PDF generation error:", err);
        setIsDownloading(false);
        alert("PDF generate karne me problem hui. Kripya page refresh karke try karein.");
      });
    }, 300);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 pt-16 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
            <div className="flex items-center gap-4">
               <button onClick={() => handleNavigation('loan')} className="p-2 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
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
            
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                  <span>Program Selection</span>
                </h3>

                <div className="mb-4">
                  <input 
                    type="file" 
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isParsingDoc}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isParsingDoc ? (
                      <><Loader2 className="animate-spin" size={18} /> Offer Letter Padh Raha Hu...</>
                    ) : (
                      <><Sparkles size={18} className="text-yellow-200" /> Upload Offer Letter 🪄</>
                    )}
                  </button>
                  {aiError && (
                    <p className="text-xs text-red-600 mt-3 font-bold bg-red-50 p-2.5 rounded-lg border border-red-200">
                      <AlertCircle className="inline mr-1 -mt-0.5" size={14}/>
                      {aiError}
                    </p>
                  )}
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {PROGRAMS.map((p, i) => (
                    <button key={i} onClick={() => handleProgramChange(i)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${selectedProgramIdx === i ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shadow-sm' : 'text-slate-600 hover:bg-slate-50 border border-transparent'}`}>
                      {p.name}
                    </button>
                  ))}
                </div>
                
                {PROGRAMS[selectedProgramIdx].id === 'custom' && (
                  <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <label className="text-sm font-bold text-slate-700 block mb-2">
                      Apna Dream Program & Country likho:
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. MS in Data Science at NYU, USA" 
                      value={customProgramName}
                      onChange={(e) => setCustomProgramName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button 
                      onClick={fetchAIData}
                      disabled={isAILoading || customProgramName.length < 5}
                      className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      {isAILoading ? (
                        <><Loader2 className="animate-spin" size={16} /> Real Data Laa raha hu...</>
                      ) : (
                        <><Sparkles size={16} className="text-emerald-400" /> Auto-Fill with AI</>
                      )}
                    </button>
                    <p className="text-[10px] text-slate-500 mt-2 text-center">
                      Gemini AI real market data fetch karke sliders set karega.
                    </p>
                  </div>
                )}

              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm relative">
                <h3 className="font-bold text-slate-900 mb-4">Cost Parameters (USD)</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-sm font-medium text-slate-700">Annual Tuition</label>
                      <span className="text-sm font-bold text-emerald-600">{formatUSD(tuitionUSD)}</span>
                    </div>
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
                <button onClick={() => setCalculated(true)} className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50">
                  Calculate Real ROI
                </button>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-5">
              
              {!calculated && (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 shadow-sm text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                  <BarChart2 className="w-20 h-20 text-slate-200 mb-6" />
                  <h3 className="text-slate-800 text-xl font-bold mb-2">Ready for a Reality Check?</h3>
                  <p className="text-slate-500 max-w-sm">Configure your program details on the left and calculate to see the actual financial impact in INR.</p>
                </div>
              )}

              {calculated && (
                <>
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

                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Briefcase size={18} className="text-slate-500" />
                        Post-Graduation Reality (Year 1)
                      </h3>
                      {showReality && <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 border border-emerald-200"><PiggyBank size={12}/> Trust Score: 100%</span>}
                    </div>
                    
                    <div className="p-6">
                      <div className="relative">
                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200"></div>

                        <div className="space-y-6">
                          <div className="relative pl-10">
                            <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 bg-green-500 rounded-full border-4 border-white shadow-sm"></div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Offer Letter CTC (Annual)</p>
                            <p className="text-xl font-extrabold text-slate-900">{formatINR(stats.expectedCTCINR)}</p>
                          </div>

                          <div className={`relative pl-10 transition-all duration-500 ${!showReality ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                            <div className="absolute left-2.5 top-2 w-3.5 h-3.5 bg-red-400 rounded-full border-4 border-white shadow-sm"></div>
                            <div className="flex justify-between items-center bg-red-50 p-3 rounded-xl border border-red-100">
                              <div>
                                <p className="text-sm font-bold text-red-700">Taxes & Deductions ({(currentTaxRate * 100).toFixed(0)}%)</p>
                              </div>
                              <p className="text-base font-bold text-red-700">-{formatINR(stats.taxDeductionINR)}</p>
                            </div>
                          </div>

                          <div className={`relative pl-10 transition-all duration-500 ${!showReality ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                            <div className="absolute left-2.5 top-2 w-3.5 h-3.5 bg-orange-400 rounded-full border-4 border-white shadow-sm"></div>
                            <div className="flex justify-between items-center bg-orange-50 p-3 rounded-xl border border-orange-100">
                              <div>
                                <p className="text-sm font-bold text-orange-700">Living Expenses</p>
                                <p className="text-xs text-orange-600 mt-0.5">Rent, food, transport post-grad (Annual)</p>
                              </div>
                              <p className="text-base font-bold text-orange-700">-{formatINR(stats.postGradLivingCostINR)}</p>
                            </div>
                          </div>

                          <div className="relative pl-10">
                            <div className="absolute left-2.5 top-2 w-3.5 h-3.5 bg-purple-500 rounded-full border-4 border-white shadow-sm"></div>
                            <div className="flex justify-between items-center bg-purple-50 p-3 rounded-xl border border-purple-100">
                              <div>
                                <p className="text-sm font-bold text-purple-700">Loan EMI (Annual)</p>
                                {showReality && (
                                  <p className="text-xs text-purple-600 mt-0.5">
                                    Includes ₹{formatINR(stats.debtAtGraduationINR - stats.loanAmountINR)} interest accrued during study.
                                  </p>
                                )}
                              </div>
                              <p className="text-base font-bold text-purple-700">-{formatINR(stats.yearlyEMI_INR)}</p>
                            </div>
                          </div>

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
                                {formatINR(stats.netSavingsINR)}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={() => setShowReportPreview(true)} 
                      className="bg-white border-2 border-slate-200 text-slate-800 hover:border-emerald-500 hover:text-emerald-700 font-bold py-3.5 px-6 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-3 group"
                    >
                      <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg group-hover:bg-emerald-100 transition-colors">
                        <FileText size={20} />
                      </div>
                      <div className="text-left">
                        <span className="block text-sm">Convince Your Parents</span>
                        <span className="block text-xs font-normal text-slate-500">Generate PDF Pitch Report</span>
                      </div>
                    </button>

                    <div className="bg-slate-900 rounded-2xl p-4 flex flex-row items-center justify-between text-white shadow-lg relative overflow-hidden group hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => handleNavigation('loan')}>
                      <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <GraduationCap size={100} />
                      </div>
                      <div className="z-10 pl-2">
                        <h4 className="text-sm font-bold text-emerald-400">Ready for a realistic future?</h4>
                        <p className="text-slate-300 text-xs mt-1">Explore tailored education loans.</p>
                      </div>
                      <button className="z-10 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-2.5 px-5 rounded-xl transition-all shadow-md text-sm whitespace-nowrap">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReportPreview && calculated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="text-emerald-600" size={24}/>
                  Parent Pitch Report Preview
                </h2>
                <p className="text-sm text-slate-500 mt-1">Yeh document aapke parents ko as a solid proof present karne ke liye design kiya gaya hai.</p>
              </div>
              <div className="flex gap-3 items-center">
                <button 
                  onClick={handleDownloadPDF} 
                  disabled={isDownloading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70"
                >
                  {isDownloading ? (
                    <><Loader2 size={18} className="animate-spin" /> Generating PDF...</>
                  ) : (
                    <><Download size={18} /> Save as PDF</>
                  )}
                </button>
                <button 
                  onClick={() => setShowReportPreview(false)} 
                  className="p-2.5 text-slate-400 hover:bg-slate-200 hover:text-slate-800 rounded-xl transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-200 flex justify-center custom-scrollbar">
              <div id="pdf-report-content" className="bg-white shadow-xl w-full max-w-[794px] min-h-[1123px] relative">
                 <PrintableReportLayout stats={stats} activeProgramName={activeProgramName} durationYears={durationYears} loanPercent={loanPercent} interestRate={interestRate} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="hidden print:block absolute top-0 left-0 w-full bg-white text-black">
         <PrintableReportLayout stats={stats} activeProgramName={activeProgramName} durationYears={durationYears} loanPercent={loanPercent} interestRate={interestRate} />
      </div>
    </>
  );
}

function PrintableReportLayout({ stats, activeProgramName, durationYears, loanPercent, interestRate }: any) {
  const isSafe = stats.netSavingsINR > 0;

  const monthlySalary = stats.expectedCTCINR / 12;
  const monthlyTax = stats.taxDeductionINR / 12;
  const monthlyLiving = stats.postGradLivingCostINR / 12;
  const monthlyEMI = stats.emiMonthly;
  const monthlySavings = stats.netSavingsINR / 12;

  return (
    <div className="p-10 space-y-6 text-slate-900 bg-white">
      <div className="border-b-4 border-slate-900 pb-6 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building className="text-slate-800" size={28} />
            <span className="font-bold text-slate-500 tracking-widest uppercase text-xs">Unified Student Engagement Platform</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900">Financial Viability Report</h1>
          <p className="text-slate-600 mt-2 font-bold text-lg">Program: {activeProgramName}</p>
        </div>
        <div className="text-right border-l-2 border-slate-200 pl-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date Generated</p>
          <p className="text-sm font-bold text-slate-800">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <div className="mt-3 bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-md font-medium">
            Strict AI Reality-Check Model
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 break-inside-avoid">
        <Info size={24} className="text-blue-600 shrink-0 mt-1"/> 
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-1">Executive Summary</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            This document provides a conservative, data-driven financial projection for pursuing <strong>{activeProgramName}</strong> over <strong>{durationYears} year(s)</strong>. Unlike standard marketing material, this analysis strictly accounts for real-world international income tax, regional living expenses, and full debt-servicing obligations to ensure absolute financial safety.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 break-inside-avoid">
        <div className="space-y-4">
          <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 flex items-center gap-2">
            <Target size={20} className="text-slate-500" /> Capital Requirement
          </h3>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-slate-500 font-medium mb-1">Total Education Cost (Tuition + Living)</p>
            <p className="text-3xl font-black text-slate-900 mb-4">{formatINR(stats.totalCostINR)}</p>
            
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Education Loan ({loanPercent}%)</span>
                <span className="text-sm font-bold">{formatINR(stats.loanAmountINR)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Self-Funded / Margin</span>
                <span className="text-sm font-bold">{formatINR(stats.outOfPocketINR)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-500" /> Expected Returns
          </h3>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-emerald-800 font-medium mb-1">Expected Starting Salary (CTC)</p>
            <p className="text-3xl font-black text-emerald-700 mb-4">{formatINR(stats.expectedCTCINR)}</p>
            
            <div className="space-y-3 pt-4 border-t border-emerald-200/50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-emerald-800">Est. Interest Rate</span>
                <span className="text-sm font-bold text-emerald-900">{interestRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-emerald-800">Real Payback Period</span>
                <span className="text-sm font-bold text-emerald-900">{stats.realPayback} Years</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-4 flex items-center gap-2">
          <PiggyBank size={20} className="text-slate-500"/> Annual Cashflow Analysis (First Year Reality)
        </h3>
        <p className="text-sm text-slate-500 mb-4">The following table breaks down exactly what you will earn, spend, and save annually.</p>
        
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm border-collapse">
            <tbody>
              <tr className="bg-slate-50 border-b border-slate-200 break-inside-avoid">
                <td className="py-4 px-6 font-bold text-slate-800 w-2/3">Gross Annual Salary (CTC)</td>
                <td className="py-4 px-6 font-black text-lg text-slate-900">{formatINR(stats.expectedCTCINR)}</td>
              </tr>
              <tr className="border-b border-slate-100 text-slate-600 break-inside-avoid">
                <td className="py-3 px-6 font-medium">(-) Income Tax Deductions</td>
                <td className="py-3 px-6 text-red-600 font-medium">-{formatINR(stats.taxDeductionINR)}</td>
              </tr>
              <tr className="border-b border-slate-100 text-slate-600 break-inside-avoid">
                <td className="py-3 px-6 font-medium">(-) Annual Living Expenses (Rent, Food, Travel)</td>
                <td className="py-3 px-6 text-orange-600 font-medium">-{formatINR(stats.postGradLivingCostINR)}</td>
              </tr>
              <tr className="border-b border-slate-200 text-slate-600 break-inside-avoid">
                <td className="py-3 px-6 font-medium bg-slate-50">(-) Education Loan EMI (Annualized)</td>
                <td className="py-3 px-6 text-purple-600 font-bold bg-slate-50">-{formatINR(stats.yearlyEMI_INR)}</td>
              </tr>
              <tr className={`break-inside-avoid ${isSafe ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-900'}`}>
                <td className="py-4 px-6 font-black text-base w-2/3">Net Annual Savings (Surplus Cash In-Hand)</td>
                <td className={`py-4 px-6 font-black text-xl ${isSafe ? 'text-emerald-700' : 'text-red-700'}`}>
                  {formatINR(stats.netSavingsINR)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm break-inside-avoid">
          <h4 className="font-bold text-blue-900 mb-3 text-sm flex items-center gap-2">
            <Calculator size={16} className="text-blue-600" /> Parent's Quick View: Monthly Snapshot
          </h4>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm text-center">
              <p className="text-xs text-slate-500 font-medium mb-1">Monthly Salary</p>
              <p className="text-sm font-black text-slate-800">{formatINR(monthlySalary)}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm text-center">
              <p className="text-xs text-slate-500 font-medium mb-1">Tax + Living Cost</p>
              <p className="text-sm font-black text-orange-600">-{formatINR(monthlyTax + monthlyLiving)}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm text-center">
              <p className="text-xs text-slate-500 font-medium mb-1">Monthly EMI</p>
              <p className="text-sm font-black text-purple-600">-{formatINR(monthlyEMI)}</p>
            </div>
            <div className={`p-3 rounded-lg border shadow-sm text-center ${isSafe ? 'bg-emerald-100 border-emerald-300' : 'bg-red-100 border-red-300'}`}>
              <p className={`text-xs font-bold mb-1 ${isSafe ? 'text-emerald-800' : 'text-red-800'}`}>Net Savings / Month</p>
              <p className={`text-sm font-black ${isSafe ? 'text-emerald-700' : 'text-red-700'}`}>{formatINR(monthlySavings)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6 break-inside-avoid">
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
           <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
             <ShieldCheck size={16} className="text-blue-600"/> Risk Mitigations
           </h4>
           <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4 marker:text-slate-400">
             <li>Salary estimates use <strong>average base pay</strong>, not the top 1%.</li>
             <li>Living expenses include inflation buffers.</li>
             <li>Taxes are calculated at local rates before EMI payment.</li>
           </ul>
        </div>
        
        <div className={`rounded-xl p-5 border-2 ${isSafe ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            {isSafe ? <CheckCircle className="text-green-600" size={20}/> : <ShieldAlert className="text-red-600" size={20}/>}
            <h3 className={`font-bold uppercase tracking-wider text-sm ${isSafe ? 'text-green-800' : 'text-red-800'}`}>
              Final Verdict: {isSafe ? 'Financially Safe' : 'High Risk'}
            </h3>
          </div>
          <p className={`text-sm leading-snug ${isSafe ? 'text-green-700' : 'text-red-700'}`}>
            {isSafe 
              ? `The student will comfortably manage all expenses and EMI, generating a pure annual surplus of ${formatINR(stats.netSavingsINR)} for wealth building.` 
              : `The projected income falls short. The student will face an annual deficit of ${formatINR(Math.abs(stats.netSavingsINR))}. Re-evaluation required.`}
          </p>
        </div>
      </div>
      
      <div className="text-center pt-6 pb-2 text-xs text-slate-400 font-medium mt-8 border-t border-slate-200">
        Generated by the Unified Student Engagement Platform • Strict Reality-Check Financial Model • Page 1 of 1
      </div>
    </div>
  );
}
