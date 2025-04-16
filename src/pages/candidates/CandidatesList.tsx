
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useJob } from '@/contexts/JobContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CandidatesList = () => {
  const { user, isAuthenticated } = useAuth();
  const { applications, jobs } = useJob();
  const navigate = useNavigate();
  
  // Group applications by candidate
  const candidatesMap = applications.reduce((acc, app) => {
    if (!acc[app.candidateId]) {
      acc[app.candidateId] = {
        candidateId: app.candidateId,
        candidateName: app.candidateName,
        applications: []
      };
    }
    acc[app.candidateId].applications.push(app);
    return acc;
  }, {});
  
  const candidates = Object.values(candidatesMap);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    if (user?.userType !== 'HR') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  if (!user || user.userType !== 'HR') return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-evalverse-charcoal">Candidates</h2>
          <p className="text-gray-500 mt-2">View all candidates who have applied to your job postings</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Candidates</CardTitle>
            <CardDescription>
              {candidates.length} candidate{candidates.length !== 1 ? 's' : ''} have applied to your job postings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {candidates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No candidates have applied to your job postings yet.</p>
                <Button onClick={() => navigate('/jobs/create')} className="bg-evalverse-purple hover:bg-evalverse-brightPurple">
                  Post a New Job
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate Name</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Assessments Completed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((candidate: any) => {
                    const completedAssessments = candidate.applications.filter(app => app.testTaken).length;
                    
                    return (
                      <TableRow key={candidate.candidateId}>
                        <TableCell className="font-medium">{candidate.candidateName}</TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            {candidate.applications.map(app => {
                              const job = jobs.find(j => j.id === app.jobId);
                              return (
                                <div key={app.id} className="text-sm">
                                  <Badge variant="outline" className="mr-2 border-evalverse-blue text-evalverse-blue">
                                    {job?.title || 'Unknown Job'}
                                  </Badge>
                                </div>
                              );
                            })}
                          </div>
                        </TableCell>
                        <TableCell>{completedAssessments}/{candidate.applications.length}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {candidate.applications.map(app => {
                              const job = jobs.find(j => j.id === app.jobId);
                              return (
                                <Button 
                                  key={app.id}
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/jobs/${app.jobId}/candidates`)}
                                  className="border-evalverse-purple text-evalverse-purple"
                                >
                                  <FileText className="h-4 w-4 mr-1" />
                                  {job?.title || 'View Job'}
                                </Button>
                              );
                            })}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-center mt-8">
          <Button 
            onClick={() => navigate('/jobs')} 
            className="bg-evalverse-purple hover:bg-evalverse-brightPurple"
          >
            View Job Postings
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CandidatesList;
