import React, { useState, useRef, useEffect } from 'react';
import { 
  MdNotificationsNone, 
  MdSearch,
  MdSettings,
  MdPerson,
  MdMenu,
  MdClose,
  MdVpnKey,
  MdEmail,
  MdPhone,
  MdAdminPanelSettings,
  MdExpandMore,
  MdAccountCircle,
  MdLock,
} from 'react-icons/md';
import { FiGlobe, FiLogOut } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser, getProfile } from "../store/reducer/authReducer"; // Fixed import

/* -------------------- DARK BLACK & WHITE GLOW THEME -------------------- */
const gradientNavClass = 
  "bg-gradient-to-br from-[#0A0C0E] via-[#0F1115] to-[#050607] \
   border-b border-white/5 shadow-[0_15px_35px_-15px_black,0_0_0_1px_rgba(255,255,255,0.02)] \
   backdrop-blur-xl relative";

const glassCardClass =
  "bg-gradient-to-br from-[#0C0E12] via-[#111419] to-[#080A0C] \
   border border-white/10 rounded-2xl shadow-[0_20px_40px_-15px_black,0_0_0_1px_rgba(255,255,255,0.02)] \
   backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_25px_50px_-15px_black,0_0_20px_rgba(255,255,255,0.1)]";

const buttonIconClass = 
  "p-2.5 text-white/70 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-300 \
   border border-transparent hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]";

/* -------------------- NAVBAR -------------------- */
const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const userDropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  // Get the actual user data (handle nested structure)
  const getActualUser = () => {
    if (!user) return null;
    // Check if user has nested user object
    return user.user || user;
  };

  const actualUser = getActualUser();

  useEffect(() => {
    // Only fetch profile if we don't have user data
    if (!actualUser) {
      dispatch(getProfile());
    }
  }, [dispatch, actualUser]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser()); // Using logoutUser instead of logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!actualUser) return 'Admin User';
    return actualUser.name || actualUser.firstname || actualUser.username || 'Admin User';
  };

  // Get user email
  const getUserEmail = () => {
    if (!actualUser) return 'admin@wrestling.com';
    return actualUser.email || 'admin@wrestling.com';
  };

  // Get user mobile
  const getUserMobile = () => {
    if (!actualUser) return '+91 98765 43210';
    return actualUser.mobile || '+91 98765 43210';
  };

  // Get user role
  const getUserRole = () => {
    if (!actualUser) return 'Admin';
    return actualUser.role || 'Admin';
  };

  // Get user initial
  const getUserInitial = () => {
    if (!actualUser) return 'U';
    const name = actualUser.name || actualUser.firstname || '';
    return name.charAt(0) || actualUser.mobile?.charAt(0) || 'U';
  };

  return (
    <>
      {/* NAVBAR — BLACK & WHITE GLOW */}
      <nav className={`${gradientNavClass} px-4 md:px-6 py-2 flex justify-between items-center sticky top-0 z-30`}>
        {/* Animated glow overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.03)_0%,_transparent_70%)] pointer-events-none" />
        
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3 relative z-10">
          <button
            className={`${buttonIconClass} md:hidden`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <MdClose size={22} /> : <MdMenu size={22} />}
          </button>

          {/* SEARCH — white glass with glow */}

        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 md:gap-3 relative z-10">
          {/* GLOBE ICON */}
          <a href="https://demo3.daltincasino.live/" target="_blank" rel="noreferrer">
            <button className={buttonIconClass}>
              <FiGlobe size={20} />
            </button>
          </a>

         

        

          {/* USER DROPDOWN — GLOWING PROFILE */}
          <div className="relative" ref={userDropdownRef}>
            <button
              className="flex items-center gap-3 p-1.5 pl-2 pr-4 rounded-xl hover:bg-white/5 transition-all duration-300 
                         border border-transparent hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center 
                              border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  {loading ? (
                    <span className="text-white/60">...</span>
                  ) : (
                    <span className="text-white font-bold text-lg drop-shadow-[0_2px_5px_black]">
                      {getUserInitial()}
                    </span>
                  )}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full 
                               border-2 border-black shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-white text-sm font-medium">{getUserDisplayName()}</p>
                <p className="text-white/40 text-xs">{getUserRole()}</p>
              </div>
              <MdExpandMore className={`text-white/60 transition-transform duration-300 ${userDropdownOpen ? 'rotate-180' : ''}`} size={18} />
            </button>

            {/* DROPDOWN MENU — GLASS CARD */}
            {userDropdownOpen && (
              <div className={`${glassCardClass} absolute right-0 mt-3 w-64 py-2 z-50 animate-fadeIn`}>
                {/* User info header */}
                <div className="px-5 py-4 border-b border-white/10">
                  <p className="text-white font-medium">{getUserDisplayName()}</p>
                  <p className="text-white/40 text-xs mt-0.5">{getUserEmail()}</p>
                </div>
                
                <button
                  className="flex items-center gap-3 px-5 py-3 text-sm text-white/80 hover:bg-white/5 w-full transition group"
                  onClick={() => {
                    setShowProfileModal(true);
                    setUserDropdownOpen(false);
                  }}
                >
                  <MdAccountCircle size={18} className="text-white/60 group-hover:text-white" />
                  <span>My Profile</span>
                </button>
                
                

                <hr className="border-white/10 my-1" />

                <button
                  className="flex items-center gap-3 px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 w-full transition group"
                  onClick={handleLogout}
                >
                  <FiLogOut size={18} className="group-hover:text-red-300" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* PROFILE MODAL — ELEGANT DARK GLASS */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className={`${glassCardClass} w-full max-w-md p-8 relative animate-scaleIn overflow-hidden`}>
            {/* Decorative glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            
            

            <div className="flex flex-col items-center text-center mb-6 relative z-10">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-white/30 to-white/5 flex items-center justify-center 
                            border border-white/30 mb-4 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                <MdAdminPanelSettings size={48} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
              </div>
              <h2 className="text-2xl font-bold text-white drop-shadow-[0_2px_5px_black]">
                Admin Profile
              </h2>
              <p className="text-white/40 text-sm mt-1">account information</p>
            </div>

            <div className="space-y-4 bg-black/40 rounded-2xl p-6 border border-white/10 relative z-10 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-white/90">
                <MdPerson className="text-white/50" size={20} />
                <span className="text-sm text-white/60 w-20">Name</span>
                <span className="text-white font-medium">{getUserDisplayName()}</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <MdEmail className="text-white/50" size={20} />
                <span className="text-sm text-white/60 w-20">Email</span>
                <span className="text-white/90">{getUserEmail()}</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <MdPhone className="text-white/50" size={20} />
                <span className="text-sm text-white/60 w-20">Phone</span>
                <span className="text-white/90">{getUserMobile()}</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <MdVpnKey className="text-white/50" size={20} />
                <span className="text-sm text-white/60 w-20">Role</span>
                <span className="text-white uppercase text-xs bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                  {getUserRole()}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-6 relative z-10">
              <button
                className="flex-1 py-3 px-4 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 
                           border border-white/20 rounded-xl text-white transition-all flex items-center justify-center gap-2
                           shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]"
                onClick={() => setShowProfileModal(false)}
              >
                <MdClose size={18} />
                Close
              </button>
             
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL ANIMATIONS */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>
    </>
  );
};

export default Navbar;