-- Add policy for teachers to view profiles of students assigned to their tests
CREATE POLICY "Teachers can view student profiles for their tests"
ON public.profiles
FOR SELECT
USING (
  has_role(auth.uid(), 'teacher'::app_role) 
  AND EXISTS (
    SELECT 1 
    FROM test_assignments ta
    JOIN tests t ON t.id = ta.test_id
    WHERE ta.student_id = profiles.id
    AND t.teacher_id = auth.uid()
  )
);

-- Also allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));