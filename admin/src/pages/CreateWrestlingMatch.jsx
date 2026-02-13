import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  MdGroups,
  MdCalendarToday,
  MdAccessTime,
  MdAttachMoney,
  MdArrowBack,
  MdAddCircleOutline,
  MdImage,
  MdSportsMma,
  MdCheckCircle,
  MdWarning,
  MdClose,
  MdUpload,
  
} from "react-icons/md";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";

import {
  createWrestlingMatch,
  clearStatus,
} from "../store/reducer/wrestlingAdminSlice";
import { CoinsIcon } from "lucide-react";

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

const createButtonClass =
  "flex items-center justify-center gap-2 w-full py-4 px-6 bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 \
   rounded-xl text-emerald-300 font-bold text-base border border-emerald-500/30 \
   shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(16,185,129,0.1)] \
   hover:from-emerald-500/30 hover:to-emerald-900/40 hover:border-emerald-500/50 \
   hover:text-emerald-200 hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(16,185,129,0.25)] \
   transition-all duration-300 disabled:opacity-50";

const inputStyleClasses =
  "w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white text-sm \
   placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 \
   outline-none transition-all duration-300 backdrop-blur-md \
   shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] focus:shadow-[0_0_25px_rgba(255,255,255,0.1),inset_0_2px_8px_rgba(0,0,0,0.6)]";

const selectStyleClasses =
  "w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white text-sm \
   focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all \
   backdrop-blur-md shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] cursor-pointer";

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

const CreateWrestlingMatch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector(
    (state) => state.wrestlingAdmin
  );

  const [teamAName, setTeamAName] = useState("");
  const [teamBName, setTeamBName] = useState("");
  const [matchDate, setMatchDate] = useState(null);
  const [time, setTime] = useState("");
  const [minbet, setMinbet] = useState("");
  const [maxbet, setMaxbet] = useState("");

  /* IMAGE STATES */
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ================= IMAGE HANDLER ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    showToast("Image selected successfully", "success");
  };

  /* ================= TIME OPTIONS ================= */
  const timeOptions = [];

  if (matchDate) {
    const now = new Date();
    const roundedNow = new Date(now);
    const roundedMinutes = Math.ceil(now.getMinutes() / 5) * 5;

    if (roundedMinutes === 60) {
      roundedNow.setHours(now.getHours() + 1, 0, 0, 0);
    } else {
      roundedNow.setMinutes(roundedMinutes, 0, 0);
    }

    const isToday =
      new Date(matchDate).toDateString() === new Date().toDateString();

    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 5) {
        const slot = new Date(matchDate);
        slot.setHours(h, m, 0, 0);
        if (isToday && slot < roundedNow) continue;

        const hour12 = h % 12 === 0 ? 12 : h % 12;
        const ampm = h < 12 ? "AM" : "PM";

        timeOptions.push({
          label: `${hour12.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")} ${ampm}`,
          value: `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}`,
        });
      }
    }
  }

  /* ================= SUBMIT ================= */
  const submitHandler = (e) => {
    e.preventDefault();

    if (
      !teamAName ||
      !teamBName ||
      !matchDate ||
      !time ||
      minbet === "" ||
      maxbet === ""
    ) {
      showToast("Please fill all required fields", "error");
      return;
    }

    if (+maxbet < +minbet) {
      showToast("Max bet cannot be less than Min bet", "error");
      return;
    }

    const [hh, mm] = time.split(":").map(Number);
    const startTime = new Date(matchDate);
    startTime.setHours(hh, mm, 0, 0);

    dispatch(
      createWrestlingMatch({
        teamAName,
        teamBName,
        startTime,
        minbet: Number(minbet),
        maxbet: Number(maxbet),
        img: image,
      })
    );
  };

  /* ================= SUCCESS RESET ================= */
  useEffect(() => {
    if (success) {
      setTeamAName("");
      setTeamBName("");
      setMatchDate(null);
      setTime("");
      setMinbet("");
      setMaxbet("");
      setImage(null);
      setPreview(null);
      
      showToast("Match created successfully", "success");
      
      const t = setTimeout(() => dispatch(clearStatus()), 1500);
      return () => clearTimeout(t);
    }
  }, [success, dispatch]);

  /* ================= ERROR HANDLER ================= */
  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405] p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER CARD */}
        <div className={`${gradientCardClass} p-6 md:p-8 mb-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 
                            flex items-center justify-center border border-white/30
                            shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <MdSportsMma size={26} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_5px_black]">
                  Create Wrestling Match
                </h1>
                <p className="text-white/40 text-sm mt-0.5 flex items-center gap-2">
                  <MdAddCircleOutline size={14} />
                  Add new match to the platform
                </p>
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

        {/* FORM CARD */}
        <div className={`${gradientCardClass} p-6 md:p-8`}>
          <form
            onSubmit={submitHandler}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* TEAM A */}
            <div className="space-y-2">
              <label className="text-white/60 text-xs flex items-center gap-1">
                <MdGroups size={14} />
                Team A Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <MdGroups className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  placeholder="Enter team A name"
                  value={teamAName}
                  onChange={(e) => setTeamAName(e.target.value)}
                  className={`${inputStyleClasses} pl-11`}
                />
              </div>
            </div>

            {/* TEAM B */}
            <div className="space-y-2">
              <label className="text-white/60 text-xs flex items-center gap-1">
                <MdGroups size={14} />
                Team B Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <MdGroups className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  placeholder="Enter team B name"
                  value={teamBName}
                  onChange={(e) => setTeamBName(e.target.value)}
                  className={`${inputStyleClasses} pl-11`}
                />
              </div>
            </div>

            {/* DATE */}
            <div className="space-y-2">
              <label className="text-white/60 text-xs flex items-center gap-1">
                <MdCalendarToday size={14} />
                Match Date <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <MdCalendarToday className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 z-10" size={18} />
                <DatePicker
                  selected={matchDate}
                  onChange={setMatchDate}
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select match date"
                  className={`${inputStyleClasses} pl-11`}
                  wrapperClassName="w-full"
                />
              </div>
            </div>

            {/* TIME */}
            <div className="space-y-2">
              <label className="text-white/60 text-xs flex items-center gap-1">
                <MdAccessTime size={14} />
                Match Time <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <MdAccessTime className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={`${selectStyleClasses} pl-11 appearance-none`}
                >
                  <option value="">Select time slot</option>
                  {timeOptions.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* MIN BET */}
            <div className="space-y-2">
              <label className="text-white/60 text-xs flex items-center gap-1">
                <CoinsIcon size={14} />
                Minimum Bet <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <MdAttachMoney className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="number"
                  placeholder="Enter minimum bet amount"
                  value={minbet}
                  onChange={(e) => setMinbet(e.target.value)}
                  className={`${inputStyleClasses} pl-11`}
                />
              </div>
            </div>

            {/* MAX BET */}
            <div className="space-y-2">
              <label className="text-white/60 text-xs flex items-center gap-1">
                <CoinsIcon size={14} />
                Maximum Bet <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <MdAttachMoney className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="number"
                  placeholder="Enter maximum bet amount"
                  value={maxbet}
                  onChange={(e) => setMaxbet(e.target.value)}
                  className={`${inputStyleClasses} pl-11`}
                />
              </div>
            </div>

            {/* IMAGE UPLOAD - FULL WIDTH */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-white/60 text-xs flex items-center gap-1">
                <MdImage size={14} />
                Match Image (Optional)
              </label>
              
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="match-image-upload"
                />
                <label
                  htmlFor="match-image-upload"
                  className={`${inputStyleClasses} flex items-center justify-between cursor-pointer group`}
                >
                  <span className="flex items-center gap-2 text-white/50 group-hover:text-white/80">
                    <MdUpload size={18} />
                    {preview ? "Change image" : "Upload match image"}
                  </span>
                  {preview && (
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full border border-emerald-500/50">
                      Selected
                    </span>
                  )}
                </label>
              </div>

              {/* IMAGE PREVIEW */}
              {preview && (
                <div className="mt-4 relative rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={preview}
                    alt="Match preview"
                    className="w-full h-56 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setPreview(null);
                    }}
                    className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded-lg border border-white/20 text-white/80 hover:text-white transition"
                  >
                    <MdClose size={16} />
                  </button>
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg border border-white/20">
                    <span className="text-white/80 text-xs flex items-center gap-1">
                      <MdCheckCircle size={12} className="text-emerald-400" />
                      Preview Ready
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={loading}
                className={createButtonClass}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-emerald-300/30 border-t-emerald-300 rounded-full animate-spin" />
                    Creating Match...
                  </>
                ) : (
                  <>
                    <MdAddCircleOutline size={20} />
                    Create Match
                  </>
                )}
              </button>
            </div>
          </form>

          {/* STATUS MESSAGES - now handled by toast, but keep for accessibility */}
          {error && (
            <p className="text-red-400/70 text-xs text-center mt-4 flex items-center justify-center gap-1">
              <MdWarning size={14} />
              {error}
            </p>
          )}
          {success && (
            <p className="text-emerald-400/70 text-xs text-center mt-4 flex items-center justify-center gap-1">
              <MdCheckCircle size={14} />
              Match created successfully
            </p>
          )}
        </div>

        {/* INFO CARD - optional helper */}
        <div className={`${gradientCardClass} p-4 mt-6`}>
          <div className="flex items-center gap-2 text-white/50 text-xs">
            <MdWarning size={14} className="text-amber-400" />
            <span>All fields marked with <span className="text-red-400">*</span> are required</span>
            <span className="w-1 h-1 rounded-full bg-white/20 mx-2" />
            <span>Match will be created in PENDING status</span>
          </div>
        </div>
      </div>

      {/* Global animations */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .react-datepicker {
          background: #0F1115 !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 16px !important;
          color: white !important;
          box-shadow: 0 20px 40px -10px black, 0 0 0 1px rgba(255,255,255,0.02) !important;
        }
        .react-datepicker__header {
          background: #0A0C0F !important;
          border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        }
        .react-datepicker__current-month,
        .react-datepicker__day-name {
          color: white !important;
        }
        .react-datepicker__day {
          color: rgba(255,255,255,0.8) !important;
        }
        .react-datepicker__day:hover {
          background: rgba(255,255,255,0.1) !important;
        }
        .react-datepicker__day--selected {
          background: rgba(16,185,129,0.3) !important;
          border: 1px solid rgba(16,185,129,0.5) !important;
        }
        .react-datepicker__day--disabled {
          color: rgba(255,255,255,0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default CreateWrestlingMatch;