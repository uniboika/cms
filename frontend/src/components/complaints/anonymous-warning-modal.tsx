import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AnonymousWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AnonymousWarningModal({ isOpen, onClose, onConfirm }: AnonymousWarningModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <i className="fas fa-exclamation-triangle text-3xl text-yellow-500"></i>
          </div>
          <div className="flex-1">
            <DialogHeader>
              <DialogTitle>Anonymous Submission Warning</DialogTitle>
            </DialogHeader>
            <div className="text-sm text-gray-600 space-y-2 mt-2">
              {/* <p><strong>Important:</strong> While your complaint will appear anonymous to other users, administrators can still trace the report back to you if necessary.</p> */}
              <p>Submitting false or malicious reports may lead to account flags and potential suspension.</p>
              <p>Please ensure your complaint is genuine and accurate.</p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <Button 
            type="button" 
            variant="outline"
            onClick={onClose}
            className="flex-1"
            data-testid="button-cancel-anonymous"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={onConfirm}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600"
            data-testid="button-confirm-anonymous"
          >
            I Understand, Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
