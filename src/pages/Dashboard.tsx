
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useJob } from '@/contexts/JobContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, ClipboardList, FileText, Users } from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { jobs, applications, reports } = useJob();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const isHR = user.userType === 'HR';

  // Dashboard stats for HR
  const hrStats = {
    totalJobs: jobs.length,
    totalCandidates: new Set(applications.map(app => app.candidateId)).size,
    totalApplications: applications.length,
    totalAssessments: reports.length
  };

  // Dashboard stats for Candidate
  const candidateStats = {
    totalJobsAvailable: jobs.length,
    myApplications: applications.filter(app => app.candidateId === user.id).length,
    testsCompleted: applications.filter(app => app.candidateId === user.id && app.testTaken).length,
    pendingTests: applications.filter(app => app.candidateId === user.id && !app.testTaken).length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-evalverse-charcoal">Dashboard</h2>
          <p className="text-gray-500 mt-2">
            {isHR 
              ? 'Overview of your recruitment activities and candidate assessments.'
              : 'Track your job applications and assessment results.'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isHR ? (
            <>
              <StatsCard 
                title="Active Jobs" 
                value={hrStats.totalJobs} 
                description="Total job postings" 
                icon={<FileText className="h-5 w-5 text-evalverse-blue" />} 
                onClick={() => navigate('/jobs')}
              />
              <StatsCard 
                title="Candidates" 
                value={hrStats.totalCandidates} 
                description="Unique applicants" 
                icon={<Users className="h-5 w-5 text-evalverse-brightPurple" />} 
                onClick={() => navigate('/candidates')}
              />
              <StatsCard 
                title="Applications" 
                value={hrStats.totalApplications} 
                description="Total submissions" 
                icon={<ClipboardList className="h-5 w-5 text-evalverse-purple" />} 
                onClick={() => navigate('/candidates')}
              />
              <StatsCard 
                title="Assessments" 
                value={hrStats.totalAssessments} 
                description="Completed tests" 
                icon={<BarChart className="h-5 w-5 text-evalverse-blue" />} 
                onClick={() => navigate('/reports')}
              />
            </>
          ) : (
            <>
              <StatsCard 
                title="Available Jobs" 
                value={candidateStats.totalJobsAvailable} 
                description="Open positions" 
                icon={<FileText className="h-5 w-5 text-evalverse-blue" />} 
                onClick={() => navigate('/jobs')}
              />
              <StatsCard 
                title="My Applications" 
                value={candidateStats.myApplications} 
                description="Jobs applied to" 
                icon={<ClipboardList className="h-5 w-5 text-evalverse-purple" />} 
                onClick={() => navigate('/applications')}
              />
              <StatsCard 
                title="Tests Completed" 
                value={candidateStats.testsCompleted} 
                description="Finished assessments" 
                icon={<BarChart className="h-5 w-5 text-evalverse-brightPurple" />} 
                onClick={() => navigate('/applications')}
              />
              <StatsCard 
                title="Pending Tests" 
                value={candidateStats.pendingTests} 
                description="Awaiting completion" 
                icon={<ClipboardList className="h-5 w-5 text-evalverse-blue" />}
                onClick={() => navigate('/applications')} 
              />
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-medium mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isHR ? (
              <>
                <Button 
                  onClick={() => navigate('/jobs/create')} 
                  className="bg-evalverse-purple hover:bg-evalverse-brightPurple"
                >
                  Post a New Job
                </Button>
                <Button 
                  onClick={() => navigate('/candidates')} 
                  variant="outline"
                  className="border-evalverse-purple text-evalverse-purple hover:bg-evalverse-lightPurple"
                >
                  View Candidates
                </Button>
                <Button 
                  onClick={() => navigate('/reports')} 
                  variant="outline"
                  className="border-evalverse-blue text-evalverse-blue hover:bg-evalverse-lightPurple"
                >
                  Assessment Reports
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => navigate('/jobs')} 
                  className="bg-evalverse-purple hover:bg-evalverse-brightPurple"
                >
                  Browse Jobs
                </Button>
                <Button 
                  onClick={() => navigate('/applications')} 
                  variant="outline"
                  className="border-evalverse-purple text-evalverse-purple hover:bg-evalverse-lightPurple"
                >
                  View My Applications
                </Button>
                <Button 
                  onClick={() => navigate('/profile')} 
                  variant="outline"
                  className="border-evalverse-blue text-evalverse-blue hover:bg-evalverse-lightPurple"
                >
                  Update Profile
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-xl font-medium mb-4">Recent Activity</h3>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-gray-500">No recent activities to display.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description, icon, onClick }) => (
  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </CardContent>
  </Card>
);

export default Dashboard;
