import { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import CareerNavigator from './pages/CareerNavigator';
import ROICalculator from './pages/ROICalculator';
import AdmissionPredictor from './pages/AdmissionPredictor';
import LoanEstimator from './pages/LoanEstimator';
import ChatMentor from './pages/ChatMentor';

function AppContent() {
  const { currentPage, user, loading } = useApp();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500 text-sm">Loading VidyaAI...</span>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    if (!user) return <Landing onAuthClick={() => setShowAuth(true)} />;
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'career': return <CareerNavigator />;
      case 'roi': return <ROICalculator />;
      case 'admission': return <AdmissionPredictor />;
      case 'loan': return <LoanEstimator />;
      case 'chat': return <ChatMentor />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar onAuthClick={() => setShowAuth(true)} />
      {renderPage()}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
