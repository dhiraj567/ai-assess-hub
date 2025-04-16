
import React, { useState, useRef, useEffect } from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ChevronLeft, ChevronRight, Mic, MicOff, Pause, Play } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VoiceResult } from '@/lib/types';

const VoiceTest: React.FC = () => {
  const { voiceQuestions, voiceResults, saveVoiceResult } = useAssessment();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Maximum recording time in seconds
  const MAX_RECORDING_TIME = 120;
  
  if (voiceQuestions.length === 0) {
    return <div className="text-center py-4">No questions available</div>;
  }
  
  const currentQuestion = voiceQuestions[currentQuestionIndex];
  
  // Check if we already have a recording for this question
  const existingResult = voiceResults.find(r => r.questionId === currentQuestion.id);
  
  useEffect(() => {
    // Reset state when question changes
    if (!existingResult) {
      setAudioUrl(null);
      setRecordingTime(0);
      setIsRecording(false);
      setIsPaused(false);
      setError(null);
    } else {
      setAudioUrl(existingResult.audioUrl);
    }
    
    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [currentQuestionIndex, existingResult]);
  
  const startRecording = async () => {
    try {
      setError(null);
      chunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        setIsRecording(false);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setIsPaused(false);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= MAX_RECORDING_TIME) {
            if (mediaRecorderRef.current) {
              mediaRecorderRef.current.stop();
            }
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please ensure you have granted permission.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };
  
  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };
  
  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      // Resume timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= MAX_RECORDING_TIME) {
            if (mediaRecorderRef.current) {
              mediaRecorderRef.current.stop();
            }
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };
  
  const handleSubmitRecording = () => {
    if (!audioUrl) return;
    
    setSubmitting(true);
    
    // Simulate AI analysis of the voice recording
    setTimeout(() => {
      // Generate random scores for demo purposes
      // In a real app, this would be done by an AI model
      const clarity = Math.random() * 5;
      const confidence = Math.random() * 5;
      const contentQuality = Math.random() * 5;
      
      const result: VoiceResult = {
        questionId: currentQuestion.id,
        audioUrl,
        clarity,
        confidence,
        contentQuality
      };
      
      saveVoiceResult(result);
      setSubmitting(false);
      
      // If there are more questions, move to the next one
      if (currentQuestionIndex < voiceQuestions.length - 1) {
        handleNextQuestion();
      }
    }, 1500);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < voiceQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-500">
          Question {currentQuestionIndex + 1} of {voiceQuestions.length}
        </span>
        <span className="text-sm font-medium text-gray-500">
          {voiceResults.length} of {voiceQuestions.length} answered
        </span>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-medium">
              {currentQuestion.question}
            </CardTitle>
            {existingResult && (
              <Badge className="bg-evalverse-success">Completed</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!audioUrl && !existingResult && (
            <div className="text-center py-8">
              <div className="mb-4">
                <Mic className={`h-12 w-12 mx-auto ${isRecording ? 'text-evalverse-purple animate-pulse' : 'text-gray-400'}`} />
              </div>
              <p className="text-gray-600 mb-4">
                Click the button below to start recording your answer.
              </p>
            </div>
          )}
          
          {(audioUrl || existingResult) && (
            <div className="py-4">
              <h3 className="text-sm font-medium mb-2">Your Recording</h3>
              <audio src={existingResult?.audioUrl || audioUrl || ''} controls className="w-full" />
              
              {existingResult && (
                <div className="mt-4 space-y-3">
                  <Separator />
                  <h3 className="text-sm font-medium">AI Evaluation</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Clarity</span>
                        <span>{existingResult.clarity.toFixed(1)}/5</span>
                      </div>
                      <Progress value={(existingResult.clarity / 5) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Confidence</span>
                        <span>{existingResult.confidence.toFixed(1)}/5</span>
                      </div>
                      <Progress value={(existingResult.confidence / 5) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Content Quality</span>
                        <span>{existingResult.contentQuality.toFixed(1)}/5</span>
                      </div>
                      <Progress value={(existingResult.contentQuality / 5) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {isRecording && (
            <div className="text-center py-4">
              <div className="flex items-center justify-center mb-2">
                <div className="text-xl font-medium">{formatTime(recordingTime)}</div>
                <span className="ml-2 text-red-500 animate-pulse">●</span>
              </div>
              <Progress value={(recordingTime / MAX_RECORDING_TIME) * 100} className="mb-4" />
              <p className="text-sm text-gray-500">
                Maximum recording time: {formatTime(MAX_RECORDING_TIME)}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0 || isRecording}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === voiceQuestions.length - 1 || isRecording}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          {!existingResult && (
            <div>
              {!isRecording && !audioUrl && (
                <Button
                  onClick={startRecording}
                  className="bg-evalverse-purple hover:bg-evalverse-brightPurple"
                >
                  <Mic className="h-4 w-4 mr-1" /> Start Recording
                </Button>
              )}
              
              {isRecording && (
                <div className="space-x-2">
                  {isPaused ? (
                    <Button
                      onClick={resumeRecording}
                      variant="outline"
                      className="border-evalverse-purple text-evalverse-purple"
                    >
                      <Play className="h-4 w-4 mr-1" /> Resume
                    </Button>
                  ) : (
                    <Button
                      onClick={pauseRecording}
                      variant="outline"
                      className="border-evalverse-purple text-evalverse-purple"
                    >
                      <Pause className="h-4 w-4 mr-1" /> Pause
                    </Button>
                  )}
                  <Button
                    onClick={stopRecording}
                    variant="outline"
                    className="border-red-500 text-red-500"
                  >
                    <MicOff className="h-4 w-4 mr-1" /> Stop
                  </Button>
                </div>
              )}
              
              {audioUrl && !isRecording && (
                <div className="space-x-2">
                  <Button
                    onClick={() => {
                      setAudioUrl(null);
                      setRecordingTime(0);
                    }}
                    variant="outline"
                  >
                    Record Again
                  </Button>
                  <Button
                    onClick={handleSubmitRecording}
                    className="bg-evalverse-purple hover:bg-evalverse-brightPurple"
                    disabled={submitting}
                  >
                    {submitting ? 'Analyzing...' : 'Submit Recording'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
      
      {/* Navigation buttons for all questions */}
      <div className="flex flex-wrap gap-2 justify-center">
        {voiceQuestions.map((q, index) => {
          const questionResult = voiceResults.find(r => r.questionId === q.id);
          const isAnswered = !!questionResult;
          
          return (
            <Button
              key={q.id}
              variant="outline"
              className={`h-10 w-10 p-0 ${isAnswered ? 
                'bg-green-100 border-green-500 text-green-700' : 
                (index === currentQuestionIndex ? 'bg-evalverse-lightPurple border-evalverse-purple' : '')
              }`}
              onClick={() => {
                if (!isRecording) {
                  setCurrentQuestionIndex(index);
                }
              }}
              disabled={isRecording}
            >
              {index + 1}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default VoiceTest;
