import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser } from "../store/reducer/authReducer";
import { useNavigate } from "react-router-dom";

/* ------------------ ICON LIBRARY (only icons, no emojis) ------------------ */
import {
  MdLockOutline,
  MdEmail,
  MdPhoneIphone,
  MdArrowBack,
  MdAdminPanelSettings,
  MdDashboard,
  MdVpnKey,
  MdVisibility,
  MdVisibilityOff,
  MdPassword,
} from "react-icons/md";
import { FiSend, FiLogIn } from "react-icons/fi";

import { HiOutlineIdentification } from "react-icons/hi";

/* ------------------ SMALL COMPONENTS ------------------ */
const RequiredStar = () => (
  <span className="text-gradient-shade ml-1">*</span>
);

/* ------------------ DARK THEME GRADIENT STYLES (fully responsive, glow & shine) ------------------ */
const inputStyleClasses =
  "w-full px-5 py-4 bg-black/50 border border-gray-600/30 rounded-2xl text-white text-lg \
   placeholder-gray-500/70 focus:border-gray-400 focus:ring-4 focus:ring-gray-500/30 \
   hover:border-gray-500/50 outline-none transition-all duration-300 backdrop-blur-md \
   shadow-[0_0_15px_rgba(0,0,0,0.8),inset_0_2px_5px_rgba(0,0,0,0.6)] \
   focus:shadow-[0_0_25px_rgba(120,120,120,0.4)]";

const labelStyleClasses =
  "block text-sm font-medium text-gray-300 mb-2 tracking-wide flex items-center gap-2";

const gradientCardClass =
  "relative bg-gradient-to-br from-[#0B0D10] via-[#15181E] to-[#070809] \
   border border-gray-700/30 rounded-3xl shadow-[0_30px_60px_-15px_black,0_0_0_1px_rgba(255,255,255,0.02)] \
   backdrop-blur-xl transition-all duration-500 hover:border-gray-600/50 hover:shadow-[0_35px_70px_-15px_black,0_0_20px_rgba(150,150,150,0.2)] \
   before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none";

const buttonGradientClass =
  "w-full py-4 px-6 bg-gradient-to-br from-[#2A2F37] to-[#0C0E12] \
   rounded-2xl text-white font-bold tracking-wider text-base \
   border border-gray-600/40 shadow-[0_10px_25px_-8px_black,0_0_15px_rgba(100,100,100,0.2)] \
   hover:from-[#3A404A] hover:to-[#161A1F] hover:border-gray-500/60 \
   hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(180,180,180,0.3)] \
   disabled:opacity-40 transition-all duration-300 flex items-center justify-center gap-3";

/* ------------------ FORGOT PASSWORD ------------------ */
const ForgotPassword = ({ onBackToLogin }) => {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    setTimeout(() => {
      setLoading(false);
      if (!mobile || mobile.length !== 10) {
        setError("Please enter a valid 10 digit mobile number.");
      } else {
        setMessage("OTP has been sent to your registered mobile number.");
      }
    }, 1500);
  };

  return (
    <div className="animate-gradientFade space-y-6">
      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-5 py-4 rounded-2xl flex items-center gap-3 backdrop-blur-sm shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <FiSend className="text-emerald-400" size={20} />
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-5 py-4 rounded-2xl flex items-center gap-3 backdrop-blur-sm shadow-[0_0_20px_rgba(239,68,68,0.15)]">
          <MdLockOutline className="text-red-400" size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleForgotPassword} className="space-y-7">
        <div>
          <label className={labelStyleClasses}>
            <MdPhoneIphone size={18} className="text-gray-400" />
            Mobile Number <RequiredStar />
          </label>
          <input
            type="tel"
            className={inputStyleClasses}
            value={mobile}
            onChange={(e) =>
              setMobile(e.target.value.replace(/\D/g, ""))
            }
            placeholder="Enter registered mobile number"
            maxLength={10}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={buttonGradientClass}
        >
          {loading ? (
            <>Sending OTP...</>
          ) : (
            <>
              <MdPassword size={20} />
              Send OTP
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button
          onClick={onBackToLogin}
          className="group flex items-center gap-2 mx-auto text-gray-400 hover:text-white transition-all duration-300 font-medium"
        >
          <MdArrowBack size={18} className="group-hover:-translate-x-1 transition" />
          Back to Login
        </button>
      </div>
    </div>
  );
};

/* ------------------ MAIN LOGIN ------------------ */
const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [roleError, setRoleError] = useState(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  // Handle redirection based on role
  useEffect(() => {
    if (user && loginAttempted) {
      if (user.role === "admin") {
        navigate("/");
      } else if (user.role === "subadmin") {
        navigate("/livematch");
      } else if (user.role === "user") {
        setRoleError("You don't have permission to access this admin panel.");
        // logoutUser the user since they don't have permission
        dispatch(logoutUser());
      }
    }
  }, [user, navigate, dispatch, loginAttempted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setRoleError(null);
    setLoginAttempted(true);
    dispatch(loginUser({ mobile, password }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-5 overflow-hidden">
      {/* DARK GRADIENT BACKGROUND — BLACK TO GRAY SHINE */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0C0D0F] to-[#1A1C22] z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(180,180,200,0.05)_0%,_transparent_70%)] z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(120,120,140,0.03)_0%,_transparent_60%)] z-0" />
      
      {/* GLOWING ORBS — subtle shine effect */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gray-600/5 rounded-full blur-[120px] z-0" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-500/5 rounded-full blur-[120px] z-0" />
      
      {/* ANIMATED SHINE LINES */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay z-0">
        <div className="absolute -inset-24 bg-gradient-conic from-gray-600/20 via-transparent to-transparent animate-slowSpin" />
      </div>

      <div className="relative w-full max-w-xl z-10">
        {/* HEADER — signature gradient shape with icon and glow */}
        <div className={`${gradientCardClass} mb-6 p-8 text-center border-t border-gray-700/40 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-50" />
          <div className="flex flex-col items-center gap-4 relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-600/30 to-gray-800/50 flex items-center justify-center backdrop-blur-md border border-gray-500/30 shadow-[0_0_30px_rgba(100,100,100,0.3)]">
              {isForgotPassword ? (
                <MdPassword className="text-gray-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" size={36} />
              ) : (
                <MdAdminPanelSettings className="text-gray-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" size={36} />
              )}
            </div>
            {isForgotPassword ? (
              <>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]">
                  Recover Account
                </h2>
                <p className="text-gray-400 text-sm tracking-wide flex items-center gap-2">
                  we'll help you reset
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]">
                  Wrestling Admin
                </h2>
                <p className="text-gray-400 text-sm tracking-wide flex items-center gap-2">
                  <MdDashboard size={14} />
                  Login Dashboard
                </p>
              </>
            )}
          </div>
        </div>

        {/* FORM — glass gradient card with glow */}
        <div className={`${gradientCardClass} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-600/5 to-transparent" />
          <div className="p-8 md:p-10 relative z-10">
            {!isForgotPassword ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className={labelStyleClasses}>
                    <MdEmail size={18} className="text-gray-400" />
                    Email or Phone <RequiredStar />
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className={inputStyleClasses}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                      placeholder="Enter your mobile number"
                    />
                    <HiOutlineIdentification className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelStyleClasses}>
                      <MdLockOutline size={18} className="text-gray-400" />
                      Password <RequiredStar />
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-gray-400 hover:text-white text-sm font-medium transition flex items-center gap-1"
                    >
                      <MdVpnKey size={14} />
                      Forgot?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`${inputStyleClasses} pr-12`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    >
                      {showPassword ? (
                        <MdVisibilityOff size={20} />
                      ) : (
                        <MdVisibility size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {(error || roleError) && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-5 py-4 rounded-2xl flex items-center gap-3 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                    <MdLockOutline size={18} />
                    {error || roleError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={buttonGradientClass}
                >
                  {loading ? (
                    "Signing in..."
                  ) : (
                    <>
                      <FiLogIn size={20} />
                      Login
                    </>
                  )}
                </button>
              </form>
            ) : (
              <ForgotPassword
                onBackToLogin={() => setIsForgotPassword(false)}
              />
            )}
          </div>
        </div>

        {/* FOOTER — subtle branding */}
        <div className="mt-8 text-center text-gray-500 text-xs flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
            secure
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
            encrypted
          </span>
          <span>© wrestling panel</span>
        </div>
      </div>

      {/* GLOBAL ANIMATIONS */}
      <style jsx global>{`
        @keyframes gradientFade {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slowSpin {
          0% { transform: rotate(0deg) scale(1.5); }
          100% { transform: rotate(360deg) scale(1.5); }
        }
        .animate-gradientFade {
          animation: gradientFade 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .animate-slowSpin {
          animation: slowSpin 40s linear infinite;
        }
        .bg-gradient-conic {
          background-image: conic-gradient(from 0deg, rgba(180,180,200,0.1) 0deg, transparent 60deg, transparent 300deg, rgba(180,180,200,0.1) 360deg);
        }
        .text-gradient-shade {
          background: linear-gradient(135deg, #c0c0c0, #ffffff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default Login;