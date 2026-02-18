import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBetHistory } from "../store/reducer/wrestlingBetHistorySlice";
import {
  MdSportsKabaddi,
  MdPerson,
  MdPhone,
  MdAttachMoney,
  MdCheckCircle,
  MdCancel,
  MdClose,
  MdInfo,
  MdRefresh,
  MdExpandMore,
  MdExpandLess,
  MdAccessTime,
  MdEmojiEvents,
  MdShowChart,
  MdTrendingUp,
  MdTrendingDown,
} from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";

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
   DARK GRADIENT THEME — consistent with navbar/sidebar
-------------------------------------------------------- */
const gradientCardClass =
  "relative bg-gradient-to-br from-[#0B0D10] via-[#15181E] to-[#070809] \
   border border-white/10 rounded-3xl shadow-[0_30px_60px_-15px_black,0_0_0_1px_rgba(255,255,255,0.02)] \
   backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:shadow-[0_35px_70px_-15px_black,0_0_30px_rgba(255,255,255,0.15)] \
   before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none";

const buttonGradientClass =
  "flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-[#2A2F37] to-[#0C0E12] \
   rounded-xl text-white font-medium text-sm border border-white/10 \
   shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(255,255,255,0.05)] \
   hover:from-[#3A404A] hover:to-[#161A1F] hover:border-white/30 \
   hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(255,255,255,0.2)] \
   transition-all duration-300 disabled:opacity-40";

const inputStyleClasses =
  "w-full px-5 py-3 bg-black/50 border border-white/10 rounded-xl text-white text-sm \
   placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 \
   outline-none transition-all duration-300 backdrop-blur-md \
   shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] focus:shadow-[0_0_25px_rgba(255,255,255,0.1),inset_0_2px_8px_rgba(0,0,0,0.6)]";

/* --------------------------------------------------------
   RESULT BADGE COMPONENT
-------------------------------------------------------- */
const ResultBadge = ({ status }) => {
  if (status === 1) {
    return (
      <span className="px-3 py-1.5 bg-emerald-500/20 rounded-lg text-emerald-300 text-xs font-medium border border-emerald-500/30">
        WON
      </span>
    );
  }

  if (status === 2) {
    return (
      <span className="px-3 py-1.5 bg-red-500/20 rounded-lg text-red-300 text-xs font-medium border border-red-500/30">
        LOST
      </span>
    );
  }

  return (
    <span className="px-3 py-1.5 bg-yellow-500/20 rounded-lg text-yellow-300 text-xs font-medium border border-yellow-500/30">
      PENDING
    </span>
  );
};

/* --------------------------------------------------------
   STATUS BADGE COMPONENT
-------------------------------------------------------- */
const StatusBadge = ({ status }) => {
  return status === 0 ? (
    <span className="px-3 py-1.5 bg-yellow-500/20 rounded-lg text-yellow-300 text-xs font-medium border border-yellow-500/30">
      PENDING
    </span>
  ) : (
    <span className="px-3 py-1.5 bg-emerald-500/20 rounded-lg text-emerald-300 text-xs font-medium border border-emerald-500/30">
      SETTLED
    </span>
  );
};

/* --------------------------------------------------------
   BET TYPE BADGE COMPONENT
-------------------------------------------------------- */
const BetTypeBadge = ({ btype }) => {
  return btype === 'BACK' ? (
    <span className="px-3 py-1.5 bg-emerald-500/20 rounded-lg text-emerald-300 text-xs font-medium border border-emerald-500/30">
      BACK
    </span>
  ) : (
    <span className="px-3 py-1.5 bg-red-500/20 rounded-lg text-red-300 text-xs font-medium border border-red-500/30">
      LAY
    </span>
  );
};

/* --------------------------------------------------------
   MATCH CARD COMPONENT
-------------------------------------------------------- */
const MatchCard = ({ game, isOpen, onToggle }) => {
  // Admin Profit / Loss Calculation (Only Settled Bets)
  const adminSummary = game.bets.reduce(
    (acc, bet) => {
      if (bet.status === 0) return acc;

      if (bet.otype === "BACK") {
        if (bet.status === 1) {
          acc.loss += bet.profit || 0;
        } else if (bet.status === 2) {
          acc.profit += bet.betAmount || 0;
        }
      }

      if (bet.otype === "LAY") {
        if (bet.status === 1) {
          acc.profit += bet.liability || 0;
        } else if (bet.status === 2) {
          acc.loss += bet.profit || 0;
        }
      }

      return acc;
    },
    { profit: 0, loss: 0 }
  );

  const netAdmin = adminSummary.profit - adminSummary.loss;

  // Calculate total bets and stake
  const totalBets = game.bets.length;
  const settledBets = game.bets.filter(b => b.status !== 0).length;
  const totalStake = game.bets.reduce((sum, b) => sum + (b.betAmount || 0), 0);

  return (
    <div className={`${gradientCardClass} overflow-hidden mb-6`}>
      {/* Header - Clickable */}
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 border-b border-white/10 hover:bg-white/5 transition-all duration-300"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-900/30 
                          flex items-center justify-center border border-orange-500/30
                          shadow-[0_0_20px_rgba(255,165,0,0.1)]">
              <MdSportsKabaddi size={30} className="text-orange-400" />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-white drop-shadow-[0_2px_5px_black]">
                  Match #{game.mid}
                </h2>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 border border-white/20">
                  {totalBets} bets
                </span>
              </div>

              <p className="text-lg text-white/80 font-medium mb-3">
                {game.eventName}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="text-white/60 flex items-center gap-1">
                  <MdAttachMoney size={16} className="text-amber-400" />
                  Total Stake: ₹{totalStake.toLocaleString()}
                </span>
                <span className="text-white/60 flex items-center gap-1">
                  <MdCheckCircle size={16} className="text-emerald-400" />
                  Settled: {settledBets}/{totalBets}
                </span>
              </div>
            </div>
          </div>

          {/* Right Section - Admin Summary & Toggle */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-4 bg-black/40 px-5 py-3 rounded-2xl border border-white/10">
              <div className="text-right">
                <span className="text-white/40 text-xs">Admin Profit</span>
                <p className="text-emerald-400 font-bold text-lg">
                  ₹{adminSummary.profit.toLocaleString()}
                </p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-right">
                <span className="text-white/40 text-xs">Admin Loss</span>
                <p className="text-red-400 font-bold text-lg">
                  ₹{adminSummary.loss.toLocaleString()}
                </p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-right">
                <span className="text-white/40 text-xs">Net</span>
                <p className={`font-bold text-lg ${netAdmin >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                  ₹{netAdmin.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white/40">
              <span className="text-xs">{isOpen ? 'Hide details' : 'Show details'}</span>
              {isOpen ?
                <MdExpandLess size={24} className="text-white/60" /> :
                <MdExpandMore size={24} className="text-white/60" />
              }
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Table */}
      <div
        className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
      >
        <div className="p-6 bg-black/40">
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="bg-black/60 border-b border-white/10">
                  <th className="px-5 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Stake
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Profit
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Liability
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {game.bets.map((bet) => (
                  <tr key={bet._id} className="hover:bg-white/5 transition-all duration-200">

                    {/* USER */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 
                      flex items-center justify-center border border-white/20">
                          <span className="text-white font-bold text-sm">
                            {bet.userId?.mobile?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm">
                            {bet.userId?.mobile || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* MOBILE */}
                    <td className="px-5 py-4 text-white/80 text-sm font-mono">
                      {bet.userId?.mobile || "N/A"}
                    </td>

                    {/* TEAM */}
                    <td className="px-5 py-4">
                      <span className="px-3 py-1.5 bg-white/10 rounded-lg text-xs border border-white/20">
                        {bet.teamName}
                      </span>
                    </td>

                    {/* TYPE */}
                    <td className="px-5 py-4">
                      <BetTypeBadge btype={bet.otype} />
                    </td>

                    {/* RATE */}
                    <td className="px-5 py-4 text-white font-mono">
                      {bet.price?.toFixed(2)}
                    </td>

                    {/* STAKE */}
                    <td className="px-5 py-4 text-amber-400 font-bold">
                      ₹{bet.betAmount?.toLocaleString()}
                    </td>

                    {/* PROFIT */}
                    <td className="px-5 py-4 text-emerald-400 font-semibold">
                      ₹{bet.profit?.toLocaleString() || 0}
                    </td>

                    {/* LIABILITY */}
                    <td className="px-5 py-4 text-red-400 font-semibold">
                      ₹{bet.liability?.toLocaleString() || 0}
                    </td>

                    {/* RESULT */}
                    <td className="px-5 py-4">
                      <ResultBadge status={bet.status} />
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <StatusBadge status={bet.status} />
                    </td>

                    {/* DATE */}
                    <td className="px-5 py-4 text-white/40 text-xs">
                      {new Date(bet.createdAt).toLocaleString()}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------
   MAIN COMPONENT - Admin Wrestling Bet History Page
-------------------------------------------------------- */
const AdminWrestlingBetHistoryPage = () => {
  const dispatch = useDispatch();
  const { bets, loading, error } = useSelector(
    (state) => state.wrestlingBetHistory
  );

  const [openMid, setOpenMid] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    dispatch(getAllBetHistory());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error]);

  // Group Bets By Match
  const groupedBets = useMemo(() => {
    const map = {};

    bets.forEach((bet) => {
      const mid = bet.sid; // ✅ USE sid (match id)

      if (!mid) return;

      if (!map[mid]) {
        map[mid] = {
          mid,
          eventName: bet.eventName, // ✅ from API
          bets: [],
        };
      }

      map[mid].bets.push(bet);
    });

    return Object.values(map);
  }, [bets]);

  // Filter matches based on search
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groupedBets;

    const query = searchQuery.toLowerCase();
    return groupedBets.filter(game =>
      game.mid.toLowerCase().includes(query) ||
      game.teams.some(t => t.tname.toLowerCase().includes(query))
    );
  }, [groupedBets, searchQuery]);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    let totalBets = 0;
    let totalStake = 0;
    let totalSettled = 0;
    let totalProfit = 0;
    let totalLoss = 0;

    groupedBets.forEach(game => {
      game.bets.forEach(bet => {
        totalBets++;
        totalStake += bet.betAmount || 0;

        if (bet.status !== 0) totalSettled++;

        if (bet.status !== 0) {
          if (bet.otype === "back") {
            if (bet.status === 1) {
              totalLoss += bet.profit || 0;
            } else if (bet.status === 2) {
              totalProfit += bet.betAmount || 0;
            }
          }

          if (bet.otype === "lay") {
            if (bet.status === 1) {
              totalProfit += bet.liability || 0;
            } else if (bet.status === 2) {
              totalLoss += bet.profit || 0;
            }
          }
        }
      });
    });

    return {
      totalBets,
      totalStake,
      totalSettled,
      totalPending: totalBets - totalSettled,
      totalProfit,
      totalLoss,
      netAdmin: totalProfit - totalLoss
    };
  }, [groupedBets]);

  const toggleTable = (mid) => {
    setOpenMid(openMid === mid ? null : mid);
  };

  const handleRefresh = () => {
    dispatch(getAllBetHistory());
    showToast("Refreshing bet history...", "info");
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
          <p className="text-white/50 text-sm mt-6">Loading bet history...</p>
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
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-900/30 
                          flex items-center justify-center border border-orange-500/30
                          shadow-[0_0_20px_rgba(255,165,0,0.1)]">
              <MdSportsKabaddi size={30} className="text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_5px_black]">
                Wrestling Bet History
              </h1>
              <p className="text-white/40 text-sm mt-0.5 flex items-center gap-2">
                <span>{groupedBets.length} matches</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span>{overallStats.totalBets} total bets</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span>₹{overallStats.totalStake.toLocaleString()} total stake</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:min-w-[300px]">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={inputStyleClasses}
                placeholder="Search by match ID or team name..."
              />
              <MdShowChart className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            </div>

            <button
              onClick={handleRefresh}
              className={buttonGradientClass}
              title="Refresh"
            >
              <MdRefresh size={18} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-7 gap-4 mb-6">
        <div className={`${gradientCardClass} p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs">Matches</p>
              <p className="text-white text-2xl font-bold mt-1">{groupedBets.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/5 
                          flex items-center justify-center border border-white/30">
              <MdSportsKabaddi size={20} className="text-white" />
            </div>
          </div>
        </div>

        <div className={`${gradientCardClass} p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs">Total Bets</p>
              <p className="text-white text-2xl font-bold mt-1">{overallStats.totalBets}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-900/30 
                          flex items-center justify-center border border-blue-500/30">
              <MdInfo size={20} className="text-blue-400" />
            </div>
          </div>
        </div>

        <div className={`${gradientCardClass} p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs">Total Stake</p>
              <p className="text-amber-400 text-2xl font-bold mt-1">
                ₹{overallStats.totalStake.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-900/30 
                          flex items-center justify-center border border-amber-500/30">
              <MdAttachMoney size={20} className="text-amber-400" />
            </div>
          </div>
        </div>

        <div className={`${gradientCardClass} p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs">Settled</p>
              <p className="text-emerald-400 text-2xl font-bold mt-1">{overallStats.totalSettled}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 
                          flex items-center justify-center border border-emerald-500/30">
              <FiCheckCircle size={20} className="text-emerald-400" />
            </div>
          </div>
        </div>

        <div className={`${gradientCardClass} p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs">Pending</p>
              <p className="text-yellow-400 text-2xl font-bold mt-1">{overallStats.totalPending}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-900/30 
                          flex items-center justify-center border border-yellow-500/30">
              <MdAccessTime size={20} className="text-yellow-400" />
            </div>
          </div>
        </div>

        <div className={`${gradientCardClass} p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs">Admin Profit</p>
              <p className="text-emerald-400 text-2xl font-bold mt-1">
                ₹{overallStats.totalProfit.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 
                          flex items-center justify-center border border-emerald-500/30">
              <MdTrendingUp size={20} className="text-emerald-400" />
            </div>
          </div>
        </div>

        <div className={`${gradientCardClass} p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs">Admin Loss</p>
              <p className="text-red-400 text-2xl font-bold mt-1">
                ₹{overallStats.totalLoss.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-900/30 
                          flex items-center justify-center border border-red-500/30">
              <MdTrendingDown size={20} className="text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Net Admin Summary Card */}
      <div className={`${gradientCardClass} p-5 mb-6 bg-gradient-to-br from-purple-500/10 to-purple-900/20 border-purple-500/30`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-900/30 
                          flex items-center justify-center border border-purple-500/30">
              <MdEmojiEvents size={24} className="text-purple-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Net Admin Profit / Loss</p>
              <p className={`text-3xl font-bold ${overallStats.netAdmin >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                ₹{overallStats.netAdmin.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-black/40 rounded-xl border border-white/10">
            <span className="text-white/40 text-xs">Overall</span>
          </div>
        </div>
      </div>

      {/* Match Cards */}
      {filteredGroups.length === 0 ? (
        <div className={`${gradientCardClass} p-12 text-center`}>
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 
                        flex items-center justify-center border border-white/20">
            <MdSportsKabaddi size={32} className="text-white/30" />
          </div>
          <p className="text-white/50 text-lg font-medium">No matches found</p>
          <p className="text-white/30 text-sm mt-1">
            {searchQuery ? 'Try adjusting your search' : 'No bet history available'}
          </p>
        </div>
      ) : (
        filteredGroups.map((game) => (
          <MatchCard
            key={game.mid}
            game={game}
            isOpen={openMid === game.mid}
            onToggle={() => toggleTable(game.mid)}
          />
        ))
      )}

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .overflow-x-auto::-webkit-scrollbar {
          height: 6px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
};

export default AdminWrestlingBetHistoryPage;