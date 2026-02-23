import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
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
  MdArrowBack,
  MdSwapHoriz,
  MdTrendingUp,
  MdTrendingDown,
  MdPerson,
  MdPhone,
  MdEmail,
  MdImage,
  MdUpdate,
  MdPlayArrow,
  MdStop,
  MdAdd,
  MdRemove,
  MdExposure,
  MdHistory,
  MdLogout,
  MdVideocam,
  MdFullscreen,
  MdVolumeUp,
  MdVolumeOff,
  MdPlayCircle,
  MdPauseCircle,
} from "react-icons/md";
import { FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";
import {
  fetchAllMatches,
  closeMatch,
  openMatch,
  updateBoxFromSocket,
  updateTeamStatusFromSocket,
  fetchMatch,
} from "../../store/reducer/wrestlingAdminSlice";
import { getBetHistoryByMid } from "../../store/reducer/wrestlingBetHistorySlice";
import { logoutUser } from "../../store/reducer/authReducer";

const socket = io("http://localhost:5200/", {
  transports: ["websocket"],
});

/* =========================
   DARK GRADIENT THEME
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
   transition-all duration-300";

const closeButtonClass =
  "flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-red-500/20 to-red-900/30 \
   rounded-xl text-red-300 font-medium text-sm border border-red-500/30 \
   shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(239,68,68,0.1)] \
   hover:from-red-500/30 hover:to-red-900/40 hover:border-red-500/50 \
   hover:text-red-200 hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(239,68,68,0.25)] \
   transition-all duration-300";

const openButtonClass =
  "flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 \
   rounded-xl text-emerald-300 font-medium text-sm border border-emerald-500/30 \
   shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(16,185,129,0.1)] \
   hover:from-emerald-500/30 hover:to-emerald-900/40 hover:border-emerald-500/50 \
   hover:text-emerald-200 hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(16,185,129,0.25)] \
   transition-all duration-300";

const statusBadgeClass = {
  OPEN: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
  PENDING: "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
  CLOSED: "bg-red-500/20 text-red-300 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
  SUSPENDED: "bg-orange-500/20 text-orange-300 border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]",
  ACTIVE: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
};

const selectStyleClasses =
  "w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white text-sm \
   focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all \
   backdrop-blur-md shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] cursor-pointer";

const inputStyleClasses =
  "w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white text-sm \
   placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 \
   outline-none transition-all duration-300 backdrop-blur-md \
   shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] focus:shadow-[0_0_25px_rgba(255,255,255,0.1),inset_0_2px_8px_rgba(0,0,0,0.6)]";

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
   COUNTDOWN HELPER
========================= */
const getCountdown = (startTime) => {
  if (!startTime) return "N/A";
  const diff = new Date(startTime).getTime() - Date.now();
  if (diff <= 0) return "Starting...";
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return `${mins}m ${secs}s`;
};

/* =========================
   VIDEO PLAYER COMPONENT
========================= */
const VideoPlayer = ({ src, poster, isPlaying, onPlayPause, onVolumeToggle, isMuted }) => {
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full bg-black rounded-2xl overflow-hidden border border-white/10 group">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={isMuted}
        className="w-full h-full object-cover"
        loop
        playsInline
      />
      
      {/* Video Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onPlayPause}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md border border-white/20 transition"
            >
              {isPlaying ? (
                <MdPauseCircle size={24} className="text-white" />
              ) : (
                <MdPlayCircle size={24} className="text-white" />
              )}
            </button>
            
            <button
              onClick={onVolumeToggle}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md border border-white/20 transition"
            >
              {isMuted ? (
                <MdVolumeOff size={20} className="text-white" />
              ) : (
                <MdVolumeUp size={20} className="text-white" />
              )}
            </button>
          </div>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md border border-white/20 transition"
          >
            <MdFullscreen size={20} className="text-white" />
          </button>
        </div>
      </div>
      
      {/* Play Icon Overlay when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={onPlayPause}
            className="p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md border border-white/20 transition transform hover:scale-110"
          >
            <MdPlayCircle size={48} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

/* =========================
   PROFIT SUMMARY COMPONENT
========================= */
const ProfitSummary = ({ mid }) => {
  const { bets } = useSelector((state) => state.wrestlingBetHistory);
  const { match } = useSelector((state) => state.wrestlingAdmin);

  const calculateProfit = () => {
    if (!match?.teams || !bets) return [];

    return match.teams.map((team) => {
      const teamBets = bets.filter((bet) => bet.teamName === team.tname);
      
      let backTotal = 0;
      let layTotal = 0;
      let backLiability = 0;
      let layLiability = 0;

      teamBets.forEach((bet) => {
        if (bet.otype === "back") {
          backTotal += bet.betAmount || 0;
          backLiability += (bet.betAmount * (bet.price - 1)) || 0;
        } else {
          layTotal += bet.betAmount || 0;
          layLiability += bet.betAmount || 0;
        }
      });

      const profitIfBackWins = backTotal - layLiability;
      const profitIfLayWins = layTotal - backLiability;

      return {
        teamName: team.tname,
        backTotal,
        layTotal,
        backLiability,
        layLiability,
        profitIfBackWins,
        profitIfLayWins,
        status: team.status,
      };
    });
  };

  const profitData = calculateProfit();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">Profit Summary - MID: {mid}</h3>
      <div className="grid grid-cols-1 gap-4">
        {profitData.map((data, index) => (
          <div key={index} className="bg-black/40 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold">{data.teamName}</span>
              <span className={`px-2 py-1 text-xs rounded-full border ${
                data.status === "ACTIVE" 
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                  : "bg-orange-500/20 text-orange-300 border-orange-500/50"
              }`}>
                {data.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <span className="text-emerald-400/80 text-xs">BACK Total</span>
                <p className="text-emerald-400 font-bold">₹{data.backTotal}</p>
                <span className="text-white/40 text-xs">Liability: ₹{data.backLiability}</span>
              </div>
              <div>
                <span className="text-red-400/80 text-xs">LAY Total</span>
                <p className="text-red-400 font-bold">₹{data.layTotal}</p>
                <span className="text-white/40 text-xs">Liability: ₹{data.layLiability}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
              <div>
                <span className="text-white/40 text-xs">Profit if BACK wins</span>
                <p className={`font-bold ${data.profitIfBackWins >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  ₹{data.profitIfBackWins}
                </p>
              </div>
              <div>
                <span className="text-white/40 text-xs">Profit if LAY wins</span>
                <p className={`font-bold ${data.profitIfLayWins >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  ₹{data.profitIfLayWins}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================
   MAIN COMPONENT
========================= */
const WrestlingControlCenter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [tid, setTid] = useState("");
  const [boxId, setBoxId] = useState("");
  const [rate, setRate] = useState("");
  const [size, setSize] = useState("");
  const [timer, setTimer] = useState("");
  const [rateStep, setRateStep] = useState("0.01");
  const [confirmation, setConfirmation] = useState({ isOpen: false, type: "close", id: null });
  const [showProfit, setShowProfit] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [view, setView] = useState("matches"); // 'matches' or 'control'

  // Redux state
  const { matches = [], loading, status } = useSelector(
    (state) => state.wrestlingAdmin
  );
  const { match: selectedMatch, loading: matchLoading } = useSelector(
    (state) => state.wrestlingAdmin
  );
  const { bets } = useSelector((state) => state.wrestlingBetHistory);

  // Force re-render every second for countdown
  const [, tick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => tick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Initial fetch
  useEffect(() => {
    dispatch(fetchAllMatches()).then((res) => {
      if (res?.payload?.message) {
        showToast(res.payload.message, "info");
      }
    });
  }, [dispatch]);

  // Fetch selected match details
  useEffect(() => {
    if (selectedMatchId) {
      dispatch(fetchMatch(selectedMatchId));
    }
  }, [selectedMatchId, dispatch]);

  // Fetch bet history when match changes
  // useEffect(() => {
  //   if (selectedMatch?.mid) {
  //     dispatch(getBetHistoryByMid(selectedMatch.mid));
  //   }
  // }, [selectedMatch?.mid, dispatch]);

  // Socket connection
  useEffect(() => {
    if (selectedMatch?.mid) {
      socket.emit("join-match", String(selectedMatch.mid));
    }
  }, [selectedMatch?.mid]);

  // Socket listeners
  useEffect(() => {
    const boxHandler = (payload) => {
      dispatch(updateBoxFromSocket(payload));
    };

    const teamStatusHandler = (payload) => {
      dispatch(updateTeamStatusFromSocket(payload));
    };

    socket.on("box:update", boxHandler);
    socket.on("team:status-update", teamStatusHandler);

    return () => {
      socket.off("box:update", boxHandler);
      socket.off("team:status-update", teamStatusHandler);
    };
  }, [dispatch]);

  // Keyboard shortcuts for rate control
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedMatch || selectedMatch.status !== "OPEN" || !tid || view !== "control") return;

      if (e.key === "ArrowUp") {
        e.preventDefault();
        handleIncreaseRate();
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        handleDecreaseRate();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMatch, tid, rateStep, view]);

  const minRate = 0.00;
  const maxRate = 1.99;

  /* =========================
     TEAM SWITCH
  ========================= */
  const switchTeam = (currentTeam) => {
    if (!selectedMatch || !selectedMatch.teams) return;

    const playableTeams = selectedMatch.teams.filter(
      (t) => t.side === "A" || t.side === "B"
    );

    if (playableTeams.length < 2) return;

    const nextTeam = playableTeams.find(
      (t) => String(t.tid) !== String(currentTeam.tid)
    );

    if (!nextTeam) return;

    socket.emit("admin:update-team-status", {
      matchId: selectedMatch._id,
      mid: selectedMatch.mid,
      tid: currentTeam.tid,
      status: "SUSPENDED",
    });

    socket.emit("admin:update-team-status", {
      matchId: selectedMatch._id,
      mid: selectedMatch.mid,
      tid: nextTeam.tid,
      status: "ACTIVE",
    });

    setTimeout(() => {
      setTid(String(nextTeam.tid));
      setBoxId("3");
    }, 80);

    showToast("Team Switched 🔁", "info");
  };

  /* =========================
     UPDATE ALL BOXES
  ========================= */
  const updateAllBoxes = (team, newBackRate, newLayRate) => {
    const gap = 0.01;

    newBackRate = Math.max(minRate, Math.min(maxRate, newBackRate));
    newLayRate = Math.max(minRate, Math.min(maxRate, newLayRate));

    if (newLayRate <= newBackRate) {
      newLayRate = +(newBackRate + gap).toFixed(2);
    }

    const box2Back = +(newBackRate - gap).toFixed(2);
    const box1Back = +(box2Back - gap).toFixed(2);
    const box5Lay = +(newLayRate + gap).toFixed(2);
    const box6Lay = +(box5Lay - gap).toFixed(2);

    const ladder = [
      { boxId: 1, rate: box1Back },
      { boxId: 2, rate: box2Back },
      { boxId: 3, rate: newBackRate },
      { boxId: 4, rate: newLayRate },
      { boxId: 5, rate: box5Lay },
      { boxId: 6, rate: box6Lay },
    ];

    ladder.forEach((box) => {
      const existing = team.boxes.find(b => b.boxId == box.boxId);
      if (!existing) return;

      socket.emit("admin:update-box", {
        matchId: selectedMatch._id,
        mid: selectedMatch.mid,
        tid: team.tid,
        boxId: box.boxId,
        rate: box.rate,
        size: existing.size || 0,
        timer: existing.timer || 0,
      });
    });
  };

  /* =========================
     HANDLE INCREASE/DECREASE
  ========================= */
  const handleIncreaseRate = () => {
    if (!selectedMatch || selectedMatch.status !== "OPEN" || !tid) return;

    const team = selectedMatch.teams.find(
      (t) => String(t.tid) === String(tid)
    );
    if (!team) return;

    const backBox = team.boxes.find(b => b.boxId == 3);
    const layBox = team.boxes.find(b => b.boxId == 4);
    if (!backBox || !layBox) return;

    const step = Number(rateStep);
    let newBackRate = +(Number(backBox.rate) + step).toFixed(2);
    let newLayRate = +(Number(layBox.rate) + step).toFixed(2);

    if (newBackRate >= maxRate || newLayRate >= maxRate) {
      switchTeam(team);
      showToast("Auto Suspended (MAX hit) 🔁", "info");
      return;
    }

    updateAllBoxes(team, newBackRate, newLayRate);
  };

  const handleDecreaseRate = () => {
    if (!selectedMatch || selectedMatch.status !== "OPEN" || !tid) return;

    const team = selectedMatch.teams.find(
      (t) => String(t.tid) === String(tid)
    );
    if (!team) return;

    const backBox = team.boxes.find(b => b.boxId == 3);
    const layBox = team.boxes.find(b => b.boxId == 4);
    if (!backBox || !layBox) return;

    const step = Number(rateStep);
    let newBackRate = +(Number(backBox.rate) - step).toFixed(2);
    let newLayRate = +(Number(layBox.rate) - step).toFixed(2);

    if (newBackRate <= minRate || newLayRate <= minRate) {
      switchTeam(team);
      showToast("Auto Suspended (MIN hit) 🔁", "info");
      return;
    }

    updateAllBoxes(team, newBackRate, newLayRate);
  };

  /* =========================
     MATCH ACTIONS
  ========================= */
  const handleMatchClick = (id) => {
    setSelectedMatchId(id);
    setView("control");
  };

  const handleBackToMatches = () => {
    setView("matches");
    setSelectedMatchId(null);
    setTid("");
    setBoxId("");
  };

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
      if (selectedMatchId === id) {
        dispatch(fetchMatch(id));
      }
    } catch (error) {
      showToast(error.message || "An error occurred", "error");
    }
  };

  const handleUpdateBox = () => {
    if (!selectedMatch || selectedMatch.status !== "OPEN") {
      showToast("Match is not open", "error");
      return;
    }
    if (!tid || !boxId || !rate) {
      showToast("Select team, box and rate", "error");
      return;
    }

    socket.emit("admin:update-box", {
      matchId: selectedMatch._id,
      mid: selectedMatch.mid,
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

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();   // important unwrap()
  
      // clear everything
      localStorage.clear();
      sessionStorage.clear();
  
      navigate("/login");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  const selectedTeam = selectedMatch?.teams?.find(
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

  const exposureData = selectedMatch?.teams?.map((team) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405]">
      
      {/* HEADER with Logout */}
      <div className={`${gradientCardClass} m-4 p-4 md:p-5`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/20 to-red-900/30 
                          flex items-center justify-center border border-red-500/30
                          shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <MdSportsMma size={28} className="text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_5px_black]">
                Wrestling Control Center
              </h1>
              <p className="text-white/40 text-sm mt-0.5 flex items-center gap-2 flex-wrap">
                {view === "matches" ? (
                  <>
                    <span>{matches.length} total matches</span>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="text-emerald-400">
                      {matches.filter(m => m.status === "OPEN").length} live
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="text-amber-400">
                      {matches.filter(m => m.status === "PENDING").length} pending
                    </span>
                  </>
                ) : (
                  <>
                    <span>Controlling: {selectedMatch?.teams?.map(t => t.tname).join(" vs ")}</span>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span className={`px-2 py-0.5 text-xs rounded-full border ${statusBadgeClass[selectedMatch?.status]}`}>
                      {selectedMatch?.status}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {view === "control" && (
              <button
                onClick={handleBackToMatches}
                className={buttonGradientClass}
              >
                <MdArrowBack size={18} />
                Back to Matches
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-red-500/20 to-red-900/30
                       rounded-xl text-red-300 font-medium text-sm border border-red-500/30
                       hover:from-red-500/30 hover:to-red-900/40 hover:border-red-500/50
                       transition-all duration-300"
            >
              <MdLogout size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 pt-0">
        <div className=" mx-auto">
          
          {/* MATCHES VIEW */}
          {view === "matches" && (
            <>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <MdSportsMma size={20} className="text-red-400" />
                Select Match to Control
              </h2>
              
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {matches.map((match) => {
                  const hasStartTime = Boolean(match.startTime);
                  const startAt = hasStartTime ? new Date(match.startTime) : null;

                  return (
                    <div
                      key={match._id}
                      onClick={() => handleMatchClick(match._id)}
                      className={`${gradientCardClass} p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-white/30`}
                    >
                      {/* TOP BAR — status and match ID */}
                      <div className="flex justify-between items-center mb-3">
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded-full border
                            ${statusBadgeClass[match.status] || statusBadgeClass.PENDING}`}
                        >
                          {match.status}
                        </span>
                        <span className="text-xs text-white/40 font-mono">
                          MID: {match.mid}
                        </span>
                      </div>

                      {/* TEAMS */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1 text-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 
                                        flex items-center justify-center mx-auto mb-1 border border-white/30">
                            <span className="text-white font-bold text-xs">
                              {match.teams?.[0]?.tname?.charAt(0) || "A"}
                            </span>
                          </div>
                          <h3 className="text-white font-semibold text-xs truncate">
                            {match.teams?.[0]?.tname || "Team A"}
                          </h3>
                        </div>
                        
                        <div className="flex flex-col items-center px-1">
                          <span className="text-white/40 text-xs font-bold">VS</span>
                        </div>
                        
                        <div className="flex-1 text-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 
                                        flex items-center justify-center mx-auto mb-1 border border-white/30">
                            <span className="text-white font-bold text-xs">
                              {match.teams?.[1]?.tname?.charAt(0) || "B"}
                            </span>
                          </div>
                          <h3 className="text-white font-semibold text-xs truncate">
                            {match.teams?.[1]?.tname || "Team B"}
                          </h3>
                        </div>
                      </div>

                      {/* TIME INFO */}
                      <div className="mb-3 bg-black/40 rounded-lg p-2 border border-white/5">
                        {match.status === "PENDING" && hasStartTime && (
                          <div className="flex items-center gap-1 text-xs">
                            <MdAccessTime className="text-amber-400" size={12} />
                            <span className="text-amber-400/80">Starts in:</span>
                            <span className="text-amber-400 font-bold ml-auto">
                              {getCountdown(match.startTime)}
                            </span>
                          </div>
                        )}

                        {match.status === "OPEN" && (
                          <div className="flex items-center gap-1 text-xs">
                            <MdFiberManualRecord className="text-emerald-400 animate-pulse" size={12} />
                            <span className="text-emerald-400 font-semibold ml-auto">
                              LIVE NOW
                            </span>
                          </div>
                        )}
                      </div>

                      {/* BET LIMITS */}
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="bg-black/40 rounded-lg p-1 text-center border border-white/5">
                          <span className="text-white/40 text-xs">Min</span>
                          <p className="text-amber-400 font-bold text-xs">
                            ₹{match.minbet}
                          </p>
                        </div>
                        <div className="bg-black/40 rounded-lg p-1 text-center border border-white/5">
                          <span className="text-white/40 text-xs">Max</span>
                          <p className="text-amber-400 font-bold text-xs">
                            ₹{match.maxbet}
                          </p>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMatchClick(match._id);
                          }}
                          className={viewButtonClass + " text-xs py-2"}
                        >
                          <MdVisibility size={14} />
                          Control Match
                        </button>
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
            </>
          )}

          {/* CONTROL VIEW */}
          {view === "control" && selectedMatch && (
            <>
              {/* VIDEO SECTION */}
              <div className={`${gradientCardClass} p-6 mb-6`}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-red-900/30 
                                flex items-center justify-center border border-red-500/30">
                    <MdVideocam size={18} className="text-red-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Live Stream</h2>
                  <span className="px-2 py-1 text-xs bg-red-500/20 text-red-300 rounded-full border border-red-500/50 ml-auto">
                    {selectedMatch.status === "OPEN" ? "LIVE" : "OFFLINE"}
                  </span>
                </div>
                
                <VideoPlayer
                  src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
                  poster={selectedMatch?.img || "https://via.placeholder.com/1280x720?text=Wrestling+Stream"}
                  isPlaying={videoPlaying}
                  onPlayPause={() => setVideoPlaying(!videoPlaying)}
                  isMuted={videoMuted}
                  onVolumeToggle={() => setVideoMuted(!videoMuted)}
                />
              </div>

              {/* CONTROL PANELS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT PANEL - ADMIN CONTROL */}
                <div className={`${gradientCardClass} p-6 space-y-6`}>
                  {/* Match Image */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/10">
                    <img
                      src={selectedMatch?.img || "https://via.placeholder.com/800x300?text=Wrestling+Match"}
                      alt="Match"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-full border ${statusBadgeClass[selectedMatch?.status]}`}>
                        {selectedMatch?.status}
                      </span>
                    </div>
                  </div>

                  {/* Match Status Controls */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <MdFiberManualRecord className={selectedMatch?.status === "OPEN" ? "text-emerald-400 animate-pulse" : "text-red-400"} size={12} />
                      <span className="text-white/60 text-sm">Status:</span>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${statusBadgeClass[selectedMatch?.status]}`}>
                        {selectedMatch?.status}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenClick(selectedMatch._id)}
                        disabled={selectedMatch?.status === "OPEN"}
                        className={openButtonClass}
                      >
                        <MdLockOpen size={16} />
                        OPEN
                      </button>
                      <button
                        onClick={() => handleCloseClick(selectedMatch._id)}
                        disabled={selectedMatch?.status === "CLOSED"}
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
                        onChange={(e) => {
                          const selectedTid = e.target.value;
                          setTid(selectedTid);

                          const team = selectedMatch?.teams?.find(
                            (t) => String(t.tid) === String(selectedTid)
                          );

                          if (team?.boxes?.length) {
                            const backBox = team.boxes.find((b) => b.boxId == 3);
                            if (backBox) {
                              setBoxId(String(backBox.boxId));
                            } else {
                              setBoxId(String(team.boxes[0].boxId));
                            }
                          } else {
                            setBoxId("");
                          }
                        }}
                        className={selectStyleClasses}
                      >
                        <option value="">Choose team</option>
                        {selectedMatch?.teams?.map((t) => (
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

                  {/* Rate Control */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-white/60 text-xs flex items-center gap-1">
                        <MdTrendingUp size={14} />
                        Rate Control
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleDecreaseRate}
                          disabled={!tid || !boxId || selectedMatch?.status !== "OPEN"}
                          className="p-3 bg-red-500/20 rounded-xl text-red-300 border border-red-500/30 disabled:opacity-40"
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
                          disabled={!tid || !boxId || selectedMatch?.status !== "OPEN"}
                          className="p-3 bg-emerald-500/20 rounded-xl text-emerald-300 border border-emerald-500/30 disabled:opacity-40"
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
                        disabled={selectedMatch?.status !== "OPEN"}
                      />
                    </div>
                  </div>

                  {/* Update Box Button */}
                  <button
                    onClick={handleUpdateBox}
                    disabled={selectedMatch?.status !== "OPEN"}
                    className="w-full flex items-center justify-center gap-2 py-4 px-4 
                             bg-gradient-to-br from-blue-500/20 to-blue-900/30
                             rounded-xl text-blue-300 font-medium border border-blue-500/30
                             hover:from-blue-500/30 hover:to-blue-900/40 disabled:opacity-40
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
                          matchId: selectedMatch._id,
                          mid: selectedMatch.mid,
                          tid: selectedTeam.tid,
                          status:
                            selectedTeam.status === "ACTIVE"
                              ? "SUSPENDED"
                              : "ACTIVE",
                        })
                      }
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-300
                        ${selectedTeam.status === "ACTIVE" 
                          ? "bg-gradient-to-br from-red-500/20 to-red-900/30 text-red-300 border-red-500/30 hover:from-red-500/30 hover:to-red-900/40" 
                          : "bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 text-emerald-300 border-emerald-500/30 hover:from-emerald-500/30 hover:to-emerald-900/40"}`}
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
                    {matchLoading ? "Live syncing..." : status || "Connected"}
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

                  {selectedMatch && (
                    <div className="space-y-4">
                      {selectedMatch.teams.map((t) => {
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

                  <button
                    onClick={() => setShowProfit(true)}
                    className="mt-6 w-full flex items-center justify-center gap-2 py-3 
                             bg-gradient-to-br from-purple-500/20 to-purple-900/30
                             rounded-xl text-purple-300 font-medium border border-purple-500/30
                             hover:from-purple-500/30 hover:to-purple-900/40
                             transition-all duration-300"
                  >
                    <MdExposure size={18} />
                    VIEW PROFIT SUMMARY
                  </button>
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
                  <span className="px-2 py-1 text-xs bg-white/10 text-white/60 rounded-full border border-white/20 ml-auto">
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
                      {bets?.map((bet) => (
                        <tr key={bet._id} className="border-t border-white/5 hover:bg-white/5 transition">
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
                          <td className="px-4 py-3 text-white/80 text-sm">
                            {bet.teamName}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-bold rounded-full border
                              ${bet.otype === "back"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                                : "bg-red-500/20 text-red-300 border-red-500/50"
                              }`}>
                              {bet.otype?.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-amber-400 font-bold text-sm">
                            {formatCurrency(bet.betAmount)}
                          </td>
                          <td className="px-4 py-3 text-white/80 text-sm">
                            {Number(bet.price || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}

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
            </>
          )}
        </div>
      </div>

      {/* Profit Summary Modal */}
      {showProfit && selectedMatch?.mid && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowProfit(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full border border-white/20 text-white hover:bg-white/10"
            >
              <MdClose size={20} />
            </button>
            <div className={`${gradientCardClass} p-6`}>
              <ProfitSummary mid={selectedMatch.mid} />
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={() => setConfirmation({ ...confirmation, isOpen: false })}
        onConfirm={handleConfirmAction}
        type={confirmation.type}
        title={confirmation.type === "open" ? "Open Match" : "Close Match"}
        message={
          confirmation.type === "open"
            ? "Are you sure you want to open this match? Users will be able to place bets."
            : "Are you sure you want to close this match? No further bets will be accepted."
        }
      />

      {/* Global animations */}
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

export default WrestlingControlCenter;