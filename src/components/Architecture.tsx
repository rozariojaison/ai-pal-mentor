import { Card, CardContent } from "@/components/ui/card";
import { 
  FileInput, 
  CheckCircle, 
  Cpu, 
  MessageSquare, 
  Database, 
  Container,
  ArrowRight
} from "lucide-react";

const architectureSteps = [
  {
    icon: FileInput,
    title: "Input Handler",
    description: "Accepts text, code, or handwritten images via OCR",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: CheckCircle,
    title: "Validation",
    description: "Strict validation using regex and structured rules",
    color: "bg-secondary/10 text-secondary"
  },
  {
    icon: Cpu,
    title: "Feature Transform",
    description: "Tokenization and vectorization for ML compatibility",
    color: "bg-accent/10 text-accent"
  },
  {
    icon: Cpu,
    title: "TFLite Inference",
    description: "Quantized TensorFlow Lite model processes input",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: MessageSquare,
    title: "Feedback Engine",
    description: "Generates personalized, adaptive responses",
    color: "bg-secondary/10 text-secondary"
  },
  {
    icon: Database,
    title: "Local Logging",
    description: "Stores interactions for skill profiling",
    color: "bg-accent/10 text-accent"
  }
];

const techStack = [
  { name: "FastAPI", description: "Lightweight backend server" },
  { name: "TensorFlow Lite", description: "Optimized ML inference" },
  { name: "MediaPipe", description: "OCR and image processing" },
  { name: "Docker", description: "Containerized deployment" },
  { name: "Python 3.8+", description: "Core programming language" },
  { name: "Microserver", description: "Offline-first architecture" }
];

export const Architecture = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              System{" "}
              <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
                Architecture
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A robust, offline-first pipeline designed for privacy, performance, and scalability
            </p>
          </div>

          {/* Pipeline Flow */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">Processing Pipeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {architectureSteps.map((step, index) => (
                <div key={index} className="relative">
                  <Card className="h-full border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-lg ${step.color}`}>
                          <step.icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">
                          Step {index + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                  {index < architectureSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-2xl font-bold mb-8 text-center">Technology Stack</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {techStack.map((tech, index) => (
                <Card key={index} className="border-border/50 hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6 text-center space-y-2">
                    <Container className="w-8 h-8 mx-auto text-primary mb-2" />
                    <h4 className="font-semibold">{tech.name}</h4>
                    <p className="text-xs text-muted-foreground">{tech.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border border-primary/20">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  94.6%
                </div>
                <p className="text-sm text-muted-foreground">Model Accuracy</p>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-2">
                  100%
                </div>
                <p className="text-sm text-muted-foreground">Offline Operation</p>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">
                  60+
                </div>
                <p className="text-sm text-muted-foreground">Students Supported</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
