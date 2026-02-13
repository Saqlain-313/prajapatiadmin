import React, { useEffect, useState, useMemo } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaEnvelope,
  FaArrowRight,
  FaChartLine,
  FaWallet,
  FaMoneyBillWave,
  FaCoins,
  FaCreditCard,
  FaExchangeAlt,
  FaHistory,
  FaUserPlus,
  FaUserClock,
  FaUserAltSlash,
  FaRupeeSign,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaFilter,
  FaDownload,
  FaEye,
  FaLayerGroup,
} from "react-icons/fa";
import { MdDashboard, MdPerson, MdEmail, MdPhone, MdVerified, MdRefresh } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../store/reducer/authReducer";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";

/* --------------------------------------------------------
   TOAST CONFIG — consistent with dark theme
-------------------------------------------------------- */
const showToast = (message, type = "success") => {
  const icons = {
    success: <FiCheckCircle className="text-emerald-400" size={20} />,
    error: <FiXCircle className="text-red-400" size={20} />,
    info: <FiAlertCircle className="text-blue-400" size={20} />,
  };

  toast[type](message, {
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
};

/* --------------------------------------------------------
   DARK GRADIENT THEME — consistent with all pages
-------------------------------------------------------- */
const gradientCardClass =
  "relative bg-gradient-to-br from-[#0B0D10] via-[#15181E] to-[#070809] \
   border border-white/10 rounded-3xl shadow-[0_30px_60px_-15px_black,0_0_0_1px_rgba(255,255,255,0.02)] \
   backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:shadow-[0_35px_70px_-15px_black,0_0_30px_rgba(255,255,255,0.15)] \
   before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none";

const buttonGradientClass =
  "flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-[#2A2F37] to-[#0C0E12] \
   rounded-xl text-white font-medium text-sm border border-white/10 \
   shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(255,255,255,0.05)] \
   hover:from-[#3A404A] hover:to-[#161A1F] hover:border-white/30 \
   hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(255,255,255,0.2)] \
   transition-all duration-300 disabled:opacity-40";

/* --------------------------------------------------------
   STAT CARD — Enhanced with gradient theme
-------------------------------------------------------- */
const StatCard = ({ title, count, icon: Icon, link, subtitle, trend, trendValue, color = "white" }) => {
  const getColorClasses = () => {
    switch(color) {
      case 'emerald':
        return 'from-emerald-500/20 to-emerald-900/30 border-emerald-500/30 text-emerald-400';
      case 'blue':
        return 'from-blue-500/20 to-blue-900/30 border-blue-500/30 text-blue-400';
      case 'amber':
        return 'from-amber-500/20 to-amber-900/30 border-amber-500/30 text-amber-400';
      case 'red':
        return 'from-red-500/20 to-red-900/30 border-red-500/30 text-red-400';
      case 'purple':
        return 'from-purple-500/20 to-purple-900/30 border-purple-500/30 text-purple-400';
      case 'pink':
        return 'from-pink-500/20 to-pink-900/30 border-pink-500/30 text-pink-400';
      default:
        return 'from-white/20 to-white/5 border-white/30 text-white';
    }
  };

  return (
    <Link to={link || "#"} className="block h-full group">
      <div className={`${gradientCardClass} p-6 h-full`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/40 text-sm font-medium uppercase tracking-wider">
                {title}
              </p>
              <h3 className="text-4xl lg:text-5xl font-bold text-white mt-2 drop-shadow-[0_2px_5px_black]">
                {count?.toLocaleString() || '0'}
              </h3>
              {subtitle && (
                <p className="text-white/40 text-xs mt-1">{subtitle}</p>
              )}
            </div>

            {/* Icon Box with Gradient */}
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getColorClasses()} 
                          flex items-center justify-center border shadow-[0_0_20px_rgba(255,255,255,0.1)]`}>
              <Icon className="text-2xl" />
            </div>
          </div>

          {/* Trend Indicator */}
          {trend && (
            <div className="mt-4 flex items-center gap-2">
              {trend === 'up' ? (
                <FaArrowUp className="text-emerald-400 text-xs" />
              ) : trend === 'down' ? (
                <FaArrowDown className="text-red-400 text-xs" />
              ) : null}
              <span className={trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-white/60'}>
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
    switch(color) {
      case 'emerald':
        return 'from-emerald-500/20 to-emerald-900/30 border-emerald-500/30 text-emerald-400';
      case 'blue':
        return 'from-blue-500/20 to-blue-900/30 border-blue-500/30 text-blue-400';
      case 'amber':
        return 'from-amber-500/20 to-amber-900/30 border-amber-500/30 text-amber-400';
      case 'red':
        return 'from-red-500/20 to-red-900/30 border-red-500/30 text-red-400';
      case 'purple':
        return 'from-purple-500/20 to-purple-900/30 border-purple-500/30 text-purple-400';
      default:
        return 'from-white/20 to-white/5 border-white/30 text-white';
    }
  };

  return (
    <Link to={link || "#"} className="block h-full group">
      <div className={`${gradientCardClass} p-6 h-full`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/40 text-sm font-medium uppercase tracking-wider">
                {title}
              </p>
              <div className="flex items-baseline gap-1 mt-2">
                <FaRupeeSign className={`text-xl ${color === 'amber' ? 'text-amber-400' : 'text-white'}`} />
                <h3 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-[0_2px_5px_black]">
                  {amount?.toLocaleString() || '0'}
                </h3>
              </div>
              {trend && (
                <p className={`text-xs mt-1 ${trend === 'positive' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {percentage}% from last month
                </p>
              )}
            </div>

            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getColorClasses()} 
                          flex items-center justify-center border shadow-[0_0_20px_rgba(255,255,255,0.1)]`}>
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
const RecentActivityCard = ({ activities }) => {
  return (
    <div className={`${gradientCardClass} p-6 h-full`}>
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-900/30 
                          flex items-center justify-center border border-blue-500/30">
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
            activities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                    ${activity.type === 'deposit' ? 'bg-emerald-500/20 text-emerald-400' : 
                      activity.type === 'withdrawal' ? 'bg-red-500/20 text-red-400' : 
                      'bg-blue-500/20 text-blue-400'}`}>
                    {activity.type === 'deposit' ? <FaArrowDown size={14} /> : 
                     activity.type === 'withdrawal' ? <FaArrowUp size={14} /> : 
                     <FaUserPlus size={14} />}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{activity.description}</p>
                    <p className="text-white/40 text-xs">{activity.time}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${activity.type === 'deposit' ? 'text-emerald-400' : 
                  activity.type === 'withdrawal' ? 'text-red-400' : 'text-blue-400'}`}>
                  {activity.type === 'deposit' ? '+' : 
                   activity.type === 'withdrawal' ? '-' : ''} 
                  ₹{activity.amount?.toLocaleString()}
                </span>
              </div>
            ))
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
    { title: 'Total Users', link: '/users/active', icon: FaUsers, color: 'blue' },
    { title: 'Deposits', link: '/transactions/deposits', icon: FaMoneyBillWave, color: 'emerald' },
    { title: 'Withdrawals', link: '/transactions/withdrawals', icon: FaCreditCard, color: 'red' },
    { title: 'Bet History', link: '/admin/wrestling/bet-history', icon: FaHistory, color: 'purple' },
  ];

  return (
    <div className={`${gradientCardClass} p-6 h-full`}>
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-900/30 
                        flex items-center justify-center border border-purple-500/30">
            <FaLayerGroup className="text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="group p-4 bg-black/40 rounded-xl border border-white/5 hover:border-white/20 
                       transition-all duration-300 hover:bg-black/60 text-center"
            >
              <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br from-${action.color}-500/20 to-${action.color}-900/30 
                            flex items-center justify-center border border-${action.color}-500/30`}>
                <action.icon className={`text-${action.color}-400`} size={18} />
              </div>
              <p className="text-white/80 text-xs group-hover:text-white transition-colors">
                {action.title}
              </p>
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
  const { users = [], loading } = useSelector((state) => state.auth);
  
  const [timeFilter, setTimeFilter] = useState('today');
  const [refreshLoading, setRefreshLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // User Statistics
  const userStats = useMemo(() => {
    const total = users.length;
    const completed = users.filter((u) => u.profile_complete).length;
    const notCompleted = users.filter((u) => !u.profile_complete).length;
    const verified = users.filter((u) => u.is_verified).length;
    const unverified = users.filter((u) => !u.is_verified).length;
    const admins = users.filter((u) => u.role === 'admin').length;
    const regularUsers = total - admins;
    
    // Mock financial data - replace with actual data from your store
    const totalDeposits = 1250000; // Example: ₹12,50,000
    const totalWithdrawals = 875000; // Example: ₹8,75,000
    const totalProfit = 375000; // Example: ₹3,75,000
    const totalLoss = 125000; // Example: ₹1,25,000
    const netRevenue = totalProfit - totalLoss;
    const pendingWithdrawals = 45000; // Example: ₹45,000
    
    // Recent activities - mock data
    const recentActivities = [
      { type: 'deposit', description: 'User #USR001 deposited', amount: 5000, time: '5 minutes ago' },
      { type: 'withdrawal', description: 'User #USR023 withdrew', amount: 2000, time: '15 minutes ago' },
      { type: 'user', description: 'New user registered', amount: 0, time: '25 minutes ago' },
      { type: 'deposit', description: 'User #USR045 deposited', amount: 10000, time: '1 hour ago' },
    ];

    return {
      total,
      completed,
      notCompleted,
      verified,
      unverified,
      admins,
      regularUsers,
      totalDeposits,
      totalWithdrawals,
      totalProfit,
      totalLoss,
      netRevenue,
      pendingWithdrawals,
      recentActivities
    };
  }, [users]);

  const handleRefresh = async () => {
    setRefreshLoading(true);
    await dispatch(getAllUsers());
    showToast("Dashboard refreshed", "success");
    setRefreshLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405] p-4 md:p-6 lg:p-8 flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405] p-4 md:p-6 lg:p-8">
      
      {/* Header Section */}
      <div className={`${gradientCardClass} p-5 md:p-6 mb-6`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-900/30 
                          flex items-center justify-center border border-blue-500/30
                          shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <MdDashboard size={30} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_5px_black]">
                Admin Dashboard
              </h1>
              <p className="text-white/40 text-sm mt-0.5 flex items-center gap-2">
                <span>{userStats.total} total users</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span>{userStats.admins} admins</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span>₹{userStats.netRevenue.toLocaleString()} net revenue</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-black/40 rounded-xl border border-white/10 p-1">
              <button
                onClick={() => setTimeFilter('today')}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300
                  ${timeFilter === 'today' 
                    ? 'bg-white/20 text-white border border-white/30' 
                    : 'text-white/60 hover:text-white/80'}`}
              >
                Today
              </button>
              <button
                onClick={() => setTimeFilter('week')}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300
                  ${timeFilter === 'week' 
                    ? 'bg-white/20 text-white border border-white/30' 
                    : 'text-white/60 hover:text-white/80'}`}
              >
                This Week
              </button>
              <button
                onClick={() => setTimeFilter('month')}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300
                  ${timeFilter === 'month' 
                    ? 'bg-white/20 text-white border border-white/30' 
                    : 'text-white/60 hover:text-white/80'}`}
              >
                This Month
              </button>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshLoading}
              className={buttonGradientClass}
            >
              <MdRefresh className={`${refreshLoading ? 'animate-spin' : ''}`} size={18} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Statistics Section */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-900/30 
                        flex items-center justify-center border border-blue-500/30">
            <FaUsers className="text-blue-400" size={16} />
          </div>
          <h2 className="text-xl font-semibold text-white">User Overview</h2>
          <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Live Statistics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-5">
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
            title="Profile Completed"
            count={userStats.completed}
            icon={FaUserCheck}
            link="/users/active?filter=completed"
            trend="up"
            trendValue="+8%"
            color="emerald"
          />
          <StatCard
            title="Profile Not Completed"
            count={userStats.notCompleted}
            icon={FaUserClock}
            link="/users/active?filter=pending"
            trend="down"
            trendValue="-5%"
            color="amber"
          />
          <StatCard
            title="Verified Users"
            count={userStats.verified}
            icon={MdVerified}
            link="/users/active?filter=verified"
            trend="up"
            trendValue="+15%"
            color="blue"
          />
          <StatCard
            title="Unverified Users"
            count={userStats.unverified}
            icon={FaUserAltSlash}
            link="/users/active?filter=unverified"
            trend="down"
            trendValue="-3%"
            color="red"
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
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-900/30 
                        flex items-center justify-center border border-amber-500/30">
            <FaCoins className="text-amber-400" size={16} />
          </div>
          <h2 className="text-xl font-semibold text-white">Financial Overview</h2>
          <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            {timeFilter === 'today' ? "Today's" : timeFilter === 'week' ? "This Week's" : "This Month's"} Stats
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
          <FinancialStatCard
            title="Total Deposits"
            amount={userStats.totalDeposits}
            icon={FaMoneyBillWave}
            link="/transactions/deposits"
            trend="positive"
            percentage="+18"
            color="emerald"
          />
          <FinancialStatCard
            title="Total Withdrawals"
            amount={userStats.totalWithdrawals}
            icon={FaCreditCard}
            link="/transactions/withdrawals"
            trend="negative"
            percentage="-7"
            color="red"
          />
          <FinancialStatCard
            title="Total Profit"
            amount={userStats.totalProfit}
            icon={FaArrowUp}
            link="/transactions/profit"
            trend="positive"
            percentage="+12"
            color="amber"
          />
          <FinancialStatCard
            title="Total Loss"
            amount={userStats.totalLoss}
            icon={FaArrowDown}
            link="/transactions/loss"
            trend="negative"
            percentage="-4"
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Net Revenue Card */}
          <div className={`${gradientCardClass} p-6 bg-gradient-to-br from-purple-500/10 to-purple-900/20 border-purple-500/30`}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-900/30 
                                flex items-center justify-center border border-purple-500/30">
                    <FaChartLine className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider">Net Revenue</p>
                    <div className="flex items-baseline gap-1">
                      <FaRupeeSign className="text-purple-400 text-xl" />
                      <h3 className="text-3xl font-bold text-white">
                        {userStats.netRevenue.toLocaleString()}
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
                        {userStats.pendingWithdrawals.toLocaleString()}
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
                <div className="p-4 bg-black/40 rounded-xl border border-white/10">
                  <p className="text-white/40 text-xs mb-1">Avg. Deposit</p>
                  <div className="flex items-baseline gap-1">
                    <FaRupeeSign className="text-emerald-400 text-sm" />
                    <span className="text-emerald-400 font-bold text-xl">3,250</span>
                  </div>
                </div>
                <div className="p-4 bg-black/40 rounded-xl border border-white/10">
                  <p className="text-white/40 text-xs mb-1">Avg. Withdrawal</p>
                  <div className="flex items-baseline gap-1">
                    <FaRupeeSign className="text-red-400 text-sm" />
                    <span className="text-red-400 font-bold text-xl">2,180</span>
                  </div>
                </div>
                <div className="p-4 bg-black/40 rounded-xl border border-white/10">
                  <p className="text-white/40 text-xs mb-1">Conversion Rate</p>
                  <span className="text-blue-400 font-bold text-xl">68%</span>
                </div>
                <div className="p-4 bg-black/40 rounded-xl border border-white/10">
                  <p className="text-white/40 text-xs mb-1">Active Today</p>
                  <span className="text-purple-400 font-bold text-xl">156</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Details Section - Total Profit/Loss, Withdrawals, Deposits */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 
                        flex items-center justify-center border border-emerald-500/30">
            <FaWallet className="text-emerald-400" size={16} />
          </div>
          <h2 className="text-xl font-semibold text-white">User Financial Details</h2>
          <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Click to view full details
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* User Total Profit Card */}
          <Link to="/users/profit" className="group">
            <div className={`${gradientCardClass} p-6 h-full hover:border-emerald-500/30`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 
                                flex items-center justify-center border border-emerald-500/30">
                    <FaArrowUp className="text-emerald-400 text-xl" />
                  </div>
                  <FaEye className="text-white/20 group-hover:text-white/40 transition-colors" size={18} />
                </div>
                
                <p className="text-white/40 text-sm mb-1">User Total Profit</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <FaRupeeSign className="text-emerald-400 text-xl" />
                  <h3 className="text-3xl font-bold text-white">3,75,000</h3>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 bg-emerald-500/20 rounded-lg text-emerald-300">+15.3%</span>
                  <span className="text-white/40">vs last month</span>
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

          {/* User Total Loss Card */}
          <Link to="/users/loss" className="group">
            <div className={`${gradientCardClass} p-6 h-full hover:border-red-500/30`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-red-900/30 
                                flex items-center justify-center border border-red-500/30">
                    <FaArrowDown className="text-red-400 text-xl" />
                  </div>
                  <FaEye className="text-white/20 group-hover:text-white/40 transition-colors" size={18} />
                </div>
                
                <p className="text-white/40 text-sm mb-1">User Total Loss</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <FaRupeeSign className="text-red-400 text-xl" />
                  <h3 className="text-3xl font-bold text-white">1,25,000</h3>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 bg-red-500/20 rounded-lg text-red-300">+8.7%</span>
                  <span className="text-white/40">vs last month</span>
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

          {/* User Deposits Card */}
          <Link to="/transactions/deposits" className="group">
            <div className={`${gradientCardClass} p-6 h-full hover:border-blue-500/30`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-900/30 
                                flex items-center justify-center border border-blue-500/30">
                    <FaMoneyBillWave className="text-blue-400 text-xl" />
                  </div>
                  <FaEye className="text-white/20 group-hover:text-white/40 transition-colors" size={18} />
                </div>
                
                <p className="text-white/40 text-sm mb-1">User Deposits</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <FaRupeeSign className="text-blue-400 text-xl" />
                  <h3 className="text-3xl font-bold text-white">12,50,000</h3>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 bg-blue-500/20 rounded-lg text-blue-300">Total</span>
                  <span className="text-white/40">476 transactions</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-white/40 text-xs group-hover:text-white/60 transition-colors">
                    View All Deposits
                  </span>
                  <FaArrowRight className="text-white/40 group-hover:text-white/60 group-hover:translate-x-2 transition-all" size={14} />
                </div>
              </div>
            </div>
          </Link>

          {/* User Withdrawals Card */}
          <Link to="/transactions/withdrawals" className="group">
            <div className={`${gradientCardClass} p-6 h-full hover:border-purple-500/30`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-900/30 
                                flex items-center justify-center border border-purple-500/30">
                    <FaCreditCard className="text-purple-400 text-xl" />
                  </div>
                  <FaEye className="text-white/20 group-hover:text-white/40 transition-colors" size={18} />
                </div>
                
                <p className="text-white/40 text-sm mb-1">User Withdrawals</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <FaRupeeSign className="text-purple-400 text-xl" />
                  <h3 className="text-3xl font-bold text-white">8,75,000</h3>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 bg-purple-500/20 rounded-lg text-purple-300">Total</span>
                  <span className="text-white/40">324 transactions</span>
                </div>
                
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

      {/* Recent Activity & Quick Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RecentActivityCard activities={userStats.recentActivities} />
        </div>
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