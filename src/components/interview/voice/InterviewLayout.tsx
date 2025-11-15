import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Brain, CheckCircle2 } from "lucide-react";
import { useParams } from "react-router-dom";

type Phase = "FIT" | "TECH" | "BRAINTEASER" | "DONE";

const Interview = () => {
  const { token } = useParams<{ token: string }>();
  const [phase, setPhase] = useState<Phase>("FIT");

  // TODO: Initialize AI voice agent here when component mounts
  // - Connect to voice service (e.g., Deepgram, PlayHT, ElevenLabs)
  // - Set up microphone permissions and audio streaming
  // - Initialize speech-to-text for transcript capture

  const handleNextPhase = () => {
    const phaseOrder: Phase[] = ["FIT", "TECH", "BRAINTEASER", "DONE"];
    const currentIndex = phaseOrder.indexOf(phase);
    if (currentIndex < phaseOrder.length - 1) {
      setPhase(phaseOrder[currentIndex + 1]);
      // TODO: When phase changes, send signal to backend to:
      // - Update interview phase in database
      // - Adjust AI interviewer personality/question style
      // - Log phase transition in transcript
    }
  };

  const getPhaseTitle = () => {
    switch (phase) {
      case "FIT":
        return "Cultural Fit Assessment";
      case "TECH":
        return "Technical Evaluation";
      case "BRAINTEASER":
        return "Problem Solving Challenge";
      case "DONE":
        return "Interview Complete";
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "FIT":
        return "text-phase-fit";
      case "TECH":
        return "text-phase-tech";
      case "BRAINTEASER":
        return "text-phase-brain";
      case "DONE":
        return "text-green-500";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">RZ</span>
            </div>
            <div>
              <h1 className="font-semibold">RoundZ Interview</h1>
              <p className="text-xs text-muted-foreground">Session: {token?.slice(0, 12)}...</p>
            </div>
          </div>
          
          {/* Phase Indicator */}
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${getPhaseColor()}`}>
              {getPhaseTitle()}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-5xl">
          
          {/* FIT Phase */}
          {phase === "FIT" && (
            <div className="space-y-8 text-center">
              {/* Pulsing Logo */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-phase-fit/20 animate-ping" />
                  <div className="absolute inset-0 rounded-full bg-phase-fit/10 animate-pulse" 
                       style={{ animationDuration: '2s' }} />
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-phase-fit/30 to-phase-fit/10 border-4 border-phase-fit/40 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-5xl font-bold text-phase-fit">RZ</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold">Cultural Fit Assessment</h2>
                <p className="text-lg text-muted-foreground">
                  We're starting with a few questions about your background and motivations. 
                  This helps us understand if our company values align with yours.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-6">
                  <div className="w-2 h-2 rounded-full bg-phase-fit animate-pulse" />
                  <span>AI interviewer is listening...</span>
                </div>
              </div>

              {/* TODO: Voice Activity Indicator */}
              {/* Add waveform visualization here showing user speech activity */}
              {/* TODO: Display live transcript at bottom of screen */}
            </div>
          )}

          {/* TECH Phase */}
          {phase === "TECH" && (
            <div className="space-y-8">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl font-bold">Technical Evaluation</h2>
                <p className="text-muted-foreground">
                  Now let's dive into some technical scenarios. Review the code and discuss your approach.
                </p>
              </div>

              {/* Code Boards */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* SQL Code Board */}
                <div className="rounded-lg border border-border bg-card overflow-hidden shadow-lg">
                  {/* Editor Header */}
                  <div className="bg-muted/50 px-4 py-2 flex items-center gap-2 border-b border-border">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">query.sql</span>
                  </div>
                  
                  {/* Code Content */}
                  <div className="bg-slate-950 p-4 font-mono text-sm overflow-x-auto">
                    <pre className="text-slate-200">
<span className="text-purple-400">SELECT</span> u.name, 
       <span className="text-blue-400">COUNT</span>(o.id) <span className="text-purple-400">AS</span> order_count
<span className="text-purple-400">FROM</span> users u
<span className="text-purple-400">LEFT JOIN</span> orders o 
  <span className="text-purple-400">ON</span> u.id = o.user_id
<span className="text-purple-400">WHERE</span> o.created_at {`>=`} <span className="text-green-400">'2024-01-01'</span>
<span className="text-purple-400">GROUP BY</span> u.id, u.name
<span className="text-purple-400">HAVING</span> <span className="text-blue-400">COUNT</span>(o.id) {`>`} <span className="text-orange-400">5</span>
<span className="text-purple-400">ORDER BY</span> order_count <span className="text-purple-400">DESC</span>;
                    </pre>
                  </div>
                </div>

                {/* Python Code Board */}
                <div className="rounded-lg border border-border bg-card overflow-hidden shadow-lg">
                  {/* Editor Header */}
                  <div className="bg-muted/50 px-4 py-2 flex items-center gap-2 border-b border-border">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">algorithm.py</span>
                  </div>
                  
                  {/* Code Content */}
                  <div className="bg-slate-950 p-4 font-mono text-sm overflow-x-auto">
                    <pre className="text-slate-200">
<span className="text-purple-400">def</span> <span className="text-blue-400">find_duplicates</span>(arr):
    seen = <span className="text-blue-400">set</span>()
    duplicates = []
    
    <span className="text-purple-400">for</span> num <span className="text-purple-400">in</span> arr:
        <span className="text-purple-400">if</span> num <span className="text-purple-400">in</span> seen:
            duplicates.append(num)
        <span className="text-purple-400">else</span>:
            seen.add(num)
    
    <span className="text-purple-400">return</span> duplicates
                    </pre>
                  </div>
                </div>
              </div>

              {/* TODO: Code highlighting based on voice conversation */}
              {/* - Highlight specific lines when AI asks about them */}
              {/* - Allow candidate to reference line numbers verbally */}
            </div>
          )}

          {/* BRAINTEASER Phase */}
          {phase === "BRAINTEASER" && (
            <div className="space-y-8">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl font-bold">Problem Solving Challenge</h2>
                <p className="text-muted-foreground">
                  Now we'll test your reasoning with a small brainteaser. Think out loud and explain your approach.
                </p>
              </div>

              {/* Puzzle Cards */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                
                {/* Door A */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-phase-brain/20 rounded-xl blur-xl group-hover:blur-2xl transition-all animate-pulse" 
                       style={{ animationDuration: '3s' }} />
                  <div className="relative bg-card border-2 border-phase-brain/40 rounded-xl p-8 text-center space-y-4 hover:border-phase-brain/60 transition-colors cursor-pointer">
                    <div className="w-16 h-16 mx-auto rounded-full bg-phase-brain/10 flex items-center justify-center">
                      <Brain className="w-8 h-8 text-phase-brain" />
                    </div>
                    <h3 className="text-2xl font-bold">Door A</h3>
                    <p className="text-sm text-muted-foreground">
                      "I always tell the truth"
                    </p>
                  </div>
                </div>

                {/* Door B */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-phase-brain/20 rounded-xl blur-xl group-hover:blur-2xl transition-all animate-pulse" 
                       style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
                  <div className="relative bg-card border-2 border-phase-brain/40 rounded-xl p-8 text-center space-y-4 hover:border-phase-brain/60 transition-colors cursor-pointer">
                    <div className="w-16 h-16 mx-auto rounded-full bg-phase-brain/10 flex items-center justify-center">
                      <Brain className="w-8 h-8 text-phase-brain" />
                    </div>
                    <h3 className="text-2xl font-bold">Door B</h3>
                    <p className="text-sm text-muted-foreground">
                      "I always tell lies"
                    </p>
                  </div>
                </div>

                {/* Door C */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-phase-brain/20 rounded-xl blur-xl group-hover:blur-2xl transition-all animate-pulse" 
                       style={{ animationDuration: '4s', animationDelay: '1s' }} />
                  <div className="relative bg-card border-2 border-phase-brain/40 rounded-xl p-8 text-center space-y-4 hover:border-phase-brain/60 transition-colors cursor-pointer">
                    <div className="w-16 h-16 mx-auto rounded-full bg-phase-brain/10 flex items-center justify-center">
                      <Brain className="w-8 h-8 text-phase-brain" />
                    </div>
                    <h3 className="text-2xl font-bold">Door C</h3>
                    <p className="text-sm text-muted-foreground">
                      "I sometimes lie"
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
                <p className="italic">
                  "One door leads to treasure, two lead to danger. Each door has a guardian. 
                  You can ask one question to one guardian. What do you ask?"
                </p>
              </div>

              {/* TODO: Track candidate's reasoning process */}
              {/* - Capture key decision points in their verbal explanation */}
              {/* - Score logical consistency and creativity */}
            </div>
          )}

          {/* DONE Phase */}
          {phase === "DONE" && (
            <div className="text-center space-y-8 max-w-2xl mx-auto">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center border-4 border-green-500/30">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-bold">Interview Complete!</h2>
                <p className="text-lg text-muted-foreground">
                  Your interview is complete. Once processed, HR will see your updated score 
                  and comprehensive evaluation across all assessment dimensions.
                </p>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-phase-fit">✓</div>
                  <div className="text-sm text-muted-foreground">Cultural Fit</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-phase-tech">✓</div>
                  <div className="text-sm text-muted-foreground">Technical</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-phase-brain">✓</div>
                  <div className="text-sm text-muted-foreground">Problem Solving</div>
                </div>
              </div>

              {/* TODO: Show processing status */}
              {/* - Display transcript analysis progress */}
              {/* - Show when scores are calculated and ready */}
              {/* - Provide option to review transcript */}
            </div>
          )}

        </div>
      </main>

      {/* Footer Controls */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          
          {/* TODO: Microphone controls will go here */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {/* Microphone mute/unmute button */}
              {/* Volume level indicator */}
              {/* Connection status */}
            </div>
          </div>

          {/* Phase Navigation (temporary for dev) */}
          {phase !== "DONE" && (
            <Button 
              onClick={handleNextPhase}
              className="gap-2"
              variant="default"
            >
              Next Phase
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {phase === "DONE" && (
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
            >
              Return to Home
            </Button>
          )}
        </div>
      </footer>

      {/* TODO: Transcript Panel (collapsible side panel or bottom drawer) */}
      {/* - Show real-time transcript of conversation */}
      {/* - Highlight AI questions vs candidate responses */}
      {/* - Allow scrolling through conversation history */}
    </div>
  );
};

export default Interview;
