import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { StudentProfile } from '../types';

type Page = 'landing' | 'dashboard' | 'career' | 'roi' | 'admission' | 'loan' | 'chat';

interface AppContextType {
  user: User | null;
  session: Session | null;
  profile: StudentProfile | null;
  loading: boolean;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const defaultProfile: StudentProfile = {
  full_name: '',
  phone: '',
  city: '',
  current_degree: '',
  graduation_year: null,
  current_university: '',
  gpa: 0,
  target_field: '',
  target_countries: [],
  preferred_degree_type: 'Masters',
  budget_range: '',
  gre_score: null,
  gmat_score: null,
  ielts_score: null,
  toefl_score: null,
  work_experience_years: 0,
  profile_completion: 0,
  onboarding_completed: false,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  async function refreshProfile() {
    if (!user) return;
    const { data } = await supabase.from('student_profiles').select('*').eq('user_id', user.id).maybeSingle();
    if (data) {
      setProfile(data as StudentProfile);
    } else {
      setProfile(defaultProfile);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setCurrentPage('landing');
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setProfile(null);
        setCurrentPage('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      refreshProfile();
    }
  }, [user]);

  return (
    <AppContext.Provider value={{ user, session, profile, loading, currentPage, setCurrentPage, refreshProfile, signOut }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
