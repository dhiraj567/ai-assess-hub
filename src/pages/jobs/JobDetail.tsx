
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useJob } from '@/contexts/JobContext';
import { useAssessment } from '@/contexts/AssessmentContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, ArrowLeft, Building2, Calendar, Clipboard, Download, FileText, Upload, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { CandidateApplication } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { getJobById, applyForJob, getApplicationsByCandidateId, getApplicationsByJobId } = useJob();
  const { startAssessment } = useAssessment();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [candidateApplications, setCandidateApplications] = useState<CandidateApplication[]>([]);

  const job = id ? getJobById(id) : undefined;
  const formattedDate = job ? format(new Date(job.postedDate), 'MMMM dd, yyyy') : '';
  const isHR = user?.userType === 'HR';
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    if (!job) {
      navigate('/jobs');
    }
  }, [isAuthenticated, job, navigate]);

  useEffect(() => {
    if (user && job && !isHR) {
      // Check if candidate has already applied
      const applications = getApplicationsByCandidateId(user.id);
      const hasAlreadyApplied = applications.some(app => app.jobId === job.id);
      setHasApplied(hasAlreadyApplied);
    }
    
    if (user && job && isHR) {
      // Fetch applications for this job
      const applications = getApplicationsByJobId(job.id);
      setCandidateApplications(applications);
    }
  }, [user, job, isHR, getApplicationsByCandidateId, getApplicationsByJobId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleApply = () => {
    if (!user || !job) return;
    
    if (!resumeFile) {
      setError('Please upload your resume');
      return;
    }
    
    try {
      setIsApplying(true);
      
      // In a real app, this would upload the file to storage
      // For this demo, we'll create a fake URL
      const fakeResumeUrl = `resume_${user.id}_${Date.now()}.pdf`;
      
      applyForJob(job.id, user.id, fakeResumeUrl, user.username);
      
      toast({
        title: 'Application Submitted',
        description: 'Your application has been submitted successfully.',
      });
      
      setHasApplied(true);
    } catch (err) {
      setError('Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  const handleStartAssessment = (jobId: string) => {
    if (!job) return;
    
    startAssessment(jobId);
    navigate(`/assessment/${jobId}`);
  };

  if (!job || !user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/jobs')} 
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Jobs
          </Button>
          <h2 className="text-3xl font-bold tracking-tight text-evalverse-charcoal">{job.title}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-evalverse-purple">{job.title}</CardTitle>
                    <div className="flex items-center mt-2 text-gray-500">
                      <Building2 className="h-4 w-4 mr-1" />
                      <span className="mr-4">EvalVerse</span>
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Posted on {formattedDate}</span>
                    </div>
                  </div>
                  {!isHR && (
                    <Badge variant={hasApplied ? "outline" : "default"} className={hasApplied ? "border-evalverse-success text-evalverse-success" : "bg-evalverse-blue"}>
                      {hasApplied ? "Applied" : "Open"}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                  <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
                </div>
              </CardContent>
              <CardFooter>
                {!isHR && !hasApplied && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-evalverse-purple hover:bg-evalverse-brightPurple">
                        Apply for this Position
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Apply for {job.title}</DialogTitle>
                        <DialogDescription>
                          Upload your resume to apply for this position.
                        </DialogDescription>
                      </DialogHeader>
                      
                      {error && (
                        <Alert variant="destructive" className="my-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="resume">Upload Resume</Label>
                          <div className="flex items-center">
                            <Input
                              id="resume"
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                              className="flex-1"
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            Accepted formats: PDF, DOC, DOCX
                          </p>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button 
                          onClick={handleApply} 
                          className="bg-evalverse-purple hover:bg-evalverse-brightPurple"
                          disabled={isApplying || !resumeFile}
                        >
                          {isApplying ? 'Submitting...' : 'Submit Application'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                
                {!isHR && hasApplied && (
                  <div className="w-full">
                    <Button 
                      className="w-full bg-evalverse-blue hover:bg-blue-500"
                      onClick={() => handleStartAssessment(job.id)}
                    >
                      Take Assessment Test
                    </Button>
                  </div>
                )}
                
                {isHR && (
                  <Button 
                    onClick={() => navigate(`/jobs/${job.id}/candidates`)}
                    className="w-full bg-evalverse-purple hover:bg-evalverse-brightPurple"
                  >
                    View Candidates
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Position:</span>
                  <span className="font-medium">{job.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Company:</span>
                  <span className="font-medium">EvalVerse</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted:</span>
                  <span className="font-medium">{formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">Remote</span>
                </div>
              </CardContent>
            </Card>

            {isHR && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Applications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-evalverse-purple" />
                    <span className="font-medium">
                      {candidateApplications.length} applicant{candidateApplications.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clipboard className="h-5 w-5 mr-2 text-evalverse-blue" />
                    <span className="font-medium">
                      {candidateApplications.filter(app => app.testTaken).length} assessment{candidateApplications.filter(app => app.testTaken).length !== 1 ? 's' : ''} completed
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-2 border-evalverse-purple text-evalverse-purple"
                    onClick={() => navigate(`/jobs/${job.id}/candidates`)}
                  >
                    View Candidates
                  </Button>
                </CardContent>
              </Card>
            )}

            {!isHR && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Assessment Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-evalverse-purple" />
                    <span>Multiple Choice Questions</span>
                  </div>
                  <div className="flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-evalverse-blue" />
                    <span>Voice-Based Q&A</span>
                  </div>
                  <div className="flex items-center">
                    <Download className="h-5 w-5 mr-2 text-evalverse-brightPurple" />
                    <span>AI-Generated Report</span>
                  </div>
                  {hasApplied && (
                    <Button 
                      className="w-full mt-2 bg-evalverse-blue hover:bg-blue-500"
                      onClick={() => handleStartAssessment(job.id)}
                    >
                      Start Assessment
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobDetail;
