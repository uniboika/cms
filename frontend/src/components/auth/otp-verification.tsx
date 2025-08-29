import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import PasswordSetup from "./password-setup";

interface OTPVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  registrationNumber: string;
}

export default function OTPVerification({ isOpen, onClose, registrationNumber }: OTPVerificationProps) {
  const [step, setStep] = useState<'otp' | 'password'>('otp');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiRequest('POST', '/api/auth/verify-otp', {
        registrationNumber,
        otpCode,
      });

      toast({
        title: "Success",
        description: "OTP verified successfully",
      });

      setStep('password');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "OTP verification failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'password') {
    return (
      <PasswordSetup
        isOpen={isOpen}
        onClose={onClose}
        registrationNumber={registrationNumber}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <div className="text-center mb-6">
          <i className="fas fa-mobile-alt text-4xl text-primary-500 mb-4"></i>
          <DialogHeader>
            <DialogTitle>Verify Your Registration</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mt-2">
            An OTP has been sent to the console. Please check the server logs.
          </p>
          <p className="text-xs text-blue-600 mt-1 font-medium">
            Registration: <span data-testid="text-registration-number">{registrationNumber}</span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="otp-code">Enter OTP Code</Label>
            <Input
              id="otp-code"
              type="text"
              maxLength={6}
              placeholder="000000"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="text-center text-lg font-mono tracking-widest"
              required
              data-testid="input-otp"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={loading || otpCode.length !== 6}
            className="w-full bg-blue-500 hover:bg-blue-600"
            data-testid="button-verify"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </Button>
          
          <div className="text-center">
            <button type="button" className="text-sm text-gray-500 hover:text-gray-700">
              Didn't receive OTP? Check console logs
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
