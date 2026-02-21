import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBets, settleBet } from "../store/reducer/wrestlingBetAdminSlice";
import {
  MdSearch,
  MdSportsKabaddi,
  MdPerson,
  MdPhone,
  MdEmojiEvents,
  MdAttachMoney,
  MdCheckCircle,
  MdCancel,
  MdClose,
  MdWarning,
  MdInfo,
  MdFilterList,
  MdRefresh,
  MdVisibility,
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
    warning: <MdWarning className="text-yellow-400" size={20} />,
  };

  const commonStyle = {
    icon: icons[type],
    style: {
      background: "#0F1115",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "16px",
      padding: "16px 20px",
      boxShadow:
        "0 20px 40px -10px black, 0 0 0 1px rgba(255,255,255,0.05), 0 0 30px rgba(255,255,255,0.1)",
      backdropFilter: "blur(12px)",
      fontSize: "14px",
      fontWeight: "500",
    },
    duration: 4000,
  };

  if (type === "success") return toast.success(message, commonStyle);
  if (type === "error") return toast.error(message, commonStyle);
  if (type === "info") return toast(message, commonStyle);
  if (type === "warning") return toast(message, commonStyle);

  return toast(message, commonStyle);
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
   transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed";

const wonButtonClass =
  "flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 \
   rounded-lg text-emerald-300 font-medium text-xs border border-emerald-500/30 \
   shadow-[0_4px_10px_-5px_black,0_0_10px_rgba(16,185,129,0.1)] \
   hover:from-emerald-500/30 hover:to-emerald-900/40 hover:border-emerald-500/50 \
   hover:text-emerald-200 hover:shadow-[0_8px_15px_-8px_black,0_0_15px_rgba(16,185,129,0.2)] \
   transition-all duration-300";

const lostButtonClass =
  "flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-red-500/20 to-red-900/30 \
   rounded-lg text-red-300 font-medium text-xs border border-red-500/30 \
   shadow-[0_4px_10px_-5px_black,0_0_10px_rgba(239,68,68,0.1)] \
   hover:from-red-500/30 hover:to-red-900/40 hover:border-red-500/50 \
   hover:text-red-200 hover:shadow-[0_8px_15px_-8px_black,0_0_15px_rgba(239,68,68,0.2)] \
   transition-all duration-300";

const cancelButtonClass =
  "flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-yellow-500/20 to-yellow-900/30 \
   rounded-lg text-yellow-300 font-medium text-xs border border-yellow-500/30 \
   shadow-[0_4px_10px_-5px_black,0_0_10px_rgba(234,179,8,0.1)] \
   hover:from-yellow-500/30 hover:to-yellow-900/40 hover:border-yellow-500/50 \
   hover:text-yellow-200 hover:shadow-[0_8px_15px_-8px_black,0_0_15px_rgba(234,179,8,0.2)] \
   transition-all duration-300";

const inputStyleClasses =
  "w-full px-5 py-3 bg-black/50 border border-white/10 rounded-xl text-white text-sm \
   placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 \
   outline-none transition-all duration-300 backdrop-blur-md \
   shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] focus:shadow-[0_0_25px_rgba(255,255,255,0.1),inset_0_2px_8px_rgba(0,0,0,0.6)]";

/* --------------------------------------------------------
   SETTLEMENT CONFIRMATION POPUP
-------------------------------------------------------- */
const SettlementConfirmationPopup = ({ isOpen, onClose, onConfirm, betDetails, result, isLoading }) => {
  if (!isOpen) return null;

  const getResultConfig = () => {
    switch (result) {
      case 1:
        return {
          icon: <FiCheckCircle size={32} className="text-emerald-400" />,
          title: "Mark as Won",
          color: "emerald",
          message: "User will receive profit amount"
        };
      case 2:
        return {
          icon: <FiXCircle size={32} className="text-red-400" />,
          title: "Mark as Lost",
          color: "red",
          message: "Stake amount will be deducted"
        };
      case 0:
        return {
          icon: <MdCancel size={32} className="text-yellow-400" />,
          title: "Reset to Pending",
          color: "yellow",
          message: "Bet will move back to pending"
        };
      default:
        return {};
    }
  };

  const config = getResultConfig();

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className={`${gradientCardClass} w-full max-w-md relative overflow-hidden animate-scaleIn`}>
        {/* Decorative glows */}
        <div className={`absolute -top-40 -right-40 w-80 h-80 bg-${config.color}-500/10 rounded-full blur-3xl`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 bg-${config.color}-500/10 rounded-full blur-3xl`} />

        {/* Header */}
        <div className="relative z-10 p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${config.color}-500/30 to-${config.color}-900/40 
                          flex items-center justify-center border border-${config.color}-500/50
                          shadow-[0_0_30px_rgba(239,68,68,0.2)]`}>
              {config.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-[0_2px_5px_black]">
                {config.title}
              </h2>
              <p className="text-white/40 text-sm">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-xl 
                     border border-transparent hover:border-white/20 transition"
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6">
          <div className="bg-black/40 rounded-2xl border border-white/10 p-5 backdrop-blur-sm">
            <p className="text-white/90 text-center mb-3">
              Are you sure you want to settle this bet?
            </p>

            {betDetails && (
              <div className="space-y-2 mt-3 bg-black/60 p-4 rounded-xl border border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Team:</span>
                  <span className="text-white font-medium">{betDetails.teamName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Type:</span>
                  <span className="text-white font-medium">{betDetails.btype}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Stake:</span>
                  <span className="text-white font-bold">₹{betDetails.stake?.toLocaleString()}</span>
                </div>
              </div>
            )}

            <p className={`text-${config.color}-400/80 text-xs text-center mt-4 flex items-center justify-center gap-1`}>
              <MdInfo size={14} />
              {config.message}
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="relative z-10 p-6 border-t border-white/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className={buttonGradientClass}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-${config.color}-500/20 to-${config.color}-900/30 
                       rounded-xl text-${config.color}-300 font-medium text-sm border border-${config.color}-500/30
                       hover:from-${config.color}-500/30 hover:to-${config.color}-900/40 hover:border-${config.color}-500/50
                       hover:text-${config.color}-200 transition-all duration-300`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {result === 'WON' && <FiCheckCircle size={16} />}
                {result === 'LOST' && <FiXCircle size={16} />}
                {result === 'CANCELLED' && <MdCancel size={16} />}
                Yes, {result === 1 ? "won" : result === 2 ? "lost" : "pending"}              </>
            )}
          </button>
        </div>


      </div>
    </div>
  );
};

/* --------------------------------------------------------
   BET DETAILS MODAL
-------------------------------------------------------- */
const BetDetailsModal = ({ isOpen, onClose, bet }) => {
  if (!isOpen || !bet) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className={`${gradientCardClass} w-full max-w-2xl relative overflow-hidden animate-scaleIn`}>
        {/* Decorative glows */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

        {/* Header */}
        <div className="relative z-10 p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 
                          flex items-center justify-center border border-white/30
                          shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <MdSportsKabaddi size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-[0_2px_5px_black]">
                Bet Details
              </h2>
              <p className="text-white/40 text-sm">ID: {bet._id?.slice(-8)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-xl 
                     border border-transparent hover:border-white/20 transition"
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Info */}
            <div className="p-5 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-sm">
              <h4 className="text-white/80 text-sm font-semibold mb-4 flex items-center gap-2">
                <FaUserCircle className="text-white/50" size={16} />
                User Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <MdPerson className="text-white/40" size={16} />
                  <span className="text-white/60 w-20">User ID</span>
                  <span className="text-white text-xs font-mono">{bet.user?._id?.slice(-8)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MdPhone className="text-white/40" size={16} />
                  <span className="text-white/60 w-20">Mobile</span>
                  <span className="text-white">{bet.user?.mobile || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Bet Info */}
            <div className="p-5 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-sm">
              <h4 className="text-white/80 text-sm font-semibold mb-4 flex items-center gap-2">
                <MdEmojiEvents className="text-white/50" size={16} />
                Bet Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-white/60 w-20">Team</span>
                  <span className="text-white font-medium">{bet.teamName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-white/60 w-20">Type</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/90">
                    {bet.btype}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-white/60 w-20">Stake</span>
                  <span className="text-amber-400 font-bold text-lg">
                    ₹{bet.stake?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-5 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-white/40 text-xs">Created At</span>
                <p className="text-white/80 text-sm mt-1">
                  {bet.createdAt ? new Date(bet.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-white/40 text-xs">Last Updated</span>
                <p className="text-white/80 text-sm mt-1">
                  {bet.updatedAt ? new Date(bet.updatedAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 p-6 border-t border-white/10 flex justify-end">
          <button onClick={onClose} className={buttonGradientClass}>
            <MdClose size={16} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------
   MAIN COMPONENT - Admin Wrestling Pending Page
-------------------------------------------------------- */
const AdminWrestlingPendingPage = () => {
  const dispatch = useDispatch();
  const { bets, loading, error } = useSelector((s) => s.wrestlingBetAdmin);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [selectedBet, setSelectedBet] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [settlementPopup, setSettlementPopup] = useState({
    isOpen: false,
    betId: null,
    result: null,
    betDetails: null
  });
  const [settlementLoading, setSettlementLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllBets());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error]);

  const handleSettleBet = async () => {
    setSettlementLoading(true);
    try {
      await dispatch(settleBet({
        id: settlementPopup.betId,
        status: settlementPopup.result
      }));
      const statusText =
        settlementPopup.result === 1 ? "won" :
          settlementPopup.result === 2 ? "lost" :
            "pending";

      showToast(`Bet settled as ${statusText}`,
        settlementPopup.result === 1 ? "success" :
          settlementPopup.result === 2 ? "error" :
            "info"
      );
      setSettlementPopup({ isOpen: false, betId: null, result: null, betDetails: null });
      dispatch(getAllBets());
    } catch (err) {
      showToast(err?.message || "Failed to settle bet", "error");
    } finally {
      setSettlementLoading(false);
    }
  };

  const openSettlementPopup = (betId, result, betDetails) => {
    setSettlementPopup({
      isOpen: true,
      betId,
      result,
      betDetails
    });
  };

  const openDetailsModal = (bet) => {
    setSelectedBet(bet);
    setShowDetailsModal(true);
  };

  const pendingBets = bets.filter((b) => b.status === 0);

  // Filter bets based on search and type
  const filteredBets = useMemo(() => {
    let filtered = pendingBets;

    // Apply type filter
    if (filterType !== "ALL") {
      filtered = filtered.filter(b => b.btype === filterType);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.user?.mobile?.toLowerCase().includes(query) ||
        b.teamName?.toLowerCase().includes(query) ||
        b._id?.toLowerCase().includes(query) ||
        b.user?._id?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [pendingBets, searchQuery, filterType]);

  // Get unique bet types for filter
  const betTypes = useMemo(() => {
    const types = new Set(pendingBets.map(b => b.btype).filter(Boolean));
    return ['ALL', ...Array.from(types)];
  }, [pendingBets]);

  // Calculate total stake
  const totalStake = useMemo(() => {
    return filteredBets.reduce((sum, bet) => sum + (bet.stake || 0), 0);
  }, [filteredBets]);

  const handleRefresh = () => {
    dispatch(getAllBets());
    showToast("Refreshing bets...", "info");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405] p-4 md:p-6 lg:p-8">

      {/* Header Section */}
      <div className={`${gradientCardClass} p-5 md:p-6 mb-6`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-900/30 
                          flex items-center justify-center border border-orange-500/30
                          shadow-[0_0_20px_rgba(255,165,0,0.1)]">
              <MdSportsKabaddi size={26} className="text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_5px_black]">
                Wrestling Bets
              </h1>
              <p className="text-white/40 text-sm mt-0.5 flex items-center gap-2">
                <span>{pendingBets.length} pending bets</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span>₹{totalStake.toLocaleString()} total stake</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:min-w-[250px]">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={inputStyleClasses}
                placeholder="Search by mobile, team, ID..."
              />
              <MdSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`${inputStyleClasses} w-full sm:w-40 appearance-none cursor-pointer`}
            >
              {betTypes.map(type => (
                <option key={type} value={type} className="bg-[#0B0D10] text-white">
                  {type === 'ALL' ? '🎯 All Types' : `🏆 ${type}`}
                </option>
              ))}
            </select>

            <button
              onClick={handleRefresh}
              className={buttonGradientClass}
              title="Refresh"
            >
              <MdRefresh size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`${gradientCardClass} p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs">Total Pending</p>
              <p className="text-white text-2xl font-bold mt-1">{pendingBets.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-900/30 
                          flex items-center justify-center border border-blue-500/30">
              <MdSportsKabaddi size={20} className="text-blue-400" />
            </div>
          </div>
        </div>

        <div className={`${gradientCardClass} p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs">Total Stake</p>
              <p className="text-amber-400 text-2xl font-bold mt-1">
                ₹{pendingBets.reduce((sum, b) => sum + (b.stake || 0), 0).toLocaleString()}
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
              <p className="text-white/40 text-xs">Unique Users</p>
              <p className="text-white text-2xl font-bold mt-1">
                {new Set(pendingBets.map(b => b.userId?._id)).size}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-900/30 
                          flex items-center justify-center border border-purple-500/30">
              <MdPerson size={20} className="text-purple-400" />
            </div>
          </div>
        </div>

        <div className={`${gradientCardClass} p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs">Bet Types</p>
              <p className="text-white text-2xl font-bold mt-1">{betTypes.length - 1}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-900/30 
                          flex items-center justify-center border border-pink-500/30">
              <MdFilterList size={20} className="text-pink-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-white/10 border-t-white/30 rounded-full animate-ping" />
            </div>
          </div>
          <p className="text-white/50 text-sm mt-6">Loading bets...</p>
        </div>
      )}

      {/* Main Table Card */}
      {!loading && (
        <div className={`${gradientCardClass} overflow-hidden`}>
          <div className="relative z-10">

            {/* Table Header with count */}
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
              <div className="flex items-center gap-3">
                <MdInfo className="text-white/40" size={18} />
                <span className="text-white/60 text-sm">
                  Showing {filteredBets.length} of {pendingBets.length} pending bets
                </span>
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-white/40 hover:text-white text-xs px-3 py-1.5 
                           rounded-lg hover:bg-white/5 transition"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* Table */}
            {filteredBets.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 
                              flex items-center justify-center border border-white/20">
                  <MdSportsKabaddi size={32} className="text-white/30" />
                </div>
                <p className="text-white/50 text-lg font-medium">No pending bets found</p>
                <p className="text-white/30 text-sm mt-1">
                  {searchQuery || filterType !== 'ALL'
                    ? 'Try adjusting your filters'
                    : 'All bets have been settled'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-black/40 border-b border-white/10">
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
                        Stake
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredBets.map((bet) => (
                      <tr
                        key={bet._id}
                        className="hover:bg-white/5 transition-all duration-200 group"
                      >
                        {/* USER COLUMN */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 
                       flex items-center justify-center border border-white/20"
                            >
                              <span className="text-white font-bold text-sm">
                                {bet.userId?.mobile?.charAt(0) || "U"}
                              </span>
                            </div>

                            <div>
                              <div className="font-medium text-white text-sm">
                                User #{bet.userId?._id?.slice(-6)}
                              </div>

                              <div className="text-xs text-white/40 font-mono">
                                {bet._id?.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* MOBILE COLUMN */}
                        <td className="px-5 py-4">
                          <span className="text-white/80 text-sm font-mono">
                            {bet.userId?.mobile || "N/A"}
                          </span>
                        </td>

                        {/* TEAM */}
                        <td className="px-5 py-4">
                          <span
                            className="px-3 py-1.5 bg-gradient-to-br from-white/10 to-white/5 
                     rounded-lg text-white/90 text-xs font-medium border border-white/20"
                          >
                            {bet.teamName}
                          </span>
                        </td>

                        {/* TYPE */}
                        <td className="px-5 py-4">
                          <span
                            className="px-3 py-1.5 bg-gradient-to-br from-blue-500/10 to-blue-900/20 
                     rounded-lg text-blue-300 text-xs font-medium border border-blue-500/30 uppercase"
                          >
                            {bet.otype}
                          </span>
                        </td>

                        {/* AMOUNT */}
                        <td className="px-5 py-4">
                          <span className="text-amber-400 font-bold drop-shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                            ₹{bet.betAmount?.toLocaleString()}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setSettlementPopup({
                                  isOpen: true,
                                  team: bet.teamName,
                                  type: "back",
                                })
                              }
                              className={wonButtonClass}
                            >
                              {bet.teamName} BACK
                            </button>

                            <button
                              onClick={() =>
                                setSettlementPopup({
                                  isOpen: true,
                                  team: bet.teamName,
                                  type: "lay",
                                })
                              }
                              className={lostButtonClass}
                            >
                              {bet.teamName} LAY
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settlement Confirmation Popup */}
      <SettlementConfirmationPopup
        isOpen={settlementPopup.isOpen}
        onClose={() => setSettlementPopup({ isOpen: false, betId: null, result: null, betDetails: null })}
        onConfirm={handleSettleBet}
        betDetails={settlementPopup.betDetails}
        result={settlementPopup.result}
        isLoading={settlementLoading}
      />

      {/* Bet Details Modal */}
      <BetDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedBet(null);
        }}
        bet={selectedBet}
      />

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        /* Custom scrollbar for table */
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
        
        /* Select dropdown arrow */
        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='rgba(255,255,255,0.4)' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }
      `}</style>
    </div>
  );
};

export default AdminWrestlingPendingPage;