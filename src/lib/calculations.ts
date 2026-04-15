import type { UniversityRecommendation, ROIResult, LoanOffer, AdmissionResult } from '../types';
import { UNIVERSITIES_DB, COUNTRY_INSIGHTS, LOAN_OFFERS } from './data';

const USD_TO_INR = 83.5;

export function calculateEMI(principal: number, annualRate: number, tenureYears: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const months = tenureYears * 12;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
}

export function getUniversityRecommendations(params: {
  gpa: number;
  gre: number | null;
  targetField: string;
  targetCountries: string[];
  budgetUSD: number;
  workExp: number;
}): UniversityRecommendation[] {
  const { gpa, gre, targetField, targetCountries, budgetUSD, workExp } = params;

  const filtered = UNIVERSITIES_DB.filter(u => {
    const fieldMatch = u.fields.includes(targetField);
    const countryMatch = targetCountries.length === 0 || targetCountries.includes(u.country);
    const budgetMatch = u.tuitionUSD <= budgetUSD * 1.2;
    return fieldMatch && countryMatch && budgetMatch;
  });

  const scored = filtered.map(u => {
    let score = 0;
    // GPA score (max 30)
    if (gpa >= 3.8) score += 30;
    else if (gpa >= 3.5) score += 24;
    else if (gpa >= 3.2) score += 18;
    else if (gpa >= 3.0) score += 12;
    else score += 6;

    // GRE score (max 25)
    if (gre) {
      if (gre >= 325) score += 25;
      else if (gre >= 315) score += 20;
      else if (gre >= 305) score += 14;
      else score += 8;
    } else score += 12;

    // Acceptance rate bonus (max 25)
    if (u.acceptanceRate > 40) score += 25;
    else if (u.acceptanceRate > 25) score += 20;
    else if (u.acceptanceRate > 15) score += 14;
    else if (u.acceptanceRate > 8) score += 8;
    else score += 3;

    // Work experience (max 10)
    if (workExp >= 2) score += 10;
    else if (workExp >= 1) score += 5;

    // Budget fit (max 10)
    if (u.tuitionUSD <= budgetUSD) score += 10;
    else score += 3;

    const matchScore = Math.min(Math.round(score), 95);
    return {
      name: u.name,
      country: u.country,
      program: targetField,
      matchScore,
      tuitionUSD: u.tuitionUSD,
      avgSalaryUSD: u.avgSalaryUSD,
      acceptanceRate: u.acceptanceRate,
      ranking: u.ranking,
      deadline: u.deadline,
      highlights: [
        `QS Ranking #${u.ranking}`,
        `${u.acceptanceRate}% acceptance rate`,
        `Avg salary $${(u.avgSalaryUSD / 1000).toFixed(0)}k/yr`,
      ],
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 8);
}

export function calculateROI(params: {
  tuitionUSD: number;
  livingCostUSD: number;
  durationYears: number;
  expectedSalaryUSD: number;
  loanAmountINR: number;
}): ROIResult {
  const { tuitionUSD, livingCostUSD, durationYears, expectedSalaryUSD, loanAmountINR } = params;
  const totalCostUSD = (tuitionUSD + livingCostUSD) * durationYears;
  const totalCostINR = totalCostUSD * USD_TO_INR;

  const annualSalaryINR = expectedSalaryUSD * USD_TO_INR;
  const avgIndianSalaryINR = 800000;
  const salaryPremiumINR = annualSalaryINR - avgIndianSalaryINR;
  const tenYearNetGainINR = salaryPremiumINR * 10 - totalCostINR;
  const paybackYears = totalCostINR / salaryPremiumINR;
  const roiPercentage = (tenYearNetGainINR / totalCostINR) * 100;

  const emiMonthly = loanAmountINR > 0 ? calculateEMI(loanAmountINR, 11, 10) : 0;

  return {
    totalCostINR,
    totalCostUSD,
    avgFirstYearSalaryUSD: expectedSalaryUSD,
    paybackYears: Math.max(0, paybackYears),
    tenYearNetGainINR,
    roiPercentage,
    emiMonthly,
  };
}

export function predictAdmission(params: {
  gpa: number;
  gre: number | null;
  workExp: number;
  researchPapers: number;
  internships: number;
  extraCurricular: boolean;
  targetAcceptanceRate: number;
}): AdmissionResult {
  let profileScore = 0;

  // GPA (max 35)
  if (params.gpa >= 3.8) profileScore += 35;
  else if (params.gpa >= 3.5) profileScore += 28;
  else if (params.gpa >= 3.2) profileScore += 21;
  else if (params.gpa >= 3.0) profileScore += 14;
  else profileScore += 7;

  // GRE (max 30)
  if (params.gre) {
    if (params.gre >= 330) profileScore += 30;
    else if (params.gre >= 320) profileScore += 24;
    else if (params.gre >= 310) profileScore += 18;
    else if (params.gre >= 300) profileScore += 12;
    else profileScore += 6;
  } else profileScore += 15;

  // Work experience (max 15)
  profileScore += Math.min(params.workExp * 4, 15);

  // Research (max 10)
  profileScore += Math.min(params.researchPapers * 5, 10);

  // Internships (max 7)
  profileScore += Math.min(params.internships * 3, 7);

  // Extra curricular (max 3)
  if (params.extraCurricular) profileScore += 3;

  const normalizedScore = Math.min(profileScore, 100);
  const baseProb = (normalizedScore / 100) * 85;
  const acceptanceFactor = params.targetAcceptanceRate / 100;
  const probability = Math.min(Math.round(baseProb + acceptanceFactor * 15), 92);

  const strengthAreas: string[] = [];
  const improvementAreas: string[] = [];

  if (params.gpa >= 3.5) strengthAreas.push('Strong academic record');
  else improvementAreas.push('Consider retaking courses to improve GPA');

  if (params.gre && params.gre >= 315) strengthAreas.push('Competitive GRE score');
  else if (!params.gre) improvementAreas.push('Take GRE to strengthen application');
  else improvementAreas.push('Aim for GRE 315+ for better chances');

  if (params.workExp >= 2) strengthAreas.push('Solid work experience');
  else improvementAreas.push('Add more professional experience or internships');

  if (params.researchPapers >= 1) strengthAreas.push('Research publications add credibility');
  else improvementAreas.push('Work on a research project or publication');

  if (params.internships >= 2) strengthAreas.push('Multiple internships show initiative');

  const category: AdmissionResult['category'] =
    probability >= 65 ? 'Target' : probability >= 80 ? 'Safe' : 'Ambitious';

  return { probability, category, strengthAreas, improvementAreas, profileScore: normalizedScore };
}

export function getLoanOffers(params: {
  loanAmountINR: number;
  hasCollateral: boolean;
  familyIncomeINR: number;
}): (LoanOffer & { eligible: boolean })[] {
  return LOAN_OFFERS.map(offer => {
    const eligible =
      params.loanAmountINR <= offer.maxAmount &&
      (params.hasCollateral || !offer.collateralRequired) &&
      params.familyIncomeINR >= 400000;

    const emi = calculateEMI(params.loanAmountINR, offer.interestRate, offer.tenureYears);
    return { ...offer, emi, eligible };
  });
}

export function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatUSD(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

export const BUDGET_TO_USD: Record<string, number> = {
  'Under ₹30 Lakhs': 36000,
  '₹30–50 Lakhs': 55000,
  '₹50–80 Lakhs': 85000,
  '₹80 Lakhs–1 Crore': 110000,
  'Above ₹1 Crore': 150000,
};
