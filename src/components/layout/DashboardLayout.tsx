
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Building2,
  ChevronDown,
  ClipboardList,
  FileText,
  LogOut,
  Menu,
  User,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const userInitials = user?.username ? getInitials(user.username) : 'U';

  const navItems = user?.userType === 'HR' 
    ? [
        { icon: Building2, label: 'Dashboard', path: '/dashboard' },
        { icon: FileText, label: 'Job Postings', path: '/jobs' },
        { icon: ClipboardList, label: 'Candidates', path: '/candidates' },
      ]
    : [
        { icon: Building2, label: 'Dashboard', path: '/dashboard' },
        { icon: FileText, label: 'Job Listings', path: '/jobs' },
        { icon: ClipboardList, label: 'My Applications', path: '/applications' },
      ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/dashboard" className="text-2xl font-bold text-evalverse-purple">
                  EVALVERSE
                </Link>
              </div>
              {/* Desktop Navigation */}
              <nav className="hidden md:ml-6 md:flex md:space-x-4 items-center">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-evalverse-purple hover:bg-evalverse-lightPurple flex items-center"
                  >
                    <item.icon className="h-4 w-4 mr-1" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center">
              <span className="hidden md:block mr-4 text-sm text-gray-700">
                Welcome, <span className="font-semibold">{user?.username}</span>
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 bg-evalverse-purple text-white">
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Mobile menu button */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden ml-2">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open mobile menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72">
                  <div className="py-4 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <Link 
                        to="/dashboard" 
                        className="text-2xl font-bold text-evalverse-purple"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        EVALVERSE
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <nav className="flex-1 space-y-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="px-3 py-3 text-gray-700 hover:bg-evalverse-lightPurple hover:text-evalverse-purple rounded-md flex items-center"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <item.icon className="h-5 w-5 mr-3" />
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start px-3 py-3 text-gray-700"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Log out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} EVALVERSE. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
