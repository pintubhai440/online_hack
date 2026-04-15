import React, { useEffect, useRef, useState } from 'react';
import { GraduationCap, Brain, TrendingUp, BarChart3, MessageCircle, Star, ArrowRight, Globe, IndianRupee, BookOpen, Users, Award, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface LandingProps {
  onAuthClick: () => void;
}

function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 2000;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, 16);
          observer.disconnect();
        }
      }, { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

const features = [
  { icon: Brain, color: 'text-blue-600 bg-blue-50', title: 'AI Career Navigator', desc: 'Get personalized country, university, and program recommendations powered by ML algorithms trained on 100k+ admission outcomes.' },
  { icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50', title: 'ROI Calculator', desc: 'Model your financial future. See 10-year net gains, payback period, and salary outcomes against education investment.' },
  { icon: BarChart3, color: 'text-amber-600 bg-amber-50', title: 'Admission Predictor', desc: 'AI-powered probability scoring based on GPA, GRE, work experience, and profile strength vs target university benchmarks.' },
  { icon: IndianRupee, color: 'text-teal-600 bg-teal-50', title: 'Loan Eligibility Engine', desc: 'Compare education loan offers from top NBFCs. Get personalized rates, EMI scenarios, and 1-click application.' },
  { icon: MessageCircle, color: 'text-violet-600 bg-violet-50', title: 'AI Study Mentor', desc: 'Your 24/7 AI counselor for SOP guidance, interview prep, visa questions, and any study abroad doubts.' },
  { icon: Globe, color: 'text-rose-600 bg-rose-50', title: 'University Discovery', desc: 'Curated database of 500+ programs with deadlines, scholarships, living costs, and post-graduation work rights.' },
];

const steps = [
  { step: '01', title: 'Build your profile', desc: 'Tell us about your academics, test scores, and career goals in 3 minutes.' },
  { step: '02', title: 'Get AI recommendations', desc: 'Our AI analyzes 50+ parameters to suggest best-fit universities and programs.' },
  { step: '03', title: 'Plan your finances', desc: 'See exact costs, loan eligibility, and EMI scenarios tailored to your profile.' },
];

const testimonials = [
  { name: 'Arjun Mehta', program: 'MS CS – Stanford', avatar: 'AM', stars: 5, text: 'VidyaAI predicted my admission probability as 78% for Stanford. I got in! The ROI calculator helped me convince my parents it was worth the investment.' },
  { name: 'Priya Nair', program: 'MBA – Booth, Chicago', avatar: 'PN', stars: 5, text: 'Got my education loan from HDFC Credila at 10.5% through the Loan Estimator. Saved ₹2L vs what my bank was offering. Absolutely worth it.' },
  { name: 'Rahul Sharma', program: 'MEng – TU Munich', avatar: 'RS', stars: 5, text: 'Germany was never on my radar until the Career Navigator suggested it. Near-zero tuition, strong engineering program, and easy PR path. Best decision ever.' },
];

export default function Landing({ onAuthClick }: LandingProps) {
  const { session, user, setCurrentPage } = useApp();

  function handleCTA() {
    if (user || session) setCurrentPage('dashboard');
    else onAuthClick();
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      
      {/* ----------------- INTEGRATED PREMIUM HERO SECTION ----------------- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        {/* Main Glassmorphism Content Card */}
        <div className="glass-card max-w-4xl w-full text-center space-y-8 p-12 relative z-10 mt-16">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-600 font-semibold text-sm mb-4">
            <Sparkles className="w-4 h-4" /> Next-Gen Education Financing
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
            Your Journey to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-brand-500">Global Education</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Discover the best universities, calculate your ROI, and secure student loans with zero hassle. AI-powered matching for your career goals.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8">
            {session || user ? (
              <button onClick={() => setCurrentPage('dashboard')} className="btn-primary w-full sm:w-auto text-lg px-8">
                Go to Dashboard
              </button>
            ) : (
              <>
                <button onClick={handleCTA} className="btn-primary w-full sm:w-auto text-lg px-8">
                  Start Free Assessment
                </button>
                <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="btn-secondary w-full sm:w-auto text-lg px-8">
                  See How It Works
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Section Converted to Glass UI */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto w-full mt-12">
          {[
            { value: 50000, suffix: '+', label: 'Students Guided' },
            { value: 500, suffix: '+', label: 'Universities' },
            { value: 15, suffix: ' Cr+', label: 'Loans Facilitated' },
            { value: 92, suffix: '%', label: 'Placement Rate' },
          ].map(stat => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-primary-600">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-slate-500 text-xs mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------- FEATURES SECTION ----------------- */}
      <section id="features" className="py-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">AI Tools Suite</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-2 mb-4">Everything you need, in one place</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Six AI-powered tools that cover your entire study abroad journey — from exploration to loan disbursement.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group glass-card hover:border-primary-200 cursor-pointer" onClick={handleCTA}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-primary-600 text-sm font-medium group-hover:gap-2 transition-all">
                  Try it free <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- HOW IT WORKS ----------------- */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
              <h2 className="text-4xl font-extrabold text-slate-900 mt-2 mb-4">From goal to acceptance in 3 steps</h2>
              <p className="text-slate-500 mb-10">VidyaAI removes the confusion from study abroad planning. Our AI does the heavy lifting so you can focus on your applications.</p>
              <div className="space-y-6">
                {steps.map((s, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="w-12 h-12 rounded-xl bg-primary-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-lg shadow-primary-200">
                      {s.step}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{s.title}</h3>
                      <p className="text-slate-500 text-sm mt-1">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleCTA} className="btn-primary mt-10 inline-flex items-center gap-2">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-primary-900 rounded-3xl p-8 text-white shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-500/30 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <div className="font-bold">AI Analysis Complete</div>
                  <div className="text-slate-400 text-xs">Based on your profile</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Top Match: Carnegie Mellon (CS)', score: 91 },
                  { label: 'Admission Probability: CMU', score: 78 },
                  { label: 'Loan Eligibility', score: 95 },
                  { label: 'Profile Strength', score: 82 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="text-brand-400 font-semibold">{item.score}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary-500 to-brand-400 rounded-full" style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-1">
                  <CheckCircle2 className="w-4 h-4" /> Loan Pre-approved
                </div>
                <div className="text-slate-300 text-xs">HDFC Credila offers ₹55L at 10.5% — EMI ₹74,200/mo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- TESTIMONIALS ----------------- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-3">Students who made it happen</h2>
            <p className="text-slate-500">Real stories from Indian students who used VidyaAI to get into their dream programs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.stars)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-brand-500 flex items-center justify-center text-white font-bold text-sm">{t.avatar}</div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-slate-500 text-xs">{t.program}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- CTA ----------------- */}
      <section className="py-24 bg-gradient-to-br from-primary-600 to-brand-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="flex flex-wrap justify-center gap-4 mb-6 text-white/90">
            <div className="flex items-center gap-2"><Users className="w-5 h-5" /><span className="text-sm font-medium">50,000+ Students</span></div>
            <div className="flex items-center gap-2"><Award className="w-5 h-5" /><span className="text-sm font-medium">Top 10 Edtech</span></div>
            <div className="flex items-center gap-2"><BookOpen className="w-5 h-5" /><span className="text-sm font-medium">500+ Universities</span></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Your future starts with one click.</h2>
          <p className="text-primary-100 text-lg mb-8">Join thousands of Indian students who've used VidyaAI to plan smarter, apply better, and get funded.</p>
          <button onClick={handleCTA} className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary-700 font-bold rounded-xl text-lg hover:bg-slate-50 transition-colors shadow-xl transform hover:-translate-y-1">
            Start for Free <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-primary-200 text-sm mt-4">No credit card required. Takes 2 minutes.</p>
        </div>
      </section>

      {/* ----------------- FOOTER ----------------- */}
      <footer className="bg-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-brand-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">Vidya<span className="text-brand-400">AI</span></span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 VidyaAI. Empowering Indian students to achieve global excellence.</p>
          <div className="flex gap-4 text-slate-500 text-sm">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
