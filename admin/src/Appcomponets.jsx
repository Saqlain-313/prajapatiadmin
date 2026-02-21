import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.css";

import Sidebar from "./componets/Sidebar";
import Navbar from "./componets/Navbar";

import Login from "./componets/Login";
import Forget from "./componets/Forget";

import Dashboard from "./pages/Dashboard";
import ActiveUsers from "./pages/ActiveUsers";
import UserDetailsPage from "./pages/UserDetailsPage";

import PrivateRoute from "./store/PrivateRoute";

import AdminDeposit from "./pages/AdminDeposits";
import AdminWithdrawals from "./pages/AdminWithdrawals";

// Wrestling pages
import WrestlingMatches from "./pages/WrestlingMatches";
import WrestlingAdmin from "./pages/WrestlingAdmin";
import CreateWrestlingMatch from "./pages/CreateWrestlingMatch";

import AdminWrestlingBetHistoryPage from "./pages/AdminWrestlingBetHistoryPage";
import AdminWrestlingAllBetsPage from "./pages/AdminWrestlingAllBetsPage";
import AdminWrestlingPendingPage from "./pages/AdminWrestlingPendingPage";
import AdminWrestlingSettledPage from "./pages/AdminWrestlingSettledPage";
import ImagesPage from "./pages/ImagesPage";
import ReferralSettings from "./pages/ReferralSettings";
import Matchcontrol from "./pages/live/Matchcontrol";

// Admin Layout Component
const Layoutadmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-black">
          <div className="p-4 md:p-6">
            {/* Admin routes - all existing routes */}
            <Routes>
              <Route path="/" element={<Dashboard />} />

              {/* Users */}
              <Route path="/users/active" element={<ActiveUsers />} />
              <Route path="/user/:userId" element={<UserDetailsPage />} />

              {/* Deposit Routes */}
              <Route path="/deposit" element={<AdminDeposit />} />
              <Route path="/deposit/manual/success" element={<AdminDeposit />} />
              <Route path="/deposit/manual/pending" element={<AdminDeposit />} />
              <Route path="/deposit/manual/rejected" element={<AdminDeposit />} />
              <Route path="/deposit/online/success" element={<AdminDeposit />} />
              <Route path="/deposit/online/pending" element={<AdminDeposit />} />
              <Route path="/deposit/online/rejected" element={<AdminDeposit />} />

              {/* Withdrawal Routes */}
              <Route path="/withdrawals" element={<AdminWithdrawals />} />
              <Route path="/withdrawals/success" element={<AdminWithdrawals />} />
              <Route path="/withdrawals/pending" element={<AdminWithdrawals />} />
              <Route path="/withdrawals/rejected" element={<AdminWithdrawals />} />

              {/* Wrestling */}
              <Route path="/matches" element={<WrestlingMatches />} />
              <Route
                path="/admin/wrestling/:matchId"
                element={<WrestlingAdmin />}
              />
              <Route
                path="/admin/wrestling/create"
                element={<CreateWrestlingMatch />}
              />

              {/* Wrestling Bets */}
              <Route
                path="/admin/wrestling-bet-history"
                element={<AdminWrestlingBetHistoryPage />}
              />
              <Route
                path="/admin/wrestling-bets/all"
                element={<AdminWrestlingAllBetsPage />}
              />
              <Route
                path="/admin/wrestling-bets/pending"
                element={<AdminWrestlingPendingPage />}
              />
              <Route
                path="/admin/wrestling-bets/settled"
                element={<AdminWrestlingSettledPage />}
              />
              
              {/* Referral Settings */}
              <Route path="/admin/referral-settings" element={<ReferralSettings/>}/>

              {/* Banner Upload */}
              <Route path="/uploadbanner" element={<ImagesPage />} />

              {/* 404 - Redirect to dashboard for admin */}
              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

// Subadmin Layout Component - WITHOUT SIDEBAR AND NAVBAR
const Layoutsubadmin = () => {
  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Main content - Full width without sidebar and navbar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-black">
          <div className="p-4 md:p-6">
            <Routes>
              {/* Subadmin routes - only livematch */}
              <Route path="/livematch" element={<Matchcontrol />} />
              <Route path="*" element={<Navigate to="/livematch" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

// Main Layout Router Component
function LayoutRouter() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPerformed = useRef(false);

  // Get the actual user data (handle nested structure)
  const getUserData = () => {
    if (!user) return null;
    // Check if user has nested structure
    return user.user || user;
  };

  const actualUser = getUserData();
  const userRole = actualUser?.role;

  // Debug logging
  console.log("LayoutRouter - Auth State:", {
    isAuthenticated,
    user: user,
    actualUser: actualUser,
    userRole: userRole,
    currentPath: location.pathname
  });

  useEffect(() => {
    // Only redirect if authenticated with valid role and not already redirected
    if (isAuthenticated && actualUser && !redirectPerformed.current) {
      const currentPath = location.pathname;
      
      console.log("LayoutRouter - Redirect check:", {
        userRole,
        currentPath,
        shouldRedirect: userRole === "subadmin" && currentPath !== "/livematch" || 
                       userRole === "admin" && currentPath === "/livematch"
      });
      
      if (userRole === "subadmin") {
        // Subadmin should only access /livematch
        if (currentPath !== "/livematch") {
          console.log("Redirecting subadmin to /livematch");
          redirectPerformed.current = true;
          navigate("/livematch", { replace: true });
        }
      } else if (userRole === "admin") {
        // Admin should not access /livematch
        if (currentPath === "/livematch") {
          console.log("Admin tried to access livematch, redirecting to dashboard");
          redirectPerformed.current = true;
          navigate("/", { replace: true });
        }
        // Admin can access all other routes, no redirect needed
      }
    }
    
    // Reset redirect flag when user changes or becomes unauthenticated
    return () => {
      if (!isAuthenticated || !actualUser) {
        redirectPerformed.current = false;
      }
    };
  }, [isAuthenticated, actualUser, userRole, navigate, location.pathname]);

  // If not authenticated or no user data, let PrivateRoute handle it
  if (!isAuthenticated || !actualUser) {
    console.log("LayoutRouter - Not authenticated or no user data, returning null");
    return null;
  }

  console.log("LayoutRouter - Rendering layout for role:", userRole);

  // Render appropriate layout based on role
  if (userRole === "subadmin") {
    return <Layoutsubadmin />;
  }

  // Default to admin layout (for admin role)
  return <Layoutadmin />;
}

function App() {
  console.log("App - Rendering with routes");
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forget" element={<Forget />} />

      {/* Private Routes - Protected by PrivateRoute */}
      <Route element={<PrivateRoute />}>
        <Route path="/*" element={<LayoutRouter />} />
      </Route>
    </Routes>
  );
}

export default App;