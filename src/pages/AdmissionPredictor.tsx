import { useState } from 'react';
import { BarChart3, ChevronLeft, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Target } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { predictAdmission } from '../lib/calculations';
import { UNIVERSITIES_DB } from '../lib/data';
import type { AdmissionResult } from '../types';

const GRE_BENCHMARKS: Record<string, number> = {
  'MIT': 330, 'Stanford University': 328, 'Carnegie Mellon University': 322, 'UC Berkeley': 320,
  'Georgia Tech': 318, 'Columbia University': 320, 'University of Michigan': 315,
  'University of Oxford': 0, 'Imperial College London': 0, 'University of Edinburgh': 0,
  'University of Toronto': 310, 'University of British Columbia': 308, 'McGill University': 306,
  'NUS Singapore': 315, 'TU Munich': 0, 'University of Melbourne': 0,
};

export default function AdmissionPredictor() {
  const { setCurrentPage, profile } = useApp();
  const [gpa, setGpa] = useState(profile?.gpa || 3.5);
  const [gre, setGre] = useState<number | ''>(profile?.gre_score || '');
  const [workExp, setWorkExp] = useState(profile?.work_experience_years || 0);
  const [papers, setPapers] = useState(0);
  const [internships, setInternships] = useState(0);
  const [extraCurricular, setExtraCurricular] = useState(false);
  const [selectedUni, setSelectedUni] = useState('Carnegie Mellon University');
  const [result, setResult] = useState<AdmissionResult | null>(null);
  const [calculated, setCalculated] = useState(false);

  const targetUni = UNIVERSITIES_DB.find(u => u.name === selectedUni);

  function handlePredict() {
    const res = predictAdmission({
      gpa: gpa > 4 ? gpa / 10 * 4 : gpa,
      gre: gre ? Number(gre) : null,
      workExp,
      researchPapers: papers,
      internships,
      extraCurricular,
      targetAcceptanceRate: targetUni?.acceptanceRate || 20,
    });
    setResult(res);
    setCalculated(true);
  }

  const categoryConfig = {
    Safe: { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', bar: 'from-emerald-500 to-teal-400' },
    Target: { color: 'text-blue-700 bg-blue-50 border-blue-200', bar: 'from-blue-500 to-cyan-400' },
    Ambitious: { color: 'text-amber-700 bg-amber-50 border-amber-200', bar: 'from-amber-500 to-orange-400' },
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => setCurrentPage('dashboard')} className="p-2 hover:bg-white rounded-lg border border-slate-200 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-sm">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Admission Predictor</h1>
            <p className="text-slate-500 text-sm">AI-powered probability scoring for your target universities</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Target University</h3>
              <select value={selectedUni} onChange={e => setSelectedUni(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                {UNIVERSITIES_DB.map(u => <option key={u.name} value={u.name}>{u.name} ({u.country})</option>)}
              </select>
              {targetUni && (
                <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between"><span>Acceptance rate</span><span className="font-semibold">{targetUni.acceptanceRate}%</span></div>
                  <div className="flex justify-between"><span>QS Ranking</span><span className="font-semibold">#{targetUni.ranking}</span></div>
                  {GRE_BENCHMARKS[selectedUni] > 0 && <div className="flex justify-between"><span>Avg GRE</span><span className="font-semibold">{GRE_BENCHMARKS[selectedUni]}</span></div>}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Your Profile</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-700">GPA</label>
                    <span className="text-sm font-bold text-amber-600">{gpa}</span>
                  </div>
                  <input type="range" min="2.0" max="4.0" step="0.1" value={gpa > 4 ? 3.5 : gpa} onChange={e => setGpa(parseFloat(e.target.value))} className="w-full accent-amber-500" />
                  <div className="flex justify-between text-xs text-slate-400 mt-0.5"><span>2.0</span><span>4.0</span></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">GRE Score (leave blank if no GRE)</label>
                  <input type="number" min="260" max="340" value={gre} onChange={e => setGre(e.target.value ? parseInt(e.target.value) : '')} placeholder="e.g. 315" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Work Experience</label>
                  <select value={workExp} onChange={e => setWorkExp(parseInt(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                    {[0, 1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>{y === 0 ? 'Fresher' : `${y} year${y > 1 ? 's' : ''}`}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Research Papers</label>
                    <select value={papers} onChange={e => setPapers(parseInt(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                      {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Internships</label>
                    <select value={internships} onChange={e => setInternships(parseInt(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                      {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => setExtraCurricular(!extraCurricular)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${extraCurricular ? 'bg-amber-500 border-amber-500' : 'border-slate-300'}`}>
                    {extraCurricular && <CheckCircle2 className="w-3.5 h-3.5 text-white fill-white" />}
                  </div>
                  <span className="text-sm text-slate-700">Strong extra-curriculars / leadership</span>
                </label>
              </div>
              <button onClick={handlePredict} className="w-full mt-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" /> Predict My Chances
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-5">
            {!calculated && (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
                <Target className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Fill in your profile details and click Predict to see your admission probability</p>
              </div>
            )}

            {calculated && result && (
              <>
                {/* Main score */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="text-slate-500 text-sm mb-1">{selectedUni}</div>
                      <h3 className="text-3xl font-extrabold text-slate-900">{result.probability}%</h3>
                      <p className="text-slate-500 text-sm">Admission probability</p>
                    </div>
                    <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${categoryConfig[result.category].color}`}>
                      {result.category} School
                    </span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div className={`h-full bg-gradient-to-r ${categoryConfig[result.category].bar} rounded-full transition-all duration-1000`} style={{ width: `${result.probability}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>0%</span><span>50%</span><span>100%</span>
                  </div>
                </div>

                {/* Profile score breakdown */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-4">Profile Strength Score: {result.profileScore}/100</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Academic Score (GPA)', max: 35, score: gpa >= 3.8 ? 35 : gpa >= 3.5 ? 28 : gpa >= 3.2 ? 21 : 14 },
                      { label: 'Standardized Test', max: 30, score: gre ? (Number(gre) >= 325 ? 30 : Number(gre) >= 315 ? 24 : 15) : 15 },
                      { label: 'Work Experience', max: 15, score: Math.min(workExp * 4, 15) },
                      { label: 'Research & Publications', max: 10, score: Math.min(papers * 5, 10) },
                      { label: 'Extra-curriculars', max: 10, score: (internships > 0 ? Math.min(internships * 3, 7) : 0) + (extraCurricular ? 3 : 0) },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">{item.label}</span>
                          <span className="font-medium text-slate-800">{item.score}/{item.max}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full" style={{ width: `${(item.score / item.max) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                    <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Strengths
                    </h4>
                    <ul className="space-y-2">
                      {result.strengthAreas.length === 0 ? <li className="text-emerald-700 text-sm">Complete more fields to see strengths</li> :
                        result.strengthAreas.map((s, i) => <li key={i} className="text-emerald-700 text-sm flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span>{s}</li>)}
                    </ul>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                    <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Improve Here
                    </h4>
                    <ul className="space-y-2">
                      {result.improvementAreas.length === 0 ? <li className="text-amber-700 text-sm">Profile looks strong!</li> :
                        result.improvementAreas.map((s, i) => <li key={i} className="text-amber-700 text-sm flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span>{s}</li>)}
                    </ul>
                  </div>
                </div>

                <button onClick={() => setCurrentPage('chat')} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                  Discuss with AI Mentor <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
