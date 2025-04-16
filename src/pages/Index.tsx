
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-evalverse-purple">EVALVERSE</h1>
        <p className="text-xl text-gray-600">AI-Powered Recruitment Platform</p>
        <div className="mt-8 animate-pulse">Redirecting to landing page...</div>
      </div>
    </div>
  );
};

export default Index;
