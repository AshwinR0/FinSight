import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import Expenses from "./pages/Expenses";
// import SignIn from "./components/SignIn";
import Lending from "./pages/Lending";
import BorrowerDetail from "./pages/BorrowerDetail";
import Settings from "./pages/Settings";
import Investments from "./pages/Investments";
import Insights from "./pages/Insights";
import NotFound from "./pages/NotFound";
import { useThemeStore } from "./store/useThemeStore";
import { LandingPage } from "./components/LandingPage";

const queryClient = new QueryClient();

const App = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* <Route path="/signin" element={<SignIn />} /> */}
            <Route
              path="/home"
              element={
                <Layout>
                  <Expenses />
                </Layout>
              }
            />
            <Route path="/expenses" element={<Navigate to="/home" replace />} />
            <Route
              path="/lending"
              element={
                <Layout>
                  <Lending />
                </Layout>
              }
            />
            <Route
              path="/lending/:id"
              element={
                <Layout>
                  <BorrowerDetail />
                </Layout>
              }
            />
            <Route
              path="/investments"
              element={
                <Layout>
                  <Investments />
                </Layout>
              }
            />
            <Route
              path="/insights"
              element={
                <Layout>
                  <Insights />
                </Layout>
              }
            />
            <Route
              path="/settings"
              element={
                <Layout>
                  <Settings />
                </Layout>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
