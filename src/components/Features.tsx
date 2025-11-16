import { 
  CheckCircle2, 
  Shield, 
  Zap, 
  Target, 
  Database, 
  GitBranch,
  FileSearch,
  TrendingUp 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Target,
    title: "Progressive Adaptive Learning",
    description: "Tailors feedback to each student's skill level and learning pace, ensuring personalized guidance at every step.",
    color: "text-primary"
  },
  {
    icon: FileSearch,
    title: "Intelligent Code Analysis",
    description: "Evaluates code quality, efficiency, best practices, and logical reasoning with high accuracy.",
    color: "text-secondary"
  },
  {
    icon: CheckCircle2,
    title: "Misconception Detection",
    description: "Identifies conceptual gaps and misunderstandings to provide targeted educational interventions.",
    color: "text-accent"
  },
  {
    icon: Shield,
    title: "Privacy-First Architecture",
    description: "Runs entirely offline on a microserver, ensuring student data never leaves the institution.",
    color: "text-primary"
  },
  {
    icon: Database,
    title: "Interaction Logging",
    description: "Maintains detailed logs of all interactions for learning pattern analysis and system improvement.",
    color: "text-secondary"
  },
  {
    icon: Zap,
    title: "Real-Time Feedback",
    description: "Provides instant, structured responses using optimized TensorFlow Lite models.",
    color: "text-accent"
  },
  {
    icon: GitBranch,
    title: "Multi-Input Support",
    description: "Accepts text explanations, code snippets, and handwritten inputs via OCR.",
    color: "text-primary"
  },
  {
    icon: TrendingUp,
    title: "Skill Profiling",
    description: "Builds progressive skill profiles to track student growth and recommend next learning steps.",
    color: "text-secondary"
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Powerful Features for{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Adaptive Learning
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            AI-PAL combines cutting-edge machine learning with educational best practices 
            to deliver a comprehensive learning support system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/30"
            >
              <CardContent className="p-6 space-y-4">
                <div className="inline-flex p-3 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-lg text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
