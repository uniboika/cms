import React, { useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { login, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login({ registrationNumber, password });
      
      if (result.success) {
        // Show success toast
        toast({
          title: "Success",
          description: "Logged in successfully",
          variant: "default",
          className: "bg-green-500 text-white"
        });

        // Close the modal first
        onClose();

        // Get the user role from the auth state
        const currentUser = JSON.parse(localStorage.getItem('auth') || '{}').user;
        const role = currentUser?.role;
        
        // Redirect based on role
        if (role === 'student') {
          setLocation('/student-dashboard');
        } else if (role === 'school_admin') {
          setLocation('/school-admin-dashboard');
        } else if (role === 'central_admin') {
          setLocation('/central-admin-dashboard');
        } else {
          // Default fallback
          setLocation('/');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // Error toast is handled by the useAuth hook
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRegistrationNumber('');
    setPassword('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="login-registration-number">Registration Number</Label>
            <Input
              id="login-registration-number"
              type="text"
              placeholder="e.g., STU1001 or ADMIN_ACADEMICS"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              required
              data-testid="input-login-registration"
            />
          </div>
          
          <div>
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-testid="input-login-password"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
              data-testid="button-login-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              color="primary"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 text-white"
              data-testid="button-login-submit"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Test Credentials:</p>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Academics Admin: ADMIN_ACADEMICS / admin123</p>
            <p>General Admin: ADMIN_GENERAL / admin123</p>
            <p>Hostel Admin: ADMIN_HOSTEL / admin123</p>
            <p>Central Admin: CENTRAL_ADMIN / admin123</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
