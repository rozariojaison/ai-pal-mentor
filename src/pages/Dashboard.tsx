import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LogOut, 
  TrendingUp, 
  Clock, 
  Target, 
  Brain,
  Code2,
  FileText,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DemoReal } from "@/components/DemoReal";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("analysis");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchData = async () => {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      // Fetch recent interactions
      const { data: interactionsData } = await supabase
        .from("student_interactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      setInteractions(interactionsData || []);

      // Fetch progress
      const { data: progressData } = await supabase
        .from("student_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("skill_level", { ascending: false });

      setProgress(progressData || []);
      setLoading(false);
    };

    fetchData();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalInteractions = interactions.length;
  const averageSkillLevel = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + p.skill_level, 0) / progress.length)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI-PAL Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {profile?.full_name || user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={signOut}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Skill Level</p>
                  <p className="text-2xl font-bold">{averageSkillLevel}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <Clock className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Submissions</p>
                  <p className="text-2xl font-bold">{totalInteractions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Topics Covered</p>
                  <p className="text-2xl font-bold">{progress.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="analysis">Code Analysis</TabsTrigger>
            <TabsTrigger value="progress">Learning Progress</TabsTrigger>
            <TabsTrigger value="history">Interaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">
            <DemoReal />
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            {progress.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Progress Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start submitting code and explanations to track your learning progress
                  </p>
                  <Button onClick={() => setActiveTab("analysis")} className="bg-gradient-to-r from-primary to-secondary">
                    Start Analyzing Code
                  </Button>
                </CardContent>
              </Card>
            ) : (
              progress.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{item.topic}</CardTitle>
                      <span className="text-sm text-muted-foreground">
                        {item.interactions_count} interactions
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Skill Level</span>
                      <span className="font-semibold">{item.skill_level}%</span>
                    </div>
                    <Progress value={item.skill_level} className="h-2" />
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {interactions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Interactions Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Your submission history will appear here
                  </p>
                  <Button onClick={() => setActiveTab("analysis")} className="bg-gradient-to-r from-primary to-secondary">
                    Make Your First Submission
                  </Button>
                </CardContent>
              </Card>
            ) : (
              interactions.map((interaction) => (
                <Card key={interaction.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {interaction.input_type === "code" ? (
                        <Code2 className="w-4 h-4 text-primary" />
                      ) : (
                        <FileText className="w-4 h-4 text-secondary" />
                      )}
                      <CardTitle className="text-sm">
                        {interaction.input_type === "code" ? "Code" : "Explanation"} Submission
                      </CardTitle>
                    </div>
                    <CardDescription>
                      {new Date(interaction.created_at).toLocaleDateString()} at{" "}
                      {new Date(interaction.created_at).toLocaleTimeString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto max-h-32">
                      {interaction.input_content.substring(0, 200)}
                      {interaction.input_content.length > 200 && "..."}
                    </pre>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
