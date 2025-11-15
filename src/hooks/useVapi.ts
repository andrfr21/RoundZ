import { useEffect, useRef, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

export type ConversationPhase = 'FIT' | 'TECH' | 'BRAINTEASER' | 'DONE';

export type TranscriptEntry = {
  id: string;
  speaker: 'assistant' | 'user';
  text: string;
  timestamp: Date;
};

export type VapiConfig = {
  apiKey: string;
  assistantId?: string; // Optional: use a pre-configured assistant
};

// Vapi Assistant configurations for each phase
const getAssistantConfig = (phase: ConversationPhase) => {
  const phaseConfigs = {
    FIT: {
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a professional HR interviewer conducting a cultural fit assessment. 
Ask questions about the candidate's background and motivation.
Keep it conversational and natural.`
          }
        ]
      },
      voice: {
        provider: "11labs",
        voiceId: "pNInz6obpgDQGcFmaJgB",
      },
      firstMessage: "Hello! I'm excited to chat with you today. Can you tell me a bit about yourself?",
    },
    TECH: {
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a technical interviewer. The candidate can see SQL and Python code on screen. Ask them to explain the code and identify any issues.`
          }
        ]
      },
      voice: {
        provider: "11labs",
        voiceId: "pNInz6obpgDQGcFmaJgB",
      },
      firstMessage: "Great! Now let's look at the code on your screen. Can you walk me through the SQL query?",
    },
    BRAINTEASER: {
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are interviewing with a logic puzzle. Three doors - A always tells truth, B always lies, C sometimes lies. One door has treasure. Guide them through the puzzle.`
          }
        ]
      },
      voice: {
        provider: "11labs",
        voiceId: "pNInz6obpgDQGcFmaJgB",
      },
      firstMessage: "Excellent! Now for a logic puzzle. You see three doors on screen. One has treasure. What's your approach?",
    },
    DONE: {
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `The interview is complete. Thank the candidate warmly.`
          }
        ]
      },
      voice: {
        provider: "11labs",
        voiceId: "pNInz6obpgDQGcFmaJgB",
      },
      firstMessage: "Thank you for your time today! You'll hear back from our team soon.",
    },
  };

  return phaseConfigs[phase];
};

export function useVapi(config: VapiConfig, phase: ConversationPhase) {
  const [isConnected, setIsConnected] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<ConversationPhase>(phase);

  const vapiRef = useRef<any>(null);

  // Initialize Vapi
  useEffect(() => {
    try {
      // Initialize Vapi client
      vapiRef.current = new Vapi(config.apiKey);

      // Set up event listeners
      vapiRef.current.on('call-start', () => {
        console.log('📞 Call started');
        setIsCallActive(true);
        setIsConnected(true);
      });

      vapiRef.current.on('call-end', () => {
        console.log('📞 Call ended');
        setIsCallActive(false);
        setIsConnected(false);
      });

      vapiRef.current.on('speech-start', () => {
        console.log('🗣️ User started speaking');
      });

      vapiRef.current.on('speech-end', () => {
        console.log('🗣️ User stopped speaking');
      });

      vapiRef.current.on('message', (message: any) => {
        console.log('💬 Message:', message);

        if (message.type === 'transcript') {
          const entry: TranscriptEntry = {
            id: `${message.role}-${Date.now()}`,
            speaker: message.role === 'assistant' ? 'assistant' : 'user',
            text: message.transcript,
            timestamp: new Date(),
          };
          setTranscript(prev => [...prev, entry]);
        }

        if (message.type === 'conversation-update') {
          // Handle conversation updates
          setIsSpeaking(message.status === 'speaking');
        }
      });

      vapiRef.current.on('volume-level', (level: number) => {
        setVolumeLevel(level);
      });

      vapiRef.current.on('error', (error: any) => {
        console.error('❌ Vapi error:', error);
        setError(error.message || 'An error occurred');
      });

      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error('Failed to initialize Vapi:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize Vapi');
      setIsConnected(false);
    }

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, [config.apiKey]);

  // Start call with phase-specific configuration
  const startCall = useCallback(async () => {
    if (!vapiRef.current) {
      setError('Vapi not initialized');
      return;
    }

    try {
      const assistantConfig = getAssistantConfig(phase);
      
      await vapiRef.current.start(assistantConfig);
      setError(null);
    } catch (err) {
      console.error('Failed to start call:', err);
      setError(err instanceof Error ? err.message : 'Failed to start call');
    }
  }, [phase]);

  // Stop the call
  const stopCall = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  }, []);

  // Send a message (if you want to programmatically inject text)
  const sendMessage = useCallback((message: string) => {
    if (vapiRef.current && isCallActive) {
      vapiRef.current.send({
        type: 'add-message',
        message: {
          role: 'system',
          content: message,
        },
      });
    }
  }, [isCallActive]);

  // Mute/unmute
  const setMuted = useCallback((muted: boolean) => {
    if (vapiRef.current) {
      vapiRef.current.setMuted(muted);
    }
  }, []);

  // Handle phase transitions without restarting call
  useEffect(() => {
    if (phase !== currentPhase && isCallActive && vapiRef.current) {
      console.log(`📍 Phase transition: ${currentPhase} → ${phase}`);
      
      // Get the transition message for the new phase
      const phaseConfig = getAssistantConfig(phase);
      
      // Send system message to transition the conversation
      vapiRef.current.send({
        type: 'add-message',
        message: {
          role: 'system',
          content: `PHASE TRANSITION: The interview is now moving to the ${phase} phase. 
          
${phaseConfig.model.messages[0].content}

Start this phase by saying: "${phaseConfig.firstMessage}"`
        }
      });
      
      setCurrentPhase(phase);
    }
  }, [phase, currentPhase, isCallActive]);

  return {
    isConnected,
    isCallActive,
    isSpeaking,
    transcript,
    error,
    volumeLevel,
    startCall,
    stopCall,
    sendMessage,
    setMuted,
  };
}

export default useVapi;