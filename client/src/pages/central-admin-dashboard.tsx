import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { authService } from "@/lib/auth";
import { useLocation } from "wouter";
import TraceModal from "@/components/complaints/trace-modal";

export default function CentralAdminDashboard() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [traceData, setTraceData] = useState<any>(null);
  const [showTraceModal, setShowTraceModal] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const user = authService.getUser();

  const { data: complaints = [], isLoading: complaintsLoading } = useQuery({
    queryKey: ['/api/central-admin/complaints'],
    enabled: !!user,
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/central-admin/users'],
    enabled: !!user,
  });

  const { data: auditLogs = [], isLoading: auditLoading } = useQuery({
    queryKey: ['/api/central-admin/audit-logs'],
    enabled: !!user,
  });

  const complaintsArray = Array.isArray(complaints) ? complaints : [];
  const usersArray = Array.isArray(users) ? users : [];
  const auditLogsArray = Array.isArray(auditLogs) ? auditLogs : [];

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

  const flagUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiRequest('POST', `/api/central-admin/users/${userId}/flag`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/central-admin/users'] });
      toast({
        title: "Success",
        description: "User flagged successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to flag user",
        variant: "destructive",
      });
    },
  });

  const unflagUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiRequest('POST', `/api/central-admin/users/${userId}/unflag`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/central-admin/users'] });
      toast({
        title: "Success",
        description: "User unflagged successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to unflag user",
        variant: "destructive",
      });
    },
  });

  const handleTrace = (complaint: any) => {
    traceMutation.mutate(complaint.id);
  };

  const handleFlagUser = (userId: number) => {
    flagUserMutation.mutate(userId);
  };

  const handleUnflagUser = (userId: number) => {
    unflagUserMutation.mutate(userId);
  };

  const handleLogout = () => {
    authService.clearAuth();
    setLocation('/');
  };

  const filteredComplaints = complaintsArray.filter((complaint: any) => {
    if (categoryFilter !== 'all' && complaint.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && complaint.status !== statusFilter) return false;
    return true;
  });

  const systemStats = {
    totalComplaints: complaintsArray.length,
    activeStudents: usersArray.filter((u: any) => !u.isSuspended).length,
    flaggedUsers: usersArray.filter((u: any) => u.flagCount > 0).length,
    suspendedUsers: usersArray.filter((u: any) => u.isSuspended).length,
    tracesToday: auditLogsArray.filter((log: any) => 
      log.action === 'trace_complaint' && 
      new Date(log.createdAt).toDateString() === new Date().toDateString()
    ).length,
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
              <h1 className="text-lg font-semibold text-gray-900">Central Admin Dashboard</h1>
              <Badge className="bg-purple-100 text-purple-800">
                System Administrator
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Admin: <span data-testid="text-central-admin-name">{user.registrationNumber}</span>
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
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="text-center">
              <i className="fas fa-clipboard-list text-2xl text-blue-500 mb-2"></i>
              <p className="text-sm font-medium text-gray-600">Total Complaints</p>
              <p className="text-2xl font-bold text-gray-900" data-testid="text-system-total-complaints">
                {systemStats.totalComplaints}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="text-center">
              <i className="fas fa-users text-2xl text-green-500 mb-2"></i>
              <p className="text-sm font-medium text-gray-600">Active Students</p>
              <p className="text-2xl font-bold text-gray-900" data-testid="text-active-students">
                {systemStats.activeStudents}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="text-center">
              <i className="fas fa-flag text-2xl text-red-500 mb-2"></i>
              <p className="text-sm font-medium text-gray-600">Flagged Users</p>
              <p className="text-2xl font-bold text-red-600" data-testid="text-flagged-users">
                {systemStats.flaggedUsers}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="text-center">
              <i className="fas fa-ban text-2xl text-gray-500 mb-2"></i>
              <p className="text-sm font-medium text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-gray-900" data-testid="text-suspended-users">
                {systemStats.suspendedUsers}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="text-center">
              <i className="fas fa-search text-2xl text-purple-500 mb-2"></i>
              <p className="text-sm font-medium text-gray-600">Traces Today</p>
              <p className="text-2xl font-bold text-gray-900" data-testid="text-traces-today">
                {systemStats.tracesToday}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="complaints" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="complaints" data-testid="tab-all-complaints">All Complaints</TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-user-management">User Management</TabsTrigger>
            <TabsTrigger value="audit" data-testid="tab-audit-logs">Audit Logs</TabsTrigger>
          </TabsList>

          {/* All Complaints Tab */}
          <TabsContent value="complaints">
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">All System Complaints</h3>
                <div className="flex space-x-3">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40" data-testid="select-category-filter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="academics">Academics</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="hostel">Hostel</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {complaintsLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading complaints...</td>
                      </tr>
                    ) : filteredComplaints.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No complaints found</td>
                      </tr>
                    ) : (
                      filteredComplaints.map((complaint: any) => (
                        <tr key={complaint.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-mono text-gray-900" data-testid={`text-complaint-id-${complaint.id}`}>
                            #{complaint.id}
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <h4 className="font-medium text-gray-900" data-testid={`text-complaint-title-${complaint.id}`}>
                                {complaint.title}
                              </h4>
                              <p className="text-sm text-gray-600 truncate max-w-xs" data-testid={`text-complaint-description-${complaint.id}`}>
                                {complaint.description.length > 60 
                                  ? `${complaint.description.substring(0, 60)}...` 
                                  : complaint.description}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge 
                              className={
                                complaint.category === 'academics' ? 'bg-blue-100 text-blue-800' :
                                complaint.category === 'hostel' ? 'bg-purple-100 text-purple-800' :
                                'bg-green-100 text-green-800'
                              }
                              data-testid={`badge-category-${complaint.id}`}
                            >
                              {complaint.category}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <span className={complaint.isAnonymous ? "text-gray-500" : "font-medium"}>
                                {complaint.isAnonymous ? "Anonymous" : complaint.student?.registrationNumber}
                              </span>
                              <button 
                                onClick={() => handleTrace(complaint)}
                                disabled={traceMutation.isPending}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                                data-testid={`button-trace-complaint-${complaint.id}`}
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
                              variant={
                                complaint.status === 'resolved' ? 'default' : 
                                complaint.status === 'false' ? 'destructive' : 
                                'secondary'
                              }
                              data-testid={`badge-complaint-status-${complaint.id}`}
                            >
                              {complaint.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button 
                              className="text-blue-600 hover:text-blue-800"
                              data-testid={`button-view-details-${complaint.id}`}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users">
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flag Count</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {usersLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading users...</td>
                      </tr>
                    ) : usersArray.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No users found</td>
                      </tr>
                    ) : (
                      usersArray.map((user: any) => (
                        <tr key={user.id} className={`hover:bg-gray-50 ${user.isSuspended ? 'bg-red-50' : ''}`}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900" data-testid={`text-user-reg-${user.id}`}>
                            {user.registrationNumber}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900" data-testid={`text-user-name-${user.id}`}>
                            {user.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600" data-testid={`text-user-email-${user.id}`}>
                            {user.email}
                          </td>
                          <td className="px-6 py-4">
                            <Badge 
                              variant={user.flagCount > 0 ? "destructive" : "default"}
                              data-testid={`badge-flag-count-${user.id}`}
                            >
                              {user.flagCount}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge 
                              variant={user.isSuspended ? "destructive" : "default"}
                              data-testid={`badge-user-status-${user.id}`}
                            >
                              {user.isSuspended ? "suspended" : "active"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm space-x-2">
                            {!user.isSuspended ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleFlagUser(user.id)}
                                  disabled={flagUserMutation.isPending}
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                  data-testid={`button-flag-user-${user.id}`}
                                >
                                  Flag
                                </Button>
                                {user.flagCount > 0 && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleUnflagUser(user.id)}
                                    disabled={unflagUserMutation.isPending}
                                    className="bg-blue-500 hover:bg-blue-600 text-white"
                                    data-testid={`button-unflag-user-${user.id}`}
                                  >
                                    Unflag
                                  </Button>
                                )}
                              </>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleUnflagUser(user.id)}
                                disabled={unflagUserMutation.isPending}
                                className="bg-green-500 hover:bg-green-600 text-white"
                                data-testid={`button-reactivate-user-${user.id}`}
                              >
                                Reactivate
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              data-testid={`button-view-user-details-${user.id}`}
                            >
                              Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit">
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Audit Logs</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {auditLoading ? (
                  <div className="px-6 py-8 text-center text-gray-500">Loading audit logs...</div>
                ) : auditLogsArray.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">No audit logs found</div>
                ) : (
                  auditLogsArray.map((log: any) => (
                    <div key={log.id} className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <i className="fas fa-history text-gray-400 mt-1"></i>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900" data-testid={`text-audit-action-${log.id}`}>
                              {log.action.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-500" data-testid={`text-audit-date-${log.id}`}>
                              {new Date(log.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600" data-testid={`text-audit-details-${log.id}`}>
                            Admin <strong>{log.admin?.registrationNumber}</strong> {log.details}
                          </p>
                          {log.complaintId && (
                            <p className="text-xs text-gray-500 mt-1">
                              Related to complaint #{log.complaintId}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <TraceModal
        isOpen={showTraceModal}
        onClose={() => setShowTraceModal(false)}
        traceData={traceData}
        currentAdmin={user}
      />
    </div>
  );
}
