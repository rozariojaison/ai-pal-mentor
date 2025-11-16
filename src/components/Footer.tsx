import { Brain, Github, Mail, FileText } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">AI-PAL</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Progressive Adaptive Learning for Programming Education
            </p>
          </div>

          {/* Project Info */}
          <div>
            <h4 className="font-semibold mb-4">Project</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Dept of CSE, VVIT</li>
              <li>Academic Year 2025-2026</li>
              <li>Microserver Architecture</li>
              <li>Open Source</li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 className="font-semibold mb-4">Technology</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>TensorFlow Lite</li>
              <li>FastAPI</li>
              <li>Docker</li>
              <li>Python 3.8+</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <div className="space-y-3">
              <a 
                href="#" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <FileText className="w-4 h-4" />
                Documentation
              </a>
              <a 
                href="#" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
                Source Code
              </a>
              <a 
                href="#" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contact Us
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© 2025 AI-PAL. An Adaptive Learning Chatbot for Programming. All rights reserved.</p>
          <p className="mt-2">Built with privacy-first principles and educational excellence in mind.</p>
        </div>
      </div>
    </footer>
  );
};
