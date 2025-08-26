import { useState } from "react";
import RegistrationModal from "@/components/auth/registration-modal";
import LoginModal from "@/components/auth/login-modal";

export default function Landing() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">
                <i className="fas fa-clipboard-list mr-2 text-primary-500"></i>
                Complaint Management System
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              Student Portal
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hero Section */}
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              Student Complaint Management Portal
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Submit and track complaints related to academics, general issues, or hostel facilities. 
              Your voice matters in improving our educational environment.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <i className="fas fa-shield-alt text-green-500 mr-2"></i>
                Secure & Anonymous Options
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <i className="fas fa-clock text-blue-500 mr-2"></i>
                Real-time Status Updates
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <i className="fas fa-users text-purple-500 mr-2"></i>
                Multi-level Resolution
              </div>
            </div>
          </div>

          {/* Registration/Login Panels */}
          <div className="space-y-6">
            {/* Register Panel */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="text-center mb-4">
                <i className="fas fa-user-plus text-3xl text-primary-500 mb-3"></i>
                <h3 className="text-xl font-semibold text-gray-900">New Student Registration</h3>
                <p className="text-sm text-gray-600 mt-1">Create your account to start submitting complaints</p>
              </div>
              <button 
                onClick={() => setShowRegistration(true)}
                data-testid="button-register"
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
              >
                Get Started
              </button>
            </div>

            {/* Login Panel */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="text-center mb-4">
                <i className="fas fa-sign-in-alt text-3xl text-gray-600 mb-3"></i>
                <h3 className="text-xl font-semibold text-gray-900">Student Login</h3>
                <p className="text-sm text-gray-600 mt-1">Access your dashboard and complaint history</p>
              </div>
              <button 
                onClick={() => setShowLogin(true)}
                data-testid="button-login"
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
              >
                Sign In
              </button>
            </div>

            {/* Admin Access */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Administrative Access</p>
                <button 
                  onClick={() => setShowLogin(true)}
                  data-testid="button-admin-login"
                  className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                >
                  Admin Panel →
                </button>
              </div>
            </div>

            {/* Demo Users Guide */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <p className="text-sm font-medium text-blue-700 mb-3">🎯 Demo Accounts & Testing Guide:</p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-blue-700 mb-1">👑 ADMIN LOGIN (Ready to Use):</p>
                  <div className="text-xs text-gray-600 space-y-1 ml-2">
                    <p>📚 Academics: <code className="bg-white px-1 rounded">ADMIN_ACADEMICS</code> / <code className="bg-white px-1 rounded">admin123</code></p>
                    <p>🏢 General: <code className="bg-white px-1 rounded">ADMIN_GENERAL</code> / <code className="bg-white px-1 rounded">admin123</code></p>
                    <p>🏠 Hostel: <code className="bg-white px-1 rounded">ADMIN_HOSTEL</code> / <code className="bg-white px-1 rounded">admin123</code></p>
                    <p>🌟 Central: <code className="bg-white px-1 rounded">CENTRAL_ADMIN</code> / <code className="bg-white px-1 rounded">admin123</code></p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-green-700 mb-1">🎓 STUDENT REGISTRATION:</p>
                  <div className="text-xs text-gray-600 ml-2">
                    <p className="mb-1">Use these numbers: <code className="bg-white px-1 rounded">STU1001</code>, <code className="bg-white px-1 rounded">STU1002</code>, <code className="bg-white px-1 rounded">STU1003</code>, <code className="bg-white px-1 rounded">STU1004</code>, <code className="bg-white px-1 rounded">STU1005</code></p>
                    <p className="text-orange-600">⚠️ Check browser console for OTP during registration</p>
                  </div>
                </div>
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
