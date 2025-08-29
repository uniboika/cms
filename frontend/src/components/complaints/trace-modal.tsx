import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TraceModalProps {
  isOpen: boolean;
  onClose: () => void;
  traceData: {
    complaint: any;
    student: any;
  } | null;
  currentAdmin: any;
}

export default function TraceModal({ isOpen, onClose, traceData, currentAdmin }: TraceModalProps) {
  if (!traceData) return null;

  const { complaint, student } = traceData;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Complaint Trace Results</DialogTitle>
        </DialogHeader>
        
        {/* Traced User Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <i className="fas fa-exclamation-triangle text-yellow-500 text-lg mt-1"></i>
            <div>
              <h4 className="font-medium text-yellow-800">Traced User Information</h4>
              <div className="mt-2 text-sm text-yellow-700 space-y-1">
                <p><strong>Student ID:</strong> <span data-testid="text-student-id">{student?.registrationNumber}</span></p>
                <p><strong>Email:</strong> <span data-testid="text-student-email">{student?.email}</span></p>
                <p><strong>Flag Count:</strong> <span data-testid="text-flag-count">{student?.flagCount || 0}</span></p>
                <p><strong>Status:</strong> 
                  <Badge variant={student?.isSuspended ? "destructive" : "default"} className="ml-2">
                    {student?.isSuspended ? "Suspended" : "Active"}
                  </Badge>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Complaint Details */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Complaint Details</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-1" data-testid="text-complaint-title">{complaint?.title}</h5>
            <p className="text-sm text-gray-600 mb-2" data-testid="text-complaint-description">
              {complaint?.description}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Category: <span data-testid="text-complaint-category">{complaint?.category}</span></span>
              <span>Submitted: <span data-testid="text-complaint-date">{new Date(complaint?.created_at).toLocaleDateString()}</span></span>
              <span>Anonymous: <span data-testid="text-complaint-anonymous">{complaint?.isAnonymous ? "Yes" : "No"}</span></span>
            </div>
          </div>
        </div>
        
        {/* Audit Log */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Audit Log</h4>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
            <p className="text-red-800 font-medium">⚠ Trace Action Logged</p>
            <p className="text-red-700 mt-1">
              Admin <strong data-testid="text-admin-name">{currentAdmin?.registrationNumber}</strong> traced complaint #{complaint?.id} 
              on <span data-testid="text-trace-date">{new Date().toLocaleString()}</span>
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            type="button" 
            variant="outline"
            onClick={onClose}
            className="flex-1"
            data-testid="button-close-trace"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
