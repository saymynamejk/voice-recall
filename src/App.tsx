import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FirebaseProvider } from "@/lib/firebase";
import { AppProvider } from "@/context/AppContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FirebaseSetup from "./pages/FirebaseSetup";
import ProjectDetail from "./pages/ProjectDetail";
import BucketView from "./pages/BucketView";
import DailyLog from "./pages/DailyLog";
import Settings from "./pages/Settings";
import AISettings from "./pages/AISettings";
import Search from "./pages/Search";
import NewProject from "./pages/NewProject";
import Auth from "./pages/Auth";
import Appearance from "./pages/Appearance";
import HelpFAQ from "./pages/HelpFAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FirebaseProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/setup/firebase" element={<FirebaseSetup />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/projects/new" element={<NewProject />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
              <Route path="/projects/:projectId/buckets/:bucketType" element={<BucketView />} />
              <Route path="/projects/:projectId/daily-log" element={<DailyLog />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/ai" element={<AISettings />} />
              <Route path="/settings/appearance" element={<Appearance />} />
              <Route path="/help" element={<HelpFAQ />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/search" element={<Search />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </FirebaseProvider>
  </QueryClientProvider>
);

export default App;
