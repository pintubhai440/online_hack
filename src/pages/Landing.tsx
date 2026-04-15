import { useEffect, useRef, useState } from 'react';
import { GraduationCap, Brain, TrendingUp, Calculator, BarChart3, MessageCircle, Star, ArrowRight, Globe, IndianRupee, BookOpen, Users, Award, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
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
  const { setCurrentPage, user } = useApp();

  function handleCTA() {
    if (user) setCurrentPage('dashboard');
    else onAuthClick();
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(6,182,212,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.4) 0%, transparent 50%)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              AI-Powered Study Abroad Platform for Indian Students
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.08] mb-6 tracking-tight">
              Your Dream University.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Funded. Achieved.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              VidyaAI is an AI-first ecosystem that guides Indian students from university discovery to education loan — turning study abroad dreams into reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={handleCTA}
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-lg transition-all shadow-lg shadow-blue-900/50 hover:shadow-blue-800/50"
              >
                Start Free — No Card Needed
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl text-lg transition-colors backdrop-blur-sm border border-white/20"
              >
                See How It Works
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { value: 50000, suffix: '+', label: 'Students Guided' },
                { value: 500, suffix: '+', label: 'Universities' },
                { value: 15, suffix: ' Cr+', label: 'Loans Facilitated' },
                { value: 92, suffix: '%', label: 'Placement Rate' },
              ].map(stat => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4">
                  <div className="text-2xl md:text-3xl font-extrabold text-white">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-slate-400 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">AI Tools Suite</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-2 mb-4">Everything you need, in one place</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Six AI-powered tools that cover your entire study abroad journey — from exploration to loan disbursement.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all cursor-pointer" onClick={handleCTA}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                  Try it free <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
              <h2 className="text-4xl font-extrabold text-slate-900 mt-2 mb-4">From goal to acceptance in 3 steps</h2>
              <p className="text-slate-500 mb-10">VidyaAI removes the confusion from study abroad planning. Our AI does the heavy lifting so you can focus on your applications.</p>
              <div className="space-y-6">
                {steps.map((s, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
                      {s.step}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{s.title}</h3>
                      <p className="text-slate-500 text-sm mt-1">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleCTA} className="mt-10 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-8 text-white shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-cyan-400" />
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
                      <span className="text-cyan-400 font-semibold">{item.score}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: `${item.score}%` }} />
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

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-3">Students who made it happen</h2>
            <p className="text-slate-500">Real stories from Indian students who used VidyaAI to get into their dream programs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.stars)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">{t.avatar}</div>
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

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-4 mb-6 text-white/80">
            <div className="flex items-center gap-2"><Users className="w-5 h-5" /><span className="text-sm">50,000+ Students</span></div>
            <div className="flex items-center gap-2"><Award className="w-5 h-5" /><span className="text-sm">Top 10 Edtech</span></div>
            <div className="flex items-center gap-2"><BookOpen className="w-5 h-5" /><span className="text-sm">500+ Universities</span></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Your future starts with one click.</h2>
          <p className="text-blue-100 text-lg mb-8">Join thousands of Indian students who've used VidyaAI to plan smarter, apply better, and get funded.</p>
          <button onClick={handleCTA} className="inline-flex items-center gap-2 px-10 py-4 bg-white text-blue-700 font-bold rounded-xl text-lg hover:bg-blue-50 transition-colors shadow-xl">
            Start for Free <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-blue-200 text-sm mt-4">No credit card required. Takes 2 minutes.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">Vidya<span className="text-cyan-400">AI</span></span>
          </div>
          <p className="text-slate-500 text-sm">© 2025 VidyaAI. Empowering Indian students to achieve global excellence.</p>
          <div className="flex gap-4 text-slate-500 text-sm">
            <span className="hover:text-slate-300 cursor-pointer">Privacy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms</span>
            <span className="hover:text-slate-300 cursor-pointer">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
