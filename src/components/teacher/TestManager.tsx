import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Edit, UserPlus } from "lucide-react";
import { toast } from "sonner";

export const TestManager = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration_minutes: 60,
    is_published: false
  });

  useEffect(() => {
    fetchTests();
    fetchQuestions();
    fetchStudents();
  }, []);

  const fetchTests = async () => {
    const { data } = await supabase
      .from("tests")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setTests(data);
  };

  const fetchQuestions = async () => {
    const { data } = await supabase
      .from("questions")
      .select("*")
      .order("title");
    if (data) setQuestions(data);
  };

  const fetchStudents = async () => {
    const { data } = await supabase
      .from("user_roles")
      .select("user_id, profiles(full_name)")
      .eq("role", "student");
    if (data) setStudents(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: testData, error } = await supabase
      .from("tests")
      .insert({ ...formData, teacher_id: user?.id })
      .select()
      .single();

    if (error || !testData) {
      toast.error("Failed to create test");
      return;
    }

    // Add questions to test
    if (selectedQuestions.length > 0) {
      const testQuestions = selectedQuestions.map((qId, index) => ({
        test_id: testData.id,
        question_id: qId,
        order_index: index,
        points: 10
      }));

      await supabase.from("test_questions").insert(testQuestions);
    }

    toast.success("Test created successfully");
    setIsDialogOpen(false);
    resetForm();
    fetchTests();
  };

  const handleAssignTest = async () => {
    if (!selectedTest || selectedStudents.length === 0) return;

    const assignments = selectedStudents.map(studentId => ({
      test_id: selectedTest.id,
      student_id: studentId,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }));

    const { error } = await supabase
      .from("test_assignments")
      .insert(assignments);

    if (error) {
      toast.error("Failed to assign test");
      return;
    }

    toast.success(`Test assigned to ${selectedStudents.length} student(s)`);
    setIsAssignDialogOpen(false);
    setSelectedStudents([]);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("tests")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete test");
      return;
    }
    toast.success("Test deleted successfully");
    fetchTests();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      duration_minutes: 60,
      is_published: false
    });
    setSelectedQuestions([]);
  };

  const openAssignDialog = (test: any) => {
    setSelectedTest(test);
    setIsAssignDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Test Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Test
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Test</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Test Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div>
                <Label>Select Questions</Label>
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                  {questions.map((q) => (
                    <div key={q.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedQuestions.includes(q.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedQuestions([...selectedQuestions, q.id]);
                          } else {
                            setSelectedQuestions(selectedQuestions.filter(id => id !== q.id));
                          }
                        }}
                      />
                      <label className="text-sm">{q.title} ({q.difficulty})</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({...formData, is_published: checked as boolean})}
                />
                <Label>Publish immediately</Label>
              </div>
              <Button type="submit" className="w-full">Create Test</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Test to Students</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Select Students</Label>
            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
              {students.map((s) => (
                <div key={s.user_id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedStudents.includes(s.user_id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedStudents([...selectedStudents, s.user_id]);
                      } else {
                        setSelectedStudents(selectedStudents.filter(id => id !== s.user_id));
                      }
                    }}
                  />
                  <label className="text-sm">{s.profiles?.full_name || s.user_id}</label>
                </div>
              ))}
            </div>
            <Button onClick={handleAssignTest} className="w-full">Assign Test</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {tests.map((test) => (
          <Card key={test.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{test.title}</CardTitle>
                  <CardDescription>
                    {test.duration_minutes} minutes • {test.is_published ? "Published" : "Draft"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAssignDialog(test)}
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(test.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{test.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
