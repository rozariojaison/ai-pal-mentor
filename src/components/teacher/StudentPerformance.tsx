import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, TrendingUp, Clock } from "lucide-react";

export const StudentPerformance = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, avgProgress: 0, activeToday: 0 });

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    // Fetch all students
    const { data: studentRoles } = await supabase
      .from("user_roles")
      .select("user_id, profiles(full_name, student_id)")
      .eq("role", "student");

    if (!studentRoles) return;

    // Fetch progress for each student
    const studentsWithProgress = await Promise.all(
      studentRoles.map(async (student) => {
        const { data: progress } = await supabase
          .from("student_progress")
          .select("*")
          .eq("user_id", student.user_id);

        const { data: submissions } = await supabase
          .from("test_submissions")
          .select("score")
          .eq("student_id", student.user_id);

        const avgScore = submissions && submissions.length > 0
          ? Math.round(submissions.reduce((sum, s) => sum + (s.score || 0), 0) / submissions.length)
          : 0;

        const avgSkillLevel = progress && progress.length > 0
          ? Math.round(progress.reduce((sum, p) => sum + p.skill_level, 0) / progress.length)
          : 0;

        return {
          ...student,
          avgScore,
          avgSkillLevel,
          topicsCount: progress?.length || 0,
          submissionsCount: submissions?.length || 0
        };
      })
    );

    setStudents(studentsWithProgress);

    // Calculate stats
    const totalProgress = studentsWithProgress.reduce((sum, s) => sum + s.avgSkillLevel, 0);
    setStats({
      total: studentsWithProgress.length,
      avgProgress: studentsWithProgress.length > 0 ? Math.round(totalProgress / studentsWithProgress.length) : 0,
      activeToday: studentsWithProgress.filter(s => s.submissionsCount > 0).length
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Student Performance</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary/10">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">{stats.avgProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Students</p>
                <p className="text-2xl font-bold">{stats.activeToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <div className="grid gap-4">
        {students.map((student) => (
          <Card key={student.user_id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {student.profiles?.full_name?.charAt(0) || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {student.profiles?.full_name || 'Student'}
                    </CardTitle>
                    <CardDescription>
                      {student.profiles?.student_id || student.user_id.slice(0, 8)}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                  <p className="text-xl font-bold">{student.avgScore}%</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Skill Level</span>
                  <span className="font-semibold">{student.avgSkillLevel}%</span>
                </div>
                <Progress value={student.avgSkillLevel} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Topics Covered:</span>
                  <span className="font-semibold ml-2">{student.topicsCount}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Submissions:</span>
                  <span className="font-semibold ml-2">{student.submissionsCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
