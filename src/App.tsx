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
import NotFound from "@/pages/NotFound";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <main className="pt-[78px]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/publications" element={<PublicationsPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/member-login" element={<MemberLoginPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
