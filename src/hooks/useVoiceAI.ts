import { useEffect, useRef, useState, useCallback } from 'react';

// Types
export type VoiceProvider = 'elevenlabs' | 'deepgram';
export type TranscriptEntry = {
  id: string;
  speaker: 'ai' | 'candidate';
  text: string;
  timestamp: Date;
  confidence?: number;
};

export type VoiceConfig = {
  elevenLabsApiKey: string;
  elevenLabsVoiceId: string;
  deepgramApiKey?: string;
  useBrowserSTT?: boolean; // Use Web Speech API instead of Deepgram
};

export type ConversationPhase = 'FIT' | 'TECH' | 'BRAINTEASER' | 'DONE';

// ElevenLabs Voice Service
class ElevenLabsService {
  private apiKey: string;
  private voiceId: string;
  private audioContext: AudioContext | null = null;
  private audioQueue: AudioBuffer[] = [];
  private isPlaying: boolean = false;

  constructor(apiKey: string, voiceId: string) {
    this.apiKey = apiKey;
    this.voiceId = voiceId;
  }

  async initialize() {
    this.audioContext = new AudioContext();
  }

  async speak(text: string): Promise<void> {
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
      
      this.audioQueue.push(audioBuffer);
      if (!this.isPlaying) {
        this.playQueue();
      }
    } catch (error) {
      console.error('Error in ElevenLabs speech synthesis:', error);
      throw error;
    }
  }

  private async playQueue() {
    if (this.audioQueue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const audioBuffer = this.audioQueue.shift()!;
    const source = this.audioContext!.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext!.destination);
    
    source.onended = () => {
      this.playQueue();
    };

    source.start();
  }

  stopSpeaking() {
    this.audioQueue = [];
    this.isPlaying = false;
    // Stop any currently playing audio
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = new AudioContext();
    }
  }

  cleanup() {
    this.stopSpeaking();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

// Browser Speech Recognition Service (Web Speech API)
class BrowserSTTService {
  private recognition: any = null;
  private onTranscriptCallback: ((text: string, isFinal: boolean) => void) | null = null;
  private isListening: boolean = false;

  initialize(onTranscript: (text: string, isFinal: boolean) => void) {
    // @ts-ignore - Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      throw new Error('Speech Recognition not supported in this browser');
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.onTranscriptCallback = onTranscript;

    this.recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const isFinal = event.results[i].isFinal;
        
        if (this.onTranscriptCallback) {
          this.onTranscriptCallback(transcript, isFinal);
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    this.recognition.onend = () => {
      // Auto-restart if still supposed to be listening
      if (this.isListening) {
        this.recognition.start();
      }
    };
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      this.isListening = true;
      this.recognition.start();
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      this.recognition.stop();
    }
  }

  cleanup() {
    this.stopListening();
    if (this.recognition) {
      this.recognition = null;
    }
  }
}

// Deepgram STT Service (alternative to browser STT)
class DeepgramSTTService {
  private apiKey: string;
  private websocket: WebSocket | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private onTranscriptCallback: ((text: string, isFinal: boolean) => void) | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async initialize(onTranscript: (text: string, isFinal: boolean) => void) {
    this.onTranscriptCallback = onTranscript;

    // Setup WebSocket connection to Deepgram
    this.websocket = new WebSocket(
      `wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&language=en-US`,
      ['token', this.apiKey]
    );

    this.websocket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      const transcript = data.channel?.alternatives?.[0]?.transcript;
      const isFinal = data.is_final;

      if (transcript && this.onTranscriptCallback) {
        this.onTranscriptCallback(transcript, isFinal);
      }
    };

    this.websocket.onerror = (error) => {
      console.error('Deepgram WebSocket error:', error);
    };
  }

  async startListening() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && this.websocket?.readyState === WebSocket.OPEN) {
          this.websocket.send(event.data);
        }
      };

      this.mediaRecorder.start(250); // Send data every 250ms
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  stopListening() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }

  cleanup() {
    this.stopListening();
    if (this.websocket) {
      this.websocket.close();
    }
  }
}

// Main Voice AI Hook
export function useVoiceAI(config: VoiceConfig, phase: ConversationPhase) {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [currentInterimText, setCurrentInterimText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const ttsServiceRef = useRef<ElevenLabsService | null>(null);
  const sttServiceRef = useRef<BrowserSTTService | DeepgramSTTService | null>(null);

  // Initialize services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Initialize TTS (ElevenLabs)
        ttsServiceRef.current = new ElevenLabsService(
          config.elevenLabsApiKey,
          config.elevenLabsVoiceId
        );
        await ttsServiceRef.current.initialize();

        // Initialize STT (Browser or Deepgram)
        if (config.useBrowserSTT) {
          sttServiceRef.current = new BrowserSTTService();
        } else if (config.deepgramApiKey) {
          sttServiceRef.current = new DeepgramSTTService(config.deepgramApiKey);
        }

        if (sttServiceRef.current) {
          await sttServiceRef.current.initialize(handleTranscript);
        }

        setIsConnected(true);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize voice services:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize voice services');
        setIsConnected(false);
      }
    };

    initializeServices();

    return () => {
      ttsServiceRef.current?.cleanup();
      sttServiceRef.current?.cleanup();
    };
  }, [config]);

  // Handle incoming transcripts
  const handleTranscript = useCallback((text: string, isFinal: boolean) => {
    if (isFinal) {
      const entry: TranscriptEntry = {
        id: `transcript-${Date.now()}`,
        speaker: 'candidate',
        text,
        timestamp: new Date(),
      };
      setTranscript(prev => [...prev, entry]);
      setCurrentInterimText('');

      // TODO: Send final transcript to backend for LLM processing
      // This is where you'd call your API to analyze the response
      // and generate the next AI question
    } else {
      setCurrentInterimText(text);
    }
  }, []);

  // AI speaks
  const speakAI = useCallback(async (text: string) => {
    if (!ttsServiceRef.current) return;

    try {
      setIsSpeaking(true);
      
      // Add to transcript immediately
      const entry: TranscriptEntry = {
        id: `ai-${Date.now()}`,
        speaker: 'ai',
        text,
        timestamp: new Date(),
      };
      setTranscript(prev => [...prev, entry]);

      await ttsServiceRef.current.speak(text);
      setIsSpeaking(false);
    } catch (err) {
      console.error('Error in AI speech:', err);
      setIsSpeaking(false);
      setError('Failed to generate AI speech');
    }
  }, []);

  // Start listening to candidate
  const startListening = useCallback(() => {
    if (!sttServiceRef.current || isListening) return;

    try {
      sttServiceRef.current.startListening();
      setIsListening(true);
      setError(null);
    } catch (err) {
      console.error('Error starting listening:', err);
      setError('Failed to start microphone');
    }
  }, [isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (!sttServiceRef.current || !isListening) return;

    sttServiceRef.current.stopListening();
    setIsListening(false);
  }, [isListening]);

  // Get phase-appropriate greeting
  const getPhaseGreeting = useCallback((): string => {
    switch (phase) {
      case 'FIT':
        return "Hello! I'm excited to chat with you today. Let's start with some questions about your background and what motivates you. Can you tell me a bit about yourself?";
      case 'TECH':
        return "Great! Now let's move into the technical portion. I'll show you some code examples, and we can discuss your approach to solving technical problems.";
      case 'BRAINTEASER':
        return "Excellent work so far! For our final section, I have a logic puzzle for you. Take your time and think through it out loud - I want to understand your reasoning process.";
      case 'DONE':
        return "Thank you so much for your time today! We've completed all sections of the interview. You'll hear back from our team soon.";
    }
  }, [phase]);

  return {
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
  };
}

export default useVoiceAI;
