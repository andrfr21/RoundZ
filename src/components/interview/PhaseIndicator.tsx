import { Phase } from "@/pages/Interview";
import { cn } from "@/lib/utils";

interface PhaseIndicatorProps {
  phase: Phase;
}

const PhaseIndicator = ({ phase }: PhaseIndicatorProps) => {
  const phases: Phase[] = ["FIT", "TECH", "BRAINTEASER"];
  
  const getPhaseColor = (p: Phase) => {
    switch (p) {
      case "FIT":
        return "text-phase-fit";
      case "TECH":
        return "text-phase-tech";
      case "BRAINTEASER":
        return "text-phase-brain";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="flex items-center gap-2">
      {phases.map((p, index) => {
        const isActive = p === phase;
        const isPassed = phases.indexOf(phase) > index;
        
        return (
          <div key={p} className="flex items-center gap-2">
            <div
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all",
                isActive && "bg-secondary ring-2 ring-primary/50",
                isPassed && "bg-secondary/50 text-muted-foreground",
                !isActive && !isPassed && "bg-secondary/20 text-muted-foreground",
                isActive && getPhaseColor(p)
              )}
            >
              {p}
            </div>
            {index < phases.length - 1 && (
              <div className={cn(
                "w-8 h-0.5 transition-colors",
                isPassed ? "bg-primary" : "bg-border"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PhaseIndicator;
