
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useJob } from '@/contexts/JobContext';
import { useAssessment } from '@/contexts/AssessmentContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, AlertTriangle, CheckCircle2, FileText, Mic } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import MCQTest from '@/components/assessment/MCQTest';
import VoiceTest from '@/components/assessment/VoiceTest';

const Assessment = () => {
  const { id: jobId } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { getJobById, addReport } = useJob();
  const { 
    startAssessment, 
    endAssessment, 
    generateQuestions, 
    mcqQuestions, 
    voiceQuestions,
    mcqResults,
    voiceResults,
    calculateMCQScore,
    calculateVoiceScore,
    isAssessmentStarted,
    isAssessmentComplete
  } = useAssessment();
  const navigate = useNavigate();
  
  const [currentTab, setCurrentTab] = useState('mcq');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const job = jobId ? getJobById(jobId) : undefined;
  
  // Calculate progress for each section
  const mcqProgress = mcqQuestions.length > 0 
    ? (mcqResults.length / mcqQuestions.length) * 100 
    : 0;
  
  const voiceProgress = voiceQuestions.length > 0 
    ? (voiceResults.length / voiceQuestions.length) * 100 
    : 0;
  
  const totalProgress = (mcqProgress + voiceProgress) / 2;
  
  // Check if all tests are completed
  const isMCQCompleted = mcqQuestions.length > 0 && mcqResults.length === mcqQuestions.length;
  const isVoiceCompleted = voiceQuestions.length > 0 && voiceResults.length === voiceQuestions.length;
  const isAllCompleted = isMCQCompleted && isVoiceCompleted;
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    if (!job) {
      navigate('/jobs');
    }
    
    if (user?.userType === 'HR') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, job, user, navigate]);

  useEffect(() => {
    if (job && jobId && !isAssessmentStarted) {
      startAssessment(jobId);
      
      setIsGeneratingQuestions(true);
      generateQuestions(jobId, job.description)
        .then(() => {
          setIsGeneratingQuestions(false);
        })
        .catch(() => {
          setError('Failed to generate questions');
          setIsGeneratingQuestions(false);
        });
    }
  }, [job, jobId, isAssessmentStarted, startAssessment, generateQuestions]);

  const handleSubmitAssessment = async () => {
    if (!job || !user) return;
    
    try {
      setIsSubmitting(true);
      
      const mcqScore = calculateMCQScore();
      const voiceScore = calculateVoiceScore();
      
      // Generate a summary based on scores (in a real app, this would be AI-generated)
      const aiReportSummary = generateAIReport(mcqScore, voiceScore);
      
      // Add the report
      addReport({
        candidateId: user.id,
        jobId: job.id,
        mcqScore,
        voiceScore,
        aiReportSummary,
        mcqResults,
        voiceResults
      });
      
      endAssessment();
      
      // Navigate to results
      navigate(`/assessment/${job.id}/results`);
    } catch (err) {
      setError('Failed to submit assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to generate a mock AI report
  const generateAIReport = (mcqScore: number, voiceScore: number) => {
    const totalScore = (mcqScore + voiceScore) / 2;
    
    if (totalScore >= 80) {
      return "The candidate demonstrated excellent knowledge and communication skills. Their responses to technical questions were accurate and comprehensive, showing strong domain expertise. The candidate's verbal communication was clear, confident, and well-structured, indicating strong potential for the role.";
    } else if (totalScore >= 60) {
      return "The candidate showed good understanding of the key concepts with some minor knowledge gaps. Their technical responses were generally accurate. The candidate communicated clearly but could improve on confidence and depth in some areas. Overall, they show promising potential for the role with some additional development.";
    } else {
      return "The candidate demonstrated basic understanding but had significant knowledge gaps in key areas. Their technical responses lacked depth and precision. The candidate's verbal communication was hesitant and sometimes unclear. Further development would be necessary before they are ready for this role.";
    }
  };

  if (!job || !user) return null;
  
  if (isGeneratingQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-evalverse-purple">Generating Assessment</CardTitle>
            <CardDescription className="text-center">
              Our AI is creating personalized questions based on the job requirements...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <div className="animate-pulse flex space-x-4">
              <div className="h-12 w-12 rounded-full bg-evalverse-lightPurple"></div>
              <div className="h-12 w-12 rounded-full bg-evalverse-lightPurple"></div>
              <div className="h-12 w-12 rounded-full bg-evalverse-lightPurple"></div>
            </div>
            <Progress value={65} className="w-full mt-6" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-evalverse-purple mb-2">{job.title} - Assessment</h1>
          <p className="text-gray-600">Complete both sections to submit your assessment</p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Assessment Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-medium">{Math.round(totalProgress)}%</span>
                </div>
                <Progress value={totalProgress} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      Multiple Choice
                    </span>
                    <span className="text-sm font-medium">{Math.round(mcqProgress)}%</span>
                  </div>
                  <Progress value={mcqProgress} className="bg-gray-200" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium flex items-center">
                      <Mic className="h-4 w-4 mr-1" />
                      Voice Responses
                    </span>
                    <span className="text-sm font-medium">{Math.round(voiceProgress)}%</span>
                  </div>
                  <Progress value={voiceProgress} className="bg-gray-200" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger 
              value="mcq" 
              className="flex items-center justify-center"
              disabled={isAssessmentComplete}
            >
              <FileText className="h-4 w-4 mr-2" />
              Multiple Choice
              {isMCQCompleted && <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />}
            </TabsTrigger>
            <TabsTrigger 
              value="voice" 
              className="flex items-center justify-center"
              disabled={isAssessmentComplete}
            >
              <Mic className="h-4 w-4 mr-2" />
              Voice Responses
              {isVoiceCompleted && <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="mcq" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Multiple Choice Questions</CardTitle>
                <CardDescription>
                  Please select the best answer for each question.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MCQTest />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentTab('voice')}
                  disabled={isAssessmentComplete}
                >
                  Next: Voice Section
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="voice" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Voice Response Questions</CardTitle>
                <CardDescription>
                  Please record your answers to the following questions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VoiceTest />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentTab('mcq')}
                  disabled={isAssessmentComplete}
                >
                  Back to MCQ
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        {!isAllCompleted && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Incomplete Assessment</AlertTitle>
            <AlertDescription>
              Please complete all sections before submitting your assessment.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-end">
          <Button 
            className="bg-evalverse-purple hover:bg-evalverse-brightPurple"
            disabled={!isAllCompleted || isSubmitting || isAssessmentComplete}
            onClick={handleSubmitAssessment}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
