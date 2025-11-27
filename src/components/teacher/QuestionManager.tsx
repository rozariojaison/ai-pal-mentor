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
import { Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

export const QuestionManager = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    programming_language: "javascript",
    difficulty: "medium",
    topic: "",
    starter_code: "",
    expected_concepts: ""
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setQuestions(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const questionData = {
      ...formData,
      expected_concepts: formData.expected_concepts.split(',').map(c => c.trim()),
      teacher_id: user?.id
    };

    if (editingQuestion) {
      const { error } = await supabase
        .from("questions")
        .update(questionData)
        .eq("id", editingQuestion.id);

      if (error) {
        toast.error("Failed to update question");
        return;
      }
      toast.success("Question updated successfully");
    } else {
      const { error } = await supabase
        .from("questions")
        .insert(questionData);

      if (error) {
        toast.error("Failed to create question");
        return;
      }
      toast.success("Question created successfully");
    }

    setIsDialogOpen(false);
    setEditingQuestion(null);
    resetForm();
    fetchQuestions();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("questions")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete question");
      return;
    }
    toast.success("Question deleted successfully");
    fetchQuestions();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      programming_language: "javascript",
      difficulty: "medium",
      topic: "",
      starter_code: "",
      expected_concepts: ""
    });
  };

  const openEditDialog = (question: any) => {
    setEditingQuestion(question);
    setFormData({
      title: question.title,
      description: question.description,
      programming_language: question.programming_language,
      difficulty: question.difficulty,
      topic: question.topic,
      starter_code: question.starter_code || "",
      expected_concepts: question.expected_concepts?.join(', ') || ""
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Question Bank</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuestion ? "Edit Question" : "Create New Question"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
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
                  required
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Programming Language</Label>
                  <Select
                    value={formData.programming_language}
                    onValueChange={(value) => setFormData({...formData, programming_language: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData({...formData, difficulty: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  required
                  placeholder="e.g., Loops, Functions, Arrays"
                />
              </div>
              <div>
                <Label htmlFor="starter_code">Starter Code (Optional)</Label>
                <Textarea
                  id="starter_code"
                  value={formData.starter_code}
                  onChange={(e) => setFormData({...formData, starter_code: e.target.value})}
                  rows={4}
                  placeholder="function solve() {\n  // Your code here\n}"
                />
              </div>
              <div>
                <Label htmlFor="expected_concepts">Expected Concepts (comma-separated)</Label>
                <Input
                  id="expected_concepts"
                  value={formData.expected_concepts}
                  onChange={(e) => setFormData({...formData, expected_concepts: e.target.value})}
                  placeholder="loops, conditionals, arrays"
                />
              </div>
              <Button type="submit" className="w-full">
                {editingQuestion ? "Update Question" : "Create Question"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {questions.map((question) => (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{question.title}</CardTitle>
                  <CardDescription>
                    {question.programming_language} • {question.difficulty} • {question.topic}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(question)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(question.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{question.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
