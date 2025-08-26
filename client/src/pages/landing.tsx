import { useState } from "react";
import RegistrationModal from "@/components/auth/registration-modal";
import LoginModal from "@/components/auth/login-modal";

export default function Landing() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 animate-fade-in">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-elegant sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 animate-slide-down">
              <h1 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center mr-3 animate-glow">
                  <i className="fas fa-clipboard-list text-white"></i>
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EduComplaint Portal
                </span>
              </h1>
            </div>
            <div className="text-sm font-medium text-gray-600 animate-slide-down" style={{animationDelay: '0.1s'}}>
              Student Portal
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Section */}
          <div className="flex flex-col justify-center space-y-8 animate-slide-up">
            <div className="relative">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Student Complaint 
                <span className="bg-gradient-primary bg-clip-text text-transparent block">
                  Management Portal
                </span>
              </h1>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-bounce-gentle"></div>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
              Submit and track complaints related to academics, general issues, or hostel facilities. 
              Your voice matters in improving our educational environment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass rounded-xl p-4 hover-lift animate-scale-in" style={{animationDelay: '0.3s'}}>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-success rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-shield-alt text-white text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Secure & Anonymous</h3>
                    <p className="text-xs text-gray-600">Protected submissions</p>
                  </div>
                </div>
              </div>
              <div className="glass rounded-xl p-4 hover-lift animate-scale-in" style={{animationDelay: '0.4s'}}>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-clock text-white text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Real-time Updates</h3>
                    <p className="text-xs text-gray-600">Live status tracking</p>
                  </div>
                </div>
              </div>
              <div className="glass rounded-xl p-4 hover-lift animate-scale-in" style={{animationDelay: '0.5s'}}>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-users text-white text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Multi-level Resolution</h3>
                    <p className="text-xs text-gray-600">Expert handling</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Registration/Login Panels */}
          <div className="space-y-6 animate-slide-up" style={{animationDelay: '0.3s'}}>
            {/* Register Panel */}
            <div className="glass rounded-2xl shadow-gorgeous border border-white/20 p-8 hover-lift animate-scale-in" style={{animationDelay: '0.4s'}}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-glow">
                  <i className="fas fa-user-plus text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">New Student Registration</h3>
                <p className="text-gray-600">Create your account to start submitting complaints</p>
              </div>
              <button 
                onClick={() => setShowRegistration(true)}
                data-testid="button-register"
                className="w-full bg-gradient-primary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover-lift hover-scale shadow-beautiful hover:shadow-gorgeous"
              >
                Get Started
              </button>
            </div>

            {/* Login Panel */}
            <div className="glass rounded-2xl shadow-gorgeous border border-white/20 p-8 hover-lift animate-scale-in" style={{animationDelay: '0.5s'}}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-sign-in-alt text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Student Login</h3>
                <p className="text-gray-600">Access your dashboard and complaint history</p>
              </div>
              <button 
                onClick={() => setShowLogin(true)}
                data-testid="button-login"
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover-lift hover-scale shadow-beautiful hover:shadow-gorgeous"
              >
                Sign In
              </button>
            </div>

            {/* Admin Access */}
            <div className="glass rounded-2xl border border-white/20 p-6 hover-lift animate-scale-in" style={{animationDelay: '0.6s'}}>
              <div className="text-center">
                <p className="text-gray-600 mb-3 font-medium">Administrative Access</p>
                <button 
                  onClick={() => setShowLogin(true)}
                  data-testid="button-admin-login"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover-lift"
                >
                  Admin Panel →
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modals */}
      <RegistrationModal 
        isOpen={showRegistration} 
        onClose={() => setShowRegistration(false)} 
      />
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
      />
    </div>
  );
}
