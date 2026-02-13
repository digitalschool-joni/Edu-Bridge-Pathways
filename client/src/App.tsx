import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useStore } from "@/lib/store";

import Onboarding from "@/pages/onboarding";
import Diagnostic from "@/pages/diagnostic";
import Dashboard from "@/pages/dashboard";
import MoodTracker from "@/pages/mood";
import Universities from "@/pages/universities";
import Career from "@/pages/career";
import Alumni from "@/pages/alumni";
import FinalSurvey from "@/pages/final-survey";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const userProfile = useStore(state => state.userProfile);

  // Simple client-side protection: if no name, go to onboarding
  if (!userProfile?.name) {
    return <Redirect to="/onboarding" />;
  }
  
  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/dashboard" />} />
      
      <Route path="/onboarding" component={Onboarding} />
      
      {/* Protected Routes */}
      <Route path="/diagnostic">
        {() => <ProtectedRoute component={Diagnostic} />}
      </Route>
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/mood">
        {() => <ProtectedRoute component={MoodTracker} />}
      </Route>
      <Route path="/universities">
        {() => <ProtectedRoute component={Universities} />}
      </Route>
      <Route path="/career">
        {() => <ProtectedRoute component={Career} />}
      </Route>
      <Route path="/alumni">
        {() => <ProtectedRoute component={Alumni} />}
      </Route>
      <Route path="/final-survey">
        {() => <ProtectedRoute component={FinalSurvey} />}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
