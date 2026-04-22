import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import MembershipPage from "@/pages/MembershipPage";
import PublicationsPage from "@/pages/PublicationsPage";
import StorePage from "@/pages/StorePage";
import ContactPage from "@/pages/ContactPage";
import AdminPage from "@/pages/AdminPage";
import MemberLoginPage from "@/pages/MemberLoginPage";
import NewsPage from "@/pages/NewsPage";
import StrategicPlanPage from "@/pages/StrategicPlanPage";
import MemberDashboardPage from "@/pages/MemberDashboardPage";
import NotFound from "@/pages/NotFound";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, PublicRoute } from "@/components/ProtectedRoute";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "@/lib/supabaseSetup"; // Run diagnostics on app load

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppContent() {
  return (
    <>
      <Navbar />
      <main className="pt-[78px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/strategic-plan" element={<StrategicPlanPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/news" element={<NewsPage />} />
          
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/member-login" element={<MemberLoginPage />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/member-dashboard" element={<MemberDashboardPage />} />
          </Route>

          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/admin" element={<AdminPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;