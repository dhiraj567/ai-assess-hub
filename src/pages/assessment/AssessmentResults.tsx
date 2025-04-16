
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useJob } from '@/contexts/JobContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ChevronRight, Download, FileText, Mic } from 'lucide-react';
import { Report } from '@/lib/types';
import { format } from 'date-fns';

const AssessmentResults = () => {
  const { id: jobId } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { getJobById, reports } = useJob();
  const navigate = useNavigate();
  
  const [report, setReport] = useState<Report | null>(null);
  
  const job = jobId ? getJobById(jobId) : undefined;
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    if (!job) {
      navigate('/jobs');
    }
    
    if (user && job) {
      // Find the report for this user and job
      const userReport = reports.find(r => r.candidateId === user.id && r.jobId === job.id);
      if (userReport) {
        setReport(userReport);
      } else {
        navigate(`/jobs/${job.id}`);
      }
    }
  }, [isAuthenticated, job, user, reports, navigate]);

  if (!job || !user || !report) return null;
  
  const formattedDate = format(new Date(report.timestamp), 'MMMM dd, yyyy');
  const totalScore = (report.mcqScore + report.voiceScore) / 2;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const getScoreProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-evalverse-purple mb-2">Assessment Results</h1>
            <p className="text-gray-600">{job.title} - Completed on {formattedDate}</p>
          </div>
          <Link to="/dashboard">
            <Button variant="ghost">
              Return to Dashboard
            </Button>
          </Link>
        </div>
        
        {/* Summary Card */}
        <Card className="mb-6 border-evalverse-purple shadow-md">
          <CardHeader className="bg-evalverse-lightPurple rounded-t-lg">
            <div className="flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-evalverse-purple mr-2" />
              <CardTitle className="text-center text-2xl">Assessment Completed</CardTitle>
            </div>
            <CardDescription className="text-center">
              Thank you for completing your assessment for {job.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold mb-2 flex items-baseline">
                <span className={getScoreColor(totalScore)}>
                  {Math.round(totalScore)}%
                </span>
                <span className="text-base text-gray-500 ml-2">Overall Score</span>
              </div>
              <Progress 
                value={totalScore} 
                className={`w-64 h-3 ${getScoreProgressColor(totalScore)}`} 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <FileText className="h-8 w-8 text-evalverse-purple mb-2" />
                <span className="text-sm text-gray-500 mb-1">MCQ Score</span>
                <span className={`text-2xl font-bold ${getScoreColor(report.mcqScore)}`}>
                  {Math.round(report.mcqScore)}%
                </span>
                <Progress 
                  value={report.mcqScore} 
                  className={`w-full mt-2 ${getScoreProgressColor(report.mcqScore)}`} 
                />
              </div>
              
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <Mic className="h-8 w-8 text-evalverse-blue mb-2" />
                <span className="text-sm text-gray-500 mb-1">Voice Assessment</span>
                <span className={`text-2xl font-bold ${getScoreColor(report.voiceScore)}`}>
                  {Math.round(report.voiceScore)}%
                </span>
                <Progress 
                  value={report.voiceScore} 
                  className={`w-full mt-2 ${getScoreProgressColor(report.voiceScore)}`} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* AI Report */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>AI-Generated Assessment Report</CardTitle>
            <CardDescription>
              Our AI has analyzed your test performance and provided feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-evalverse-lightPurple rounded-lg text-gray-700 whitespace-pre-line">
              {report.aiReportSummary}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" /> Download Full Report
            </Button>
          </CardFooter>
        </Card>
        
        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <div className="bg-evalverse-lightPurple rounded-full p-2 flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-evalverse-purple" />
              </div>
              <div>
                <h3 className="font-medium">Assessment Complete</h3>
                <p className="text-gray-600 text-sm">
                  Your assessment has been submitted and is now available to the hiring team.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <div className="bg-evalverse-lightPurple rounded-full p-2 flex-shrink-0">
                <ChevronRight className="h-5 w-5 text-evalverse-purple" />
              </div>
              <div>
                <h3 className="font-medium">HR Review</h3>
                <p className="text-gray-600 text-sm">
                  The HR team will review your application and assessment results.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <div className="bg-evalverse-lightPurple rounded-full p-2 flex-shrink-0">
                <ChevronRight className="h-5 w-5 text-evalverse-purple" />
              </div>
              <div>
                <h3 className="font-medium">Interview Selection</h3>
                <p className="text-gray-600 text-sm">
                  Selected candidates will be contacted for the next round of interviews.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to="/jobs">
              <Button className="bg-evalverse-purple hover:bg-evalverse-brightPurple">
                Explore More Job Opportunities
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentResults;
