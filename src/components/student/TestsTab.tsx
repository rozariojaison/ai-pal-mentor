import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const TestsTab = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [testQuestions, setTestQuestions] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, string>>({});
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    const { data } = await supabase
      .from("test_assignments")
      .select(`
        *,
        tests(id, title, description, duration_minutes)
      `)
      .eq("student_id", user?.id)
      .order("assigned_at", { ascending: false });

    if (data) setAssignments(data);
  };

  const openTest = async (test: any) => {
    setSelectedTest(test);
    
    // Fetch questions for this test
    const { data: questions } = await supabase
      .from("test_questions")
      .select(`
        *,
        questions(*)
      `)
      .eq("test_id", test.tests.id)
      .order("order_index");

    if (questions) setTestQuestions(questions);

    // Fetch existing submissions
    const { data: existingSubmissions } = await supabase
      .from("test_submissions")
      .select("*")
      .eq("test_id", test.tests.id)
      .eq("student_id", user?.id);

    if (existingSubmissions) {
      const submissionsMap: Record<string, string> = {};
      existingSubmissions.forEach(sub => {
        submissionsMap[sub.question_id] = sub.code_submission;
      });
      setSubmissions(submissionsMap);
    }

    setIsTestDialogOpen(true);
  };

  const handleSubmitAnswer = async (questionId: string) => {
    const code = submissions[questionId];
    if (!code || !selectedTest) return;

    // Call AI analysis edge function
    const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-demo', {
      body: { 
        inputType: 'code',
        inputContent: code,
        programmingLanguage: 'javascript'
      }
    });

    if (analysisError) {
      toast.error("Failed to analyze submission");
      return;
    }

    // Save submission
    const { error } = await supabase
      .from("test_submissions")
      .upsert({
        test_id: selectedTest.tests.id,
        question_id: questionId,
        student_id: user?.id,
        code_submission: code,
        ai_analysis: analysisData,
        score: analysisData?.clarity_score || 50
      });

    if (error) {
      toast.error("Failed to submit answer");
      return;
    }

    toast.success("Answer submitted successfully");

    // Trigger learning path generation (async, don't wait)
    const question = testQuestions.find(tq => tq.questions.id === questionId)?.questions;
    if (question?.topic) {
      supabase.functions.invoke('generate-learning-path', {
        body: { studentId: user?.id, topic: question.topic }
      }).catch(err => console.error('Learning path generation failed:', err));
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Tests</h2>

      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTest?.tests?.title}</DialogTitle>
          </DialogHeader>
          {selectedTest && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {selectedTest.tests.duration_minutes} minutes
                </div>
                <div className="flex items-center gap-2">
                  {testQuestions.length} questions
                </div>
              </div>

              {testQuestions.map((tq, index) => {
                const question = tq.questions;
                const hasSubmission = submissions[question.id];
                
                return (
                  <Card key={question.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Question {index + 1}: {question.title}
                      </CardTitle>
                      <CardDescription>
                        {question.difficulty} • {question.topic} • {tq.points} points
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">{question.description}</p>
                      
                      {question.starter_code && (
                        <div>
                          <p className="text-sm font-semibold mb-2">Starter Code:</p>
                          <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                            {question.starter_code}
                          </pre>
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-semibold mb-2">Your Solution:</p>
                        <Textarea
                          value={submissions[question.id] || question.starter_code || ""}
                          onChange={(e) => setSubmissions({
                            ...submissions,
                            [question.id]: e.target.value
                          })}
                          rows={10}
                          className="font-mono text-xs"
                          placeholder="Write your code here..."
                        />
                      </div>

                      <Button
                        onClick={() => handleSubmitAnswer(question.id)}
                        disabled={!submissions[question.id]}
                        className="w-full"
                      >
                        {hasSubmission ? "Update Submission" : "Submit Answer"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Tests Assigned</h3>
            <p className="text-muted-foreground">
              Your teacher hasn't assigned any tests yet
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{assignment.tests?.title}</CardTitle>
                    <CardDescription>
                      Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}
                      {assignment.due_date && ` • Due: ${new Date(assignment.due_date).toLocaleDateString()}`}
                    </CardDescription>
                  </div>
                  <Button onClick={() => openTest(assignment)}>
                    Start Test
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{assignment.tests?.description}</p>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {assignment.tests?.duration_minutes} minutes
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
