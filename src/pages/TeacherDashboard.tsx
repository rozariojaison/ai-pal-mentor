import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, BookOpen, ClipboardList, Users, MessageSquare, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QuestionManager } from "@/components/teacher/QuestionManager";
import { TestManager } from "@/components/teacher/TestManager";
import { StudentPerformance } from "@/components/teacher/StudentPerformance";
import { FeedbackManager } from "@/components/teacher/FeedbackManager";

export default function TeacherDashboard() {
  const { user, signOut } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("questions");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!roleLoading && role !== 'teacher') {
      navigate("/dashboard");
      return;
    }

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      setProfile(data);
    };

    fetchProfile();
  }, [user, role, roleLoading, navigate]);

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Teacher Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome, {profile?.full_name || user?.email}
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={signOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="questions" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Questions
            </TabsTrigger>
            <TabsTrigger value="tests" className="gap-2">
              <ClipboardList className="w-4 h-4" />
              Tests
            </TabsTrigger>
            <TabsTrigger value="students" className="gap-2">
              <Users className="w-4 h-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="feedback" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions">
            <QuestionManager />
          </TabsContent>

          <TabsContent value="tests">
            <TestManager />
          </TabsContent>

          <TabsContent value="students">
            <StudentPerformance />
          </TabsContent>

          <TabsContent value="feedback">
            <FeedbackManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
