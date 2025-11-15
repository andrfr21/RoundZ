import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import PhaseIndicator from "./PhaseIndicator";
import { Phase } from "@/pages/Interview";
import { useEffect, useState } from "react";

interface InterviewHeaderProps {
  phase: Phase;
  isMicOn: boolean;
  isCameraOn: boolean;
  onMicToggle: () => void;
  onCameraToggle: () => void;
}

const InterviewHeader = ({
  phase,
  isMicOn,
  isCameraOn,
  onMicToggle,
  onCameraToggle,
}: InterviewHeaderProps) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-semibold">AI Voice Interview</h1>
        <PhaseIndicator phase={phase} />
      </div>

      <div className="flex items-center gap-4">
        <div className="text-muted-foreground font-mono text-sm">
          {formatTime(timer)}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={isMicOn ? "secondary" : "destructive"}
            size="icon"
            onClick={onMicToggle}
            className="rounded-full"
          >
            {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          
          <Button
            variant={isCameraOn ? "secondary" : "destructive"}
            size="icon"
            onClick={onCameraToggle}
            className="rounded-full"
          >
            {isCameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default InterviewHeader;
