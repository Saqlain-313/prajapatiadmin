import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MdSportsMma,
  MdArrowBack,
  MdLock,
  MdLockOpen,
  MdVisibility,
  MdGroups,
  MdAttachMoney,
  MdSpeed,
  MdTimer,
  MdCheckCircle,
  MdCancel,
  MdWarning,
  MdClose,
  MdSwapHoriz,
  MdTrendingUp,
  MdTrendingDown,
  MdPerson,
  MdPhone,
  MdEmail,
  MdFiberManualRecord,
  MdSchedule,
  MdImage,
  MdUpdate,
  MdPlayArrow,
  MdStop,
  MdAdd,
  MdRemove,
  MdExposure,
  MdHistory,
} from "react-icons/md";
import { FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";
import {
  fetchMatch,
  closeMatch,
  openMatch,
  updateBoxFromSocket,
  updateTeamStatusFromSocket,
} from "../store/reducer/wrestlingAdminSlice";
import { getBetHistoryByMid } from "../store/reducer/wrestlingBetHistorySlice";

const socket = io("http://localhost:5200/", {
  transports: ["websocket"],
});

/* =========================
   DARK GRADIENT THEME — consistent pattern
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

const openButtonClass =
  "flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 \
   rounded-xl text-emerald-300 font-medium text-sm border border-emerald-500/30 \
   shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(16,185,129,0.1)] \
   hover:from-emerald-500/30 hover:to-emerald-900/40 hover:border-emerald-500/50 \
   hover:text-emerald-200 hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(16,185,129,0.25)] \
   transition-all duration-300";

const closeButtonClass =
  "flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-red-500/20 to-red-900/30 \
   rounded-xl text-red-300 font-medium text-sm border border-red-500/30 \
   shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(239,68,68,0.1)] \
   hover:from-red-500/30 hover:to-red-900/40 hover:border-red-500/50 \
   hover:text-red-200 hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(239,68,68,0.25)] \
   transition-all duration-300";

const activeButtonClass =
  "flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 \
   rounded-xl text-emerald-300 font-medium text-sm border border-emerald-500/30 \
   shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(16,185,129,0.1)] \
   hover:from-emerald-500/30 hover:to-emerald-900/40 transition-all duration-300 w-full";

const suspendButtonClass =
  "flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-red-500/20 to-red-900/30 \
   rounded-xl text-red-300 font-medium text-sm border border-red-500/30 \
   shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(239,68,68,0.1)] \
   hover:from-red-500/30 hover:to-red-900/40 transition-all duration-300 w-full";

const inputStyleClasses =
  "w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white text-sm \
   placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 \
   outline-none transition-all duration-300 backdrop-blur-md \
   shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] focus:shadow-[0_0_25px_rgba(255,255,255,0.1),inset_0_2px_8px_rgba(0,0,0,0.6)]";

const selectStyleClasses =
  "w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white text-sm \
   focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all \
   backdrop-blur-md shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] cursor-pointer";

const statusBadgeClass = {
  OPEN: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
  CLOSED: "bg-red-500/20 text-red-300 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
  PENDING: "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
  SUSPENDED: "bg-orange-500/20 text-orange-300 border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]",
  ACTIVE: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
};

/* =========================
   CONFIRMATION POPUP
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
            {title}
          </h3>

          <p className="text-white/60 text-sm mb-6">
            {message}
          </p>

          <div className="flex gap-3 justify-end">
            <button onClick={onClose} className={buttonGradientClass}>
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
                  Confirm Open
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
   TOAST CONFIG
========================= */
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

const WrestlingAdmin = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { match: MATCH, loading, status } = useSelector(
    (state) => state.wrestlingAdmin
  );
  const { bets } = useSelector(
    (state) => state.wrestlingBetHistory
  );

  const [tid, setTid] = useState("");
  const [boxId, setBoxId] = useState("");
  const [rate, setRate] = useState("");
  const [size, setSize] = useState("");
  const [timer, setTimer] = useState("");
  const [confirmation, setConfirmation] = useState({ isOpen: false, type: "close" });

  const [rateStep, setRateStep] = useState("0.01");

  useEffect(() => {
    if (matchId) dispatch(fetchMatch(matchId));
  }, [matchId, dispatch]);

  const minRate = 0.00;
  const maxRate = 1.99;

  const handleIncreaseRate = () => {
    if (!MATCH || MATCH.status !== "OPEN") return;
    if (!tid || !boxId || !selectedBox) return;

    const current = Number(selectedBox.rate || 0);
    const step = Number(rateStep);

    let newRate = Number((current + step).toFixed(2));

    if (newRate > maxRate) newRate = maxRate;

    socket.emit("admin:update-box", {
      matchId: MATCH._id,
      mid: MATCH.mid,
      tid,
      boxId,
      rate: newRate,
      size: selectedBox.size || 0,
      timer: selectedBox.timer || 0,
    });
  };

  const handleDecreaseRate = () => {
    if (!MATCH || MATCH.status !== "OPEN") return;
    if (!tid || !boxId || !selectedBox) return;

    const current = Number(selectedBox.rate || 0);
    const step = Number(rateStep);

    let newRate = Number((current - step).toFixed(2));

    if (newRate < minRate) newRate = minRate;

    socket.emit("admin:update-box", {
      matchId: MATCH._id,
      mid: MATCH.mid,
      tid,
      boxId,
      rate: newRate,
      size: selectedBox.size || 0,
      timer: selectedBox.timer || 0,
    });
  };

  useEffect(() => {
    if (MATCH?.mid) {
      dispatch(getBetHistoryByMid(MATCH.mid));
    }
  }, [MATCH?.mid, dispatch]);

  useEffect(() => {
    if (MATCH?.mid) {
      socket.emit("join-match", String(MATCH.mid));
    }
  }, [MATCH?.mid]);

  useEffect(() => {
    const boxHandler = (payload) => {
      dispatch(updateBoxFromSocket(payload));
      showToast(`Box ${payload.boxId} updated`, "info");
    };

    const teamStatusHandler = (payload) => {
      dispatch(updateTeamStatusFromSocket(payload));
      showToast(`Team status updated to ${payload.status}`, "info");
    };

    socket.on("box:update", boxHandler);
    socket.on("team:status-update", teamStatusHandler);

    return () => {
      socket.off("box:update", boxHandler);
      socket.off("team:status-update", teamStatusHandler);
    };
  }, [dispatch]);

  const exposureData = MATCH?.teams?.map((team) => {
    const teamBets = bets?.filter(
      (bet) => String(bet.teamName) === String(team.tname)
    );

    let backTotal = 0;
    let layTotal = 0;

    teamBets?.forEach((bet) => {
      if (bet.otype === "back") {
        backTotal += bet.betAmount || 0;
      } else if (bet.otype === "lay") {
        layTotal += bet.betAmount || 0;
      }
    });

    return {
      tid: team.tid,
      teamName: team.tname,
      backTotal,
      layTotal,
      profitSide:
        backTotal > layTotal
          ? "LAY side profit"
          : layTotal > backTotal
            ? "BACK side profit"
            : "Balanced",
    };
  });

  const handleUpdateBox = () => {
    if (!MATCH || MATCH.status !== "OPEN") {
      showToast("Match is not open", "error");
      return;
    }
    if (!tid || !boxId || !rate) {
      showToast("Select team, box and rate", "error");
      return;
    }

    socket.emit("admin:update-box", {
      matchId: MATCH._id,
      mid: MATCH.mid,
      tid,
      boxId,
      rate: Number(rate),
      size: Number(size) || 0,
      timer: Number(timer) || 0,
    });

    showToast("Box updated successfully", "success");
    setSize("");
    setTimer("");
  };

  const handleOpenMatch = () => {
    setConfirmation({ isOpen: true, type: "open" });
  };

  const handleCloseMatch = () => {
    setConfirmation({ isOpen: true, type: "close" });
  };

  const handleConfirmMatchAction = async () => {
    if (confirmation.type === "open") {
      await dispatch(openMatch(MATCH._id));
      showToast("Match opened successfully", "success");
    } else {
      await dispatch(closeMatch(MATCH._id));
      showToast("Match closed successfully", "success");
    }
    dispatch(fetchMatch(matchId));
  };

  const selectedTeam = MATCH?.teams?.find(
    (t) => String(t.tid) === String(tid)
  );

  const selectedBox = selectedTeam?.boxes?.find(
    (b) => String(b.boxId) === String(boxId)
  );

  useEffect(() => {
    if (selectedBox?.rate !== undefined) {
      setRate(Number(selectedBox.rate).toFixed(2));
    }
  }, [selectedBox?.rate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405] p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER with Back Button */}
        <div className={`${gradientCardClass} p-5 md:p-6 mb-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/5 
                            flex items-center justify-center border border-white/30
                            shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <MdSportsMma size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_5px_black]">
                  Match Control
                </h1>
                {MATCH && (
                  <p className="text-white/40 text-sm mt-0.5 flex items-center gap-2">
                    <MdGroups size={14} />
                    {MATCH.teams?.map((t) => t.tname).join(" vs ")}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate(-1)}
              className={buttonGradientClass}
            >
              <MdArrowBack size={16} />
              Back
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT PANEL - ADMIN CONTROL */}
          <div className={`${gradientCardClass} p-6 space-y-6`}>
            {/* Match Image */}
            {MATCH && (
              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={
                    MATCH?.img
                      ? `${MATCH.img}`
                      : "https://via.placeholder.com/800x300?text=Wrestling+Match"
                  }
                  alt="Match"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className={`px-3 py-1.5 text-xs font-bold rounded-full border ${statusBadgeClass[MATCH?.status]}`}>
                    {MATCH?.status}
                  </span>
                </div>
              </div>
            )}

            {/* Match Status Controls */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <MdFiberManualRecord className={MATCH?.status === "OPEN" ? "text-emerald-400 animate-pulse" : "text-red-400"} size={12} />
                <span className="text-white/60 text-sm">Status:</span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${statusBadgeClass[MATCH?.status]}`}>
                  {MATCH?.status}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleOpenMatch}
                  disabled={MATCH?.status === "OPEN"}
                  className={openButtonClass}
                >
                  <MdLockOpen size={16} />
                  OPEN
                </button>
                <button
                  onClick={handleCloseMatch}
                  disabled={MATCH?.status === "CLOSED"}
                  className={closeButtonClass}
                >
                  <MdLock size={16} />
                  CLOSE
                </button>
              </div>
            </div>

            {/* Team & Box Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white/60 text-xs flex items-center gap-1">
                  <MdGroups size={14} />
                  Select Team
                </label>
                <select
                  value={tid}
                  onChange={(e) => setTid(e.target.value)}
                  className={selectStyleClasses}
                >
                  <option value="">Choose team</option>
                  {MATCH?.teams?.map((t) => (
                    <option key={t.tid} value={t.tid}>
                      {t.tname} {t.status === "SUSPENDED" ? "(SUSPENDED)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-white/60 text-xs flex items-center gap-1">
                  <MdSwapHoriz size={14} />
                  Select Box
                </label>
                <select
                  value={boxId}
                  onChange={(e) => setBoxId(e.target.value)}
                  className={selectStyleClasses}
                  disabled={!tid}
                >
                  <option value="">Choose box</option>
                  {selectedTeam?.boxes?.map((b) => (
                    <option key={b.boxId} value={b.boxId}>
                      {b.boxId == 3 ? "BACK" : b.boxId == 4 ? "LAY" : `Box ${b.boxId}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rate Control with +/- Buttons */}
            {/* <div className="space-y-2">
              <label className="text-white/60 text-xs flex items-center gap-1">
                <MdTrendingUp size={14} />
                Rate Control
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDecreaseRate}
                  disabled={!tid || !boxId || MATCH?.status !== "OPEN"}
                  className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-300 border border-red-500/30
                           disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <MdRemove size={18} />
                </button>

                <select
                  value={selectedBox?.rate?.toFixed(2) || ""}
                  onChange={(e) => {
                    if (!MATCH || MATCH.status !== "OPEN") return;
                    if (!tid || !boxId) return;
                    socket.emit("admin:update-box", {
                      matchId: MATCH._id,
                      mid: MATCH.mid,
                      tid,
                      boxId,
                      rate: Number(e.target.value),
                      size: selectedBox?.size || 0,
                      timer: selectedBox?.timer || 0,
                    });
                  }}
                  className={selectStyleClasses}
                  disabled={!tid || !boxId || MATCH?.status !== "OPEN"}
                >
                  <option value="">Rate</option>
                  {[...Array(181)].map((_, i) => {
                    const value = (1 + i * 0.05).toFixed(2);
                    return (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>

                <button
                  onClick={handleIncreaseRate}
                  disabled={!tid || !boxId || MATCH?.status !== "OPEN"}
                  className="p-3 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-xl text-emerald-300 border border-emerald-500/30
                           disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <MdAdd size={18} />
                </button>
              </div>
            </div> */}

            {/* Size & Timer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white/60 text-xs flex items-center gap-1">
                  <MdTrendingUp size={14} />
                  Rate Control
                </label>
                <div className="flex items-center gap-2">

                  <button
                    onClick={handleDecreaseRate}
                    disabled={!tid || !boxId || MATCH?.status !== "OPEN"}
                    className="p-3 bg-red-500/20 rounded-xl text-red-300 border border-red-500/30"
                  >
                    <MdRemove size={18} />
                  </button>


                  <select
                    value={rateStep}
                    onChange={(e) => setRateStep(e.target.value)}
                    className="w-24 px-3 py-3 bg-black/50 border border-white/10 rounded-xl text-white text-sm"
                  >
                    {Array.from({ length: 11 }, (_, i) => {
                      const value = (i / 100).toFixed(2);
                      return (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      );
                    })}
                  </select>

                  <button
                    onClick={handleIncreaseRate}
                    disabled={!tid || !boxId || MATCH?.status !== "OPEN"}
                    className="p-3 bg-emerald-500/20 rounded-xl text-emerald-300 border border-emerald-500/30"
                  >
                    <MdAdd size={18} />
                  </button>

                </div>
              </div>
              <div className="space-y-2">
                <label className="text-white/60 text-xs flex items-center gap-1">
                  <MdAttachMoney size={14} />
                  Size
                </label>
                <input
                  type="number"
                  placeholder="Enter size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className={inputStyleClasses}
                  disabled={MATCH?.status !== "OPEN"}
                />
              </div>

            </div>

            {/* Update Box Button */}
            <button
              onClick={handleUpdateBox}
              disabled={MATCH?.status !== "OPEN"}
              className="w-full flex items-center justify-center gap-2 py-4 px-4 
                       bg-gradient-to-br from-blue-500/20 to-blue-900/30
                       rounded-xl text-blue-300 font-medium border border-blue-500/30
                       hover:from-blue-500/30 hover:to-blue-900/40 disabled:opacity-40
                       shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(59,130,246,0.1)]
                       hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(59,130,246,0.25)]
                       transition-all duration-300"
            >
              <MdUpdate size={18} />
              UPDATE BOX
            </button>

            {/* Team Status Toggle */}
            {selectedTeam && (
              <button
                onClick={() =>
                  socket.emit("admin:update-team-status", {
                    matchId: MATCH._id,
                    mid: MATCH.mid,
                    tid: selectedTeam.tid,
                    status:
                      selectedTeam.status === "ACTIVE"
                        ? "SUSPENDED"
                        : "ACTIVE",
                  })
                }
                className={selectedTeam.status === "ACTIVE" ? suspendButtonClass : activeButtonClass}
              >
                {selectedTeam.status === "ACTIVE" ? (
                  <>
                    <MdCancel size={16} />
                    SUSPEND TEAM
                  </>
                ) : (
                  <>
                    <MdCheckCircle size={16} />
                    ACTIVATE TEAM
                  </>
                )}
              </button>
            )}

            {/* Live Sync Status */}
            <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
              <MdFiberManualRecord size={8} className="text-emerald-400 animate-pulse" />
              {loading ? "Live syncing..." : status || "Connected"}
            </div>
          </div>

          {/* RIGHT PANEL - LIVE VIEW */}
          <div className={`${gradientCardClass} p-6`}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 
                            flex items-center justify-center border border-white/30">
                <MdVisibility size={18} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-white">Live Match View</h2>
            </div>

            {MATCH && (
              <div className="space-y-4">
                {MATCH.teams.map((t) => {
                  const back = t.boxes.find((b) => b.boxId == 3);
                  const lay = t.boxes.find((b) => b.boxId == 4);

                  return (
                    <div
                      key={t.tid}
                      className={`p-4 rounded-xl border ${t.status === "SUSPENDED"
                        ? "bg-orange-500/10 border-orange-500/30"
                        : "bg-black/40 border-white/10"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 
                                        flex items-center justify-center border border-white/30">
                            <span className="text-white font-bold text-xs">
                              {t.tname?.charAt(0) || "T"}
                            </span>
                          </div>
                          <span className="text-white font-semibold">{t.tname}</span>
                          {t.status === "SUSPENDED" && (
                            <span className="px-2 py-0.5 text-xs bg-orange-500/20 text-orange-300 rounded-full border border-orange-500/50">
                              SUSPENDED
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30">
                          <span className="text-emerald-400/80 text-xs">BACK</span>
                          <p className="text-emerald-400 font-bold text-xl mt-1">
                            {back?.rate?.toFixed(2) ?? "-"}
                          </p>
                        </div>
                        <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/30">
                          <span className="text-red-400/80 text-xs">LAY</span>
                          <p className="text-red-400 font-bold text-xl mt-1">
                            {lay?.rate?.toFixed(2) ?? "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* EXPOSURE SUMMARY */}
        <div className={`${gradientCardClass} p-6 mt-6`}>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 
                          flex items-center justify-center border border-white/30">
              <MdExposure size={18} className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">Exposure Summary</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exposureData?.map((item) => (
              <div key={item.tid} className="bg-black/40 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-semibold">{item.teamName}</span>
                  <span className="text-xs text-white/40">{item.profitSide}</span>
                </div>
                <div className="flex justify-between">
                  <div className="text-center">
                    <span className="text-emerald-400/80 text-xs">BACK</span>
                    <p className="text-emerald-400 font-bold">{formatCurrency(item.backTotal)}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-red-400/80 text-xs">LAY</span>
                    <p className="text-red-400 font-bold">{formatCurrency(item.layTotal)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* USER BETS HISTORY */}
        <div className={`${gradientCardClass} p-6 mt-6`}>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 
                          flex items-center justify-center border border-white/30">
              <MdHistory size={18} className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">User Bets</h2>
            <span className="px-2 py-1 text-xs bg-white/10 text-white/60 rounded-full border border-white/20">
              {bets?.length || 0} bets
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/40 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Team</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Stake</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Rate</th>
                </tr>
              </thead>
              <tbody>
                {bets?.map((bet) => {
                  return (
                    <tr key={bet._id} className="border-t border-white/5 hover:bg-white/5 transition">

                      {/* USER */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white/20 to-white/5 
                          flex items-center justify-center border border-white/30">
                            <span className="text-white font-bold text-xs">
                              {bet.userId?.mobile?.charAt(0) || "U"}
                            </span>
                          </div>
                          <span className="text-white text-sm">
                            {bet.userId?.mobile || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* TEAM */}
                      <td className="px-4 py-3 text-white/80 text-sm">
                        {bet.teamName}
                      </td>

                      {/* TYPE */}
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full border
            ${bet.otype === "back"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                            : "bg-red-500/20 text-red-300 border-red-500/50"
                          }`}>
                          {bet.otype?.toUpperCase()}
                        </span>
                      </td>

                      {/* STAKE */}
                      <td className="px-4 py-3 text-amber-400 font-bold text-sm">
                        {formatCurrency(bet.betAmount)}
                      </td>

                      {/* RATE */}
                      <td className="px-4 py-3 text-white/80 text-sm">
                        {Number(bet.price || 0).toFixed(2)}
                      </td>

                    </tr>
                  );
                })}

                {(!bets || bets.length === 0) && (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-white/40">
                      No bets placed yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={() => setConfirmation({ ...confirmation, isOpen: false })}
        onConfirm={handleConfirmMatchAction}
        type={confirmation.type}
        title={confirmation.type === "open" ? "Open Match" : "Close Match"}
        message={
          confirmation.type === "open"
            ? "Are you sure you want to open this match? Users will be able to place bets."
            : "Are you sure you want to close this match? No further bets will be accepted."
        }
      />

      {/* Global animations */}
      <style jsx global>{`
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

export default WrestlingAdmin;