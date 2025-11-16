import { Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Docs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold">AI-PAL Documentation</h1>
            </div>
            <Button variant="outline" onClick={() => navigate("/")} className="border-primary/20">
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Introduction */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">AI-PAL Documentation</h1>
          <p className="text-lg text-muted-foreground">
            Complete guide to using the Progressive Adaptive Learning system for programming education
          </p>
        </div>

        {/* Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              AI-PAL is an offline, microserver-based adaptive learning assistant designed to support programming
              education. The system provides personalized, real-time feedback to students without compromising
              data privacy.
            </p>
            <h4>Key Features:</h4>
            <ul>
              <li>Progressive adaptive learning tailored to individual skill levels</li>
              <li>Intelligent code analysis and quality assessment</li>
              <li>Misconception detection and educational interventions</li>
              <li>Privacy-first offline architecture</li>
              <li>Comprehensive interaction logging</li>
            </ul>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Quick start guide for students</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <h4>1. Create an Account</h4>
            <p>
              Sign up using your email address. Email confirmation is auto-enabled for development, so you can
              start immediately after registration.
            </p>

            <h4>2. Submit Your First Analysis</h4>
            <p>
              Navigate to the demo section and submit either:
            </p>
            <ul>
              <li><strong>Code submissions</strong> - Paste your programming code for analysis</li>
              <li><strong>Text explanations</strong> - Explain concepts in your own words</li>
            </ul>

            <h4>3. Review Feedback</h4>
            <p>
              AI-PAL will analyze your submission and provide:
            </p>
            <ul>
              <li>Clarity analysis with scoring</li>
              <li>Conceptual understanding assessment</li>
              <li>Code quality evaluation (for code submissions)</li>
              <li>Misconception detection</li>
              <li>Adaptive hints</li>
              <li>Suggested next topics</li>
            </ul>

            <h4>4. Track Progress</h4>
            <p>
              Visit your dashboard to see learning progress, skill development, and interaction history.
            </p>
          </CardContent>
        </Card>

        {/* Architecture */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>System Architecture</CardTitle>
            <CardDescription>Technical overview</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <h4>Processing Pipeline:</h4>
            <ol>
              <li><strong>Input Handler</strong> - Accepts text, code, or images</li>
              <li><strong>Validation</strong> - Strict input validation and sanitization</li>
              <li><strong>Feature Transform</strong> - Tokenization and vectorization</li>
              <li><strong>AI Inference</strong> - TensorFlow Lite model analysis</li>
              <li><strong>Feedback Engine</strong> - Generates personalized responses</li>
              <li><strong>Local Logging</strong> - Stores interactions securely</li>
            </ol>

            <h4>Technology Stack:</h4>
            <ul>
              <li><strong>Frontend:</strong> React, TypeScript, Tailwind CSS</li>
              <li><strong>Backend:</strong> Lovable Cloud (Supabase)</li>
              <li><strong>AI Engine:</strong> Lovable AI Gateway (Google Gemini)</li>
              <li><strong>Database:</strong> PostgreSQL with RLS</li>
              <li><strong>Authentication:</strong> Lovable Cloud Auth</li>
            </ul>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
            <CardDescription>Tips for effective learning</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <h4>For Students:</h4>
            <ul>
              <li>Submit genuine attempts before checking solutions</li>
              <li>Use adaptive hints as learning opportunities</li>
              <li>Review feedback carefully before revising</li>
              <li>Track your progress regularly</li>
              <li>Focus on understanding concepts, not just correct answers</li>
            </ul>

            <h4>For Instructors:</h4>
            <ul>
              <li>Encourage students to use the system for practice</li>
              <li>Review interaction logs to identify common misconceptions</li>
              <li>Use aggregate progress data to adjust curriculum</li>
              <li>Promote the system as a learning aid, not a solution provider</li>
            </ul>
          </CardContent>
        </Card>

        {/* Security & Privacy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Security & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <h4>Data Protection:</h4>
            <ul>
              <li>All user data is protected with Row Level Security (RLS)</li>
              <li>Interactions are logged locally and associated only with user accounts</li>
              <li>No student data is shared with third parties</li>
              <li>Authentication uses secure token-based system</li>
            </ul>

            <h4>Academic Integrity:</h4>
            <ul>
              <li>System provides hints and guidance, not complete solutions</li>
              <li>Designed to promote learning and understanding</li>
              <li>Interaction logs help detect unusual patterns</li>
            </ul>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle>Support & Contact</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              For technical support, questions, or feedback, please contact:
            </p>
            <ul>
              <li><strong>Institution:</strong> VVIT Department of Computer Science</li>
              <li><strong>Academic Year:</strong> 2025-2026</li>
              <li><strong>System Type:</strong> Microserver Architecture</li>
            </ul>

            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="font-semibold mb-2">Quick Links:</p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate("/")} className="border-primary/20">
                  Home
                </Button>
                <Button variant="outline" onClick={() => navigate("/auth")} className="border-secondary/20">
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="border-accent/20"
                >
                  Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
