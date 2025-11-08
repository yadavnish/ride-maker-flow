import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, LayoutDashboard, Home } from "lucide-react";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import WhatsAppChat from "./pages/WhatsAppChat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-xl">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Uber on WhatsApp
              </span>
            </Link>
            <div className="flex gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/chat" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Chat
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin" className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </Link>
              </Button>
            </div>
          </div>
        </nav>

        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/chat" element={<WhatsAppChat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
