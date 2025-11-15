import { useState } from "react";
import { useParams } from "react-router-dom";
import InterviewHeader from "@/components/interview/InterviewHeader";
import CameraPreview from "@/components/interview/CameraPreview";
import CentralPanel from "@/components/interview/CentralPanel";
import ChatPanel from "@/components/interview/ChatPanel";

export type Phase = "FIT" | "TECH" | "BRAINTEASER" | "DONE";

export interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
}

const Interview = () => {
  const { token } = useParams<{ token: string }>();
  const [phase, setPhase] = useState<Phase>("FIT");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hello! I'm your AI interviewer. Let's start with the cultural fit assessment. Tell me about yourself.",
      timestamp: new Date(),
    },
  ]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const handleNextPhase = () => {
    const phaseOrder: Phase[] = ["FIT", "TECH", "BRAINTEASER", "DONE"];
    const currentIndex = phaseOrder.indexOf(phase);
    if (currentIndex < phaseOrder.length - 1) {
      setPhase(phaseOrder[currentIndex + 1]);
      
      // Add phase transition message
      let transitionMessage = "";
      switch (phaseOrder[currentIndex + 1]) {
        case "TECH":
          transitionMessage = "Great! Now let's move to the technical assessment. I'll present some coding challenges.";
          break;
        case "BRAINTEASER":
          transitionMessage = "Excellent work! For the final phase, let's test your problem-solving with some brainteasers.";
          break;
        case "DONE":
          transitionMessage = "Congratulations! You've completed all phases of the interview. Thank you for your time!";
          break;
      }
      
      if (transitionMessage) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "ai",
          content: transitionMessage,
          timestamp: new Date(),
        }]);
      }
    }
  };

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);

    // TODO: Send message to AI voice agent backend
    // Simulate AI response for now
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "Thank you for sharing that. Could you elaborate further?",
        timestamp: new Date(),
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <InterviewHeader
        phase={phase}
        isMicOn={isMicOn}
        isCameraOn={isCameraOn}
        onMicToggle={() => setIsMicOn(!isMicOn)}
        onCameraToggle={() => setIsCameraOn(!isCameraOn)}
      />

      <div className="flex-1 relative p-4 overflow-hidden">
        <CentralPanel phase={phase} onNextPhase={handleNextPhase} />
        <CameraPreview isActive={isCameraOn} />
      </div>

      <ChatPanel messages={messages} onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Interview;
