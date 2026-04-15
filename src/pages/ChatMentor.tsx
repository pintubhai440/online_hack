import { useState, useRef, useEffect } from 'react';
import { MessageCircle, ChevronLeft, Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import type { ChatMessage } from '../types';

const QUICK_QUESTIONS = [
  'Which country is best for CS masters?',
  'How much loan can I get for USA MS?',
  'What GRE score do I need for CMU?',
  'How do I write a strong SOP?',
  'What are OPT/CPT rules for USA?',
  'Compare USA vs Canada for Indian students',
  'How to get scholarships for MS programs?',
  'What documents needed for F-1 visa?',
];

const SMART_RESPONSES: { patterns: string[]; response: string }[] = [
  {
    patterns: ['gre', 'score', 'need', 'required'],
    response: `Great question! GRE requirements vary by university tier:

**Top 10 (MIT, Stanford, CMU):** 325–335+
**Top 11-25 (Georgia Tech, UCLA, UCSD):** 315–325
**Top 26-50:** 308–318
**State schools / Safe schools:** 300–310

**Key insight:** A higher GRE can compensate for a lower GPA, and vice versa. For a 3.5 GPA, aim for 320+ to be competitive at top 20 programs.

💡 Pro tip: Q (Quant) score matters most for STEM — aim for 165+/170.`
  },
  {
    patterns: ['sop', 'statement', 'purpose', 'essay'],
    response: `Writing a strong SOP is critical! Here's my framework:

**Structure (1,000–1,200 words):**
1. **Opening hook** (2-3 lines) — a specific moment that sparked your interest
2. **Academic journey** — relevant coursework, projects, research
3. **Professional experience** — internships, work (if any)
4. **Why this specific program** — mention 2-3 faculty by name, their research
5. **Career goals** — short-term (post-grad) and long-term (5-10 years)
6. **Why this university** — specific resources, labs, culture

**Common mistakes to avoid:**
❌ Generic opening ("Since childhood I have been fascinated...")
❌ Repeating your resume
❌ Not connecting your background to your goals

Want me to review a draft or help with a specific section?`
  },
  {
    patterns: ['loan', 'finance', 'cost', 'money', 'fund'],
    response: `Education financing for India → Abroad studies — here's the full picture:

**Loan Options:**
- **HDFC Credila:** Up to ₹75L, no collateral, 10.5–13% p.a.
- **Avanse:** Up to ₹75L, flexible repayment, 11–14% p.a.
- **InCred:** Quick disbursal (7 days), 12–15% p.a.
- **SBI (collateral):** Up to ₹1.5 Cr, 9.15% p.a. (lowest rate!)

**Key tips:**
✅ Apply 6 months before program start
✅ Get pre-visa disbursement letter from lender
✅ Tax benefit u/s 80E — deduct 100% of interest!
✅ EMI starts 1 year after course OR 6 months after getting job

**Typical USA MS total cost:** ₹50–80 Lakhs all-in
**EMI for ₹50L @ 11%, 10 years:** ~₹68,900/month

Want to check your specific eligibility? Try the Loan Estimator tool!`
  },
  {
    patterns: ['visa', 'f1', 'student visa', 'uk visa', 'canada visa'],
    response: `Visa guidance for study abroad:

**USA F-1 Student Visa:**
📋 Required docs: I-20 from university, DS-160 form, SEVIS fee ($350), bank statements (2x first-year cost), admission offer
⏱️ Process: 4–8 weeks. Apply after getting I-20.
💰 Interview at US Embassy/Consulate in India

**Key financial proof:** Show funds for 1st year + return ticket. Family savings, loan sanction letter both accepted.

**UK Student Visa:**
Simpler process! Online biometrics, 3 weeks processing.

**Canada Study Permit:**
Apply online, need proof of funds (CAD 10,000 per year minimum) + admission letter.

**Pro tips:**
- Apply visa 3 months before program start
- Get loan sanction letter BEFORE visa appointment
- F-1 allows 20 hrs/week work on campus, unlimited off-campus with CPT/OPT

Any specific country visa you want details on?`
  },
  {
    patterns: ['opt', 'cpt', 'work', 'h1b', 'after graduation'],
    response: `Post-graduation work rights — this is crucial for ROI!

**USA (F-1 OPT):**
- 12 months OPT for any STEM or non-STEM
- **STEM OPT extension: 24 additional months** (total 3 years!)
- CS, DS, Engineering = STEM eligible
- After OPT: H-1B lottery (25% chance/year, multiple tries)

**Canada (PGWP - Post-Graduate Work Permit):**
- 3-year PGWP for 2-year programs (best value!)
- Express Entry pathway to PR — takes 2-4 years
- Very predictable and immigrant-friendly

**UK (PSW - Post-Study Work Visa):**
- 2 years work visa after graduation (no job offer needed!)
- Path to Skilled Worker visa → ILR (Permanent Residency)

**Germany:**
- 18-month job search visa after graduation
- Blue Card → PR in 2-3 years

**Recommendation for Indian students:**
🇨🇦 Canada: Best for PR
🇺🇸 USA: Best for salary (but H-1B uncertain)
🇩🇪 Germany: Best value for money + good PR

Want help modeling the financial returns for each country?`
  },
  {
    patterns: ['scholarship', 'fellowship', 'funding', 'assistantship', 'ta', 'ra'],
    response: `Scholarships & Funding options for Indian students:

**University-funded (best options):**
- **TA (Teaching Assistantship):** Tuition waiver + $15-25k stipend/year
- **RA (Research Assistantship):** Same benefits, work with prof
- **Merit scholarships:** $5-20k/year based on GPA/GRE

**How to get TA/RA:**
1. Contact professors directly BEFORE applying (email your research interests)
2. Apply to PhD programs if open to research
3. Strong GRE + research experience helps enormously
4. State schools (UT Austin, Purdue, ASU) give more TAs than Ivies

**External scholarships:**
- **Fulbright-Nehru:** Full scholarship for India→USA
- **Inlaks Shivdasani:** Up to $100k for top universities
- **Narotam Sekhsaria:** ₹20L for grad studies
- **AAUW:** For women in STEM

**Reality check:** Most Indian students get ~30-50% funding through TAs/RAs if they actively pursue it. Don't rely on need-based aid (India income levels don't qualify for US need-based).`
  },
  {
    patterns: ['canada', 'best', 'compare', 'vs', 'better'],
    response: `USA vs Canada — the ultimate comparison for Indian students:

| Factor | 🇺🇸 USA | 🇨🇦 Canada |
|--------|---------|------------|
| Tuition | $40-70k/yr | $20-30k/yr |
| Living cost | $18-25k/yr | $12-18k/yr |
| Starting salary | $90-120k | $55-75k |
| PR difficulty | Hard (H-1B) | Easy (Express Entry) |
| Work after grad | 3yr OPT/STEM | 3yr PGWP |
| Safety | Moderate | High |
| Indian community | Very large | Large |

**Choose USA if:** You're in CS/Finance, targeting top companies (FAANG), okay with H-1B uncertainty, want highest salary

**Choose Canada if:** You prioritize PR/permanent settlement, want lower total cost, value predictability, open to slightly lower salary

**My recommendation:** If you're in CS with GRE 315+ and GPA 3.5+, target USA as primary with Canada as backup. The salary premium in USA typically justifies the higher cost.

Want me to run the ROI numbers for your specific situation?`
  },
  {
    patterns: ['germany', 'free', 'tuition', 'europe'],
    response: `Germany is a hidden gem for Indian students!

**Why Germany:**
- **Near-zero tuition** at public universities (€150–500/semester admin fees)
- Strong engineering programs (RWTH Aachen, TU Munich, TU Berlin)
- 18-month job search visa after graduation
- Blue Card → PR in 2-3 years
- English-taught programs increasing

**Key requirements:**
- Academic equivalent of German Abitur (typically 8+ CGPA or top percentile)
- No GRE required usually!
- German language (B2-C1) for many programs, but English-taught available
- APS certificate (Academic Evaluation Centre) — mandatory for Indian students

**Popular programs:**
- TU Munich: Engineering, CS (world top 50)
- RWTH Aachen: Engineering
- LMU Munich: Business, Sciences
- KIT: Engineering

**Realistic costs:**
- Tuition: €0–500/semester
- Living: €700-900/month (total ₹6-8L/year)
- Total 2-year MS: ₹15-20 Lakhs (vs ₹70L+ for USA!)

**Catch:** Lower salaries (€45-60k starting), but excellent work-life balance and PR pathway!`
  },
];

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const item of SMART_RESPONSES) {
    if (item.patterns.some(p => lower.includes(p))) {
      return item.response;
    }
  }
  return `That's a great question about your study abroad journey! Here's what I can help you with:

**I can answer questions about:**
- 🎓 University selection & admission requirements
- 📊 GRE/GMAT/IELTS score requirements
- 💰 Tuition costs, living expenses & ROI
- 🏦 Education loans & financial planning
- 🌍 Country comparisons (USA, UK, Canada, Germany, etc.)
- 📝 SOP writing, LOR guidance
- 🛂 Visa processes & work rights
- 🎯 Scholarship & funding opportunities

Try asking me something specific like:
- "What GRE score do I need for top 10 CS programs?"
- "How much does it cost to study in Canada?"
- "Compare USA vs Canada for Indian students"
- "How to get scholarships for MS programs?"

What would you like to know?`;
}

function formatMessage(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="font-bold text-slate-900 mt-3 mb-1">{line.slice(2, -2)}</p>;
    }
    const boldFormatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    if (line.startsWith('- ') || line.startsWith('✅') || line.startsWith('❌') || line.startsWith('💡') || line.startsWith('💰') || line.startsWith('📋') || line.startsWith('⏱️') || line.startsWith('🎓') || line.startsWith('🏦') || line.startsWith('🌍') || line.startsWith('📝') || line.startsWith('🛂') || line.startsWith('🎯') || line.startsWith('📊') || line.startsWith('🇺🇸') || line.startsWith('🇨🇦') || line.startsWith('🇩🇪') || line.startsWith('🇬🇧')) {
      return <p key={i} className="py-0.5 text-slate-700" dangerouslySetInnerHTML={{ __html: boldFormatted }} />;
    }
    if (line.trim() === '') return <div key={i} className="h-1" />;
    return <p key={i} className="text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: boldFormatted }} />;
  });
}

export default function ChatMentor() {
  const { setCurrentPage, profile } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: `Hello${profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋 I'm your AI Study Abroad Mentor, powered by VidyaAI.

I can help you with everything from university selection and admission strategy to visa guidance and financial planning.

**What would you like to explore today?** You can ask me about:
- Best universities for your profile
- GRE/GMAT score requirements
- Education loan & financing options
- Country comparisons and work rights
- SOP/essay writing tips`,
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function sendMessage(text?: string) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    const userMsg: ChatMessage = { role: 'user', content: msg, timestamp: new Date() };
    setMessages(m => [...m, userMsg]);
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

    let response: string;
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const res = await fetch(`${supabaseUrl}/functions/v1/chat-mentor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${anonKey}`, 'Apikey': anonKey },
        body: JSON.stringify({ message: msg, context: { targetField: profile?.target_field, targetCountries: profile?.target_countries } }),
      });
      if (res.ok) {
        const data = await res.json();
        response = data.response || getAIResponse(msg);
      } else {
        response = getAIResponse(msg);
      }
    } catch {
      response = getAIResponse(msg);
    }

    setIsTyping(false);
    const assistantMsg: ChatMessage = { role: 'assistant', content: response, timestamp: new Date() };
    setMessages(m => [...m, assistantMsg]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16 flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex flex-col flex-1" style={{ maxHeight: 'calc(100vh - 64px)' }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <button onClick={() => setCurrentPage('dashboard')} className="p-2 hover:bg-white rounded-lg border border-slate-200 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-sm">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-900">AI Study Mentor</h1>
            <p className="text-slate-500 text-sm">Your personal study abroad advisor — always available</p>
          </div>
          <button onClick={() => setMessages([{ role: 'assistant', content: 'Hi! I\'m your AI Study Abroad Mentor. What would you like to know?', timestamp: new Date() }])}
            className="p-2 hover:bg-white rounded-lg border border-slate-200 transition-colors" title="New conversation">
            <RefreshCw className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4 min-h-0">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-gradient-to-br from-rose-500 to-pink-500' : 'bg-gradient-to-br from-blue-600 to-cyan-500'}`}>
                {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'assistant' ? 'bg-white border border-slate-100 shadow-sm text-left' : 'bg-blue-600 text-white'}`}>
                {msg.role === 'assistant' ? (
                  <div className="text-sm space-y-0.5">{formatMessage(msg.content)}</div>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
                <p className={`text-xs mt-2 ${msg.role === 'assistant' ? 'text-slate-400' : 'text-blue-200'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick questions */}
        <div className="shrink-0 mb-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {QUICK_QUESTIONS.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)}
                className="shrink-0 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors">
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="shrink-0 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-3 p-3">
          <Sparkles className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about universities, loans, visas, SOPs..."
            className="flex-1 text-sm focus:outline-none text-slate-800 placeholder-slate-400 bg-transparent"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 rounded-xl flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
