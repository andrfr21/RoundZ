import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Video, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleStartDemo = () => {
    // Generate a demo token
    const demoToken = `demo-${Date.now()}`;
    navigate(`/interview/${demoToken}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-2xl shadow-primary/50 mb-4">
            <span className="text-3xl font-bold text-primary-foreground">RZ</span>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                RoundZ
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Next-generation AI-powered interview platform. Experience seamless video interviews 
              with intelligent assessment across all skill dimensions.
            </p>
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            onClick={handleStartDemo}
            className="gap-2 text-lg px-8 py-6 shadow-lg shadow-primary/30"
          >
            Start Demo Interview
            <ArrowRight className="h-5 w-5" />
          </Button>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 pt-16 border-t border-border">
            <div className="space-y-3 p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-phase-fit/10 flex items-center justify-center mx-auto">
                <Video className="h-6 w-6 text-phase-fit" />
              </div>
              <h3 className="font-semibold text-lg">Video Interview</h3>
              <p className="text-sm text-muted-foreground">
                Real-time video conversations with AI interviewers in a Zoom-like environment
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-phase-tech/10 flex items-center justify-center mx-auto">
                <Sparkles className="h-6 w-6 text-phase-tech" />
              </div>
              <h3 className="font-semibold text-lg">Smart Assessment</h3>
              <p className="text-sm text-muted-foreground">
                Multi-phase evaluation covering cultural fit, technical skills, and problem-solving
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-phase-brain/10 flex items-center justify-center mx-auto">
                <Brain className="h-6 w-6 text-phase-brain" />
              </div>
              <h3 className="font-semibold text-lg">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">
                Advanced voice AI that adapts to your responses and provides real-time feedback
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border">
        <p>© 2024 RoundZ. Powered by Lovable AI.</p>
      </footer>
    </div>
  );
};

export default Index;
