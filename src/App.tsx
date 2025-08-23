import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SupabaseProvider from "./lib/supabase-context";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Pathway from "./pages/Pathway";
import Quiz from "./pages/Quiz";
import Leaderboard from "./pages/Leaderboard";
import Chat from "./pages/Chat";
import ChatMessages from "./pages/ChatMessages";
import Profile from "./pages/Profile";
import Homework from "./pages/Homework";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import { useSupabase } from '@/lib/supabase-context'

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const supabase = useSupabase();
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthenticated(!!user);
      setLoading(false);
    });
  }, [supabase]);
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!authenticated) {
    window.location.replace("/login");
    return null;
  }
  return children;
}

const App = () => (
  <SupabaseProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/pathway" element={<Pathway />} />
                      <Route path="/homework" element={<Homework />} />
                      <Route path="/quiz" element={<Quiz />} />
                      <Route path="/leaderboard" element={<Leaderboard />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/chat/:roomId" element={<ChatMessages />} />
                      <Route path="/profile" element={<Profile />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>

        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </SupabaseProvider>
);

export default App;
