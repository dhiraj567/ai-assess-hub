
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useJob } from '@/contexts/JobContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

const CreateJob = () => {
  const { user, isAuthenticated } = useAuth();
  const { addJob } = useJob();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.userType !== 'HR') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim() || !description.trim() || !requirements.trim()) {
      setError('All fields are required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      addJob({
        title,
        description,
        requirements,
        postedByUserId: user?.id || '',
      });
      
      toast({
        title: 'Success',
        description: 'Job posting created successfully',
      });
      
      navigate('/jobs');
    } catch (err) {
      setError('Failed to create job posting');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.userType !== 'HR') return null;

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
          <h2 className="text-3xl font-bold tracking-tight text-evalverse-charcoal">Create Job Posting</h2>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Post a New Job</CardTitle>
            <CardDescription>
              Create a job listing for candidates to apply. Be as detailed as possible to attract qualified candidates.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Senior Frontend Developer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide details about the role, responsibilities, and company..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="min-h-[150px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements & Qualifications</Label>
                <Textarea
                  id="requirements"
                  placeholder="List skills, experience, education, and other qualifications..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  required
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/jobs')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-evalverse-purple hover:bg-evalverse-brightPurple"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Job Posting'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateJob;
