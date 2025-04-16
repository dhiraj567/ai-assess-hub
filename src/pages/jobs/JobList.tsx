
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useJob } from '@/contexts/JobContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Calendar, Plus, Search } from 'lucide-react';
import { Job } from '@/lib/types';
import { format } from 'date-fns';

const JobList = () => {
  const { user, isAuthenticated } = useAuth();
  const { jobs } = useJob();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const filtered = jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  if (!user) return null;

  const isHR = user.userType === 'HR';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-evalverse-charcoal">
              {isHR ? 'Manage Job Postings' : 'Browse Job Opportunities'}
            </h2>
            <p className="text-gray-500 mt-2">
              {isHR 
                ? 'Create and manage job listings for candidates to apply'
                : 'Discover and apply for positions that match your skills'}
            </p>
          </div>
          {isHR && (
            <Button 
              onClick={() => navigate('/jobs/create')}
              className="bg-evalverse-purple hover:bg-evalverse-brightPurple"
            >
              <Plus className="mr-2 h-4 w-4" /> Post New Job
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search jobs by title or keyword..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Job listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                isHR={isHR} 
                onClick={() => navigate(`/jobs/${job.id}`)} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No jobs matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

interface JobCardProps {
  job: Job;
  isHR: boolean;
  onClick: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, isHR, onClick }) => {
  const formattedDate = format(new Date(job.postedDate), 'MMM dd, yyyy');
  
  // Truncate description
  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-evalverse-purple">{job.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm line-clamp-3">
          {truncateDescription(job.description, 150)}
        </p>
        <div className="flex items-center text-gray-500 text-sm">
          <Building2 className="h-4 w-4 mr-1" />
          <span>EvalVerse</span>
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Posted on {formattedDate}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full border-evalverse-purple text-evalverse-purple hover:bg-evalverse-lightPurple"
        >
          {isHR ? 'View Candidates' : 'View Details'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobList;
