import React, { useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.css";

import Sidebar from "./componets/Sidebar";
import Navbar from "./componets/Navbar";

import Login from "./componets/Login";
import Forget from "./componets/Forget";

import Dashboard from "./pages/Dashboard";
import ActiveUsers from "./pages/ActiveUsers";
import UserDetailsPage from "./pages/UserDetailsPage";

import AdminWithdrawals from "./pages/AdminWithdrawals";

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

import SuccessDeposit from "./pages/Deposit/Onlinepay/SuccessDeposit";
import RejectedDeposit from "./pages/Deposit/Onlinepay/RejectedDeposit";
import PendingDeposit from "./pages/Deposit/Onlinepay/PendingDeposit";

import Success from "./pages/Deposit/Manualpay/SuccessDeposit";
import Rejected from "./pages/Deposit/Manualpay/RejectedDeposit";
import Pending from "./pages/Deposit/Manualpay/PendingDeposit";

import AdminUpiSettings from "./pages/AdminUpiSettings";
import AdminGeneralSettings from "./pages/AdminGeneralSettings";
import AdminCreateNotification from "./pages/AdminCreateNotification";
import UserNotifications from "./pages/UserNotifications";

/* =========================
   🔐 Private Route
========================= */
function PrivateRoute({ allowedRole }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "admin") return <Navigate to="/dashboard" replace />;
    if (user.role === "subadmin") return <Navigate to="/livematch" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

/* =========================
   🟢 Admin Layout
========================= */
function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto bg-black">
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

/* =========================
   🔵 SubAdmin Layout
========================= */
function SubAdminLayout() {
  return (
    <div className="min-h-screen bg-black">
      <Matchcontrol />
    </div>
  );
}

/* =========================
   🚀 Main App Component
========================= */
function AppComponent() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ================= LOGIN ROUTE ================= */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            user?.role === "admin" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/livematch" replace />
            )
          ) : (
            <Login />
          )
        }
      />

      <Route path="/forget" element={<Forget />} />

      {/* ================= SUBADMIN ================= */}
      <Route element={<PrivateRoute allowedRole="subadmin" />}>
        <Route path="/livematch" element={<SubAdminLayout />} />
      </Route>

      {/* ================= ADMIN ================= */}
      <Route element={<PrivateRoute allowedRole="admin" />}>
        <Route element={<AdminLayout />}>

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/users/active" element={<ActiveUsers />} />
          <Route path="/user/:userId" element={<UserDetailsPage />} />

          <Route path="/withdrawals/*" element={<AdminWithdrawals />} />

          <Route path="/online/deposit" element={<SuccessDeposit />} />
          <Route path="/online/rejected" element={<RejectedDeposit />} />
          <Route path="/online/pending" element={<PendingDeposit />} />

          <Route path="/manual/success" element={<Success />} />
          <Route path="/manual/rejected" element={<Rejected />} />
          <Route path="/manual/pending" element={<Pending />} />

          <Route path="/matches" element={<WrestlingMatches />} />
          <Route path="/admin/wrestling/:matchId" element={<WrestlingAdmin />} />
          <Route path="/admin/wrestling/create" element={<CreateWrestlingMatch />} />

          <Route path="/admin/wrestling-bet-history" element={<AdminWrestlingBetHistoryPage />} />
          <Route path="/admin/wrestling-bets/all" element={<AdminWrestlingAllBetsPage />} />
          <Route path="/admin/wrestling-bets/pending" element={<AdminWrestlingPendingPage />} />
          <Route path="/admin/wrestling-bets/settled" element={<AdminWrestlingSettledPage />} />

          <Route path="/admin/upiUpdate" element={<AdminUpiSettings />} />
          <Route path="/admin/general-settings" element={<AdminGeneralSettings />} />
          <Route path="/admin/create-notification" element={<AdminCreateNotification />} />
          <Route path="/notifications" element={<UserNotifications />} />

          <Route path="/admin/referral-settings" element={<ReferralSettings />} />
          <Route path="/uploadbanner" element={<ImagesPage />} />

          <Route
            path="*"
            element={
              <div className="text-white p-8">
                <h1 className="text-2xl font-bold">
                  404 - Page Not Found
                </h1>
              </div>
            }
          />

        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}

export default AppComponent;