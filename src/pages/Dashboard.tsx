import { useEffect, useState } from 'react';
import { Brain, TrendingUp, BarChart3, IndianRupee, MessageCircle, Globe, ChevronRight, GraduationCap, Target, CheckCircle2, AlertCircle, Pencil, Loader2, X, Flame, Award, Bell } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { supabase } from '../lib/supabase';
import { FIELDS, COUNTRIES, BUDGET_RANGES } from '../lib/data';
import type { StudentProfile } from '../types';

const tools = [
  { icon: Brain, page: 'career' as const, label: 'Career Navigator', desc: 'AI university & country recommendations', color: 'bg-blue-600' },
  { icon: TrendingUp, page: 'roi' as const, label: 'ROI Calculator', desc: 'Compare education investment returns', color: 'bg-emerald-600' },
  { icon: BarChart3, page: 'admission' as const, label: 'Admission Predictor', desc: 'Probability scores for your shortlist', color: 'bg-amber-500' },
  { icon: IndianRupee, page: 'loan' as const, label: 'Loan Estimator', desc: 'Compare NBFC loan offers instantly', color: 'bg-teal-600' },
  { icon: MessageCircle, page: 'chat' as const, label: 'AI Mentor', desc: 'Chat with your study abroad advisor', color: 'bg-rose-500' },
  { icon: Globe, page: 'career' as const, label: 'University Discovery', desc: 'Explore 500+ global programs', color: 'bg-slate-700' },
];

export default function Dashboard() {
  const { user, profile, setCurrentPage, refreshProfile } = useApp();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<StudentProfile>>({});

  useEffect(() => {
    if (profile) setForm(profile);
    else if (!profile && user) setEditing(true);
  }, [profile, user]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    const completion = calculateCompletion(form);
    const upsertData = { ...form, user_id: user.id, profile_completion: completion, onboarding_completed: completion > 50, updated_at: new Date().toISOString() };

    const { error } = await supabase.from('student_profiles').upsert(upsertData, { onConflict: 'user_id' });
    if (!error) {
      await refreshProfile();
      setEditing(false);
    }
    setSaving(false);
  }

  function calculateCompletion(p: Partial<StudentProfile>): number {
    const fields = ['full_name', 'city', 'current_degree', 'gpa', 'target_field', 'target_countries', 'budget_range'];
    const filled = fields.filter(f => {
      const val = p[f as keyof StudentProfile];
      if (Array.isArray(val)) return val.length > 0;
      return val !== undefined && val !== null && val !== '' && val !== 0;
    });
    return Math.round((filled.length / fields.length) * 100);
  }

  const completion = profile?.profile_completion || calculateCompletion(form);
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Student';

  // 🧠 STEP 1: The Brain (Next Best Action Logic)
  const getSmartNudge = () => {
    // Stage 1: Agar profile 50% se kam hai
    if (completion < 50) {
      return {
        title: "Profile Incomplete",
        desc: "Complete your basic details to unlock AI recommendations and earn 50 EduPoints.",
        btnText: "Complete Profile",
        action: () => setEditing(true),
        iconColor: "text-amber-600",
        bgColor: "bg-amber-100"
      };
    }
    // Stage 2: Agar goal set nahi hai
    if (!profile?.target_field || !profile?.target_countries?.length) {
       return {
        title: "Set Your Goals",
        desc: "Tell us what and where you want to study so our AI can find the best matches.",
        btnText: "Set Goals",
        action: () => setEditing(true),
        iconColor: "text-blue-600",
        bgColor: "bg-blue-100"
      };
    }
    // Stage 3: Agar sab set hai, toh final goal (Loan) ki taraf push karo
    return {
      title: "Action Required",
      desc: "Your loan eligibility check is pending. Complete it to discover top NBFC offers.",
      btnText: "Check Now →",
      action: () => setCurrentPage('loan'),
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-100"
    };
  };

  const currentNudge = getSmartNudge();

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back, {displayName.split(' ')[0]} 👋</h1>
            <p className="text-slate-500 mt-1">Your study abroad journey dashboard</p>
          </div>
          <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            <Pencil className="w-4 h-4" /> Edit Profile
          </button>
        </div>

        {/* NAYA SECTION: Gamification, Streaks aur Rewards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Daily Streak Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 border border-orange-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-5 h-5 text-orange-600 fill-orange-600" />
                <span className="font-bold text-orange-900">
                  {/* Yahan se real data aayega, agar nahi mila toh 0 dikhayega */}
                  {profile?.current_streak || 0} Day Streak!
                </span>
              </div>
              <p className="text-orange-700 text-xs">Log in tomorrow to keep it going</p>
            </div>
            <div className="text-2xl font-extrabold text-orange-600">🔥</div>
          </div>

          {/* Reward Points Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border border-purple-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-purple-900">
                  {/* Real Points yahan ayenge */}
                  {profile?.reward_points || 0} EduPoints
                </span>
              </div>
              <p className="text-purple-700 text-xs">Earn 50 more to unlock premium counselor chat</p>
            </div>
            <button className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Redeem
            </button>
          </div>

          {/* Smart Nudges / Notifications */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-start gap-3 transition-all hover:shadow-md">
            {/* Notification Icon Container with Badge */}
            <div className={`${currentNudge.bgColor} p-2 rounded-lg shrink-0 relative`}>
              <Bell className={`w-5 h-5 ${currentNudge.iconColor}`} />
              {/* Dynamic Notification Badge (Agar 100% complete nahi hai, tabhi dikhega) */}
              {completion < 100 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center text-[10px] font-bold text-white ring-2 ring-white">1</span>
                </span>
              )}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block mb-0.5">{currentNudge.title}</span>
              <p className="text-slate-500 text-xs">{currentNudge.desc}</p>
              <button 
                onClick={currentNudge.action} 
                className={`${currentNudge.iconColor.replace('text', 'text')} text-xs font-bold mt-2 hover:underline transition-all`}
              >
                {currentNudge.btnText}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white mb-8 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {completion >= 70 ? <CheckCircle2 className="w-5 h-5 text-emerald-300" /> : <AlertCircle className="w-5 h-5 text-amber-300" />}
                <span className="font-semibold">Profile Strength: {completion}%</span>
              </div>
              <p className="text-blue-100 text-sm">
                {completion < 50 ? 'Complete your profile to unlock personalized AI recommendations' :
                 completion < 80 ? 'Great start! Add test scores to improve your matches' :
                 'Excellent! Your profile is fully optimized for AI matching'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold">{completion}%</div>
              <div className="text-blue-200 text-xs">Complete</div>
            </div>
          </div>
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${completion}%` }} />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Target Countries', value: profile?.target_countries?.length || 0, suffix: ' selected', icon: Globe },
            { label: 'Target Field', value: profile?.target_field ? 1 : 0, suffix: profile?.target_field ? '' : ' not set', text: profile?.target_field?.split('/')[0]?.trim() || 'Not set', icon: GraduationCap },
            { label: 'GPA', value: profile?.gpa || 0, suffix: '/10.0', icon: Target },
            { label: 'Budget Range', value: null, text: profile?.budget_range || 'Not set', icon: IndianRupee },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500">{s.label}</span>
              </div>
              <div className="font-bold text-slate-900 truncate">
                {s.text || `${s.value}${s.suffix}`}
              </div>
            </div>
          ))}
        </div>

        {/* AI Tools */}
        <h2 className="text-lg font-bold text-slate-900 mb-4">AI Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {tools.map((tool, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(tool.page)}
              className="group bg-white rounded-xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all text-left"
            >
              <div className={`w-10 h-10 rounded-xl ${tool.color} flex items-center justify-center mb-3 shadow-sm`}>
                <tool.icon className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold text-slate-900 mb-1">{tool.label}</div>
              <div className="text-slate-500 text-sm">{tool.desc}</div>
              <div className="flex items-center gap-1 mt-3 text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                Open tool <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>

        {/* Quick CTA */}
        <div className="bg-slate-900 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold text-lg">Ready to apply for your education loan?</h3>
            <p className="text-slate-400 text-sm mt-1">Pre-check your eligibility in 2 minutes — no impact on CIBIL score</p>
          </div>
          <button onClick={() => setCurrentPage('loan')} className="shrink-0 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors">
            Check Loan Eligibility
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Edit Your Profile</h2>
              <button onClick={() => setEditing(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <input value={form.full_name || ''} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                  <input value={form.city || ''} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Mumbai" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Degree</label>
                  <input value={form.current_degree || ''} onChange={e => setForm(f => ({ ...f, current_degree: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. B.Tech Computer Science" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">GPA / CGPA</label>
                  <input type="number" min="0" max="10" step="0.1" value={form.gpa || ''} onChange={e => setForm(f => ({ ...f, gpa: parseFloat(e.target.value) }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 8.5 (10-pt) or 3.7 (4-pt)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">GRE Score</label>
                  <input type="number" min="260" max="340" value={form.gre_score || ''} onChange={e => setForm(f => ({ ...f, gre_score: parseInt(e.target.value) }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 315" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Work Experience (Years)</label>
                  <input type="number" min="0" max="20" value={form.work_experience_years || ''} onChange={e => setForm(f => ({ ...f, work_experience_years: parseInt(e.target.value) }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 2" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Target Field of Study</label>
                <select value={form.target_field || ''} onChange={e => setForm(f => ({ ...f, target_field: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Select your field</option>
                  {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Target Countries (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {COUNTRIES.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm(f => ({
                        ...f,
                        target_countries: f.target_countries?.includes(c)
                          ? f.target_countries.filter(x => x !== c)
                          : [...(f.target_countries || []), c]
                      }))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${form.target_countries?.includes(c) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Budget Range (all-in)</label>
                <select value={form.budget_range || ''} onChange={e => setForm(f => ({ ...f, budget_range: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Select budget</option>
                  {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <button onClick={handleSave} disabled={saving} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
