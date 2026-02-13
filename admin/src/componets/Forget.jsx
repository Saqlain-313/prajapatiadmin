import { useState } from 'react';
import { 
  MdEmail, 
  MdLock, 
  MdMenu, 
  MdClose,
  MdPersonAdd,
  MdDownload,
  MdArrowBack,
  MdAdminPanelSettings,
  MdVisibility,
  MdVisibilityOff,
  MdPassword,
} from 'react-icons/md';
import { FiLogIn, FiSend } from 'react-icons/fi';

import { HiOutlineMail } from 'react-icons/hi';

/* ------------------ DARK GRADIENT THEME — BLACK & GRAY GLOW ------------------ */
const gradientCardClass =
  "relative bg-gradient-to-br from-[#0B0D10] via-[#15181E] to-[#070809] \
   border border-gray-700/30 rounded-3xl shadow-[0_30px_60px_-15px_black,0_0_0_1px_rgba(255,255,255,0.02)] \
   backdrop-blur-xl transition-all duration-500 hover:border-gray-600/50 hover:shadow-[0_35px_70px_-15px_black,0_0_30px_rgba(150,150,150,0.25)] \
   before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none";

const buttonGradientClass =
  "w-full py-4 px-6 bg-gradient-to-br from-[#2A2F37] to-[#0C0E12] \
   rounded-2xl text-white font-bold tracking-wider text-base \
   border border-gray-600/40 shadow-[0_10px_25px_-8px_black,0_0_15px_rgba(100,100,100,0.2)] \
   hover:from-[#3A404A] hover:to-[#161A1F] hover:border-gray-500/60 \
   hover:shadow-[0_15px_30px_-10px_black,0_0_30px_rgba(180,180,180,0.35)] \
   disabled:opacity-40 transition-all duration-300 flex items-center justify-center gap-3";

const inputStyleClasses =
  "w-full px-5 py-4 bg-black/50 border border-gray-600/30 rounded-2xl text-white text-lg \
   placeholder-gray-500/70 focus:border-gray-400 focus:ring-4 focus:ring-gray-500/30 \
   hover:border-gray-500/50 outline-none transition-all duration-300 backdrop-blur-md \
   shadow-[0_0_15px_rgba(0,0,0,0.8),inset_0_2px_5px_rgba(0,0,0,0.6)] \
   focus:shadow-[0_0_30px_rgba(120,120,120,0.45)]";

const labelStyleClasses =
  "block text-sm font-medium text-gray-300 mb-2 tracking-wide flex items-center gap-2";

const Forget = () => {
  const [currentPage, setCurrentPage] = useState('forgot-password');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Password visibility state

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const ForgotPasswordForm = () => (
    <div className={`${gradientCardClass} w-full max-w-md p-8 md:p-10 relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-600/5 to-transparent" />
      <div className="text-center mb-8 relative z-10">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-600/30 to-gray-800/50 flex items-center justify-center mx-auto mb-5 border border-gray-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(100,100,100,0.3)]">
          <MdPassword className="text-gray-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" size={36} />
        </div>
        <h1 className="font-bold text-3xl md:text-4xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] mb-3">
          Forgot password?
        </h1>
        <p className="text-gray-400 text-base flex items-center justify-center gap-2">
          <HiOutlineMail size={16} />
          Enter your email below
        </p>
      </div>

      <form role="form" className="space-y-7 relative z-10">
        <div>
          <label htmlFor="email" className={labelStyleClasses}>
            <MdEmail size={18} className="text-gray-400" />
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <MdEmail className="text-gray-500" size={18} />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              className={`${inputStyleClasses} pl-12`}
              placeholder="Enter your email address"
              aria-label="Email"
            />
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className={buttonGradientClass}
          >
            <FiSend size={18} />
            Email password reset link
          </button>
        </div>
      </form>
      
      <div className="mt-8 text-center relative z-10">
        <button
          onClick={() => setCurrentPage('login')}
          className="group flex items-center gap-2 mx-auto text-gray-400 hover:text-white transition-all duration-300 font-medium"
        >
          <MdArrowBack size={18} className="group-hover:-translate-x-1 transition" />
          Go back to Sign In
        </button>
      </div>
    </div>
  );

  const LoginForm = () => (
    <div className={`${gradientCardClass} w-full max-w-md p-8 md:p-10 relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-600/5 to-transparent" />
      <div className="text-center mb-8 relative z-10">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-600/30 to-gray-800/50 flex items-center justify-center mx-auto mb-5 border border-gray-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(100,100,100,0.3)]">
          <MdAdminPanelSettings className="text-gray-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" size={36} />
        </div>
        <h1 className="font-bold text-3xl md:text-4xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] mb-3">
          Welcome back
        </h1>
        <p className="text-gray-400 text-base">Sign in to your account</p>
      </div>

      <form className="space-y-7 relative z-10">
        <div>
          <label className={labelStyleClasses}>
            <MdEmail size={18} className="text-gray-400" />
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <MdEmail className="text-gray-500" size={18} />
            </div>
            <input
              type="email"
              className={`${inputStyleClasses} pl-12`}
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label className={labelStyleClasses}>
            <MdLock size={18} className="text-gray-400" />
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <MdLock className="text-gray-500" size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className={`${inputStyleClasses} pl-12 pr-12`}
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

        <button
          type="submit"
          className={buttonGradientClass}
        >
          <FiLogIn size={18} />
          Sign In
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* HEADER — dark gradient with glow */}
      <header className="fixed top-6 left-0 right-0 z-50 px-4 md:px-12">
        <div className={`${gradientCardClass} container mx-auto py-3 px-6 md:px-8 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-600/5 to-transparent" />
          <div className="flex items-center justify-between relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600/30 to-gray-800/50 flex items-center justify-center border border-gray-500/30 shadow-[0_0_15px_rgba(100,100,100,0.3)]">
                <span className="text-white font-bold text-xl drop-shadow-[0_2px_5px_black]">WM</span>
              </div>
              <h2 className="text-lg font-bold text-gray-200">Corporate UI</h2>
            </div>

            {/* Centered Nav — icons only */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
              <button
                onClick={() => setCurrentPage('signup')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition px-4 py-2 rounded-xl hover:bg-white/5 hover:border-gray-600/30 border border-transparent"
              >
                <MdPersonAdd size={18} />
                Sign Up
              </button>
              <button
                onClick={() => setCurrentPage('login')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition px-4 py-2 rounded-xl hover:bg-white/5 hover:border-gray-600/30 border border-transparent"
              >
                <FiLogIn size={18} />
                Sign In
              </button>
            </div>

            {/* Right: Free download */}
            <div className="hidden md:block">
              <button className="flex items-center gap-2 bg-gradient-to-br from-gray-600/30 to-gray-800/40 hover:from-gray-500/40 hover:to-gray-700/50 text-white px-5 py-2 rounded-xl border border-gray-600/40 transition-all shadow-[0_0_15px_rgba(100,100,100,0.2)] hover:shadow-[0_0_25px_rgba(150,150,150,0.3)]">
                <MdDownload size={18} />
                Free download
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={toggleMenu} 
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition border border-transparent hover:border-gray-600/30"
              >
                {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile nav menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-5 pt-5 border-t border-gray-700/40 space-y-2 relative z-10">
              <button
                onClick={() => setCurrentPage('signup')}
                className="flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:bg-white/5 rounded-xl transition"
              >
                <MdPersonAdd size={18} />
                Sign Up
              </button>
              <button
                onClick={() => setCurrentPage('login')}
                className="flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:bg-white/5 rounded-xl transition"
              >
                <FiLogIn size={18} />
                Sign In
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-br from-gray-600/30 to-gray-800/40 text-white rounded-xl border border-gray-600/40">
                <MdDownload size={18} />
                Free download
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT — dark gradient background with glow orbs */}
      <div className="relative min-h-screen flex font-sans antialiased overflow-hidden">
        {/* BLACK TO GRAY GRADIENT BACKGROUND */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0C0D0F] to-[#1A1C22] z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(180,180,200,0.05)_0%,_transparent_70%)] z-0" />
        
        {/* GLOWING ORBS */}
        <div className="absolute top-40 left-20 w-96 h-96 bg-gray-600/10 rounded-full blur-[120px] z-0" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-gray-500/10 rounded-full blur-[120px] z-0" />
        
        {/* Animated shine */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay z-0">
          <div className="absolute -inset-24 bg-gradient-conic from-gray-600/20 via-transparent to-transparent animate-slowSpin" />
        </div>

        {/* Left: Form */}
        <div className="relative w-full md:w-1/2 flex items-center justify-center p-5 lg:p-8 z-10">
          {currentPage === 'login' ? <LoginForm /> : <ForgotPasswordForm />}
        </div>

        {/* Right: Image + text — dark themed with glow */}
        <div
          className="hidden md:flex md:w-1/2 relative bg-cover bg-center z-10 m-8 rounded-3xl overflow-hidden border border-gray-700/40 shadow-[0_30px_60px_-15px_black,0_0_0_1px_rgba(255,255,255,0.02)]"
          style={{ backgroundImage: "url('https://admin.maxifysolutions.in/assets/img/image-sign-in.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 p-8 bg-black/60 backdrop-blur-xl rounded-2xl border border-gray-700/40 shadow-[0_0_30px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)]">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-[0_2px_5px_black]">
              Enter our global community of developers.
            </h2>
            <p className="mt-3 text-gray-400 text-sm flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gray-500"></span>
              Copyright © 2022 Corporate UI Design System
            </p>
          </div>
        </div>
      </div>

      {/* GLOBAL STYLES */}
      <style jsx global>{`
        @keyframes slowSpin {
          0% { transform: rotate(0deg) scale(1.5); }
          100% { transform: rotate(360deg) scale(1.5); }
        }
        .animate-slowSpin {
          animation: slowSpin 40s linear infinite;
        }
        .bg-gradient-conic {
          background-image: conic-gradient(from 0deg, rgba(180,180,200,0.1) 0deg, transparent 60deg, transparent 300deg, rgba(180,180,200,0.1) 360deg);
        }
      `}</style>
    </>
  );
};

export default Forget;