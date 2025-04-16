
import React, { useState } from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';
import { MCQResult } from '@/lib/types';

const MCQTest: React.FC = () => {
  const { mcqQuestions, mcqResults, saveMCQResult } = useAssessment();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  if (mcqQuestions.length === 0) {
    return <div className="text-center py-4">No questions available</div>;
  }
  
  const currentQuestion = mcqQuestions[currentQuestionIndex];
  
  // Check if we already have an answer for this question
  const existingResult = mcqResults.find(r => r.questionId === currentQuestion.id);
  
  // Use the existing answer if available
  const effectiveSelectedOption = existingResult ? existingResult.selectedAnswer : selectedOption;
  
  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };
  
  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    
    const result: MCQResult = {
      questionId: currentQuestion.id,
      selectedAnswer: selectedOption,
      isCorrect: selectedOption === currentQuestion.correctAnswer
    };
    
    saveMCQResult(result);
    setShowFeedback(true);
  };
  
  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    setCurrentQuestionIndex(prev => Math.min(prev + 1, mcqQuestions.length - 1));
  };
  
  const handlePrevQuestion = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));
  };
  
  // Get correct status if feedback is shown
  const isCorrect = showFeedback && selectedOption === currentQuestion.correctAnswer;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-500">
          Question {currentQuestionIndex + 1} of {mcqQuestions.length}
        </span>
        <span className="text-sm font-medium text-gray-500">
          {mcqResults.length} of {mcqQuestions.length} answered
        </span>
      </div>
      
      <Card className={`border-2 ${showFeedback ? (isCorrect ? 'border-green-500' : 'border-red-500') : 'border-transparent'}`}>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={effectiveSelectedOption?.toString()} 
            onValueChange={(value) => handleOptionSelect(parseInt(value))}
            className="space-y-3"
            disabled={showFeedback || !!existingResult}
          >
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index} 
                className={`flex items-center space-x-2 rounded-md border p-3 
                  ${showFeedback || existingResult ? 
                    (index === currentQuestion.correctAnswer ? 'bg-green-50 border-green-200' : 
                      (effectiveSelectedOption === index && index !== currentQuestion.correctAnswer ? 'bg-red-50 border-red-200' : '')
                    ) : ''
                  }
                  ${!showFeedback && !existingResult && effectiveSelectedOption === index ? 'bg-evalverse-lightPurple border-evalverse-purple' : ''}
                `}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
                {(showFeedback || existingResult) && index === currentQuestion.correctAnswer && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                {(showFeedback || existingResult) && effectiveSelectedOption === index && index !== currentQuestion.correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === mcqQuestions.length - 1}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          {!showFeedback && !existingResult && (
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className="bg-evalverse-purple hover:bg-evalverse-brightPurple"
            >
              Submit Answer
            </Button>
          )}
          {(showFeedback || existingResult) && currentQuestionIndex < mcqQuestions.length - 1 && (
            <Button
              onClick={handleNextQuestion}
              className="bg-evalverse-purple hover:bg-evalverse-brightPurple"
            >
              Next Question <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Navigation buttons for all questions */}
      <div className="flex flex-wrap gap-2 justify-center">
        {mcqQuestions.map((q, index) => {
          const questionResult = mcqResults.find(r => r.questionId === q.id);
          const isAnswered = !!questionResult;
          const isCorrectAnswer = questionResult?.isCorrect;
          
          return (
            <Button
              key={q.id}
              variant="outline"
              className={`h-10 w-10 p-0 ${isAnswered ? 
                (isCorrectAnswer ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700') : 
                (index === currentQuestionIndex ? 'bg-evalverse-lightPurple border-evalverse-purple' : '')
              }`}
              onClick={() => {
                setSelectedOption(null);
                setShowFeedback(false);
                setCurrentQuestionIndex(index);
              }}
            >
              {index + 1}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MCQTest;
