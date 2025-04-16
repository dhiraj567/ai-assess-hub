
import React, { createContext, useContext, useState } from 'react';
import { MCQQuestion, VoiceQuestion, MCQResult, VoiceResult } from '@/lib/types';

interface AssessmentContextType {
  currentJobId: string | null;
  mcqQuestions: MCQQuestion[];
  voiceQuestions: VoiceQuestion[];
  mcqResults: MCQResult[];
  voiceResults: VoiceResult[];
  isAssessmentStarted: boolean;
  isAssessmentComplete: boolean;
  startAssessment: (jobId: string) => void;
  endAssessment: () => void;
  generateQuestions: (jobId: string, jobDescription: string) => Promise<void>;
  saveMCQResult: (result: MCQResult) => void;
  saveVoiceResult: (result: VoiceResult) => void;
  calculateMCQScore: () => number;
  calculateVoiceScore: () => number;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

// Sample MCQ questions for development
const generateSampleMCQQuestions = (jobId: string): MCQQuestion[] => {
  if (jobId === '1') { // Frontend Developer
    return [
      {
        id: '1',
        question: 'Which hook is used to perform side effects in a React component?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correctAnswer: 1
      },
      {
        id: '2',
        question: 'What does CSS stand for?',
        options: ['Cascading Style Sheets', 'Creative Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'],
        correctAnswer: 0
      },
      {
        id: '3',
        question: 'Which of the following is NOT a JavaScript framework/library?',
        options: ['React', 'Angular', 'Vue', 'Photoshop'],
        correctAnswer: 3
      },
      {
        id: '4',
        question: 'Which of these is a TypeScript type?',
        options: ['string', 'String', 'text', 'varchar'],
        correctAnswer: 0
      },
      {
        id: '5',
        question: 'What is Redux used for?',
        options: [
          'DOM manipulation', 
          'State management', 
          'Server-side rendering', 
          'API requests'
        ],
        correctAnswer: 1
      }
    ];
  } else if (jobId === '2') { // UX/UI Designer
    return [
      {
        id: '1',
        question: 'What is the primary goal of UX design?',
        options: [
          'Make interfaces visually appealing', 
          'Optimize user satisfaction', 
          'Use latest design trends', 
          'Minimize development costs'
        ],
        correctAnswer: 1
      },
      {
        id: '2',
        question: 'Which of these is NOT a principle of visual hierarchy?',
        options: ['Size', 'Color', 'Coding', 'Contrast'],
        correctAnswer: 2
      },
      {
        id: '3',
        question: 'What is a wireframe?',
        options: [
          'A high-fidelity mockup', 
          'A basic layout structure', 
          'A design system', 
          'A user flow diagram'
        ],
        correctAnswer: 1
      },
      {
        id: '4',
        question: 'Which research method directly observes how users interact with a product?',
        options: ['Surveys', 'Interviews', 'Usability testing', 'A/B testing'],
        correctAnswer: 2
      },
      {
        id: '5',
        question: 'What does accessibility in design refer to?',
        options: [
          'Having a responsive design', 
          'Fast load times', 
          'Making products usable by people with disabilities', 
          'Availability on multiple platforms'
        ],
        correctAnswer: 2
      }
    ];
  } else {
    return [
      {
        id: '1',
        question: 'What is a RESTful API?',
        options: [
          'A programming language', 
          'A database structure', 
          'An architectural style for APIs', 
          'A testing framework'
        ],
        correctAnswer: 2
      },
      {
        id: '2',
        question: 'Which HTTP method is typically used for retrieving data?',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        correctAnswer: 0
      },
      {
        id: '3',
        question: 'What does CRUD stand for?',
        options: [
          'Create, Read, Update, Delete', 
          'Connect, Retrieve, Update, Destroy', 
          'Common, Regular, Uniform, Direct', 
          'Configuration, Request, Usage, Deployment'
        ],
        correctAnswer: 0
      },
      {
        id: '4',
        question: 'Which database is NOT a NoSQL database?',
        options: ['MongoDB', 'PostgreSQL', 'Cassandra', 'Redis'],
        correctAnswer: 1
      },
      {
        id: '5',
        question: 'What is middleware in the context of Express.js?',
        options: [
          'A type of database', 
          'Functions that execute during the request-response cycle', 
          'A security protocol', 
          'Front-end components'
        ],
        correctAnswer: 1
      }
    ];
  }
};

// Sample voice questions for development
const generateSampleVoiceQuestions = (jobId: string): VoiceQuestion[] => {
  if (jobId === '1') { // Frontend Developer
    return [
      {
        id: '1',
        question: 'Explain how you would optimize the performance of a React application.'
      },
      {
        id: '2',
        question: 'Describe your experience with responsive design and how you ensure compatibility across different devices.'
      },
      {
        id: '3',
        question: 'How do you stay updated with the latest frontend development trends and technologies?'
      }
    ];
  } else if (jobId === '2') { // UX/UI Designer
    return [
      {
        id: '1',
        question: 'Describe your design process from requirement gathering to final implementation.'
      },
      {
        id: '2',
        question: 'How do you balance aesthetic design with usability and accessibility concerns?'
      },
      {
        id: '3',
        question: 'Tell us about a design challenge you faced and how you overcame it.'
      }
    ];
  } else {
    return [
      {
        id: '1',
        question: 'Explain your approach to designing and optimizing database schemas.'
      },
      {
        id: '2',
        question: 'How do you ensure the security of APIs and backend systems you develop?'
      },
      {
        id: '3',
        question: 'Describe how you would scale a Node.js application to handle increased traffic.'
      }
    ];
  }
};

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [mcqQuestions, setMCQQuestions] = useState<MCQQuestion[]>([]);
  const [voiceQuestions, setVoiceQuestions] = useState<VoiceQuestion[]>([]);
  const [mcqResults, setMCQResults] = useState<MCQResult[]>([]);
  const [voiceResults, setVoiceResults] = useState<VoiceResult[]>([]);
  const [isAssessmentStarted, setIsAssessmentStarted] = useState(false);
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);

  const startAssessment = (jobId: string) => {
    setCurrentJobId(jobId);
    setIsAssessmentStarted(true);
    setIsAssessmentComplete(false);
    setMCQResults([]);
    setVoiceResults([]);
  };

  const endAssessment = () => {
    setIsAssessmentComplete(true);
  };

  const generateQuestions = async (jobId: string, jobDescription: string) => {
    // In a real application, this would call an AI service to generate questions
    // For development, we'll use our sample questions
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    
    setMCQQuestions(generateSampleMCQQuestions(jobId));
    setVoiceQuestions(generateSampleVoiceQuestions(jobId));
  };

  const saveMCQResult = (result: MCQResult) => {
    setMCQResults(prev => {
      // Replace if already exists, otherwise add
      const exists = prev.some(r => r.questionId === result.questionId);
      if (exists) {
        return prev.map(r => r.questionId === result.questionId ? result : r);
      } else {
        return [...prev, result];
      }
    });
  };

  const saveVoiceResult = (result: VoiceResult) => {
    setVoiceResults(prev => {
      // Replace if already exists, otherwise add
      const exists = prev.some(r => r.questionId === result.questionId);
      if (exists) {
        return prev.map(r => r.questionId === result.questionId ? result : r);
      } else {
        return [...prev, result];
      }
    });
  };

  const calculateMCQScore = () => {
    if (mcqResults.length === 0) return 0;
    
    const correctAnswers = mcqResults.filter(r => r.isCorrect).length;
    return (correctAnswers / mcqQuestions.length) * 100;
  };

  const calculateVoiceScore = () => {
    if (voiceResults.length === 0) return 0;
    
    // Average the scores across all voice questions
    const total = voiceResults.reduce((sum, result) => {
      return sum + (result.clarity + result.confidence + result.contentQuality) / 3;
    }, 0);
    
    return (total / voiceResults.length) * 20; // Scale to 0-100
  };

  return (
    <AssessmentContext.Provider
      value={{
        currentJobId,
        mcqQuestions,
        voiceQuestions,
        mcqResults,
        voiceResults,
        isAssessmentStarted,
        isAssessmentComplete,
        startAssessment,
        endAssessment,
        generateQuestions,
        saveMCQResult,
        saveVoiceResult,
        calculateMCQScore,
        calculateVoiceScore
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};
