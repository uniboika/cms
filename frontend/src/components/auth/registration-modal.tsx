import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import OTPVerification from "./otp-verification";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiRequest('POST', '/api/auth/register', {
        registrationNumber,
        fullName,
        email,
      });

      toast({
        title: "Success",
        description: "OTP sent successfully. Check server console.",
      });

      setStep('otp');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Registration failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('register');
    setRegistrationNumber('');
    setFullName('');
    setEmail('');
    onClose();
  };

  if (step === 'otp') {
    return (
      <OTPVerification
        isOpen={isOpen}
        onClose={handleClose}
        registrationNumber={registrationNumber}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Student Registration</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="registration-number">Registration Number</Label>
            <Input
              id="registration-number"
              type="text"
              placeholder="e.g., STU1001"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              required
              data-testid="input-registration-number"
            />
            <p className="text-xs text-gray-500 mt-1">Enter your official student registration number</p>
          </div>
          
          <div>
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              type="text"
              placeholder="e.g., John Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              data-testid="input-full-name"
            />
            <p className="text-xs text-gray-500 mt-1">Enter your full name as per official records</p>
          </div>
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@student.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="input-email"
            />
            <p className="text-xs text-gray-500 mt-1">We'll send verification details to this email</p>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 text-white"
              data-testid="button-continue"
            >
              {loading ? 'Sending...' : 'Continue'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
