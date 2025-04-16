
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Building2, Mail, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const UserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    if (user) {
      setName(user.username || '');
      setEmail(user.email || '');
      setBio('');
    }
  }, [isAuthenticated, user, navigate]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real application, this would update the user profile in the database
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!",
      });
    }, 1000);
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-evalverse-charcoal">My Profile</h2>
          <p className="text-gray-500 mt-2">View and update your profile information</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4 bg-evalverse-purple text-white">
                  <AvatarFallback className="text-xl">
                    {getInitials(user.username || 'User')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{user.username}</h3>
                <div className="flex items-center justify-center mt-1 text-gray-500">
                  {user.userType === 'HR' ? (
                    <Building2 className="h-4 w-4 mr-1" />
                  ) : (
                    <User className="h-4 w-4 mr-1" />
                  )}
                  <span>{user.userType}</span>
                </div>
                <div className="flex items-center justify-center mt-1 text-gray-500">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{user.email || 'No email provided'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Edit Profile Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us a bit about yourself"
                      className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="bg-evalverse-purple hover:bg-evalverse-brightPurple"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
