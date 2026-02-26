import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdSearch,
  MdVisibility,
  MdDelete,
  MdClose,
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdVerified,
  MdCreditCard,
  MdDateRange,
  MdAdminPanelSettings,
  MdPersonOutline,
  MdBadge,
  MdShare,
  MdPeople,
  MdArrowBack,
} from "react-icons/md";
import { FaUserCircle, FaRegIdCard } from "react-icons/fa";
import { FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { getAllUsers, deleteUser } from "../store/reducer/authReducer";

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

const deleteButtonClass =
  "flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-red-500/20 to-red-900/30 \
   rounded-xl text-red-300 font-medium text-sm border border-red-500/30 \
   shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(239,68,68,0.1)] \
   hover:from-red-500/30 hover:to-red-900/40 hover:border-red-500/50 \
   hover:text-red-200 hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(239,68,68,0.25)] \
   transition-all duration-300 disabled:opacity-40";

const inputStyleClasses =
  "w-full px-5 py-3 bg-black/50 border border-white/10 rounded-xl text-white text-sm \
   placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 \
   outline-none transition-all duration-300 backdrop-blur-md \
   shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] focus:shadow-[0_0_25px_rgba(255,255,255,0.1),inset_0_2px_8px_rgba(0,0,0,0.6)]";

/* --------------------------------------------------------
   DELETE CONFIRMATION POPUP COMPONENT
-------------------------------------------------------- */
const DeleteConfirmationPopup = ({ isOpen, onClose, onConfirm, userName, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className={`${gradientCardClass} w-full max-w-md relative overflow-hidden animate-scaleIn`}>
        {/* Decorative glows */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />
        
        {/* Header */}
        <div className="relative z-10 p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/30 to-red-900/40 
                          flex items-center justify-center border border-red-500/50
                          shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <FiAlertCircle size={32} className="text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-[0_2px_5px_black]">
                Delete User
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
            <p className="text-white/90 text-center mb-2">
              Are you sure you want to delete this user?
            </p>
            {userName && (
              <p className="text-white font-semibold text-center text-lg">
                "{userName}"
              </p>
            )}
            <p className="text-red-400/80 text-xs text-center mt-4 flex items-center justify-center gap-1">
              <FiAlertCircle size={14} />
              All data associated with this user will be permanently removed
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
            className={deleteButtonClass}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-red-300/30 border-t-red-300 rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <MdDelete size={16} />
                Yes, Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------
   USER DETAILS PAGE — NEW SEPARATE PAGE (/users/active/:id)
-------------------------------------------------------- */
export const UserDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { users = [] } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (users.length === 0) {
      dispatch(getAllUsers());
    }
  }, [dispatch, users.length]);

  useEffect(() => {
    if (id && users.length > 0) {
      const foundUser = users.find((u) => u._id === id);
      setUser(foundUser);
    }
  }, [id, users]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const result = await dispatch(deleteUser(id));
      
      if (result?.payload?.message) {
        showToast(result.payload.message, "success");
      } else {
        showToast("User deleted successfully", "success");
      }
      
      setShowDeletePopup(false);
      navigate("/users/active");
    } catch (err) {
      showToast(err?.message || "Failed to delete user", "error");
      setShowDeletePopup(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/users/active");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405] p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className={`${gradientCardClass} p-12 text-center`}>
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-lg">Loading user details...</p>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === "admin";
  const fullName = `${user.firstname || ""} ${user.lastname || ""}`.trim() || "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405] p-4 md:p-6 lg:p-8">
      <div className={`${gradientCardClass} w-full max-w-5xl mx-auto relative overflow-hidden`}>
        {/* Decorative glows */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        
        {/* Header with back button */}
        <div className="relative z-10 p-6 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={handleGoBack}
              className="p-2 text-white/70 hover:text-white rounded-lg 
                       hover:bg-white/5 border border-transparent hover:border-white/20
                       transition-all duration-300 mr-2"
            >
              <MdArrowBack size={22} />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 
                          flex items-center justify-center border border-white/30
                          shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <MdPerson size={28} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-[0_2px_5px_black]">
                User Details
              </h2>
              <p className="text-white/40 text-sm flex items-center gap-1">
                <FaRegIdCard size={12} />
                ID: {user._id?.slice(-8) || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Profile content - SAME DESIGN as before but in a page */}
        <div className="relative z-10 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - avatar & basic info */}
            <div className="space-y-5">
              <div className="flex flex-col items-center text-center p-5 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-white/30 to-white/5 
                              flex items-center justify-center border border-white/40 mb-3
                              shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                  <span className="text-white font-bold text-3xl drop-shadow-[0_2px_10px_black]">
                    {(user.firstname?.charAt(0) || "U").toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{fullName}</h3>
                <span className={`mt-2 px-4 py-1.5 text-xs font-bold rounded-full border
                  ${isAdmin 
                    ? "bg-purple-500/20 text-purple-300 border-purple-500/50" 
                    : "bg-white/10 text-white/80 border-white/20"}`}>
                  {user.role?.toUpperCase() || "USER"}
                </span>
              </div>

              <div className="p-5 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-sm">
                <h4 className="text-white/80 text-sm font-semibold mb-3 flex items-center gap-2">
                  <MdBadge className="text-white/50" />
                  Account Info
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <MdEmail className="text-white/40" size={16} />
                    <span className="text-white/60 w-20">Email</span>
                    <span className="text-white">{user.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MdPhone className="text-white/40" size={16} />
                    <span className="text-white/60 w-20">Mobile</span>
                    <span className="text-white">{user.mobile || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MdVerified className="text-white/40" size={16} />
                    <span className="text-white/60 w-20">Verified</span>
                    <span className={`${user.is_verified ? "text-emerald-400" : "text-red-400"}`}>
                      {user.is_verified ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MdDateRange className="text-white/40" size={16} />
                    <span className="text-white/60 w-20">Joined</span>
                    <span className="text-white/80 text-xs">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - details */}
            <div className="space-y-5">
              <div className="p-5 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-sm">
                <h4 className="text-white/80 text-sm font-semibold mb-3 flex items-center gap-2">
                  <MdLocationOn className="text-white/50" />
                  Location & Address
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-white/40 text-xs">Country</span>
                      <p className="text-white">{user.country_name || "N/A"} ({user.country_code || "N/A"})</p>
                    </div>
                    <div>
                      <span className="text-white/40 text-xs">State</span>
                      <p className="text-white">{user.state || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-white/40 text-xs">City</span>
                      <p className="text-white">{user.city || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-white/40 text-xs">ZIP</span>
                      <p className="text-white">{user.zip || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-white/40 text-xs">Full Address</span>
                    <p className="text-white/90 text-sm mt-1 bg-black/30 p-2 rounded-lg">
                      {user.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-sm">
                <h4 className="text-white/80 text-sm font-semibold mb-3 flex items-center gap-2">
                  <MdShare className="text-white/50" />
                  Referral & Stats
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                    <span className="text-white/40 text-xs">Referral Code</span>
                    <p className="text-white font-mono text-sm mt-1">{user.referral_code || "N/A"}</p>
                  </div>
                  <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                    <span className="text-white/40 text-xs">Referrals</span>
                    <p className="text-white text-sm mt-1 flex items-center gap-1">
                      <MdPeople size={14} className="text-white/50" />
                      {user.referrals_count || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-amber-500/10 to-amber-900/20 rounded-2xl border border-amber-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-amber-300 font-semibold flex items-center gap-2">
                    <MdCreditCard size={18} />
                    Credit Balance
                  </span>
                  <span className="text-2xl font-bold text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                    ₹{(user.credit || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="relative z-10 p-6 border-t border-white/10 flex justify-end gap-3">
          <button onClick={handleGoBack} className={buttonGradientClass}>
            <MdArrowBack size={16} />
            Back to Users
          </button>
          
          {!isAdmin && (
            <button
              onClick={() => setShowDeletePopup(true)}
              className={deleteButtonClass}
            >
              <MdDelete size={16} />
              Delete User
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      <DeleteConfirmationPopup
        isOpen={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onConfirm={handleDelete}
        userName={fullName}
        isLoading={deleteLoading}
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
      `}</style>
    </div>
  );
};

/* --------------------------------------------------------
   TABLE ROW — with consistent dark theme
-------------------------------------------------------- */
const UserTableRow = ({ user, onView, onDelete }) => {
  const isAdmin = user.role === "admin";
  const fullName = `${user.name || ""}`.trim() || "Unknown";
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/users/${user._id}`);
  };

  return (
    <tr className="border-t border-white/5 hover:bg-white/5 transition-all duration-200 group">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 
                        flex items-center justify-center border border-white/20
                        shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <span className="text-white font-bold text-sm">
              {(user.name?.charAt(0) || "U").toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-semibold text-white group-hover:text-white/90">
              {fullName}
            </div>
            <div className="text-xs text-white/40">
               {user.mobile || "N/A"}
            </div>
          </div>
        </div>
      </td>

      <td className="p-4 text-sm text-white/60">
        {user.country_code || "N/A"}
      </td>

      <td className="p-4">
        <span
          className={`px-3 py-1.5 text-xs font-bold rounded-full border
            ${isAdmin
              ? "bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
              : "bg-white/10 text-white/80 border-white/20"
            }`}
        >
          {user.role?.toUpperCase()}
        </span>
      </td>

      <td className="p-4 text-sm text-white/60">
        {user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "N/A"}
      </td>

      <td className="p-4 font-bold text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.2)]">
        ₹{(user.credit || 0).toFixed(2)}
      </td>

      <td className="p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleView}
            className="p-2 text-white/70 hover:text-white rounded-lg 
                     hover:bg-white/5 border border-transparent hover:border-white/20
                     transition-all duration-300"
            title="View Details"
          >
            <MdVisibility size={18} />
          </button>
          
          <button
            disabled={isAdmin}
            onClick={() => onDelete(user._id, fullName)}
            className={`p-2 rounded-lg transition-all duration-300
              ${isAdmin
                ? "text-white/20 cursor-not-allowed"
                : "text-red-400/70 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/30"
              }`}
            title={isAdmin ? "Cannot delete admin" : "Delete user"}
          >
            <MdDelete size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

/* --------------------------------------------------------
   MAIN COMPONENT — Active Users with Delete Popup
-------------------------------------------------------- */
const ActiveUsers = () => {
  const dispatch = useDispatch();
  const { users = [], loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [deletePopup, setDeletePopup] = useState({
    isOpen: false,
    userId: null,
    userName: ''
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load users on mount
  useEffect(() => {
    dispatch(getAllUsers()).then((res) => {
      if (res?.payload?.message) {
        showToast(res.payload.message, "info");
      }
    });
  }, [dispatch]);

  // Handle delete with popup
  const handleDeleteClick = (userId, userName) => {
    setDeletePopup({
      isOpen: true,
      userId,
      userName
    });
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const result = await dispatch(deleteUser(deletePopup.userId));
      
      if (result?.payload?.message) {
        showToast(result.payload.message, "success");
      } else {
        showToast("User deleted successfully", "success");
      }
      
      setDeletePopup({ isOpen: false, userId: null, userName: '' });
      await dispatch(getAllUsers());
    } catch (err) {
      showToast(err?.message || "Failed to delete user", "error");
      setDeletePopup({ isOpen: false, userId: null, userName: '' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeletePopup({ isOpen: false, userId: null, userName: '' });
  };

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase();

    const sortedUsers = [...users].sort((a, b) => {
      if (a.role === "admin") return -1;
      if (b.role === "admin") return 1;
      return 0;
    });

    return sortedUsers.filter((u) => {
      const email = String(u.email || "").toLowerCase();
      const mobile = String(u.mobile || "").toLowerCase();
      const name = `${u.firstname || ""} ${u.lastname || ""}`.toLowerCase();
      return email.includes(query) || mobile.includes(query) || name.includes(query);
    });
  }, [users, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405] p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className={`${gradientCardClass} p-5 md:p-6 mb-6`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/5 
                          flex items-center justify-center border border-white/30
                          shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <MdPersonOutline size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_5px_black]">
                Active Users
              </h1>
              <p className="text-white/40 text-sm mt-0.5">
                {filteredUsers.length} users • {users.filter(u => u.role === "admin").length} admins
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={inputStyleClasses}
              placeholder="Search by name, email or mobile..."
            />
            <MdSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
          <p className="text-white/50 text-sm">Loading users...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={`${gradientCardClass} p-8 text-center`}>
          <FiAlertCircle size={40} className="text-red-400 mx-auto mb-3" />
          <p className="text-red-300 font-medium">{error}</p>
          <button 
            onClick={() => dispatch(getAllUsers())}
            className="mt-4 px-5 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-white/80 text-sm border border-white/20"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Users Table */}
      {!loading && filteredUsers.length > 0 && (
        <div className={`${gradientCardClass} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/40 border-b border-white/10">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">User</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Country</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Joined</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Balance</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <UserTableRow
                    key={user._id}
                    user={user}
                    onView={() => navigate(`/users/${user._id}`)}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredUsers.length === 0 && (
        <div className={`${gradientCardClass} p-12 text-center`}>
          <MdPersonOutline size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/50 text-lg font-medium">No users found</p>
          <p className="text-white/30 text-sm mt-1">Try adjusting your search query</p>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      <DeleteConfirmationPopup
        isOpen={deletePopup.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        userName={deletePopup.userName}
        isLoading={deleteLoading}
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
      `}</style>
    </div>
  );
};

export default ActiveUsers;