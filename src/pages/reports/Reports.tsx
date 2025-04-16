
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useJob } from '@/contexts/JobContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, FileText } from 'lucide-react';
import { format } from 'date-fns';

const Reports = () => {
  const { user, isAuthenticated } = useAuth();
  const { reports, jobs } = useJob();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    if (user?.userType !== 'HR' && user?.userType !== 'Candidate') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  if (!user) return null;
  
  const isHR = user.userType === 'HR';
  
  // For HR, show all reports; for candidates, show only their reports
  const filteredReports = isHR 
    ? reports 
    : reports.filter(report => report.candidateId === user.id);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-evalverse-charcoal">Assessment Reports</h2>
          <p className="text-gray-500 mt-2">
            {isHR 
              ? 'View all candidate assessment reports' 
              : 'View your assessment results'}
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Reports</CardTitle>
            <CardDescription>
              {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} available
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No assessment reports available yet.</p>
                {isHR ? (
                  <Button onClick={() => navigate('/jobs')} className="bg-evalverse-purple hover:bg-evalverse-brightPurple">
                    View Job Postings
                  </Button>
                ) : (
                  <Button onClick={() => navigate('/jobs')} className="bg-evalverse-purple hover:bg-evalverse-brightPurple">
                    Browse Jobs
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    {isHR && <TableHead>Candidate</TableHead>}
                    <TableHead>Date</TableHead>
                    <TableHead>MCQ Score</TableHead>
                    <TableHead>Voice Score</TableHead>
                    <TableHead>Overall</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map(report => {
                    const job = jobs.find(j => j.id === report.jobId);
                    const formattedDate = format(new Date(report.timestamp), 'MMM dd, yyyy');
                    const overallScore = Math.round((report.mcqScore + report.voiceScore) / 2);
                    
                    const getScoreColor = (score: number) => {
                      if (score >= 80) return 'text-green-600';
                      if (score >= 60) return 'text-amber-600';
                      return 'text-red-600';
                    };
                    
                    return (
                      <TableRow key={report.id}>
                        <TableCell>{job?.title || 'Unknown Job'}</TableCell>
                        {isHR && <TableCell>{report.candidateId}</TableCell>}
                        <TableCell>{formattedDate}</TableCell>
                        <TableCell className={getScoreColor(report.mcqScore)}>
                          {Math.round(report.mcqScore)}%
                        </TableCell>
                        <TableCell className={getScoreColor(report.voiceScore)}>
                          {Math.round(report.voiceScore)}%
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            overallScore >= 80 ? "bg-green-500" : 
                            overallScore >= 60 ? "bg-amber-500" : 
                            "bg-red-500"
                          }>
                            {overallScore}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/assessment/${report.jobId}/results`)}
                            className="border-evalverse-purple text-evalverse-purple"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
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
            onClick={() => navigate(isHR ? '/jobs' : '/dashboard')} 
            className="bg-evalverse-purple hover:bg-evalverse-brightPurple"
          >
            {isHR ? 'View Jobs' : 'Back to Dashboard'}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
