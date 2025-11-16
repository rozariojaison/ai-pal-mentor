import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Sparkles, Code2, FileText } from "lucide-react";
import { toast } from "sonner";

const sampleCode = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`;

const sampleExplanation = `A linked list is a data structure where elements are stored in nodes. Each node contains data and a pointer to the next node. It's better than arrays because you can insert elements easily.`;

const mockFeedback = {
  clarity: {
    score: 78,
    analysis: "Your explanation covers basic concepts but lacks depth in certain areas. Structure is clear but could benefit from more specific examples."
  },
  conceptual: {
    understanding: "Good grasp of basic linked list structure. However, missing key aspects like time complexity advantages.",
    gaps: ["Time complexity comparison", "Memory allocation details", "Traversal patterns"]
  },
  codeQuality: {
    efficiency: "Algorithm is correct but not optimal. Time complexity: O(n²)",
    bestPractices: "Consider using early termination for already sorted arrays",
    suggestions: ["Add a 'swapped' flag for optimization", "Include input validation", "Add docstring documentation"]
  },
  misconceptions: [
    "Insertion is not always 'easy' - depends on position and whether you have the reference"
  ],
  hints: "Try explaining why insertion at the beginning is O(1) but at the end could be O(n) without a tail pointer.",
  nextTopic: "Consider studying doubly linked lists and their advantages next."
};

export const Demo = () => {
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("text");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnalyze = () => {
    if (!input.trim()) {
      toast.error("Please enter some content to analyze");
      return;
    }

    setIsAnalyzing(true);
    setShowFeedback(false);

    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowFeedback(true);
      toast.success("Analysis complete!");
    }, 2000);
  };

  const loadSample = () => {
    if (activeTab === "code") {
      setInput(sampleCode);
    } else {
      setInput(sampleExplanation);
    }
    setShowFeedback(false);
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
              Experience adaptive feedback in action. Submit your code or explanations 
              and receive personalized analysis instantly.
            </p>
          </div>

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
                <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                        Analyze
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={loadSample}
                    className="border-primary/20"
                  >
                    Load Sample
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
                {!showFeedback ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-4">
                    <div className="p-4 rounded-full bg-muted">
                      <Sparkles className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Submit your input to receive adaptive feedback
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                    {/* Clarity Analysis */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        Clarity Analysis
                      </h4>
                      <div className="pl-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Score:</span>
                          <span className="text-sm font-medium">{mockFeedback.clarity.score}%</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{mockFeedback.clarity.analysis}</p>
                      </div>
                    </div>

                    {/* Conceptual Understanding */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                        Conceptual Understanding
                      </h4>
                      <div className="pl-4 space-y-2">
                        <p className="text-sm text-muted-foreground">{mockFeedback.conceptual.understanding}</p>
                        <div>
                          <p className="text-xs font-medium mb-1">Areas to strengthen:</p>
                          <ul className="space-y-1">
                            {mockFeedback.conceptual.gaps.map((gap, i) => (
                              <li key={i} className="text-xs text-muted-foreground ml-4">• {gap}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Code Quality */}
                    {activeTab === "code" && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-accent" />
                          Code Quality
                        </h4>
                        <div className="pl-4 space-y-2">
                          <p className="text-sm text-muted-foreground">{mockFeedback.codeQuality.efficiency}</p>
                          <p className="text-sm text-muted-foreground">{mockFeedback.codeQuality.bestPractices}</p>
                          <div>
                            <p className="text-xs font-medium mb-1">Suggestions:</p>
                            <ul className="space-y-1">
                              {mockFeedback.codeQuality.suggestions.map((suggestion, i) => (
                                <li key={i} className="text-xs text-muted-foreground ml-4">• {suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Adaptive Hint */}
                    <div className="space-y-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <h4 className="font-semibold text-sm text-primary">💡 Adaptive Hint</h4>
                      <p className="text-sm text-foreground">{mockFeedback.hints}</p>
                    </div>

                    {/* Next Topic */}
                    <div className="space-y-2 p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                      <h4 className="font-semibold text-sm text-secondary">🎯 Suggested Next Topic</h4>
                      <p className="text-sm text-foreground">{mockFeedback.nextTopic}</p>
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
