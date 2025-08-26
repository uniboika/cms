import { useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { authService } from "@/lib/auth";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiRequest('POST', '/api/auth/login', {
        registrationNumber,
        password,
      });

      const authData = await response.json();
      authService.setAuth(authData);

      toast({
        title: "Success",
        description: "Logged in successfully",
      });

      onClose();

      // Redirect based on role
      const { role } = authData.user;
      if (role === 'student') {
        setLocation('/student-dashboard');
      } else if (role === 'school_admin') {
        setLocation('/school-admin-dashboard');
      } else if (role === 'central_admin') {
        setLocation('/central-admin-dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive",
      });
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
      <DialogContent className="max-w-md">
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
              className="flex-1"
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
