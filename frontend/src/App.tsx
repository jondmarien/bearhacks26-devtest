import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import "@/index.css";

// Lazy-loaded components
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const ApplicationPage = lazy(() => import("@/pages/ApplicationPage"));
const RsvpPage = lazy(() => import("@/pages/RsvpPage"));
const AdminLoginPage = lazy(() => import("@/pages/AdminLoginPage"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const ErrorPage = lazy(() => import("@/pages/ErrorPage"));

import LoadingScreen from "@/components/layout/LoadingScreen";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingScreen message="Waking up the bears..." />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/app/apply" element={<ApplicationPage />} />
            <Route path="/app/rsvp" element={<RsvpPage />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
