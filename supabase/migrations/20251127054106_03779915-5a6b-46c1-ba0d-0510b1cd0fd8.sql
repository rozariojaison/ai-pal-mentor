-- Create questions table (teachers create code questions)
CREATE TABLE public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  programming_language text NOT NULL DEFAULT 'javascript',
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  topic text NOT NULL,
  starter_code text,
  expected_concepts text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can create questions"
  ON public.questions FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'teacher'));

CREATE POLICY "Teachers can view all questions"
  ON public.questions FOR SELECT
  USING (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can update their own questions"
  ON public.questions FOR UPDATE
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own questions"
  ON public.questions FOR DELETE
  USING (auth.uid() = teacher_id);

-- Create tests table
CREATE TABLE public.tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  duration_minutes integer,
  is_published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can create tests"
  ON public.tests FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'teacher'));

CREATE POLICY "Teachers can view all tests"
  ON public.tests FOR SELECT
  USING (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can update their own tests"
  ON public.tests FOR UPDATE
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own tests"
  ON public.tests FOR DELETE
  USING (auth.uid() = teacher_id);

-- Create test_questions junction table
CREATE TABLE public.test_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid REFERENCES public.tests(id) ON DELETE CASCADE NOT NULL,
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  order_index integer NOT NULL,
  points integer DEFAULT 10,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(test_id, question_id)
);

ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage test questions"
  ON public.test_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.tests
      WHERE tests.id = test_questions.test_id
      AND tests.teacher_id = auth.uid()
    )
  );

-- Create test_assignments table
CREATE TABLE public.test_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid REFERENCES public.tests(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assigned_at timestamp with time zone DEFAULT now(),
  due_date timestamp with time zone,
  UNIQUE(test_id, student_id)
);

ALTER TABLE public.test_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can assign tests"
  ON public.test_assignments FOR INSERT
  WITH CHECK (
    has_role(auth.uid(), 'teacher') AND
    EXISTS (
      SELECT 1 FROM public.tests
      WHERE tests.id = test_assignments.test_id
      AND tests.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view their test assignments"
  ON public.test_assignments FOR SELECT
  USING (
    has_role(auth.uid(), 'teacher') AND
    EXISTS (
      SELECT 1 FROM public.tests
      WHERE tests.id = test_assignments.test_id
      AND tests.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can view their own assignments"
  ON public.test_assignments FOR SELECT
  USING (auth.uid() = student_id);

-- Add RLS policies for students to see assigned tests and questions
CREATE POLICY "Students can view assigned tests"
  ON public.tests FOR SELECT
  USING (
    has_role(auth.uid(), 'student') AND
    EXISTS (
      SELECT 1 FROM public.test_assignments
      WHERE test_id = tests.id AND student_id = auth.uid()
    )
  );

CREATE POLICY "Students can view assigned questions"
  ON public.questions FOR SELECT
  USING (
    has_role(auth.uid(), 'student') AND
    EXISTS (
      SELECT 1 FROM public.test_questions tq
      JOIN public.test_assignments ta ON tq.test_id = ta.test_id
      WHERE tq.question_id = questions.id
      AND ta.student_id = auth.uid()
    )
  );

CREATE POLICY "Students can view assigned test questions"
  ON public.test_questions FOR SELECT
  USING (
    has_role(auth.uid(), 'student') AND
    EXISTS (
      SELECT 1 FROM public.test_assignments
      WHERE test_id = test_questions.test_id AND student_id = auth.uid()
    )
  );

-- Create test_submissions table
CREATE TABLE public.test_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid REFERENCES public.tests(id) ON DELETE CASCADE NOT NULL,
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  code_submission text NOT NULL,
  ai_analysis jsonb,
  score integer,
  submitted_at timestamp with time zone DEFAULT now(),
  UNIQUE(test_id, question_id, student_id)
);

ALTER TABLE public.test_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can create their submissions"
  ON public.test_submissions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can view their own submissions"
  ON public.test_submissions FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view submissions for their tests"
  ON public.test_submissions FOR SELECT
  USING (
    has_role(auth.uid(), 'teacher') AND
    EXISTS (
      SELECT 1 FROM public.tests
      WHERE tests.id = test_submissions.test_id
      AND tests.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update scores"
  ON public.test_submissions FOR UPDATE
  USING (
    has_role(auth.uid(), 'teacher') AND
    EXISTS (
      SELECT 1 FROM public.tests
      WHERE tests.id = test_submissions.test_id
      AND tests.teacher_id = auth.uid()
    )
  );

-- Create feedback table
CREATE TABLE public.teacher_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  submission_id uuid REFERENCES public.test_submissions(id) ON DELETE CASCADE,
  feedback_text text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.teacher_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can create feedback"
  ON public.teacher_feedback FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'teacher') AND auth.uid() = teacher_id);

CREATE POLICY "Teachers can view their feedback"
  ON public.teacher_feedback FOR SELECT
  USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view feedback on their submissions"
  ON public.teacher_feedback FOR SELECT
  USING (auth.uid() = student_id);

-- Create learning_paths table (AI-generated)
CREATE TABLE public.learning_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_topic text NOT NULL,
  skill_level integer DEFAULT 0,
  recommended_topics text[],
  strengths text[],
  areas_for_improvement text[],
  next_milestone text,
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(student_id, current_topic)
);

ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own learning path"
  ON public.learning_paths FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own learning path"
  ON public.learning_paths FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own learning path"
  ON public.learning_paths FOR UPDATE
  USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view all learning paths"
  ON public.learning_paths FOR SELECT
  USING (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tests_updated_at
  BEFORE UPDATE ON public.tests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_learning_paths_updated_at
  BEFORE UPDATE ON public.learning_paths
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();