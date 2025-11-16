import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Code2, Sparkles } from "lucide-react";

export const Hero = () => {
  const scrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-secondary/5 to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Adaptive Learning Technology</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              AI-PAL
            </span>
            <br />
            <span className="text-foreground">
              Progressive Adaptive Learning for Programming
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            An offline, microserver-based adaptive learning assistant that provides personalized, 
            real-time feedback to programming students without compromising data privacy.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              onClick={scrollToDemo}
              className="group bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Try Demo
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/20 hover:bg-primary/5"
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore Features
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
              <div className="p-3 rounded-lg bg-primary/10">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Adaptive Feedback</h3>
              <p className="text-sm text-muted-foreground text-center">
                Personalized learning paths based on student performance
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border/50 hover:border-secondary/30 transition-colors">
              <div className="p-3 rounded-lg bg-secondary/10">
                <Code2 className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground">Code Analysis</h3>
              <p className="text-sm text-muted-foreground text-center">
                Intelligent evaluation of code quality and logic
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border/50 hover:border-accent/30 transition-colors">
              <div className="p-3 rounded-lg bg-accent/10">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground">Offline First</h3>
              <p className="text-sm text-muted-foreground text-center">
                Complete privacy with microserver deployment
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
