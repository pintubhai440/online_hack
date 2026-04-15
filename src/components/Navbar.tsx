import { useState } from 'react';
import { GraduationCap, Menu, X, ChevronDown } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface NavbarProps {
  onAuthClick: () => void;
}

const tools = [
  { label: 'Career Navigator', page: 'career' as const },
  { label: 'ROI Calculator', page: 'roi' as const },
  { label: 'Admission Predictor', page: 'admission' as const },
  { label: 'Loan Estimator', page: 'loan' as const },
  { label: 'AI Mentor', page: 'chat' as const },
];

export default function Navbar({ onAuthClick }: NavbarProps) {
  const { user, currentPage, setCurrentPage, signOut, profile } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => setCurrentPage(user ? 'dashboard' : 'landing')} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">Vidya<span className="text-blue-600">AI</span></span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {user && (
              <>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  Dashboard
                </button>
                <div className="relative">
                  <button
                    onClick={() => setToolsOpen(!toolsOpen)}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    AI Tools <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {toolsOpen && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                      {tools.map(t => (
                        <button
                          key={t.page}
                          onClick={() => { setCurrentPage(t.page); setToolsOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${currentPage === t.page ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold">
                    {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                    {profile?.full_name || user.email}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onAuthClick}
                  className="hidden md:block px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onAuthClick}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                >
                  Get Started Free
                </button>
              </>
            )}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-1">
          {user && (
            <>
              <button onClick={() => { setCurrentPage('dashboard'); setMobileOpen(false); }} className="block w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Dashboard</button>
              {tools.map(t => (
                <button key={t.page} onClick={() => { setCurrentPage(t.page); setMobileOpen(false); }} className="block w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">{t.label}</button>
              ))}
              <button onClick={() => { signOut(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg">Sign Out</button>
            </>
          )}
          {!user && (
            <button onClick={() => { onAuthClick(); setMobileOpen(false); }} className="block w-full text-center px-3 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg">Get Started Free</button>
          )}
        </div>
      )}
    </nav>
  );
}
