import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { JobProvider } from "./contexts/JobContext";
import { AssessmentProvider } from "./contexts/AssessmentContext";

// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import JobList from "./pages/jobs/JobList";
import CreateJob from "./pages/jobs/CreateJob";
import JobDetail from "./pages/jobs/JobDetail";
import CandidatesList from "./pages/hr/CandidatesList";
import Assessment from "./pages/assessment/Assessment";
import AssessmentResults from "./pages/assessment/AssessmentResults";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <JobProvider>
        <AssessmentProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Auth Routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                
                {/* Job Routes */}
                <Route path="/jobs" element={<ProtectedRoute><JobList /></ProtectedRoute>} />
                <Route path="/jobs/create" element={<ProtectedRoute><CreateJob /></ProtectedRoute>} />
                <Route path="/jobs/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
                <Route path="/jobs/:id/candidates" element={<ProtectedRoute><CandidatesList /></ProtectedRoute>} />
                
                {/* Assessment Routes */}
                <Route path="/assessment/:id" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
                <Route path="/assessment/:id/results" element={<ProtectedRoute><AssessmentResults /></ProtectedRoute>} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AssessmentProvider>
      </JobProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
