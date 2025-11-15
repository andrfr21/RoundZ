import { CheckCircle2, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const DonePhase = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 max-w-2xl mx-auto text-center">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-phase-fit/20 animate-pulse-glow" />
        </div>
        <CheckCircle2 className="relative h-24 w-24 text-phase-fit" />
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Interview Complete!</h2>
        <p className="text-lg text-muted-foreground">
          Thank you for participating in the RoundZ AI Interview. Your responses have been recorded and will be reviewed by our team.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Button variant="default" className="gap-2">
          <Download className="h-4 w-4" />
          Download Transcript
        </Button>
        <Button variant="secondary" className="gap-2">
          <Mail className="h-4 w-4" />
          Email Results
        </Button>
      </div>

      <div className="mt-8 p-6 rounded-lg bg-card border border-border space-y-3">
        <h3 className="font-semibold">What happens next?</h3>
        <ul className="text-sm text-muted-foreground space-y-2 text-left">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Our team will review your interview within 2-3 business days</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>You'll receive detailed feedback via email</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Top candidates will be invited for a final round</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DonePhase;
