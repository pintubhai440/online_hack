
/*
  # eduFinance Platform Schema

  ## Overview
  Creates the full database schema for the eduFinance student engagement and education financing platform.

  ## New Tables
  1. `student_profiles` - Extended student profile with academic and career preferences
     - user_id (links to auth.users)
     - Personal details: full_name, phone, city, current_degree, graduation_year, university, gpa
     - Aspirations: target_field, target_countries, preferred_degree_type, budget_range
     - Test scores: gre_score, gmat_score, ielts_score, toefl_score, work_experience_years
     - Platform tracking: profile_completion, onboarding_completed
  
  2. `loan_inquiries` - Student loan interest and applications
     - user_id, university, program, country, estimated_cost, status
  
  3. `saved_universities` - Universities bookmarked by students
     - user_id, university_name, country, program, match_score, deadline

  4. `career_assessments` - Results from career navigator tool
     - user_id, recommended_countries, recommended_universities, match_scores

  ## Security
  - RLS enabled on all tables
  - All policies restricted to authenticated users accessing only their own data
*/

-- Student Profiles
CREATE TABLE IF NOT EXISTS student_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name text DEFAULT '',
  phone text DEFAULT '',
  city text DEFAULT '',
  current_degree text DEFAULT '',
  graduation_year integer,
  current_university text DEFAULT '',
  gpa numeric(3,2) DEFAULT 0,
  target_field text DEFAULT '',
  target_countries text[] DEFAULT '{}',
  preferred_degree_type text DEFAULT 'Masters',
  budget_range text DEFAULT '',
  gre_score integer,
  gmat_score integer,
  ielts_score numeric(3,1),
  toefl_score integer,
  work_experience_years integer DEFAULT 0,
  profile_completion integer DEFAULT 0,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON student_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON student_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON student_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Loan Inquiries
CREATE TABLE IF NOT EXISTS loan_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  university text NOT NULL,
  program text NOT NULL,
  country text NOT NULL,
  estimated_cost_usd numeric DEFAULT 0,
  loan_amount_requested numeric DEFAULT 0,
  status text DEFAULT 'draft',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE loan_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own loan inquiries"
  ON loan_inquiries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own loan inquiries"
  ON loan_inquiries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own loan inquiries"
  ON loan_inquiries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Saved Universities
CREATE TABLE IF NOT EXISTS saved_universities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  university_name text NOT NULL,
  country text NOT NULL,
  program text NOT NULL,
  match_score integer DEFAULT 0,
  application_deadline date,
  tuition_usd numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_universities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own saved universities"
  ON saved_universities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved universities"
  ON saved_universities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved universities"
  ON saved_universities FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Career Assessments
CREATE TABLE IF NOT EXISTS career_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  input_data jsonb DEFAULT '{}',
  results jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE career_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own assessments"
  ON career_assessments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
  ON career_assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
