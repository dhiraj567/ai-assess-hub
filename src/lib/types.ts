
// User types
export type UserRole = 'HR' | 'Candidate';

export interface User {
  id: string;
  username: string;
  email: string;
  userType: UserRole;
  dateCreated: string;
}

// Job types
export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  postedDate: string;
  postedByUserId: string;
}

// Assessment types
export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface VoiceQuestion {
  id: string;
  question: string;
}

export interface MCQResult {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
}

export interface VoiceResult {
  questionId: string;
  audioUrl: string;
  clarity: number;
  confidence: number;
  contentQuality: number;
}

// Report types
export interface Report {
  id: string;
  candidateId: string;
  jobId: string;
  mcqScore: number;
  voiceScore: number;
  aiReportSummary: string;
  timestamp: string;
  mcqResults?: MCQResult[];
  voiceResults?: VoiceResult[];
}

export interface CandidateApplication {
  id: string;
  candidateId: string;
  jobId: string;
  candidateName: string;
  resumeUrl: string;
  applicationDate: string;
  testTaken: boolean;
  reportId?: string;
}
