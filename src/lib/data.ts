// src/lib/data.ts

export const COUNTRIES = [
  'USA', 'UK', 'Canada', 'Australia', 'Germany', 
  'Singapore', 'Ireland', 'Netherlands', 'New Zealand', 'France'
];

export const FIELDS = [
  'Computer Science / AI / ML',
  'Data Science / Analytics',
  'Business Administration / MBA',
  'Engineering (Mechanical / Civil / Electrical)',
  'Finance / FinTech',
  'Healthcare / Biotechnology',
  'Design / UX / Product',
  'Public Policy / International Relations',
  'Environmental Science',
  'Law / LLM',
];

export const BUDGET_RANGES = [
  'Under ₹30 Lakhs',
  '₹30–50 Lakhs',
  '₹50–80 Lakhs',
  '₹80 Lakhs–1 Crore',
  'Above ₹1 Crore',
];

export const UNIVERSITIES_DB = [
  { name: 'MIT', country: 'USA', ranking: 1, tuitionUSD: 57986, acceptanceRate: 4, fields: ['Computer Science / AI / ML', 'Engineering (Mechanical / Civil / Electrical)', 'Data Science / Analytics'], avgSalaryUSD: 120000, deadline: 'Dec 15' },
  { name: 'Stanford University', country: 'USA', ranking: 3, tuitionUSD: 56550, acceptanceRate: 4, fields: ['Computer Science / AI / ML', 'Business Administration / MBA', 'Engineering (Mechanical / Civil / Electrical)'], avgSalaryUSD: 130000, deadline: 'Dec 1' },
  { name: 'Carnegie Mellon University', country: 'USA', ranking: 8, tuitionUSD: 54244, acceptanceRate: 15, fields: ['Computer Science / AI / ML', 'Data Science / Analytics', 'Design / UX / Product'], avgSalaryUSD: 115000, deadline: 'Dec 15' },
  { name: 'UC Berkeley', country: 'USA', ranking: 10, tuitionUSD: 44066, acceptanceRate: 17, fields: ['Data Science / Analytics', 'Engineering (Mechanical / Civil / Electrical)', 'Finance / FinTech'], avgSalaryUSD: 110000, deadline: 'Dec 1' },
  { name: 'University of Michigan', country: 'USA', ranking: 18, tuitionUSD: 52000, acceptanceRate: 26, fields: ['Engineering (Mechanical / Civil / Electrical)', 'Business Administration / MBA', 'Finance / FinTech'], avgSalaryUSD: 95000, deadline: 'Jan 15' },
  { name: 'Georgia Tech', country: 'USA', ranking: 20, tuitionUSD: 33096, acceptanceRate: 21, fields: ['Computer Science / AI / ML', 'Engineering (Mechanical / Civil / Electrical)', 'Data Science / Analytics'], avgSalaryUSD: 105000, deadline: 'Jan 15' },
  { name: 'Columbia University', country: 'USA', ranking: 12, tuitionUSD: 63530, acceptanceRate: 7, fields: ['Finance / FinTech', 'Public Policy / International Relations', 'Business Administration / MBA'], avgSalaryUSD: 120000, deadline: 'Jan 5' },
  { name: 'University of Oxford', country: 'UK', ranking: 2, tuitionUSD: 42000, acceptanceRate: 18, fields: ['Public Policy / International Relations', 'Finance / FinTech', 'Healthcare / Biotechnology'], avgSalaryUSD: 75000, deadline: 'Jan 20' },
  { name: 'Imperial College London', country: 'UK', ranking: 7, tuitionUSD: 39000, acceptanceRate: 14, fields: ['Engineering (Mechanical / Civil / Electrical)', 'Computer Science / AI / ML', 'Healthcare / Biotechnology'], avgSalaryUSD: 72000, deadline: 'Jan 15' },
  { name: 'University of Edinburgh', country: 'UK', ranking: 22, tuitionUSD: 32000, acceptanceRate: 35, fields: ['Data Science / Analytics', 'Business Administration / MBA', 'Computer Science / AI / ML'], avgSalaryUSD: 65000, deadline: 'Feb 1' },
  { name: 'University of Toronto', country: 'Canada', ranking: 25, tuitionUSD: 28000, acceptanceRate: 43, fields: ['Computer Science / AI / ML', 'Finance / FinTech', 'Healthcare / Biotechnology'], avgSalaryUSD: 70000, deadline: 'Jan 15' },
  { name: 'University of British Columbia', country: 'Canada', ranking: 34, tuitionUSD: 26000, acceptanceRate: 46, fields: ['Data Science / Analytics', 'Environmental Science', 'Engineering (Mechanical / Civil / Electrical)'], avgSalaryUSD: 68000, deadline: 'Jan 15' },
  { name: 'McGill University', country: 'Canada', ranking: 30, tuitionUSD: 22000, acceptanceRate: 46, fields: ['Healthcare / Biotechnology', 'Business Administration / MBA', 'Law / LLM'], avgSalaryUSD: 65000, deadline: 'Jan 15' },
  { name: 'NUS Singapore', country: 'Singapore', ranking: 11, tuitionUSD: 22000, acceptanceRate: 7, fields: ['Computer Science / AI / ML', 'Finance / FinTech', 'Business Administration / MBA'], avgSalaryUSD: 80000, deadline: 'Jan 15' },
  { name: 'TU Munich', country: 'Germany', ranking: 37, tuitionUSD: 1500, acceptanceRate: 30, fields: ['Engineering (Mechanical / Civil / Electrical)', 'Computer Science / AI / ML', 'Environmental Science'], avgSalaryUSD: 55000, deadline: 'Mar 1' },
  { name: 'University of Melbourne', country: 'Australia', ranking: 33, tuitionUSD: 35000, acceptanceRate: 40, fields: ['Business Administration / MBA', 'Design / UX / Product', 'Healthcare / Biotechnology'], avgSalaryUSD: 62000, deadline: 'Oct 31' },
];

export const LOAN_OFFERS = [
  {
    lender: 'HDFC Credila',
    maxAmount: 7500000,
    interestRate: 10.5,
    tenureYears: 12,
    processingFee: 1.0,
    collateralRequired: false,
    features: ['No collateral up to ₹75L', 'Study period moratorium', 'Pre-approval in 3 days', 'Tax benefit u/s 80E'],
  },
  {
    lender: 'Avanse Financial',
    maxAmount: 7500000,
    interestRate: 11.0,
    tenureYears: 15,
    processingFee: 1.0,
    collateralRequired: false,
    features: ['100% financing available', 'Doorstep service', 'Competitive rates for top 200 unis', 'Flexible repayment'],
  },
  {
    lender: 'InCred Finance',
    maxAmount: 6000000,
    interestRate: 12.5,
    tenureYears: 10,
    processingFee: 1.5,
    collateralRequired: false,
    features: ['Quick disbursal in 7 days', 'Minimal documentation', 'Digital-first process', 'Pre-visa disbursal'],
  },
  {
    lender: 'State Bank of India',
    maxAmount: 15000000,
    interestRate: 9.15,
    tenureYears: 15,
    processingFee: 0,
    collateralRequired: true,
    features: ['Lowest interest rates', '0 processing fee', 'Largest loan amount', 'Priority for Ivy/QS Top 100'],
  },
];

export const COUNTRY_INSIGHTS: Record<string, { avgCostUSD: number; avgSalaryUSD: number; prScore: string; visaDifficulty: string; indianStudents: number }> = {
  USA: { avgCostUSD: 55000, avgSalaryUSD: 105000, prScore: 'Moderate (H1B lottery)', visaDifficulty: 'Moderate', indianStudents: 268000 },
  UK: { avgCostUSD: 38000, avgSalaryUSD: 68000, prScore: 'Good (PSW Visa)', visaDifficulty: 'Easy', indianStudents: 126000 },
  Canada: { avgCostUSD: 26000, avgSalaryUSD: 65000, prScore: 'Excellent (Express Entry)', visaDifficulty: 'Easy', indianStudents: 184000 },
  Australia: { avgCostUSD: 34000, avgSalaryUSD: 60000, prScore: 'Good (Skilled Visa)', visaDifficulty: 'Moderate', indianStudents: 102000 },
  Germany: { avgCostUSD: 2000, avgSalaryUSD: 52000, prScore: 'Good (Blue Card)', visaDifficulty: 'Moderate', indianStudents: 42000 },
  Singapore: { avgCostUSD: 22000, avgSalaryUSD: 78000, prScore: 'Moderate', visaDifficulty: 'Easy', indianStudents: 18000 },
  Ireland: { avgCostUSD: 28000, avgSalaryUSD: 58000, prScore: 'Good', visaDifficulty: 'Easy', indianStudents: 26000 },
  Netherlands: { avgCostUSD: 18000, avgSalaryUSD: 54000, prScore: 'Moderate', visaDifficulty: 'Easy', indianStudents: 15000 },
  'New Zealand': { avgCostUSD: 28000, avgSalaryUSD: 52000, prScore: 'Good', visaDifficulty: 'Easy', indianStudents: 12000 },
  France: { avgCostUSD: 12000, avgSalaryUSD: 48000, prScore: 'Moderate', visaDifficulty: 'Moderate', indianStudents: 10000 },
};
