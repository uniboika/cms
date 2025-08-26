import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import TraceModal from "@/components/complaints/trace-modal";
import ResolveModal from "@/components/complaints/resolve-modal";

export default function SchoolAdminDashboard() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [traceData, setTraceData] = useState<any>(null);
  const [showTraceModal, setShowTraceModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveType, setResolveType] = useState<'resolve' | 'false'>('resolve');
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const { data: complaints = [], isLoading, error } = useQuery({
    queryKey: ['/api/admin/complaints'],
    enabled: !!user,
  });

  console.log('User:', user);
  console.log('Complaints:', complaints);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  const complaintsArray = Array.isArray(complaints) ? complaints : [];

  const traceMutation = useMutation({
    mutationFn: async (complaintId: number) => {
      const response = await apiRequest('POST', `/api/admin/complaints/${complaintId}/trace`, {});
      return response.json();
    },
    onSuccess: (data) => {
      setTraceData(data);
      setShowTraceModal(true);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to trace complaint",
        variant: "destructive",
      });
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async ({ id, resolutionNote }: { id: number, resolutionNote: string }) => {
      const response = await apiRequest('POST', `/api/admin/complaints/${id}/resolve`, {
        resolutionNote,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/complaints'] });
      setShowResolveModal(false);
      setSelectedComplaint(null);
      toast({
        title: "Success",
        description: "Complaint resolved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to resolve complaint",
        variant: "destructive",
      });
    },
  });

  const markFalseMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: number, reason: string }) => {
      const response = await apiRequest('POST', `/api/admin/complaints/${id}/mark-false`, {
        reason,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/complaints'] });
      setShowResolveModal(false);
      setSelectedComplaint(null);
      toast({
        title: "Success",
        description: "Complaint marked as false",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark complaint as false",
        variant: "destructive",
      });
    },
  });

  const handleTrace = (complaint: any) => {
    traceMutation.mutate(complaint.id);
  };

  const handleResolve = (complaint: any) => {
    setSelectedComplaint(complaint);
    setResolveType('resolve');
    setShowResolveModal(true);
  };

  const handleMarkFalse = (complaint: any) => {
    setSelectedComplaint(complaint);
    setResolveType('false');
    setShowResolveModal(true);
  };

  const handleResolveSubmit = (note: string) => {
    if (resolveType === 'resolve') {
      resolveMutation.mutate({ id: selectedComplaint.id, resolutionNote: note });
    } else {
      markFalseMutation.mutate({ id: selectedComplaint.id, reason: note });
    }
  };

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const filteredComplaints = complaintsArray.filter((complaint: any) => {
    if (statusFilter === 'all') return true;
    return complaint.status === statusFilter;
  });

  const stats = {
    total: complaintsArray.length,
    pending: complaintsArray.filter((c: any) => c.status === 'pending').length,
    resolved: complaintsArray.filter((c: any) => c.status === 'resolved').length,
    false: complaintsArray.filter((c: any) => c.status === 'false').length,
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900">School Admin Dashboard</h1>
              <Badge className="bg-blue-100 text-blue-800">
                <span data-testid="text-admin-category">{user.category}</span> Administrator
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Admin: <span data-testid="text-admin-name">{user.registrationNumber}</span>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center">
              <i className="fas fa-clipboard-list text-2xl text-blue-500 mr-3"></i>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="text-total-complaints">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center">
              <i className="fas fa-clock text-2xl text-yellow-500 mr-3"></i>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600" data-testid="text-pending-complaints">{stats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center">
              <i className="fas fa-check-circle text-2xl text-green-500 mr-3"></i>
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600" data-testid="text-resolved-complaints">{stats.resolved}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center">
              <i className="fas fa-flag text-2xl text-red-500 mr-3"></i>
              <div>
                <p className="text-sm font-medium text-gray-600">Flagged as False</p>
                <p className="text-2xl font-bold text-red-600" data-testid="text-false-complaints">{stats.false}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Complaints for My Category</h3>
            <div className="flex space-x-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32" data-testid="select-status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading complaints...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-red-500">
                      Error loading complaints: {error.message}
                    </td>
                  </tr>
                ) : filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No complaints found for {user?.category} category
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((complaint: any) => (
                    <tr key={complaint.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <h4 className="font-medium text-gray-900" data-testid={`text-complaint-title-${complaint.id}`}>
                            {complaint.title}
                          </h4>
                          <p className="text-sm text-gray-600" data-testid={`text-complaint-description-${complaint.id}`}>
                            {complaint.description.length > 100 
                              ? `${complaint.description.substring(0, 100)}...` 
                              : complaint.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <span className={complaint.isAnonymous ? "text-gray-500" : "font-medium"}>
                            {complaint.isAnonymous ? "Anonymous" : complaint.student?.registrationNumber}
                          </span>
                          <button 
                            onClick={() => handleTrace(complaint)}
                            disabled={traceMutation.isPending}
                            className="ml-2 text-blue-600 hover:text-blue-800 text-xs"
                            data-testid={`button-trace-${complaint.id}`}
                          >
                            <i className="fas fa-search"></i> Trace
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600" data-testid={`text-complaint-date-${complaint.id}`}>
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant={complaint.status === 'resolved' ? 'default' : complaint.status === 'false' ? 'destructive' : 'secondary'}
                          data-testid={`badge-status-${complaint.id}`}
                        >
                          {complaint.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        {complaint.status === 'pending' ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleResolve(complaint)}
                              className="bg-green-500 hover:bg-green-600 text-white"
                              data-testid={`button-resolve-${complaint.id}`}
                            >
                              Resolve
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleMarkFalse(complaint)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                              data-testid={`button-mark-false-${complaint.id}`}
                            >
                              Mark False
                            </Button>
                          </>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            {complaint.status === 'resolved' ? 'Resolved' : 'Marked as False'}
                            {complaint.resolvedAt && ` on ${new Date(complaint.resolvedAt).toLocaleDateString()}`}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TraceModal
        isOpen={showTraceModal}
        onClose={() => setShowTraceModal(false)}
        traceData={traceData}
        currentAdmin={user}
      />

      <ResolveModal
        isOpen={showResolveModal}
        onClose={() => setShowResolveModal(false)}
        onResolve={handleResolveSubmit}
        complaint={selectedComplaint}
        loading={resolveMutation.isPending || markFalseMutation.isPending}
        type={resolveType}
      />
    </div>
  );
}
