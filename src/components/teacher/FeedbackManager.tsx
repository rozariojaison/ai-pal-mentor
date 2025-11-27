import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";

export const FeedbackManager = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState("3");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    const { data: tests } = await supabase
      .from("tests")
      .select("id")
      .eq("teacher_id", user?.id);

    if (!tests) return;

    const testIds = tests.map(t => t.id);

    const { data } = await supabase
      .from("test_submissions")
      .select(`
        *,
        questions(title, topic),
        tests(title),
        profiles!test_submissions_student_id_fkey(full_name)
      `)
      .in("test_id", testIds)
      .order("submitted_at", { ascending: false });

    if (data) setSubmissions(data);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedSubmission || !feedbackText) return;

    const { error } = await supabase
      .from("teacher_feedback")
      .insert({
        teacher_id: user?.id,
        student_id: selectedSubmission.student_id,
        submission_id: selectedSubmission.id,
        feedback_text: feedbackText,
        rating: parseInt(rating)
      });

    if (error) {
      toast.error("Failed to submit feedback");
      return;
    }

    toast.success("Feedback submitted successfully");
    setIsDialogOpen(false);
    setFeedbackText("");
    setRating("3");
    setSelectedSubmission(null);
  };

  const openFeedbackDialog = (submission: any) => {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Student Submissions</h2>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Provide Feedback</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Student</p>
                <p className="font-semibold">{selectedSubmission.profiles?.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Question</p>
                <p className="font-semibold">{selectedSubmission.questions?.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Code Submission</p>
                <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto max-h-60">
                  {selectedSubmission.code_submission}
                </pre>
              </div>
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Select value={rating} onValueChange={setRating}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Needs Improvement</SelectItem>
                    <SelectItem value="2">2 - Below Average</SelectItem>
                    <SelectItem value="3">3 - Average</SelectItem>
                    <SelectItem value="4">4 - Good</SelectItem>
                    <SelectItem value="5">5 - Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                  placeholder="Provide detailed feedback on the student's submission..."
                />
              </div>
              <Button onClick={handleSubmitFeedback} className="w-full">
                Submit Feedback
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {submission.profiles?.full_name || 'Student'}
                  </CardTitle>
                  <CardDescription>
                    {submission.tests?.title} • {submission.questions?.title}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openFeedbackDialog(submission)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Feedback
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto max-h-32">
                {submission.code_submission.substring(0, 200)}
                {submission.code_submission.length > 200 && "..."}
              </pre>
              {submission.score && (
                <div className="mt-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-semibold">Score: {submission.score}%</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
