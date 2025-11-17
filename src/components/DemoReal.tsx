import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Sparkles, Code2, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const demoQuestions = {
  code: [
    {
      title: "Bubble Sort Implementation",
      content: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,
      language: "Python"
    },
    {
      title: "Factorial Function",
      content: `function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`,
      language: "JavaScript"
    },
    {
      title: "String Reversal",
      content: `def reverse_string(s):
    return s[::-1]`,
      language: "Python"
    }
  ],
  text: [
    {
      title: "Linked List Explanation",
      content: `A linked list is a data structure where elements are stored in nodes. Each node contains data and a pointer to the next node. It's better than arrays because you can insert elements easily.`
    },
    {
      title: "Binary Search Explanation",
      content: `Binary search is an algorithm that finds the position of a target value within a sorted array. It works by repeatedly dividing the search interval in half and comparing the target to the middle element.`
    }
  ]
};

export const DemoReal = () => {
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<"text" | "code">("text");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<number>(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!input.trim()) {
      toast.error("Please enter some content to analyze");
      return;
    }

    setIsAnalyzing(true);
    setFeedback(null);

    try {
      // Use demo function if not authenticated, otherwise use full analysis
      const functionName = user ? "analyze-input" : "analyze-demo";
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          inputType: activeTab,
          inputContent: input,
          programmingLanguage: activeTab === "code" ? "Python" : null,
        },
      });

      if (error) {
        console.error("Analysis error:", error);
        if (error.message?.includes("429") || error.message?.includes("rate limit")) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
        } else if (error.message?.includes("402") || error.message?.includes("credits")) {
          toast.error("AI credits exhausted. Please add credits to continue.");
        } else {
          toast.error("Analysis failed. Please try again.");
        }
        return;
      }

      if (data?.feedback) {
        setFeedback(data.feedback);
        toast.success("Analysis complete!");
      } else {
        toast.error("No feedback received");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSample = (index: number) => {
    setSelectedQuestion(index);
    const questions = activeTab === "code" ? demoQuestions.code : demoQuestions.text;
    const question = questions[index];
    setInput(question.content);
    setFeedback(null);
  };

  return (
    <section id="demo" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Try{" "}
              <span className="bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
                AI-PAL
              </span>
              {" "}Demo
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience adaptive feedback powered by real AI. Submit your code or explanations 
              and receive personalized analysis instantly.
            </p>
          </div>

          <Alert className="mb-6 border-primary/20 bg-primary/5">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                {user 
                  ? "Select a sample question below or write your own to get personalized feedback"
                  : "Try the demo with sample questions below - Sign in to save your progress and unlock full features"
                }
              </span>
              {!user && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/auth")}
                  className="ml-4 border-primary/20"
                >
                  Sign In
                </Button>
              )}
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Your Input
                </CardTitle>
                <CardDescription>
                  Enter your code or explanation below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "text" | "code")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text" className="gap-2">
                      <FileText className="w-4 h-4" />
                      Explanation
                    </TabsTrigger>
                    <TabsTrigger value="code" className="gap-2">
                      <Code2 className="w-4 h-4" />
                      Code
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="text" className="space-y-4">
                    <Textarea
                      placeholder="Explain a programming concept in your own words..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </TabsContent>
                  <TabsContent value="code" className="space-y-4">
                    <Textarea
                      placeholder="Paste your code here..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </TabsContent>
                </Tabs>

                <div className="space-y-3">
                  <div className="text-sm font-medium text-muted-foreground">
                    Sample Questions for Testing:
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {(activeTab === "code" ? demoQuestions.code : demoQuestions.text).map((question, index) => (
                      <Button
                        key={index}
                        variant={selectedQuestion === index ? "default" : "outline"}
                        size="sm"
                        onClick={() => loadSample(index)}
                        className="justify-start text-left h-auto py-2"
                      >
                        <span className="font-medium">{index + 1}.</span>
                        <span className="ml-2 truncate">{question.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Analyze with AI
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Section */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  AI Feedback
                </CardTitle>
                <CardDescription>
                  Personalized adaptive learning feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!feedback ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-4">
                    <div className="p-4 rounded-full bg-muted">
                      <Sparkles className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Select a sample question or write your own, then click "Analyze with AI" to receive intelligent feedback
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {feedback}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
