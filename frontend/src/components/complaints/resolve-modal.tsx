import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ResolveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: (resolutionNote: string) => void;
  complaint: any;
  loading?: boolean;
  type: 'resolve' | 'false';
}

export default function ResolveModal({ 
  isOpen, 
  onClose, 
  onResolve, 
  complaint, 
  loading = false,
  type 
}: ResolveModalProps) {
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      onResolve(note);
      setNote('');
    }
  };

  const handleClose = () => {
    setNote('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {type === 'resolve' ? 'Resolve Complaint' : 'Mark as False Report'}
          </DialogTitle>
        </DialogHeader>
        
        {/* Complaint Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-1" data-testid="text-resolve-complaint-title">
            {complaint?.title}
          </h4>
          <p className="text-sm text-gray-600" data-testid="text-resolve-complaint-description">
            {complaint?.description}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="resolution-note">
              {type === 'resolve' ? 'Resolution Note' : 'Reason for marking as false'}
            </Label>
            <Textarea
              id="resolution-note"
              rows={4}
              placeholder={
                type === 'resolve' 
                  ? "Describe the actions taken to resolve this complaint..." 
                  : "Explain why this complaint is being marked as false..."
              }
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
              data-testid="textarea-resolution-note"
            />
          </div>
          
          <div className="flex space-x-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              data-testid="button-cancel-resolve"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !note.trim()}
              className={`flex-1 ${
                type === 'resolve' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
              data-testid="button-submit-resolve"
            >
              {loading 
                ? 'Processing...' 
                : type === 'resolve' 
                  ? 'Mark as Resolved' 
                  : 'Mark as False'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
