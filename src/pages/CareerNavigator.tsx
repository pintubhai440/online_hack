import { useState } from 'react';
import { Brain, Star, Bookmark, ExternalLink, ChevronLeft, Globe, DollarSign, Users, TrendingUp, Info, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getUniversityRecommendations, formatUSD, BUDGET_TO_USD } from '../lib/calculations';
import { FIELDS, COUNTRIES, BUDGET_RANGES, COUNTRY_INSIGHTS } from '../lib/data';
import type { UniversityRecommendation } from '../types';
import { supabase } from '../lib/supabase';
import { getUniversityData } from '../lib/gemini'; // 🧠 Naya Engine Import

export default function CareerNavigator() {
  const { setCurrentPage, profile, user } = useApp();
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<UniversityRecommendation[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const [form, setForm] = useState({
    gpa: profile?.gpa || 3.5,
    gre: profile?.gre_score || null as number | null,
    targetField: profile?.target_field || '',
    targetCountries: profile?.target_countries || [] as string[],
    budgetRange: profile?.budget_range || '',
    workExp: profile?.work_experience_years || 0,
  });

  const [activeCountryTab, setActiveCountryTab] = useState<string | null>(null);

  // 🧠 State Add Karo (The Brain's Short-term Memory)
  const [rawAiData, setRawAiData] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);

  async function handleAnalyze() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const budgetUSD = BUDGET_TO_USD[form.budgetRange] || 60000;
    const recs = getUniversityRecommendations({
      gpa: form.gpa > 4 ? form.gpa / 10 * 4 : form.gpa,
      gre: form.gre,
      targetField: form.targetField,
      targetCountries: form.targetCountries,
      budgetUSD,
      workExp: form.workExp,
    });
    setResults(recs);
    setStep('results');
    setLoading(false);
  }

  async function saveUniversity(uni: UniversityRecommendation) {
    if (!user) return;
    const key = `${uni.name}-${uni.country}`;
    await supabase.from('saved_universities').insert({
      user_id: user.id,
      university_name: uni.name,
      country: uni.country,
      program: uni.program,
      match_score: uni.matchScore,
      tuition_usd: uni.tuitionUSD,
    });
    setSavedIds(s => new Set([...s, key]));
  }

  // 🚀 The Ignition Switch (Button Click Logic)
  const handleGenerateClick = async () => {
    setIsFetching(true);
    setRawAiData("AI is fetching live 2026 data from the internet..."); 

    // Yeh prompt AI ko control karega taaki wo budget aur INR format follow kare
    const promptText = `Act as an expert study abroad counselor. 
    Find 2 real universities in the USA for MS in Computer Science for an Indian student with a budget of under 50 Lakhs INR. 
    Provide the real 2026 tuition fees in INR and the next application deadline. 
    Return the output STRICTLY as a JSON array of objects. Do not include markdown formatting or extra text.`;

    // Engine se data le aao
    const data = await getUniversityData(promptText);
    
    setRawAiData(data);
    setIsFetching(false);
  };

  const countriesToShow = form.targetCountries.length > 0 ? form.targetCountries : COUNTRIES.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => setCurrentPage('dashboard')} className="p-2 hover:bg-white rounded-lg border border-slate-200 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">AI Career Navigator</h1>
            <p className="text-slate-500 text-sm">Personalized university & country recommendations</p>
          </div>
        </div>

        {step === 'form' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-5 text-lg">Tell us about yourself</h2>
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">GPA / CGPA</label>
                    <input type="number" step="0.1" value={form.gpa} onChange={e => setForm(f => ({ ...f, gpa: parseFloat(e.target.value) }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 3.7 or 8.5" />
                    <p className="text-xs text-slate-400 mt-1">Enter on 4.0 scale or 10-point CGPA</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">GRE Score (optional)</label>
                    <input type="number" value={form.gre || ''} onChange={e => setForm(f => ({ ...f, gre: e.target.value ? parseInt(e.target.value) : null }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 315 (260-340)" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Work Experience</label>
                    <select value={form.workExp} onChange={e => setForm(f => ({ ...f, workExp: parseInt(e.target.value) }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      {[0, 1, 2, 3, 4, 5].map(y => <option key={y} value={y}>{y === 0 ? 'Fresher' : `${y} year${y > 1 ? 's' : ''}`}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Budget (total cost)</label>
                    <select value={form.budgetRange} onChange={e => setForm(f => ({ ...f, budgetRange: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="">Select budget</option>
                      {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Target Field</label>
                  <select value={form.targetField} onChange={e => setForm(f => ({ ...f, targetField: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Select your field</option>
                    {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Countries</label>
                  <div className="flex flex-wrap gap-2">
                    {COUNTRIES.map(c => (
                      <button key={c} type="button"
                        onClick={() => setForm(f => ({ ...f, targetCountries: f.targetCountries.includes(c) ? f.targetCountries.filter(x => x !== c) : [...f.targetCountries, c] }))}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${form.targetCountries.includes(c) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                      >{c}</button>
                    ))}
                  </div>
                </div>

                {/* Original App Form Submit Button */}
                <button onClick={handleAnalyze} disabled={!form.targetField || loading}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                  {loading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Analyzing your profile...</> : <><Sparkles className="w-4 h-4" />View Suggested Universities</>}
                </button>

                {/* 🔌 Live Engine Testing Section */}
                <div className="pt-6 mt-4 border-t border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-600" /> Live AI Engine Test
                  </h3>
                  
                  {/* Button Se Wire Connect Karo */}
                  <button 
                    onClick={handleGenerateClick} 
                    disabled={isFetching}
                    className="w-full bg-slate-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isFetching ? "Analyzing Profile & Fetching Data..." : "Generate AI Recommendations (Live Fetch)"}
                  </button>

                  {/* Screen Par Data Dikhao (The Test Screen) */}
                  {rawAiData && (
                    <div className="mt-4 p-4 bg-slate-900 text-green-400 font-mono text-sm rounded-xl whitespace-pre-wrap overflow-x-auto shadow-inner border border-slate-800">
                      <p className="text-white mb-2 font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Raw AI Data (Connection Test):
                      </p>
                      {rawAiData}
                    </div>
                  )}
                </div>

              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-5 text-white">
                <Brain className="w-8 h-8 mb-3 text-blue-200" />
                <h3 className="font-bold mb-2">How AI matching works</h3>
                <p className="text-blue-100 text-sm leading-relaxed">Our algorithm analyzes 50+ data points including acceptance rates, salary outcomes, and your profile strength to rank universities by fit — not just prestige.</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-3 text-sm">Country Quick Stats</h3>
                <div className="space-y-2">
                  {countriesToShow.slice(0, 4).map(c => {
                    const info = COUNTRY_INSIGHTS[c];
                    if (!info) return null;
                    return (
                      <div key={c} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                        <span className="text-sm font-medium text-slate-700">{c}</span>
                        <div className="text-right">
                          <div className="text-xs text-slate-500">~${(info.avgCostUSD / 1000).toFixed(0)}k/yr</div>
                          <div className="text-xs text-emerald-600 font-medium">PR: {info.prScore.split('(')[0].trim()}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'results' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Your AI Recommendations</h2>
                <p className="text-slate-500 text-sm">{results.length} universities matched your profile</p>
              </div>
              <button onClick={() => setStep('form')} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                Adjust Criteria
              </button>
            </div>

            {/* Country tabs */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              <button onClick={() => setActiveCountryTab(null)}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!activeCountryTab ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                All Countries
              </button>
              {[...new Set(results.map(r => r.country))].map(c => (
                <button key={c} onClick={() => setActiveCountryTab(activeCountryTab === c ? null : c)}
                  className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCountryTab === c ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  {c}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results
                .filter(r => !activeCountryTab || r.country === activeCountryTab)
                .map((uni, i) => {
                  const key = `${uni.name}-${uni.country}`;
                  const isSaved = savedIds.has(key);
                  const scoreColor = uni.matchScore >= 80 ? 'text-emerald-600 bg-emerald-50' : uni.matchScore >= 65 ? 'text-amber-600 bg-amber-50' : 'text-slate-600 bg-slate-100';
                  return (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-blue-200 hover:shadow-md transition-all shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{uni.country}</span>
                            <span className="text-xs text-slate-400">Deadline: {uni.deadline}</span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-lg">{uni.name}</h3>
                          <p className="text-slate-500 text-sm">{uni.program.split('/')[0].trim()}</p>
                        </div>
                        <div className={`px-3 py-1.5 rounded-xl font-bold text-sm ${scoreColor}`}>
                          {uni.matchScore}% match
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                          <DollarSign className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                          <div className="text-xs font-semibold text-slate-700">{formatUSD(uni.tuitionUSD)}</div>
                          <div className="text-xs text-slate-400">Tuition/yr</div>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                          <div className="text-xs font-semibold text-slate-700">{formatUSD(uni.avgSalaryUSD)}</div>
                          <div className="text-xs text-slate-400">Avg salary</div>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                          <Users className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                          <div className="text-xs font-semibold text-slate-700">{uni.acceptanceRate}%</div>
                          <div className="text-xs text-slate-400">Accept rate</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => isSaved ? null : saveUniversity(uni)}
                          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${isSaved ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-500' : ''}`} />
                          {isSaved ? 'Saved' : 'Save'}
                        </button>
                        <button onClick={() => setCurrentPage('loan')}
                          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
                          <Star className="w-3.5 h-3.5" /> Get Loan
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Country insights */}
            <div className="mt-8">
              <h3 className="font-bold text-slate-900 mb-4">Country Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...new Set(results.map(r => r.country))].map(c => {
                  const info = COUNTRY_INSIGHTS[c];
                  if (!info) return null;
                  return (
                    <div key={c} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-slate-900">{c}</span>
                      </div>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between"><span className="text-slate-500">Avg tuition</span><span className="font-medium text-slate-700">${(info.avgCostUSD / 1000).toFixed(0)}k/yr</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Avg salary</span><span className="font-medium text-slate-700">${(info.avgSalaryUSD / 1000).toFixed(0)}k/yr</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">PR pathway</span><span className="font-medium text-emerald-600">{info.prScore.split('(')[0].trim()}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Indian students</span><span className="font-medium text-slate-700">{(info.indianStudents / 1000).toFixed(0)}k+</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
