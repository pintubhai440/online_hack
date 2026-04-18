export interface StudentProfile {
  id?: string;
  user_id?: string;
  full_name: string;
  phone: string;
  city: string;
  current_degree: string;
  graduation_year: number | null;
  current_university: string;
  gpa: number;
  target_field: string;
  target_countries: string[];
  preferred_degree_type: string;
  budget_range: string;
  gre_score: number | null;
  gmat_score: number | null;
  ielts_score: number | null;
  toefl_score: number | null;
  work_experience_years: number;
  profile_completion: number;
  onboarding_completed: boolean;
  
  // Naye variables jo aapne add karne bole the
  current_streak?: number;
  reward_points?: number;
}

export interface UniversityRecommendation {
  name: string;
  country: string;
  program: string;
  matchScore: number;
  tuitionUSD: number;
  avgSalaryUSD: number;
  acceptanceRate: number;
  ranking: number;
  deadline: string;
  highlights: string[];
}

export interface ROIResult {
  totalCostINR: number;
  totalCostUSD: number;
  avgFirstYearSalaryUSD: number;
  paybackYears: number;
  tenYearNetGainINR: number;
  roiPercentage: number;
  emiMonthly: number;
}

export interface LoanOffer {
  lender: string;
  maxAmount: number;
  interestRate: number;
  tenureYears: number;
  processingFee: number;
  collateralRequired: boolean;
  emi: number;
  features: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AdmissionResult {
  probability: number;
  category: 'Ambitious' | 'Target' | 'Safe';
  strengthAreas: string[];
  improvementAreas: string[];
  profileScore: number;
}
