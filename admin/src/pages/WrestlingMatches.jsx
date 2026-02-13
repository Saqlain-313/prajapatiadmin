import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  MdSportsMma,
  MdAccessTime,
  MdAttachMoney,
  MdVisibility,
  MdLock,
  MdLockOpen,
  MdWarning,
  MdClose,
  MdCheckCircle,
  MdCancel,
  MdEmojiEvents,
  MdGroups,
  MdSchedule,
  MdFiberManualRecord,
} from "react-icons/md";
import { FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";
import {
  fetchAllMatches,
  closeMatch,
  openMatch,
} from "../store/reducer/wrestlingAdminSlice";

/* =========================
   DARK GRADIENT THEME — consistent with navbar/sidebar
========================= */
const gradientCardClass =
  "relative bg-gradient-to-br from-[#0B0D10] via-[#15181E] to-[#070809] \
   border border-white/10 rounded-3xl shadow-[0_30px_60px_-15px_black,0_0_0_1px_rgba(255,255,255,0.02)] \
   backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:shadow-[0_35px_70px_-15px_black,0_0_30px_rgba(255,255,255,0.15)] \
   before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none";

const buttonGradientClass =
  "flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-[#2A2F37] to-[#0C0E12] \
   rounded-xl text-white font-medium text-sm border border-white/10 \
   shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(255,255,255,0.05)] \
   hover:from-[#3A404A] hover:to-[#161A1F] hover:border-white/30 \
   hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(255,255,255,0.2)] \
   transition-all duration-300 disabled:opacity-40";

const viewButtonClass =
  "flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-blue-500/20 to-blue-900/30 \
   rounded-xl text-blue-300 font-medium text-sm border border-blue-500/30 \
   shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(59,130,246,0.1)] \
   hover:from-blue-500/30 hover:to-blue-900/40 hover:border-blue-500/50 \
   hover:text-blue-200 hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(59,130,246,0.25)] \
   transition-all duration-300 w-full";

const closeButtonClass =
  "flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-red-500/20 to-red-900/30 \
   rounded-xl text-red-300 font-medium text-sm border border-red-500/30 \
   shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(239,68,68,0.1)] \
   hover:from-red-500/30 hover:to-red-900/40 hover:border-red-500/50 \
   hover:text-red-200 hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(239,68,68,0.25)] \
   transition-all duration-300 w-full";

const openButtonClass =
  "flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 \
   rounded-xl text-emerald-300 font-medium text-sm border border-emerald-500/30 \
   shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(16,185,129,0.1)] \
   hover:from-emerald-500/30 hover:to-emerald-900/40 hover:border-emerald-500/50 \
   hover:text-emerald-200 hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(16,185,129,0.25)] \
   transition-all duration-300 w-full";

const statusBadgeClass = {
  OPEN: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
  PENDING: "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
  CLOSED: "bg-red-500/20 text-red-300 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
};

/* =========================
   CONFIRMATION POPUP — are you sure?
========================= */
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = "close" }) => {
  if (!isOpen) return null;

  const isClose = type === "close";
  const icon = isClose ? (
    <FiXCircle className="text-red-400" size={32} />
  ) : (
    <FiCheckCircle className="text-emerald-400" size={32} />
  );

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className={`${gradientCardClass} w-full max-w-md relative overflow-hidden animate-scaleIn`}>
        {/* Decorative glows */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
              ${isClose 
                ? "bg-red-500/20 border border-red-500/50" 
                : "bg-emerald-500/20 border border-emerald-500/50"}`}>
              {icon}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-xl 
                       border border-transparent hover:border-white/20 transition"
            >
              <MdClose size={20} />
            </button>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 drop-shadow-[0_2px_5px_black]">
            {title || (isClose ? "Close Match" : "Re-Open Match")}
          </h3>
          
          <p className="text-white/60 text-sm mb-6">
            {message || (isClose 
              ? "Are you sure you want to close this match? No further bets will be accepted."
              : "Are you sure you want to re-open this match? Bets will be accepted again.")}
          </p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className={buttonGradientClass}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={isClose ? closeButtonClass : openButtonClass}
            >
              {isClose ? (
                <>
                  <MdLock size={16} />
                  Confirm Close
                </>
              ) : (
                <>
                  <MdLockOpen size={16} />
                  Confirm Re-Open
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================
   TOAST CONFIG — consistent dark theme - FIXED
========================= */
const showToast = (message, type = "success") => {
  const icons = {
    success: <FiCheckCircle className="text-emerald-400" size={20} />,
    error: <FiXCircle className="text-red-400" size={20} />,
    info: <FiAlertCircle className="text-blue-400" size={20} />,
  };

  // FIXED: Use toast() directly instead of toast[type]
  toast(message, {
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

/* =========================
   COUNTDOWN HELPER (SAFE)
========================= */
const getCountdown = (startTime) => {
  if (!startTime) return "N/A";

  const diff = new Date(startTime).getTime() - Date.now();
  if (diff <= 0) return "Starting...";

  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  return `${mins}m ${secs}s`;
};

const WrestlingMatches = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { matches = [], loading, status } = useSelector(
    (state) => state.wrestlingAdmin
  );

  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    id: null,
    type: "close",
  });

  /* ⏱ Force re-render every second for countdown */
  const [, tick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => tick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  /* 📥 Initial fetch with toast */
  useEffect(() => {
    dispatch(fetchAllMatches()).then((res) => {
      if (res?.payload?.message) {
        showToast(res.payload.message, "info");
      }
    });
  }, [dispatch]);

  /* 📢 Show status messages */
  useEffect(() => {
    if (status) {
      showToast(status, "info");
    }
  }, [status]);

  /* =========================
     ACTION HANDLERS with confirmation
  ========================= */
  const handleCloseClick = (id) => {
    setConfirmation({
      isOpen: true,
      id,
      type: "close",
    });
  };

  const handleOpenClick = (id) => {
    setConfirmation({
      isOpen: true,
      id,
      type: "open",
    });
  };

  const handleConfirmAction = async () => {
    const { id, type } = confirmation;
    try {
      if (type === "close") {
        await dispatch(closeMatch(id)).unwrap();
        showToast("Match closed successfully", "success");
      } else {
        await dispatch(openMatch(id)).unwrap();
        showToast("Match re-opened successfully", "success");
      }
      dispatch(fetchAllMatches());
    } catch (error) {
      showToast(error.message || "An error occurred", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405] p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER — consistent gradient card */}
        <div className={`${gradientCardClass} p-5 md:p-6 mb-6`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/5 
                          flex items-center justify-center border border-white/30
                          shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <MdSportsMma size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_5px_black]">
                Wrestling Matches
              </h1>
              <p className="text-white/40 text-sm mt-0.5 flex items-center gap-2">
                <span>{matches.length} total</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="text-emerald-400">
                  {matches.filter(m => m.status === "OPEN").length} live
                </span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="text-amber-400">
                  {matches.filter(m => m.status === "PENDING").length} pending
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-white/50 text-sm">Loading matches...</p>
          </div>
        )}

        {/* MATCH CARDS — grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {matches.map((match) => {
            const hasStartTime = Boolean(match.startTime);
            const startAt = hasStartTime ? new Date(match.startTime) : null;

            return (
              <div
                key={match._id}
                className={`${gradientCardClass} p-5 flex flex-col h-full`}
              >
                {/* TOP BAR — status and match ID */}
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`px-3 py-1.5 text-xs font-bold rounded-full border
                      ${statusBadgeClass[match.status] || statusBadgeClass.PENDING}`}
                  >
                    {match.status}
                  </span>
                  <span className="text-xs text-white/40 font-mono bg-black/40 px-2 py-1 rounded-lg border border-white/10">
                    MID: {match.mid}
                  </span>
                </div>

                {/* TEAMS — with icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1 text-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 
                                  flex items-center justify-center mx-auto mb-2 border border-white/30">
                      <span className="text-white font-bold text-sm">
                        {match.teams?.[0]?.tname?.charAt(0) || "A"}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold text-sm truncate">
                      {match.teams?.[0]?.tname || "Team A"}
                    </h3>
                  </div>
                  
                  <div className="flex flex-col items-center px-2">
                    <span className="text-white/40 text-xs font-bold">VS</span>
                    <MdSportsMma size={20} className="text-red-400/60 my-1" />
                  </div>
                  
                  <div className="flex-1 text-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 
                                  flex items-center justify-center mx-auto mb-2 border border-white/30">
                      <span className="text-white font-bold text-sm">
                        {match.teams?.[1]?.tname?.charAt(0) || "B"}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold text-sm truncate">
                      {match.teams?.[1]?.tname || "Team B"}
                    </h3>
                  </div>
                </div>

                {/* TIME INFO */}
                <div className="mb-4 space-y-2 bg-black/40 rounded-xl p-3 border border-white/5">
                  <div className="flex items-center gap-2 text-sm">
                    <MdSchedule className="text-white/40" size={16} />
                    <span className="text-white/60">Start:</span>
                    <span className="text-white font-medium ml-auto">
                      {hasStartTime
                        ? startAt.toLocaleString("en-IN", {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit'
                          })
                        : "Not set"}
                    </span>
                  </div>

                  {match.status === "PENDING" && hasStartTime && (
                    <div className="flex items-center gap-2 text-sm">
                      <MdAccessTime className="text-amber-400" size={16} />
                      <span className="text-amber-400/80">Starts in:</span>
                      <span className="text-amber-400 font-bold ml-auto">
                        {getCountdown(match.startTime)}
                      </span>
                    </div>
                  )}

                  {match.status === "OPEN" && (
                    <div className="flex items-center gap-2 text-sm">
                      <MdFiberManualRecord className="text-emerald-400 animate-pulse" size={16} />
                      <span className="text-emerald-400 font-semibold ml-auto">
                        LIVE NOW
                      </span>
                    </div>
                  )}
                </div>

                {/* BET LIMITS */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-black/40 rounded-xl p-2 text-center border border-white/5">
                    <span className="text-white/40 text-xs">Min Bet</span>
                    <p className="text-amber-400 font-bold drop-shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                      ₹{match.minbet}
                    </p>
                  </div>
                  <div className="bg-black/40 rounded-xl p-2 text-center border border-white/5">
                    <span className="text-white/40 text-xs">Max Bet</span>
                    <p className="text-amber-400 font-bold drop-shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                      ₹{match.maxbet}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-auto space-y-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/wrestling/${match._id}`)
                    }
                    className={viewButtonClass}
                  >
                    <MdVisibility size={16} />
                    View Match Details
                  </button>

                  {match.status === "OPEN" && (
                    <button
                      onClick={() => handleCloseClick(match._id)}
                      className={closeButtonClass}
                    >
                      <MdLock size={16} />
                      Close Match
                    </button>
                  )}

                  {match.status === "CLOSED" && (
                    <button
                      onClick={() => handleOpenClick(match._id)}
                      className={openButtonClass}
                    >
                      <MdLockOpen size={16} />
                      Re-Open Match
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* EMPTY STATE */}
        {!loading && matches.length === 0 && (
          <div className={`${gradientCardClass} p-12 text-center`}>
            <MdSportsMma size={48} className="text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg font-medium">No matches found</p>
            <p className="text-white/30 text-sm mt-1">Create a new match to get started</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={() => setConfirmation({ ...confirmation, isOpen: false })}
        onConfirm={handleConfirmAction}
        type={confirmation.type}
        title={confirmation.type === "close" ? "Close Match" : "Re-Open Match"}
        message={
          confirmation.type === "close"
            ? "Are you sure you want to close this match? No further bets will be accepted and the match will be settled."
            : "Are you sure you want to re-open this match? Bets will be accepted again and users can place new bets."
        }
      />

      {/* FIXED: Regular style tag instead of jsx global */}
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default WrestlingMatches;