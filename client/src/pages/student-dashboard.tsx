import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { authService } from "@/lib/auth";
import { useLocation } from "wouter";
import AnonymousWarningModal from "@/components/complaints/anonymous-warning-modal";

export default function StudentDashboard() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showAnonymousWarning, setShowAnonymousWarning] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const user = authService.getUser();

  const { data: complaints = [], isLoading } = useQuery({
    queryKey: ['/api/complaints/my'],
    enabled: !!user,
  });

  const complaintsArray = Array.isArray(complaints) ? complaints : [];

  const createComplaintMutation = useMutation({
    mutationFn: async (complaintData: any) => {
      const response = await apiRequest('POST', '/api/complaints', complaintData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/complaints/my'] });
      toast({
        title: "Success",
        description: "Complaint submitted successfully",
      });
      setTitle('');
      setDescription('');
      setCategory('');
      setIsAnonymous(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit complaint",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with:', { title, description, category, isAnonymous });
    
    if (!title || !description || !category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (isAnonymous) {
      console.log('Showing anonymous warning modal');
      setShowAnonymousWarning(true);
    } else {
      console.log('Submitting complaint directly');
      submitComplaint();
    }
  };

  const submitComplaint = () => {
    console.log('submitComplaint called with data:', {
      title,
      description,
      category,
      isAnonymous,
    });
    
    createComplaintMutation.mutate({
      title,
      description,
      category,
      isAnonymous,
    });
  };

  const handleConfirmAnonymous = () => {
    setShowAnonymousWarning(false);
    submitComplaint();
  };

  const handleLogout = () => {
    authService.clearAuth();
    setLocation('/');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'resolved': return 'default';
      case 'false': return 'destructive';
      default: return 'secondary';
    }
  };

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'academics': return 'bg-blue-100 text-blue-800';
      case 'hostel': return 'bg-purple-100 text-purple-800';
      case 'general': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900">Student Dashboard</h1>
              <span className="text-sm text-gray-500">Welcome, Student</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Reg: <span data-testid="text-user-registration">{user.registrationNumber}</span>
              </span>
              <button 
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
                data-testid="button-logout"
              >
                <i className="fas fa-sign-out-alt mr-1"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create New Complaint Card */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-plus-circle text-primary-500 mr-2"></i>
                Submit New Complaint
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="complaint-title">Title</Label>
                  <Input
                    id="complaint-title"
                    type="text"
                    placeholder="Brief description of the issue"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    data-testid="input-complaint-title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="complaint-category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger data-testid="select-complaint-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academics">Academics</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="hostel">Hostel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="complaint-description">Description</Label>
                  <Textarea
                    id="complaint-description"
                    rows={4}
                    placeholder="Detailed description of your complaint"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    data-testid="textarea-complaint-description"
                  />
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <Checkbox
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={(checked) => {
                      console.log('Anonymous checkbox changed:', checked);
                      setIsAnonymous(checked as boolean);
                    }}
                    data-testid="checkbox-anonymous"
                    className="border-2"
                  />
                  <Label htmlFor="anonymous" className="text-sm text-gray-700 font-medium cursor-pointer">
                    Submit anonymously
                  </Label>
                  <i className="fas fa-info-circle text-yellow-600" title="Anonymous submissions can still be traced by administrators"></i>
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    disabled={createComplaintMutation.isPending || !title || !description || !category}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    data-testid="button-submit-complaint"
                  >
                    {createComplaintMutation.isPending ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane mr-2"></i>
                        Submit Complaint
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* My Complaints */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">My Complaints</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {isLoading ? (
                  <div className="px-6 py-8 text-center text-gray-500">Loading complaints...</div>
                ) : complaintsArray.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">No complaints submitted yet</div>
                ) : (
                  complaintsArray.map((complaint: any) => (
                    <div key={complaint.id} className={`px-6 py-4 ${complaint.status === 'resolved' ? 'bg-green-50' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900" data-testid={`text-complaint-title-${complaint.id}`}>
                              {complaint.title}
                            </h4>
                            <Badge className={getCategoryBadgeColor(complaint.category)}>
                              {complaint.category}
                            </Badge>
                            <Badge variant={getStatusBadgeVariant(complaint.status)}>
                              {complaint.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2" data-testid={`text-complaint-description-${complaint.id}`}>
                            {complaint.description}
                          </p>
                          {complaint.status === 'resolved' && complaint.resolutionNote && (
                            <div className="bg-green-100 border border-green-200 rounded-lg p-3 mb-2">
                              <p className="text-sm font-medium text-green-800">Resolution:</p>
                              <p className="text-sm text-green-700" data-testid={`text-resolution-${complaint.id}`}>
                                {complaint.resolutionNote}
                              </p>
                            </div>
                          )}
                          {complaint.status === 'false' && complaint.resolutionNote && (
                            <div className="bg-red-100 border border-red-200 rounded-lg p-3 mb-2">
                              <p className="text-sm font-medium text-red-800">Marked as False:</p>
                              <p className="text-sm text-red-700" data-testid={`text-false-reason-${complaint.id}`}>
                                {complaint.resolutionNote}
                              </p>
                            </div>
                          )}
                          <div className="flex items-center text-xs text-gray-500 space-x-4">
                            <span data-testid={`text-complaint-date-${complaint.id}`}>
                              {new Date(complaint.createdAt).toLocaleDateString()}
                            </span>
                            <span data-testid={`text-complaint-anonymous-${complaint.id}`}>
                              Anonymous: {complaint.isAnonymous ? 'Yes' : 'No'}
                            </span>
                            {complaint.resolvedAt && (
                              <span>Resolved: {new Date(complaint.resolvedAt).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Quick Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Complaints</span>
                  <span className="font-medium text-gray-900" data-testid="text-total-complaints">
                    {complaintsArray.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-medium text-yellow-600" data-testid="text-pending-complaints">
                    {complaintsArray.filter((c: any) => c.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Resolved</span>
                  <span className="font-medium text-green-600" data-testid="text-resolved-complaints">
                    {complaintsArray.filter((c: any) => c.status === 'resolved').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Flag Count</span>
                  <span className="font-medium text-red-600" data-testid="text-user-flag-count">
                    {user.flagCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h4 className="font-semibold text-blue-900 mb-3">
                <i className="fas fa-info-circle mr-2"></i>
                Guidelines
              </h4>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Be specific and detailed in your complaints</li>
                <li>• Choose the appropriate category</li>
                <li>• Anonymous reports can still be traced</li>
                <li>• False reports may result in account flags</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <AnonymousWarningModal
        isOpen={showAnonymousWarning}
        onClose={() => setShowAnonymousWarning(false)}
        onConfirm={handleConfirmAnonymous}
      />
    </div>
  );
}
