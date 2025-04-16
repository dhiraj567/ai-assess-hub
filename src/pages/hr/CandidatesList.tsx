
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useJob } from '@/contexts/JobContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, Download, FileText, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const CandidatesList = () => {
  const { id: jobId } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { getJobById, getApplicationsByJobId, reports } = useJob();
  const navigate = useNavigate();
  
  const job = jobId ? getJobById(jobId) : undefined;
  const applications = jobId ? getApplicationsByJobId(jobId) : [];
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    if (!job) {
      navigate('/jobs');
    }
    
    if (user?.userType !== 'HR') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, job, user, navigate]);

  if (!job || !user || user.userType !== 'HR') return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/jobs/${job.id}`)} 
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Job
          </Button>
          <h2 className="text-3xl font-bold tracking-tight text-evalverse-charcoal">Candidates</h2>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{job.title}</CardTitle>
            <CardDescription>
              Manage and review candidates who have applied for this position
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <div>
                <span className="font-medium">{applications.length}</span> total application(s)
              </div>
              <div>
                <span className="font-medium">{applications.filter(app => app.testTaken).length}</span> assessment(s) completed
              </div>
            </div>
            
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No candidates have applied for this position yet.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Resume</TableHead>
                    <TableHead>Assessment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map(application => {
                    const report = application.reportId 
                      ? reports.find(r => r.id === application.reportId) 
                      : undefined;
                    
                    const applicationDate = format(new Date(application.applicationDate), 'MMM dd, yyyy');
                    
                    return (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">{application.candidateName}</TableCell>
                        <TableCell>{applicationDate}</TableCell>
                        <TableCell>
                          {application.testTaken ? (
                            <Badge className="bg-evalverse-success">Completed</Badge>
                          ) : (
                            <Badge variant="outline" className="text-orange-500 border-orange-300">Pending Assessment</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Download Resume">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell>
                          {application.testTaken ? (
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                              <span>{report ? `${Math.round((report.mcqScore + report.voiceScore) / 2)}%` : 'Completed'}</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <XCircle className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-gray-500">Not taken</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={!application.testTaken}
                            onClick={() => navigate(`/reports/${application.reportId}`)}
                            className={application.testTaken ? 'border-evalverse-purple text-evalverse-purple' : ''}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View Report
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
      </div>
    </DashboardLayout>
  );
};

export default CandidatesList;
