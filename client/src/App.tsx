import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import ResumeBuilder from "@/pages/resume-builder";
import PortfolioBuilder from "@/pages/portfolio-builder";
import PortfolioTemplates from "@/pages/portfolio-templates";
import PortfolioEditor from "@/pages/portfolio-editor";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import AuthCallback from "@/pages/auth-callback";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/home" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/resume-builder" component={ResumeBuilder} />
      <Route path="/resume-builder/:action" component={ResumeBuilder} />
      <Route path="/resume/:id" component={ResumeBuilder} />
      <Route path="/portfolio-builder" component={PortfolioBuilder} />
      <Route path="/portfolio-templates" component={PortfolioTemplates} />
      <Route path="/portfolio-editor/:templateId" component={PortfolioEditor} />
      <Route path="/login" component={Login} />
      <Route path="/auth/callback" component={AuthCallback} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </TooltipProvider>
  );
}

export default App;
