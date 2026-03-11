import React, { useEffect, useState, useMemo } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaArrowRight,
  FaChartLine,
  FaWallet,
  FaMoneyBillWave,
  FaCoins,
  FaCreditCard,
  FaHistory,
  FaUserPlus,
  FaRupeeSign,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaLayerGroup,
} from "react-icons/fa";
import { MdDashboard, MdRefresh } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  getUserStats,
} from "../store/reducer/authReducer";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { getAllDeposits } from "../store/reducer/depositAdminSlice";
import {
  getAllWithdrawals,
  getWithdrawalStats,
  clearWithdrawalState,
} from "../store/reducer/withdrawalReducer";
import {
  getDepositStats,
} from "../store/reducer/depositSlice";

/* --------------------------------------------------------
   TOAST CONFIG — consistent with dark theme
-------------------------------------------------------- */
const showToast = (message, type = "success") => {
  const icons = {
    success: <FiCheckCircle className="text-emerald-400" size={20} />,
    error: <FiXCircle className="text-red-400" size={20} />,
    info: <FiAlertCircle className="text-blue-400" size={20} />,
  };

  try {
    toast[type](message, {
      id: message,
      icon: icons[type],
      style: {
        background: "#0F1115",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "16px",
        padding: "16px 20px",
        boxShadow: "0 20px 40px -10px black, 0 0 0 1px rgba(255,255,255,0.05), 0 0 30px rgba(255,255,255,0.1)",
        backdropFilter: "blur(12px)",
        fontSize: "14px",
        fontWeight: "500",
      },
      duration: 4000,
    });
  } catch (e) { }
};

const gradientCardClass =
  "relative bg-gradient-to-br from-[#0B0D10] via-[#15181E] to-[#070809] border border-white/10 rounded-3xl shadow-[0_30px_60px_-15px_black,0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:shadow-[0_35px_70px_-15px_black,0_0_30px_rgba(255,255,255,0.15)] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none";

const buttonGradientClass =
  "flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-[#2A2F37] to-[#0C0E12] rounded-xl text-white font-medium text-sm border border-white/10 shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(255,255,255,0.05)] hover:from-[#3A404A] hover:to-[#161A1F] hover:border-white/30 hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(255,255,255,0.2)] transition-all duration-300 disabled:opacity-40";

/* --------------------------------------------------------
   STAT CARD — Enhanced with gradient theme
-------------------------------------------------------- */
const StatCard = ({ title, count, icon: Icon, link, subtitle, trend, trendValue, color = "white" }) => {
  const getColorClasses = () => {
    switch (color) {
      case "emerald":
        return "from-emerald-500/20 to-emerald-900/30 border-emerald-500/30 text-emerald-400";
      case "blue":
        return "from-blue-500/20 to-blue-900/30 border-blue-500/30 text-blue-400";
      case "amber":
        return "from-amber-500/20 to-amber-900/30 border-amber-500/30 text-amber-400";
      case "red":
        return "from-red-500/20 to-red-900/30 border-red-500/30 text-red-400";
      case "purple":
        return "from-purple-500/20 to-purple-900/30 border-purple-500/30 text-purple-400";
      case "pink":
        return "from-pink-500/20 to-pink-900/30 border-pink-500/30 text-pink-400";
      default:
        return "from-white/20 to-white/5 border-white/30 text-white";
    }
  };

  return (
    <Link to={link || "#"} className="block h-full group">
      <div className={`${gradientCardClass} p-6 h-full`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10" />
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/40 text-sm font-medium uppercase tracking-wider">{title}</p>
              <h3 className="text-4xl lg:text-5xl font-bold text-white mt-2 drop-shadow-[0_2px_5px_black]">
                {typeof count === "number" ? count.toLocaleString() : count || "0"}
              </h3>
              {subtitle && (
                <p className="text-white/40 text-xs mt-1">{subtitle}</p>
              )}
            </div>
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getColorClasses()} flex items-center justify-center border shadow-[0_0_20px_rgba(255,255,255,0.1)]`}>
              <Icon className="text-2xl" />
            </div>
          </div>
          {trend && (
            <div className="mt-4 flex items-center gap-2">
              {trend === "up" ? (
                <FaArrowUp className="text-emerald-400 text-xs" />
              ) : trend === "down" ? (
                <FaArrowDown className="text-red-400 text-xs" />
              ) : null}
              <span className={trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-white/60"}>
                {trendValue}
              </span>
            </div>
          )}
          <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-white/40 group-hover:text-white/60 transition-colors">
            <span className="text-xs font-medium">View Details</span>
            <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300 text-sm" />
          </div>
        </div>
      </div>
    </Link>
  );
};

/* --------------------------------------------------------
   FINANCIAL STAT CARD — For financial metrics
-------------------------------------------------------- */
const FinancialStatCard = ({ title, amount, icon: Icon, link, trend, percentage, color = "amber" }) => {
  const getColorClasses = () => {
    switch (color) {
      case "emerald":
        return "from-emerald-500/20 to-emerald-900/30 border-emerald-500/30 text-emerald-400";
      case "blue":
        return "from-blue-500/20 to-blue-900/30 border-blue-500/30 text-blue-400";
      case "amber":
        return "from-amber-500/20 to-amber-900/30 border-amber-500/30 text-amber-400";
      case "red":
        return "from-red-500/20 to-red-900/30 border-red-500/30 text-red-400";
      case "purple":
        return "from-purple-500/20 to-purple-900/30 border-purple-500/30 text-purple-400";
      default:
        return "from-white/20 to-white/5 border-white/30 text-white";
    }
  };

  return (
    <Link to={link || "#"} className="block h-full group">
      <div className={`${gradientCardClass} p-6 h-full`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10" />
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/40 text-sm font-medium uppercase tracking-wider">{title}</p>
              <div className="flex items-baseline gap-1 mt-2">
                <FaRupeeSign className={`text-xl ${color === "amber" ? "text-amber-400" : "text-white"}`} />
                <h3 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-[0_2px_5px_black]">
                  {typeof amount === "number" ? amount.toLocaleString() : amount || "0"}
                </h3>
              </div>
            </div>
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getColorClasses()} flex items-center justify-center border shadow-[0_0_20px_rgba(255,255,255,0.1)]`}>
              <Icon className="text-2xl" />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-white/40 group-hover:text-white/60 transition-colors">
            <span className="text-xs font-medium">View Transactions</span>
            <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300 text-sm" />
          </div>
        </div>
      </div>
    </Link>
  );
};

/* --------------------------------------------------------
   RECENT ACTIVITY CARD
-------------------------------------------------------- */
const RecentActivityCard = ({ activities = [] }) => {
  return (
    <div className={`${gradientCardClass} p-6 h-full`}>
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-900/30 flex items-center justify-center border border-blue-500/30">
              <FaHistory className="text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          </div>
          <Link to="/transactions/history" className="text-blue-400/70 hover:text-blue-400 text-xs flex items-center gap-1">
            View All <FaArrowRight size={10} />
          </Link>
        </div>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity, index) => {
              const isDeposit = activity.type === "deposit";
              const isWithdrawal = activity.type === "withdrawal";
              return (
                <div
                  key={activity._id || index}
                  className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center
                        ${isDeposit
                          ? "bg-emerald-500/20 text-emerald-400"
                          : isWithdrawal
                            ? "bg-red-500/20 text-red-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                    >
                      {isDeposit ? (
                        <FaArrowDown size={14} />
                      ) : isWithdrawal ? (
                        <FaArrowUp size={14} />
                      ) : (
                        <FaUserPlus size={14} />
                      )}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{activity.description || "Activity"}</p>
                      <p className="text-white/40 text-xs">{activity.time || "Recently"}</p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-bold ${isDeposit
                      ? "text-emerald-400"
                      : isWithdrawal
                        ? "text-red-400"
                        : "text-blue-400"
                      }`}
                  >
                    {isDeposit && "+"}
                    {isWithdrawal && "-"}
                    ₹{Number(activity.amount || 0).toLocaleString()}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <FaHistory className="text-white/20 text-3xl mx-auto mb-2" />
              <p className="text-white/40 text-sm">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------
   QUICK ACTIONS CARD
-------------------------------------------------------- */
const QuickActionsCard = () => {
  const actions = [
    { title: "Total Users", link: "/users/active", icon: FaUsers, color: "blue" },
    { title: "Deposits", link: "/transactions/deposits", icon: FaMoneyBillWave, color: "emerald" },
    { title: "Withdrawals", link: "/transactions/withdrawals", icon: FaCreditCard, color: "red" },
    { title: "Bet History", link: "/admin/wrestling/bet-history", icon: FaHistory, color: "purple" },
  ];

  // Fix: Tailwind arbitrary value for color classes (can't use template literals for className!)
  const getActionColorClasses = (color) => {
    switch (color) {
      case "blue":
        return "from-blue-500/20 to-blue-900/30 border-blue-500/30 text-blue-400";
      case "emerald":
        return "from-emerald-500/20 to-emerald-900/30 border-emerald-500/30 text-emerald-400";
      case "red":
        return "from-red-500/20 to-red-900/30 border-red-500/30 text-red-400";
      case "purple":
        return "from-purple-500/20 to-purple-900/30 border-purple-500/30 text-purple-400";
      default:
        return "";
    }
  };

  return (
    <div className={`${gradientCardClass} p-6 h-full`}>
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-900/30 flex items-center justify-center border border-purple-500/30">
            <FaLayerGroup className="text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, idx) => (
            <Link
              key={idx}
              to={action.link}
              className="group p-4 bg-black/40 rounded-xl border border-white/5 hover:border-white/20 transition-all duration-300 hover:bg-black/60 text-center"
            >
              <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br ${getActionColorClasses(action.color)} flex items-center justify-center border`}>
                <action.icon className={getActionColorClasses(action.color).split(" ").find(cls => cls.startsWith("text-"))} size={18} />
              </div>
              <p className="text-white/80 text-xs group-hover:text-white transition-colors">{action.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------
   MAIN DASHBOARD COMPONENT
-------------------------------------------------------- */
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users = [], stats: authStats = {}, loading } = useSelector((state) => state.auth || {});
  const { withdrawals = [] } = useSelector((state) => state.withdrawal || {});
  const { deposits = [] } = useSelector((state) => state.adminDeposits || {});
  const { stats = {} } = useSelector((state) => state.deposits || {});
  const { stats: withdrawalStats = {} } = useSelector((state) => state.withdrawal || {});

  const { approved = {}, today = {} } = stats;

  const [timeFilter, setTimeFilter] = useState("today");
  const [refreshLoading, setRefreshLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getUserStats());
    dispatch(getAllDeposits());
    dispatch(getAllWithdrawals());
    dispatch(getDepositStats());
    dispatch(getWithdrawalStats());
  }, [dispatch]);

  // UseMemo user statistics block (Fixed: Using consolidated stats from backend and total user counts correctly)
  const userStats = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const isToday = (date) => {
      if (!date) return false;
      const d = new Date(date);
      return d >= todayStart && d <= todayEnd;
    };

    const userList = Array.isArray(users) ? users : [];

    // Stats from Redux (Backend Aggregated)
    const depositStats = stats || {}; // from getDepositStats

    const total = authStats.total || 0;
    const admins = authStats.admins || 0;
    const regularUsers = authStats.regular || 0;
    const activeToday = authStats.activeToday || 0;

    // Deposits (Use accurate backend stats)
    const totalApprovedAmount = (depositStats.approved?.totalAmount || 0);
    const todayDepositAmount = (depositStats.today?.totalAmount || 0);
    const approvedDepositsCount = (depositStats.approved?.totalCount || 0);
    const avgDeposit = approvedDepositsCount > 0 ? totalApprovedAmount / approvedDepositsCount : 0;

    // Withdrawals (Use accurate backend stats)
    const totalWithdrawals = (withdrawalStats.approved?.totalAmount || 0);
    const todayWithdrawalAmount = (withdrawalStats.today?.totalAmount || 0);
    const pendingWithdrawals = (withdrawalStats.pending?.totalAmount || 0);
    const approvedWithdrawalsCount = (withdrawalStats.approved?.totalCount || 0);
    const avgWithdrawal = approvedWithdrawalsCount > 0 ? totalWithdrawals / approvedWithdrawalsCount : 0;

    // Profit/Loss
    const totalProfit = totalApprovedAmount - totalWithdrawals;
    const totalLoss = totalWithdrawals > totalApprovedAmount ? totalWithdrawals - totalApprovedAmount : 0;
    const todayProfit = todayDepositAmount - todayWithdrawalAmount;
    const netRevenue = totalProfit;

    // Conversion Rate
    const conversionRate = total > 0 ? (approvedDepositsCount / total) * 100 : 0;

    // Recent Activities (Calculated from what's available in state, which is fine for "Recent")
    const depositList = Array.isArray(deposits) ? deposits : [];
    const withdrawalList = Array.isArray(withdrawals) ? withdrawals : [];

    const recentDeposits = depositList.slice(0, 5).filter(d => d.status === "approved").map((d) => ({
      _id: d._id,
      type: "deposit",
      amount: d.amount,
      description: "Deposit Approved",
      time: new Date(d.createdAt).toLocaleString(),
      timeRaw: d.createdAt,
    }));
    const recentWithdrawals = withdrawalList.slice(0, 5).filter(w => w.status === "approved").map((w) => ({
      _id: w._id,
      type: "withdrawal",
      amount: w.amount,
      description: "Withdrawal Approved",
      time: new Date(w.createdAt).toLocaleString(),
      timeRaw: w.createdAt,
    }));

    const recentActivities = [...recentDeposits, ...recentWithdrawals]
      .sort((a, b) => new Date(b.timeRaw) - new Date(a.timeRaw))
      .slice(0, 5);

    return {
      total,
      admins,
      regularUsers,
      activeToday,
      totalApprovedAmount,
      totalWithdrawals,
      totalProfit,
      totalLoss,
      netRevenue,
      todayDepositAmount,
      todayWithdrawalAmount,
      todayProfit,
      avgDeposit,
      avgWithdrawal,
      conversionRate,
      pendingWithdrawals,
      approvedDepositsCount,
      approvedWithdrawalsCount,
      recentActivities,
    };
  }, [authStats, deposits, withdrawals, stats, withdrawalStats]);

  const handleRefresh = async () => {
    setRefreshLoading(true);
    await Promise.all([
      dispatch(getAllUsers()),
      dispatch(getUserStats()),
      dispatch(getAllDeposits()),
      dispatch(getAllWithdrawals()),
      dispatch(getDepositStats()),
      dispatch(getWithdrawalStats()),
    ]);
    showToast("Dashboard refreshed", "success");
    setRefreshLoading(false);
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-[80vh] bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-white/10 border-t-white/30 rounded-full animate-ping" />
            </div>
          </div>
          <p className="text-white/50 text-sm mt-6">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Fix: optional chaining and safe fallback with || 0 for possible undefined
  const getAmount = (num) => (typeof num === "number" ? num : 0);

  return (
    <div className=" bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405] ">
      {/* Header Section */}
      <div className={`${gradientCardClass} p-5 md:p-6 mb-6`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-900/30 flex items-center justify-center border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <MdDashboard size={30} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_5px_black]">Admin Dashboard</h1>
              <p className="text-white/40 text-sm mt-0.5 flex items-center gap-2">
                <span>{userStats.total} total users</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span>{userStats.admins} admins</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span>₹{userStats.netRevenue?.toLocaleString()} net revenue</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshLoading}
              className={buttonGradientClass}
            >
              <MdRefresh className={`${refreshLoading ? "animate-spin" : ""}`} size={18} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>
      {/* User Statistics Section */}
      <section className="mb-8">
        <div className="flex items-center  gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-900/30 flex items-center justify-center border border-blue-500/30">
            <FaUsers className="text-blue-400" size={16} />
          </div>
          <h2 className="text-xl font-semibold text-white">User Overview</h2>
          <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Live Statistics
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Users"
            count={userStats.total}
            icon={FaUsers}
            link="/users/active"
            trend="up"
            trendValue="+12%"
            color="white"
          />
          <StatCard
            title="Admin Users"
            count={userStats.admins}
            icon={FaUserCheck}
            link="/users/active?filter=admin"
            color="purple"
          />
          <StatCard
            title="Regular Users"
            count={userStats.regularUsers}
            icon={FaUsers}
            link="/users/active?filter=regular"
            color="pink"
          />
        </div>
      </section>
      {/* Financial Statistics Section */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-900/30 flex items-center justify-center border border-amber-500/30">
            <FaCoins className="text-amber-400" size={16} />
          </div>
          <h2 className="text-xl font-semibold text-white">Financial Overview</h2>
          <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            {timeFilter === "today"
              ? "Today's"
              : timeFilter === "week"
                ? "This Week's"
                : "This Month's"} Stats
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
          <FinancialStatCard
            title="Total Deposits"
            amount={getAmount(userStats.totalApprovedAmount)}
            icon={FaMoneyBillWave}
            link="/deposit"
            color="emerald"
          />
          <FinancialStatCard
            title="Total Withdrawals"
            amount={getAmount(userStats.totalWithdrawals)}
            icon={FaCreditCard}
            link="/withdrawals"
            color="red"
          />
          <FinancialStatCard
            title="Total Profit"
            amount={getAmount(userStats.totalProfit)}
            icon={FaArrowUp}
            color="amber"
          />
          <FinancialStatCard
            title="Total Loss"
            amount={getAmount(userStats.totalLoss)}
            icon={FaArrowDown}
            color="red"
          />
          <FinancialStatCard
            title="Today Deposits"
            amount={getAmount(userStats.todayDepositAmount)}
            icon={FaMoneyBillWave}
            color="emerald"
          />
          <FinancialStatCard
            title="Today Withdrawals"
            amount={getAmount(userStats.todayWithdrawalAmount)}
            icon={FaCreditCard}
            color="red"
          />
          <FinancialStatCard
            title="Today Profit"
            amount={getAmount(userStats.todayProfit)}
            icon={FaChartLine}
            color="amber"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Net Revenue Card */}
          <div className={`${gradientCardClass} p-6 bg-gradient-to-br from-purple-500/10 to-purple-900/20 border-purple-500/30`}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-900/30 flex items-center justify-center border border-purple-500/30">
                    <FaChartLine className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider">Net Revenue</p>
                    <div className="flex items-baseline gap-1">
                      <FaRupeeSign className="text-purple-400 text-xl" />
                      <h3 className="text-3xl font-bold text-white">
                        {userStats.netRevenue?.toLocaleString()}
                      </h3>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-purple-500/20 rounded-lg text-purple-300 text-xs font-medium border border-purple-500/30">
                  +12% vs last month
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/10">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-white/40 text-xs">Pending Withdrawals</span>
                    <div className="flex items-baseline gap-1">
                      <FaRupeeSign className="text-amber-400 text-sm" />
                      <span className="text-amber-400 font-bold text-xl">
                        {userStats.pendingWithdrawals?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/transactions/withdrawals/pending"
                    className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg text-amber-300 text-xs font-medium border border-amber-500/30 transition-all duration-300"
                  >
                    Review
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* Quick Stats Card */}
          <div className={`${gradientCardClass} p-6`}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Avg Deposit */}
                <div className="p-4 bg-black/40 rounded-xl border border-white/10">
                  <p className="text-white/40 text-xs mb-1">Avg. Deposit</p>
                  <div className="flex items-baseline gap-1">
                    <FaRupeeSign className="text-emerald-400 text-sm" />
                    <span className="text-emerald-400 font-bold text-xl">
                      {Math.round(userStats.avgDeposit || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                {/* Avg Withdrawal */}
                <div className="p-4 bg-black/40 rounded-xl border border-white/10">
                  <p className="text-white/40 text-xs mb-1">Avg. Withdrawal</p>
                  <div className="flex items-baseline gap-1">
                    <FaRupeeSign className="text-red-400 text-sm" />
                    <span className="text-red-400 font-bold text-xl">
                      {Math.round(userStats.avgWithdrawal || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                {/* Conversion Rate */}
                <div className="p-4 bg-black/40 rounded-xl border border-white/10">
                  <p className="text-white/40 text-xs mb-1">Conversion Rate</p>
                  <span className="text-blue-400 font-bold text-xl">
                    {(userStats.conversionRate || 0).toFixed(1)}%
                  </span>
                </div>
                {/* Active Today */}
                <div className="p-4 bg-black/40 rounded-xl border border-white/10">
                  <p className="text-white/40 text-xs mb-1">Active Today</p>
                  <span className="text-purple-400 font-bold text-xl">
                    {userStats.activeToday || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* User Details Section - Total Profit/Loss, Withdrawals, Deposits */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 flex items-center justify-center border border-emerald-500/30">
            <FaWallet className="text-emerald-400" size={16} />
          </div>
          <h2 className="text-xl font-semibold text-white">User Financial Details</h2>
          <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Click to view full details
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link to="/users/profit" className="group">
            <div className={`${gradientCardClass} p-6 h-full hover:border-emerald-500/30`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 flex items-center justify-center border border-emerald-500/30">
                    <FaArrowUp className="text-emerald-400 text-xl" />
                  </div>
                  <FaEye className="text-white/20 group-hover:text-white/40 transition-colors" size={18} />
                </div>
                <p className="text-white/40 text-sm mb-1">User Total Profit</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <FaRupeeSign className="text-emerald-400 text-xl" />
                  <h3 className="text-3xl font-bold text-white">
                    {userStats.totalProfit?.toLocaleString()}
                  </h3>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-white/40 text-xs group-hover:text-white/60 transition-colors">
                    View Top Earners
                  </span>
                  <FaArrowRight className="text-white/40 group-hover:text-white/60 group-hover:translate-x-2 transition-all" size={14} />
                </div>
              </div>
            </div>
          </Link>
          <Link to="/users/loss" className="group">
            <div className={`${gradientCardClass} p-6 h-full hover:border-red-500/30`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-red-900/30 flex items-center justify-center border border-red-500/30">
                    <FaArrowDown className="text-red-400 text-xl" />
                  </div>
                  <FaEye className="text-white/20 group-hover:text-white/40 transition-colors" size={18} />
                </div>
                <p className="text-white/40 text-sm mb-1">User Total Loss</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <FaRupeeSign className="text-red-400 text-xl" />
                  <h3 className="text-3xl font-bold text-white">
                    {userStats.totalLoss?.toLocaleString()}
                  </h3>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-white/40 text-xs group-hover:text-white/60 transition-colors">
                    View Top Losers
                  </span>
                  <FaArrowRight className="text-white/40 group-hover:text-white/60 group-hover:translate-x-2 transition-all" size={14} />
                </div>
              </div>
            </div>
          </Link>
          <Link to="/transactions/deposits" className="group">
            <div className={`${gradientCardClass} p-6 h-full hover:border-blue-500/30`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-900/30 flex items-center justify-center border border-blue-500/30">
                    <FaMoneyBillWave className="text-blue-400 text-xl" />
                  </div>
                  <FaEye className="text-white/20 group-hover:text-white/40 transition-colors" size={18} />
                </div>
                <p className="text-white/40 text-sm mb-1">User Deposits</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <FaRupeeSign className="text-blue-400 text-xl" />
                  <h3 className="text-3xl font-bold text-white">
                    {userStats.totalApprovedAmount?.toLocaleString()}
                  </h3>
                </div>
                <div className="text-xs text-white/40">{userStats.approvedDepositsCount} transactions</div>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-white/40 text-xs group-hover:text-white/60 transition-colors">
                    View All Deposits
                  </span>
                  <FaArrowRight className="text-white/40 group-hover:text-white/60 group-hover:translate-x-2 transition-all" size={14} />
                </div>
              </div>
            </div>
          </Link>
          <Link to="/transactions/withdrawals" className="group">
            <div className={`${gradientCardClass} p-6 h-full hover:border-purple-500/30`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-900/30 flex items-center justify-center border border-purple-500/30">
                    <FaCreditCard className="text-purple-400 text-xl" />
                  </div>
                  <FaEye className="text-white/20 group-hover:text-white/40 transition-colors" size={18} />
                </div>
                <p className="text-white/40 text-sm mb-1">User Withdrawals</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <FaRupeeSign className="text-purple-400 text-xl" />
                  <h3 className="text-3xl font-bold text-white">
                    {userStats.totalWithdrawals?.toLocaleString()}
                  </h3>
                </div>
                <div className="text-xs text-white/40">{userStats.approvedWithdrawalsCount} transactions</div>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-white/40 text-xs group-hover:text-white/60 transition-colors">
                    View All Withdrawals
                  </span>
                  <FaArrowRight className="text-white/40 group-hover:text-white/60 group-hover:translate-x-2 transition-all" size={14} />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivityCard activities={userStats?.recentActivities || []} />
        </div>
        {/* Quick Actions */}
        <div>
          <QuickActionsCard />
        </div>
      </section>
      {/* Global Animations */}
      <style jsx global>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;