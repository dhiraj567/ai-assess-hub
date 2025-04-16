
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useJob } from '@/contexts/JobContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, FileText, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const ApplicationsList = () => {
  const { user, isAuthenticated } = useAuth();
  const { getApplicationsByCandidateId, getJobById } = useJob();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    if (user?.userType !== 'Candidate') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  if (!user || user.userType !== 'Candidate') return null;

  const applications = getApplicationsByCandidateId(user.id);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-evalverse-charcoal">My Applications</h2>
          <p className="text-gray-500 mt-2">Track your job applications and assessment results</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>
              View and manage your job applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">You haven't applied to any jobs yet.</p>
                <Button onClick={() => navigate('/jobs')} className="bg-evalverse-purple hover:bg-evalverse-brightPurple">
                  Browse Jobs
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assessment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map(application => {
                    const job = getJobById(application.jobId);
                    const applicationDate = format(new Date(application.applicationDate), 'MMM dd, yyyy');
                    
                    return (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">{job?.title || 'Unknown Job'}</TableCell>
                        <TableCell>{applicationDate}</TableCell>
                        <TableCell>
                          <Badge className="bg-evalverse-blue">Applied</Badge>
                        </TableCell>
                        <TableCell>
                          {application.testTaken ? (
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                              <span>Completed</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <XCircle className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-gray-500">Not taken</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/jobs/${application.jobId}`)}
                              className="border-evalverse-purple text-evalverse-purple"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              View Job
                            </Button>
                            {!application.testTaken && (
                              <Button 
                                size="sm"
                                onClick={() => navigate(`/assessment/${application.jobId}`)}
                                className="bg-evalverse-blue hover:bg-blue-500"
                              >
                                Take Assessment
                              </Button>
                            )}
                            {application.testTaken && application.reportId && (
                              <Button 
                                size="sm"
                                onClick={() => navigate(`/assessment/${application.jobId}/results`)}
                                className="bg-evalverse-brightPurple hover:bg-purple-500"
                              >
                                View Results
                              </Button>
                            )}
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
            Browse More Jobs
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApplicationsList;
