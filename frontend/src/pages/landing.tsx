import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import LoginModal from "@/components/auth/login-modal";
import RegistrationModal from "@/components/auth/registration-modal";
import { GraduationCap, Shield, Users, FileText, Clock, Eye } from "lucide-react";

export default function Landing() {
  console.log('Rendering Landing component');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();

  console.log('Auth state:', { isAuthenticated, user });

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User is authenticated, redirecting based on role:', user.role);
      if (user.role === 'student') {
        setLocation('/student-dashboard');
      } else if (user.role === 'school_admin') {
        setLocation('/school-admin-dashboard');
      } else if (user.role === 'central_admin') {
        setLocation('/central-admin-dashboard');
      } else {
        console.error('Unknown user role:', user.role);
        setLocation('/');
      }
    }
  }, [isAuthenticated, user, setLocation]);

  // if (isAuthenticated) {
  //   return <div className="flex items-center justify-center min-h-screen">
  //     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //     <span className="ml-4 text-lg">Redirecting to your dashboard...</span>
  //   </div>;
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                <FileText className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Campus Complaints
                </span>
                
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => setShowLogin(true)}
                data-testid="button-login"
                className="hover:bg-blue-50"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => setShowRegister(true)}
                data-testid="button-register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
        
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
            Modern Solution for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Student Complaints</span>
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed">
            Streamline complaint resolution with our comprehensive platform designed for educational institutions. 
            Featuring role-based access, real-time tracking, and complete transparency.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setShowRegister(true)}
              data-testid="button-get-started"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 text-white"
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setShowLogin(true)}
              data-testid="button-sign-in"
              className="text-lg px-8 py-4 border-2 hover:bg-blue-50"
            >
              View Demo
            </Button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
            <p className="text-gray-600">Monitor complaint status and resolution progress in real-time</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Anonymous Options</h3>
            <p className="text-gray-600">Submit complaints anonymously when needed for sensitive issues</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Role-based Access</h3>
            <p className="text-gray-600">Different access levels for students, school admins, and central admins</p>
          </div>
        </div>

        {/* User Roles Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Every User
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored experiences for different roles within your educational institution
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Student Role */}
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="bg-blue-200 text-blue-800">Students</Badge>
                </div>
                <CardTitle className="text-xl text-gray-900">Submit & Track</CardTitle>
                <CardDescription className="text-gray-600">
                  Easy complaint submission with comprehensive tracking capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Submit complaints across multiple categories
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Optional anonymous submissions
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Real-time status updates
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Complete complaint history
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* School Admin Role */}
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="outline" className="border-purple-300 text-purple-700">School Admins</Badge>
                </div>
                <CardTitle className="text-xl text-gray-900">Manage & Resolve</CardTitle>
                <CardDescription className="text-gray-600">
                  Efficient resolution tools with category-based management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                    Category-specific complaint views
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                    Resolution status management
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                    Reject false complaints
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                    Detailed resolution notes
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Central Admin Role */}
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-green-600 hover:bg-green-700 text-white">Central Admins</Badge>
                </div>
                <CardTitle className="text-xl text-gray-900">System Oversight</CardTitle>
                <CardDescription className="text-gray-600">
                  Complete administration with user management capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    System-wide complaint overview
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    User account management
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    Comprehensive audit logs
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    Account flagging & suspension
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        {/* <div className="mt-32 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-16 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Institution?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join hundreds of educational institutions already using our platform to streamline complaint management
          </p>
          <Button 
            size="lg"
            onClick={() => setShowRegister(true)}
            className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-xl"
          >
            Start Your Free Trial Today
          </Button>
        </div> */}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Campus Complaints</span>
            </div>
            <p className="text-gray-600 mb-4">
              Empowering educational institutions with efficient, transparent complaint resolution.
            </p>
            <p className="text-sm text-gray-500">
              © 2025 Campus Complaints Management System. Built for educational excellence.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <RegistrationModal isOpen={showRegister} onClose={() => setShowRegister(false)} />
    </div>
  );
}