// Service pour sauvegarder et envoyer les transcripts
// src/services/transcriptService.ts

import { TranscriptEntry } from '@/hooks/useVapi';

export type InterviewTranscript = {
  interviewId: string;
  candidateName?: string;
  startedAt: Date;
  completedAt?: Date;
  phases: {
    FIT: TranscriptEntry[];
    TECH: TranscriptEntry[];
    BRAINTEASER: TranscriptEntry[];
    DONE: TranscriptEntry[];
  };
  fullTranscript: TranscriptEntry[];
};

export type ScoringRequest = {
  interviewId: string;
  transcript: TranscriptEntry[];
  metadata: {
    candidateName?: string;
    duration: number; // en secondes
    completedPhases: string[];
  };
};

export type ScoringResponse = {
  overallScore: number;
  fitScore: number;
  techScore: number;
  brainScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
};

class TranscriptService {
  private apiUrl: string;

  constructor() {
    // URL de votre agent de notation
    this.apiUrl = import.meta.env.VITE_SCORING_API_URL || 'https://your-scoring-api.com';
  }

  /**
   * Sauvegarde le transcript dans Supabase
   */
  async saveTranscript(transcript: InterviewTranscript): Promise<void> {
    try {
      // TODO: Implémenter la sauvegarde Supabase
      console.log('💾 Sauvegarde du transcript:', transcript);
      
      // Exemple avec Supabase (à décommenter quand configuré):
      /*
      const { data, error } = await supabase
        .from('interview_transcripts')
        .insert({
          interview_id: transcript.interviewId,
          candidate_name: transcript.candidateName,
          started_at: transcript.startedAt,
          completed_at: transcript.completedAt,
          full_transcript: transcript.fullTranscript,
          phases: transcript.phases,
        });

      if (error) throw error;
      console.log('✅ Transcript sauvegardé dans Supabase');
      */
    } catch (error) {
      console.error('❌ Erreur sauvegarde transcript:', error);
      throw error;
    }
  }

  /**
   * Envoie le transcript à l'agent de notation
   */
  async sendForScoring(request: ScoringRequest): Promise<ScoringResponse> {
    try {
      console.log('📤 Envoi du transcript à l\'agent de notation...');
      console.log('Transcript:', request.transcript.length, 'messages');

      const response = await fetch(`${this.apiUrl}/api/score-interview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Ajoutez vos headers d'auth si nécessaire
          // 'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const scores: ScoringResponse = await response.json();
      console.log('✅ Scores reçus:', scores);

      return scores;
    } catch (error) {
      console.error('❌ Erreur envoi pour notation:', error);
      throw error;
    }
  }

  /**
   * Sauvegarde locale dans localStorage (backup)
   */
  saveLocally(interviewId: string, transcript: TranscriptEntry[]): void {
    try {
      const data = {
        interviewId,
        transcript,
        savedAt: new Date().toISOString(),
      };
      
      localStorage.setItem(
        `interview_transcript_${interviewId}`,
        JSON.stringify(data)
      );
      
      console.log('💾 Transcript sauvegardé localement');
    } catch (error) {
      console.error('❌ Erreur sauvegarde locale:', error);
    }
  }

  /**
   * Récupère un transcript local
   */
  getLocalTranscript(interviewId: string): TranscriptEntry[] | null {
    try {
      const data = localStorage.getItem(`interview_transcript_${interviewId}`);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      return parsed.transcript;
    } catch (error) {
      console.error('❌ Erreur récupération locale:', error);
      return null;
    }
  }

  /**
   * Formatte le transcript pour affichage
   */
  formatTranscript(transcript: TranscriptEntry[]): string {
    return transcript.map(entry => {
      const speaker = entry.speaker === 'assistant' ? 'AI' : 'Candidat';
      const time = entry.timestamp.toLocaleTimeString();
      return `[${time}] ${speaker}: ${entry.text}`;
    }).join('\n');
  }

  /**
   * Exporte le transcript en fichier texte
   */
  exportAsText(transcript: TranscriptEntry[], filename: string): void {
    const content = this.formatTranscript(transcript);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  /**
   * Exporte le transcript en JSON
   */
  exportAsJSON(transcript: TranscriptEntry[], filename: string): void {
    const content = JSON.stringify(transcript, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
  }
}

// Export singleton
export const transcriptService = new TranscriptService();
export default transcriptService;