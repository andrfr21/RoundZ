import { Phase } from "@/pages/Interview";
import FitPhase from "./phases/FitPhase";
import TechPhase from "./phases/TechPhase";
import BrainteaserPhase from "./phases/BrainteaserPhase";
import DonePhase from "./phases/DonePhase";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface CentralPanelProps {
  phase: Phase;
  onNextPhase: () => void;
}

const CentralPanel = ({ phase, onNextPhase }: CentralPanelProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center pb-64 relative">
      {phase === "FIT" && <FitPhase />}
      {phase === "TECH" && <TechPhase />}
      {phase === "BRAINTEASER" && <BrainteaserPhase />}
      {phase === "DONE" && <DonePhase />}
      
      {phase !== "DONE" && (
        <Button
          onClick={onNextPhase}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 gap-2"
          size="lg"
        >
          Next Phase
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default CentralPanel;
