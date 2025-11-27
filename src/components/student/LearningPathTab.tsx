import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Sparkles, Award, AlertCircle } from "lucide-react";

export const LearningPathTab = () => {
  const { user } = useAuth();
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);

  useEffect(() => {
    fetchLearningPath();
    fetchFeedback();
  }, []);

  const fetchLearningPath = async () => {
    const { data } = await supabase
      .from("learning_paths")
      .select("*")
      .eq("student_id", user?.id)
      .order("updated_at", { ascending: false });

    if (data) setLearningPaths(data);
  };

  const fetchFeedback = async () => {
    const { data } = await supabase
      .from("teacher_feedback")
      .select(`
        *,
        profiles!teacher_feedback_teacher_id_fkey(full_name),
        test_submissions(
          questions(title)
        )
      `)
      .eq("student_id", user?.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (data) setFeedback(data);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Learning Path</h2>

      {/* AI-Generated Learning Paths */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Personalized Recommendations
        </h3>
        
        {learningPaths.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Learning Path Yet</h3>
              <p className="text-muted-foreground">
                Complete tests and code analyses to get personalized recommendations
              </p>
            </CardContent>
          </Card>
        ) : (
          learningPaths.map((path) => (
            <Card key={path.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{path.current_topic}</span>
                  <Badge variant="outline">{path.skill_level}% Mastery</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Current Skill Level</span>
                    <span className="font-semibold">{path.skill_level}%</span>
                  </div>
                  <Progress value={path.skill_level} className="h-2" />
                </div>

                {path.strengths && path.strengths.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4 text-green-600" />
                      Your Strengths
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {path.strengths.map((strength: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="bg-green-100 text-green-800">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {path.areas_for_improvement && path.areas_for_improvement.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-600" />
                      Areas to Improve
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {path.areas_for_improvement.map((area: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="bg-orange-100 text-orange-800">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {path.recommended_topics && path.recommended_topics.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Recommended Next Topics
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {path.recommended_topics.map((topic: string, idx: number) => (
                        <li key={idx}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {path.next_milestone && (
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm font-semibold text-primary mb-1">Next Milestone</p>
                    <p className="text-sm">{path.next_milestone}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Teacher Feedback */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Teacher Feedback</h3>
        
        {feedback.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No feedback yet</p>
            </CardContent>
          </Card>
        ) : (
          feedback.map((fb) => (
            <Card key={fb.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {fb.test_submissions?.questions?.title || 'Feedback'}
                    </CardTitle>
                    <CardDescription>
                      From {fb.profiles?.full_name || 'Teacher'} • {new Date(fb.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {fb.rating && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {fb.rating}/5
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{fb.feedback_text}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
