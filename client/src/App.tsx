import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import StudentDashboard from "@/pages/student-dashboard";
import SchoolAdminDashboard from "@/pages/school-admin-dashboard";
import CentralAdminDashboard from "@/pages/central-admin-dashboard";
import { authService } from "@/lib/auth";

function ProtectedRoute({ component: Component, allowedRoles }: { component: any, allowedRoles: string[] }) {
  const user = authService.getUser();
  
  if (!authService.isAuthenticated() || !user) {
    return <Redirect to="/" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Redirect to="/" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/student-dashboard">
        <ProtectedRoute component={StudentDashboard} allowedRoles={['student']} />
      </Route>
      <Route path="/school-admin-dashboard">
        <ProtectedRoute component={SchoolAdminDashboard} allowedRoles={['school_admin']} />
      </Route>
      <Route path="/central-admin-dashboard">
        <ProtectedRoute component={CentralAdminDashboard} allowedRoles={['central_admin']} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
