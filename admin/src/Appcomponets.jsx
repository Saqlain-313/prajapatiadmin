// import React, { useState } from "react";
// import { Routes, Route } from "react-router-dom";
// import "./App.css";

// import Sidebar from "./componets/Sidebar";
// import Navbar from "./componets/Navbar";

// import Login from "./componets/Login";
// import Forget from "./componets/Forget";

// import Dashboard from "./pages/Dashboard";
// import ActiveUsers from "./pages/ActiveUsers";
// import UserDetailsPage from "./pages/UserDetailsPage";

// import PrivateRoute from "./store/PrivateRoute";

// import AdminDeposit from "./pages/AdminDeposits";
// import AdminWithdrawals from "./pages/AdminWithdrawals";

// // Deposit Pages
// import DepositManualSuccess from "./pages/Deposit/Manualpay/SuccessDeposit";
// import DepositManualPending from "./pages/Deposit/Manualpay/PendingDeposit";
// import DepositManualRejected from "./pages/Deposit/Manualpay/RejectedDeposit";
// import DepositOnlineSuccess from "./pages/Deposit/Onlinepay/SuccessDeposit";
// import DepositOnlinePending from "./pages/Deposit/Onlinepay/PendingDeposit";
// import DepositOnlineRejected from "./pages/Deposit/Onlinepay/RejectedDeposit";

// // Withdrawal Pages
// import WithdrawalsSuccess from "./pages/Withdraw/SuccessWithdraw";
// import WithdrawalsPending from "./pages/Withdraw/PendingWithdraw";
// import WithdrawalsRejected from "./pages/Withdraw/RejectedWithdraw";

// import WrestlingMatches from "./pages/WrestlingMatches";
// import WrestlingAdmin from "./pages/WrestlingAdmin";
// import CreateWrestlingMatch from "./pages/CreateWrestlingMatch";

// import AdminWrestlingBetHistoryPage from "./pages/AdminWrestlingBetHistoryPage";
// import AdminWrestlingAllBetsPage from "./pages/AdminWrestlingAllBetsPage";
// import AdminWrestlingPendingPage from "./pages/AdminWrestlingPendingPage";
// import AdminWrestlingSettledPage from "./pages/AdminWrestlingSettledPage";
// import ImagesPage from "./pages/ImagesPage";
// import ReferralSettings from "./pages/ReferralSettings";

// function Layout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-black overflow-hidden">
      
//       {/* Sidebar */}
//       <Sidebar
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//       />

//       {/* Right Section */}
//       <div className="flex-1 flex flex-col overflow-hidden">
        
//         {/* Navbar */}
//         <Navbar
//           sidebarOpen={sidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//         />

//         {/* Main Content */}
//         <main className="flex-1 overflow-y-auto overflow-x-hidden bg-black">
//           <div className="p-4 md:p-6">
//             <Routes>
//               <Route element={<PrivateRoute />}>

//                 <Route index element={<Dashboard />} />

//                 <Route path="/users/active" element={<ActiveUsers />} />
//                 <Route path="/deposit" element={<AdminDeposit />} />
                
//                 {/* Deposit Manual Routes */}
//                 <Route path="/deposit/manual/success" element={<DepositManualSuccess />} />
//                 <Route path="/deposit/manual/pending" element={<DepositManualPending />} />
//                 <Route path="/deposit/manual/rejected" element={<DepositManualRejected />} />
                
//                 {/* Deposit Online Routes */}
//                 <Route path="/deposit/online/success" element={<DepositOnlineSuccess />} />
//                 <Route path="/deposit/online/pending" element={<DepositOnlinePending />} />
//                 <Route path="/deposit/online/rejected" element={<DepositOnlineRejected />} />

//                 <Route path="/withdrawals" element={<AdminWithdrawals />} />
                
//                 {/* Withdrawal Status Routes */}
//                 <Route path="/withdrawals/success" element={<WithdrawalsSuccess />} />
//                 <Route path="/withdrawals/pending" element={<WithdrawalsPending />} />
//                 <Route path="/withdrawals/rejected" element={<WithdrawalsRejected />} />

//                 {/* Wrestling */}
//                 <Route path="/matches" element={<WrestlingMatches />} />
//                 <Route
//                   path="/admin/wrestling/:matchId"
//                   element={<WrestlingAdmin />}
//                 />
//                 <Route
//                   path="/admin/wrestling/create"
//                   element={<CreateWrestlingMatch />}
//                 />

//                 {/* Wrestling Bets */}
//                 <Route
//                   path="/admin/wrestling-bet-history"
//                   element={<AdminWrestlingBetHistoryPage />}
//                 />
//                 <Route
//                   path="/admin/wrestling-bets/all"
//                   element={<AdminWrestlingAllBetsPage />}
//                 />
//                 <Route
//                   path="/admin/wrestling-bets/pending"
//                   element={<AdminWrestlingPendingPage />}
//                 />
//                 <Route
//                   path="/admin/wrestling-bets/settled"
//                   element={<AdminWrestlingSettledPage />}
//                 />
//                 <Route path="/admin/referral-settings" element={<ReferralSettings/>}/>

//                 <Route path="/uploadbanner" element={<ImagesPage />} />

//                 {/* 404 */}
//                 <Route
//                   path="*"
//                   element={
//                     <div className="p-8 text-white">
//                       <h1 className="text-2xl font-bold">
//                         404 - Page Not Found
//                       </h1>
//                     </div>
//                   }
//                 />
//               </Route>
//             </Routes>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// function AppComponent() {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/forget" element={<Forget />} />

//       {/* Private Layout */}
//       <Route path="/*" element={<Layout />} />
//     </Routes>
//   );
// }

// export default AppComponent;



import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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

// Single components that handle all deposit/withdrawal routes with filtering
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



// Super Admin Layout (with sidebar and navbar)
function SuperAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  // If not super admin, redirect to login
  if (user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Right Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Navbar */}
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-black">
          <div className="p-4 md:p-6">
            <Routes>
              <Route element={<PrivateRoute />}>

                {/* Dashboard */}
                <Route index element={<Dashboard />} />

                {/* Users */}
                <Route path="/users/active" element={<ActiveUsers />} />
                <Route path="/user/:userId" element={<UserDetailsPage />} />

                {/* Deposit Routes - All use the same AdminDeposit component */}
                <Route path="/deposit" element={<AdminDeposit />} />
                <Route path="/deposit/manual/success" element={<AdminDeposit />} />
                <Route path="/deposit/manual/pending" element={<AdminDeposit />} />
                <Route path="/deposit/manual/rejected" element={<AdminDeposit />} />
                <Route path="/deposit/online/success" element={<AdminDeposit />} />
                <Route path="/deposit/online/pending" element={<AdminDeposit />} />
                <Route path="/deposit/online/rejected" element={<AdminDeposit />} />

                {/* Withdrawal Routes - All use the same AdminWithdrawals component */}
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

                {/* 404 */}
                <Route
                  path="*"
                  element={
                    <div className="p-8 text-white">
                      <h1 className="text-2xl font-bold">
                        404 - Page Not Found
                      </h1>
                    </div>
                  }
                />
              </Route>
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

// Sub Admin Layout (no sidebar, no navbar - just the component)
function SubAdminLayout() {
  const { user } = useSelector((state) => state.auth);

  // If not subadmin, redirect to login
  if (user?.role !== "subadmin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-black">
      <Matchcontrol />
    </div>
  );
}

function AppComponent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forget" element={<Forget />} />

      {/* Subadmin Route - No sidebar, no navbar */}
      <Route path="/livematch" element={<PrivateRoute />}>
        <Route index element={<SubAdminLayout />} />
      </Route>

      {/* Super Admin Routes - With sidebar and navbar */}
      <Route path="/*" element={<SuperAdminLayout />} />
    </Routes>
  );
}

export default AppComponent;