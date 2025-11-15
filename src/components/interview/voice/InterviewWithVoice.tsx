import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, MicOff, Volume2, VolumeX, CheckCircle2, AlertCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { useVoiceAI, type ConversationPhase, type TranscriptEntry } from "@/hooks/useVoiceAI";

const Interview = () => {
  const { token } = useParams<{ token: string }>();
  const [phase, setPhase] = useState<ConversationPhase>("FIT");
  const [microphonePermission, setMicrophonePermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  // Voice AI configuration
  const voiceConfig = {
    elevenLabsApiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
    elevenLabsVoiceId: import.meta.env.VITE_ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB', // Default voice
    useBrowserSTT: true, // Set to false to use Deepgram
    deepgramApiKey: import.meta.env.VITE_DEEPGRAM_API_KEY,
  };

  const {
    isConnected,
    isListening,
    isSpeaking,
    transcript,
    currentInterimText,
    error,
    speakAI,
    startListening,
    stopListening,
    getPhaseGreeting,
  } = useVoiceAI(voiceConfig, phase);

  // Request microphone permission on mount
  useEffect(() => {
    const requestMicrophonePermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Stop immediately, we just wanted permission
        setMicrophonePermission('granted');
      } catch (err) {
        console.error('Microphone permission denied:', err);
        setMicrophonePermission('denied');
      }
    };

    requestMicrophonePermission();
  }, []);

  // Start the interview when voice is connected
  useEffect(() => {
    if (isConnected && microphonePermission === 'granted' && transcript.length === 0) {
      // Greet the candidate and start listening
      const greeting = getPhaseGreeting();
      speakAI(greeting);
      
      // Start listening after AI finishes speaking (add delay)
      setTimeout(() => {
        startListening();
      }, 3000);
    }
  }, [isConnected, microphonePermission]);

  // Handle phase transitions
  const handleNextPhase = () => {
    const phaseOrder: ConversationPhase[] = ["FIT", "TECH", "BRAINTEASER", "DONE"];
    const currentIndex = phaseOrder.indexOf(phase);
    
    if (currentIndex < phaseOrder.length - 1) {
      const nextPhase = phaseOrder[currentIndex + 1];
      
      // Stop listening during transition
      stopListening();
      
      setPhase(nextPhase);
      
      // TODO: Send phase transition to backend
      // await updateInterviewPhase(token, nextPhase);
      
      // Announce new phase
      setTimeout(() => {
        const greeting = getPhaseGreeting();
        speakAI(greeting);
        
        // Resume listening
        setTimeout(() => {
          if (nextPhase !== 'DONE') {
            startListening();
          }
        }, 2000);
      }, 1000);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
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
          
          {/* Status Indicators */}
          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className="flex items-center gap-2 text-xs">
              {isConnected ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-muted-foreground">Connected</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-muted-foreground">Connecting...</span>
                </>
              )}
            </div>

            {/* Phase Indicator */}
            <span className={`text-sm font-medium ${getPhaseColor()}`}>
              {getPhaseTitle()}
            </span>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-5xl">
          
          {/* FIT Phase */}
          {phase === "FIT" && (
            <div className="space-y-8 text-center">
              {/* Pulsing Logo with Speaking Indicator */}
              <div className="flex justify-center">
                <div className="relative">
                  {isSpeaking && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-phase-fit/20 animate-ping" />
                      <div className="absolute inset-0 rounded-full bg-phase-fit/10 animate-pulse" 
                           style={{ animationDuration: '2s' }} />
                    </>
                  )}
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
                
                {/* Status Indicator */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-6">
                  {isSpeaking ? (
                    <>
                      <Volume2 className="w-4 h-4 text-phase-fit animate-pulse" />
                      <span>AI interviewer is speaking...</span>
                    </>
                  ) : isListening ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-phase-fit animate-pulse" />
                      <span>Listening to your response...</span>
                    </>
                  ) : (
                    <span>Ready to begin</span>
                  )}
                </div>

                {/* Interim Text Display */}
                {currentInterimText && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground italic">"{currentInterimText}"</p>
                  </div>
                )}
              </div>
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
                  <div className="bg-muted/50 px-4 py-2 flex items-center gap-2 border-b border-border">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">query.sql</span>
                  </div>
                  
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
                  <div className="bg-muted/50 px-4 py-2 flex items-center gap-2 border-b border-border">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">algorithm.py</span>
                  </div>
                  
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

              {/* Interim Text Display */}
              {currentInterimText && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border max-w-2xl mx-auto">
                  <p className="text-sm text-muted-foreground italic">"{currentInterimText}"</p>
                </div>
              )}
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
                
                {['A', 'B', 'C'].map((door, idx) => (
                  <div key={door} className="group relative">
                    <div className="absolute inset-0 bg-phase-brain/20 rounded-xl blur-xl group-hover:blur-2xl transition-all animate-pulse" 
                         style={{ animationDuration: `${3 + idx * 0.5}s`, animationDelay: `${idx * 0.5}s` }} />
                    <div className="relative bg-card border-2 border-phase-brain/40 rounded-xl p-8 text-center space-y-4 hover:border-phase-brain/60 transition-colors">
                      <div className="w-16 h-16 mx-auto rounded-full bg-phase-brain/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-phase-brain">{door}</span>
                      </div>
                      <h3 className="text-2xl font-bold">Door {door}</h3>
                      <p className="text-sm text-muted-foreground">
                        {door === 'A' && '"I always tell the truth"'}
                        {door === 'B' && '"I always tell lies"'}
                        {door === 'C' && '"I sometimes lie"'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
                <p className="italic">
                  "One door leads to treasure, two lead to danger. Each door has a guardian. 
                  You can ask one question to one guardian. What do you ask?"
                </p>
              </div>

              {/* Interim Text Display */}
              {currentInterimText && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border max-w-2xl mx-auto">
                  <p className="text-sm text-muted-foreground italic">"{currentInterimText}"</p>
                </div>
              )}
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
            </div>
          )}

        </div>
      </main>

      {/* Transcript Sidebar */}
      {transcript.length > 0 && phase !== "DONE" && (
        <div className="fixed right-0 top-16 bottom-20 w-80 bg-card border-l border-border overflow-y-auto">
          <div className="p-4 border-b border-border sticky top-0 bg-card">
            <h3 className="font-semibold">Conversation Transcript</h3>
          </div>
          <div className="p-4 space-y-4">
            {transcript.map((entry) => (
              <div
                key={entry.id}
                className={`p-3 rounded-lg ${
                  entry.speaker === 'ai'
                    ? 'bg-primary/10 border border-primary/20'
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">
                    {entry.speaker === 'ai' ? '🤖 AI Interviewer' : '👤 You'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {entry.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm">{entry.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Controls */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          
          {/* Microphone Controls */}
          <div className="flex items-center gap-4">
            <Button
              variant={isListening ? "destructive" : "outline"}
              size="sm"
              onClick={toggleListening}
              disabled={!isConnected || isSpeaking || phase === "DONE"}
              className="gap-2"
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  Mute
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Unmute
                </>
              )}
            </Button>

            {/* Audio Indicator */}
            {isSpeaking && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span>AI speaking...</span>
              </div>
            )}
          </div>

          {/* Phase Navigation (Dev/Testing) */}
          {phase !== "DONE" && (
            <Button 
              onClick={handleNextPhase}
              className="gap-2"
              variant="default"
              disabled={!isConnected}
            >
              Next Phase (Dev)
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
    </div>
  );
};

export default Interview;
