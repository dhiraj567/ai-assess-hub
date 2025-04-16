
import React, { createContext, useContext, useState } from 'react';
import { Job, CandidateApplication, Report } from '@/lib/types';

interface JobContextType {
  jobs: Job[];
  applications: CandidateApplication[];
  reports: Report[];
  addJob: (job: Omit<Job, 'id' | 'postedDate'>) => void;
  getJobs: () => Job[];
  getJobById: (id: string) => Job | undefined;
  applyForJob: (jobId: string, candidateId: string, resumeUrl: string, candidateName: string) => void;
  getApplicationsByJobId: (jobId: string) => CandidateApplication[];
  getApplicationsByCandidateId: (candidateId: string) => CandidateApplication[];
  addReport: (report: Omit<Report, 'id' | 'timestamp'>) => string;
  getReportById: (id: string) => Report | undefined;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

// Mock data
const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    description: 'We are looking for a skilled frontend developer with 5+ years of experience in React.',
    requirements: 'React, TypeScript, CSS, state management (Redux or Context API)',
    postedDate: '2023-04-10T10:00:00Z',
    postedByUserId: '1'
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    description: 'Join our design team to create beautiful and functional interfaces for our products.',
    requirements: 'Figma, UI/UX principles, prototyping, user research',
    postedDate: '2023-04-12T14:30:00Z',
    postedByUserId: '1'
  },
  {
    id: '3',
    title: 'Backend Developer',
    description: 'Develop and maintain server-side applications with Node.js and Express.',
    requirements: 'Node.js, Express, MongoDB, RESTful API design',
    postedDate: '2023-04-15T09:15:00Z',
    postedByUserId: '1'
  }
];

const MOCK_APPLICATIONS: CandidateApplication[] = [];
const MOCK_REPORTS: Report[] = [];

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [applications, setApplications] = useState<CandidateApplication[]>(MOCK_APPLICATIONS);
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);

  const addJob = (job: Omit<Job, 'id' | 'postedDate'>) => {
    const newJob: Job = {
      ...job,
      id: Math.random().toString(36).substr(2, 9),
      postedDate: new Date().toISOString(),
    };
    setJobs([...jobs, newJob]);
  };

  const getJobs = () => jobs;

  const getJobById = (id: string) => jobs.find(job => job.id === id);

  const applyForJob = (jobId: string, candidateId: string, resumeUrl: string, candidateName: string) => {
    const newApplication: CandidateApplication = {
      id: Math.random().toString(36).substr(2, 9),
      candidateId,
      jobId,
      candidateName,
      resumeUrl,
      applicationDate: new Date().toISOString(),
      testTaken: false
    };
    setApplications([...applications, newApplication]);
  };

  const getApplicationsByJobId = (jobId: string) => 
    applications.filter(app => app.jobId === jobId);

  const getApplicationsByCandidateId = (candidateId: string) => 
    applications.filter(app => app.candidateId === candidateId);

  const addReport = (report: Omit<Report, 'id' | 'timestamp'>) => {
    const reportId = Math.random().toString(36).substr(2, 9);
    const newReport: Report = {
      ...report,
      id: reportId,
      timestamp: new Date().toISOString(),
    };
    setReports([...reports, newReport]);
    
    // Update application to mark test as taken
    setApplications(applications.map(app => {
      if (app.candidateId === report.candidateId && app.jobId === report.jobId) {
        return {
          ...app,
          testTaken: true,
          reportId
        };
      }
      return app;
    }));
    
    return reportId;
  };

  const getReportById = (id: string) => reports.find(report => report.id === id);

  return (
    <JobContext.Provider
      value={{
        jobs,
        applications,
        reports,
        addJob,
        getJobs,
        getJobById,
        applyForJob,
        getApplicationsByJobId,
        getApplicationsByCandidateId,
        addReport,
        getReportById
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJob = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context;
};
