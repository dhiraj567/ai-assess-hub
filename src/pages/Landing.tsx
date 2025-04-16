
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Cpu, 
  Users, 
  Briefcase, 
  FileCheck, 
  BrainCircuit, 
  MoveRight,
  LogIn,
  UserPlus
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 md:pt-24 pb-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-evalverse-purple animate-fade-in">
            EVALVERSE
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
            The next-generation AI-powered recruitment platform that transforms how you evaluate talent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild size="lg" className="gap-2 bg-evalverse-purple hover:bg-evalverse-brightPurple">
              <Link to="/login">
                <LogIn className="w-5 h-5" />
                Sign In
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 border-evalverse-purple text-evalverse-purple hover:bg-evalverse-lightPurple">
              <Link to="/register">
                <UserPlus className="w-5 h-5" />
                Register
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard 
            icon={<BrainCircuit className="w-10 h-10 text-evalverse-purple" />}
            title="AI-Powered Evaluation"
            description="Our intelligent agents create custom assessments based on job requirements."
          />
          <FeatureCard 
            icon={<Cpu className="w-10 h-10 text-evalverse-blue" />}
            title="MCQ & Voice Analysis"
            description="Advanced testing through multiple-choice questions and voice response analysis."
          />
          <FeatureCard 
            icon={<FileCheck className="w-10 h-10 text-evalverse-purple" />}
            title="Automated Reports"
            description="Comprehensive candidate reports generated instantly with AI insights."
          />
          <FeatureCard 
            icon={<Users className="w-10 h-10 text-evalverse-blue" />}
            title="Streamlined Recruitment"
            description="Simplify your hiring process from job posting to candidate selection."
          />
          <FeatureCard 
            icon={<Briefcase className="w-10 h-10 text-evalverse-purple" />}
            title="Job Management"
            description="Easily create, distribute, and manage job listings across your organization."
          />
          <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-evalverse-lightPurple hover:shadow-xl transition-all flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-evalverse-charcoal">Try Demo</h3>
              <span className="bg-evalverse-lightPurple text-evalverse-purple text-xs font-semibold px-2.5 py-0.5 rounded-full">Available Now</span>
            </div>
            <p className="text-gray-600 mb-6">Experience EVALVERSE with our demo accounts to explore all features.</p>
            <div className="mt-auto">
              <Button asChild className="w-full gap-2 bg-evalverse-blue hover:bg-blue-500">
                <Link to="/login">
                  Start Demo
                  <MoveRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-evalverse-charcoal">How EVALVERSE Works</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                <div className="bg-evalverse-lightPurple rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-evalverse-purple font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-evalverse-charcoal">HR Posts Jobs</h3>
                <p className="text-gray-600">HR professionals create detailed job postings with requirements and descriptions.</p>
              </div>
              <div className="md:w-1/2 bg-evalverse-lightGray rounded-xl p-4 shadow-md">
                <div className="h-32 bg-evalverse-lightPurple rounded-lg flex items-center justify-center">
                  <Briefcase className="w-12 h-12 text-evalverse-purple" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col-reverse md:flex-row items-center mb-12">
              <div className="md:w-1/2 bg-evalverse-lightGray rounded-xl p-4 shadow-md">
                <div className="h-32 bg-evalverse-lightPurple rounded-lg flex items-center justify-center">
                  <FileCheck className="w-12 h-12 text-evalverse-purple" />
                </div>
              </div>
              <div className="md:w-1/2 mb-6 md:mb-0 md:pl-8">
                <div className="bg-evalverse-lightPurple rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-evalverse-purple font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-evalverse-charcoal">Candidates Apply</h3>
                <p className="text-gray-600">Job seekers explore listings, submit applications, and prepare for assessments.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                <div className="bg-evalverse-lightPurple rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-evalverse-purple font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-evalverse-charcoal">AI Assessment</h3>
                <p className="text-gray-600">Our AI generates custom tests with MCQs and voice-based questions relevant to the position.</p>
              </div>
              <div className="md:w-1/2 bg-evalverse-lightGray rounded-xl p-4 shadow-md">
                <div className="h-32 bg-evalverse-lightPurple rounded-lg flex items-center justify-center">
                  <BrainCircuit className="w-12 h-12 text-evalverse-purple" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col-reverse md:flex-row items-center">
              <div className="md:w-1/2 bg-evalverse-lightGray rounded-xl p-4 shadow-md">
                <div className="h-32 bg-evalverse-lightPurple rounded-lg flex items-center justify-center">
                  <Cpu className="w-12 h-12 text-evalverse-purple" />
                </div>
              </div>
              <div className="md:w-1/2 mb-6 md:mb-0 md:pl-8">
                <div className="bg-evalverse-lightPurple rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-evalverse-purple font-bold">4</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-evalverse-charcoal">Instant Reports</h3>
                <p className="text-gray-600">HR receives comprehensive evaluation reports to make data-driven hiring decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-evalverse-charcoal text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">EVALVERSE</h2>
              <p className="text-gray-400">AI-Powered Recruitment Platform</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Button asChild variant="ghost" className="text-white hover:bg-white/10">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-evalverse-purple hover:bg-evalverse-brightPurple">
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} EVALVERSE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-evalverse-lightPurple hover:shadow-xl transition-all">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-evalverse-charcoal">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Landing;
