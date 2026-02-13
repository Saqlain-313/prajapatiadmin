import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Sidebar from "./componets/Sidebar";
import Navbar from "./componets/Navbar";

import Login from "./componets/Login";
import Forget from "./componets/Forget";

import Dashboard from "./pages/Dashboard";
import ActiveUsers from "./pages/ActiveUsers";
import PrivateRoute from "./store/PrivateRoute";
import AdminDeposit from './pages/AdminDeposits'
import AdminWithdrawals from "./pages/AdminWithdrawals";
import WrestlingMatches from "./pages/WrestlingMatches";
import WrestlingAdmin from "./pages/WrestlingAdmin";
import CreateWrestlingMatch from "./pages/CreateWrestlingMatch";
import AdminWrestlingBetHistoryPage from "./pages/AdminWrestlingBetHistoryPage";
import AdminWrestlingAllBetsPage from "./pages/AdminWrestlingAllBetsPage";
import AdminWrestlingPendingPage from "./pages/AdminWrestlingPendingPage";
import AdminWrestlingSettledPage from "./pages/AdminWrestlingSettledPage";
function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route index element={<Dashboard />} />

              <Route
                path="/users/active"
                element={<ActiveUsers />}
              />
              <Route path="/deposit" element={<AdminDeposit />} />
              <Route path="/Withdrawals" element={<AdminWithdrawals />} />
              <Route
                path="/admin/wrestling/:matchId"
                element={
                  <WrestlingAdmin />
                }
              />
              <Route path="/matches" element={<WrestlingMatches />} />
              <Route path="/admin/wrestling/create" element={<CreateWrestlingMatch />} />
              <Route
                path="/admin/wrestling-bet-history"
                element={<AdminWrestlingBetHistoryPage />}
              />

              <Route path="/admin/wrestling-bets/all" element={<AdminWrestlingAllBetsPage />} />
              <Route path="/admin/wrestling-bets/pending" element={<AdminWrestlingPendingPage />} />
              <Route path="/admin/wrestling-bets/settled" element={<AdminWrestlingSettledPage />} />

              <Route
                path="*"
                element={
                  <div className="p-8">
                    <h1 className="text-2xl font-bold">
                      404 - Page Not Found
                    </h1>
                  </div>
                }
              />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}

function AppComponent() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forget" element={<Forget />} />

      {/* Private layout */}
      <Route path="/*" element={<Layout />} />
    </Routes>
  );
}

export default AppComponent;