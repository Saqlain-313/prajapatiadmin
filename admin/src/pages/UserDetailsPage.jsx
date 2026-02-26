
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdVerified,
  MdCreditCard,
  MdDateRange,
  MdBadge,
  MdShare,
  MdPeople,
  MdArrowBack,
  MdDelete,
} from "react-icons/md";
import { FaRegIdCard } from "react-icons/fa";
import { FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { deleteUser, getUserById, updateUser } from "../store/reducer/authReducer";
/* --------------------------------------------------------
   TOAST CONFIG
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
   GRADIENT CLASSES
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

/* --------------------------------------------------------
   DELETE CONFIRMATION POPUP
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
   USER DETAILS PAGE - MAIN COMPONENT
-------------------------------------------------------- */
const UserDetailsPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const { selectedUser, loading } = useSelector((state) => state.auth);

  const user = selectedUser;


  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user data
  useEffect(() => {
    if (userId) {
      console.log("Dispatching getUserById with id:", userId);
      dispatch(getUserById(userId));
    }
  }, [userId, dispatch]);
  // Find user from Redux store

  useEffect(() => {
    if (user) {
      setFormData({
        password: "",
        role: user.role || "user",
        credit: user.credit || 0,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      setUpdateLoading(true);

      const result = await dispatch(
        updateUser({
          userId,
          updateData: formData,
        })
      );

      if (result.meta.requestStatus === "fulfilled") {
        showToast("User updated successfully", "success");
        setIsEditing(false);
      } else {
        showToast(result.payload || "Update failed", "error");
      }
    } catch (err) {
      showToast("Something went wrong", "error");
    } finally {
      setUpdateLoading(false);
    }
  };


  // Handle delete user
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const result = await dispatch(deleteUser(userId));

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

  // Handle go back
  const handleGoBack = () => {
    navigate("/users/active");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405] p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className={`${gradientCardClass} p-12 text-center max-w-md w-full`}>
          <div className="relative">
            <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-white/10 border-t-white/30 rounded-full animate-ping" />
            </div>
          </div>
          <p className="text-white/70 text-lg font-medium">Loading user details...</p>
          <p className="text-white/40 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405] p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className={`${gradientCardClass} p-12 text-center max-w-md w-full`}>
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-900/30 
                        flex items-center justify-center border border-red-500/30 mx-auto mb-6
                        shadow-[0_0_30px_rgba(239,68,68,0.15)]">
            <FiAlertCircle size={40} className="text-red-400" />
          </div>
          <p className="text-white/90 text-xl font-bold mb-2">User Not Found</p>
          <p className="text-white/50 text-sm mb-6">
            {error || "The user you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={handleGoBack}
            className="mx-auto px-6 py-3 bg-gradient-to-br from-white/10 to-white/5 
                     hover:from-white/15 hover:to-white/10 rounded-xl text-white/90 
                     border border-white/20 transition-all duration-300
                     flex items-center gap-2"
          >
            <MdArrowBack size={18} />
            Back to Users List
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === "admin";
  const fullName = `${user.firstname || ""} ${user.lastname || ""}`.trim() || "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405] p-4 md:p-6 lg:p-8">
      {/* Main Card */}
      <div className={`${gradientCardClass} w-full max-w-5xl mx-auto relative overflow-hidden`}>
        {/* Decorative glows */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl opacity-30" />

        {/* Header with back button */}
        <div className="relative z-10 p-6 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={handleGoBack}
              className="p-2 text-white/70 hover:text-white rounded-lg 
                       hover:bg-white/5 border border-transparent hover:border-white/20
                       transition-all duration-300 mr-2 group"
              title="Back to Users"
            >
              <MdArrowBack size={22} className="group-hover:-translate-x-0.5 transition-transform" />
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

          {/* Status Badge */}
        </div>

        {/* Profile content */}
        <div className="relative z-10 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column - avatar & basic info */}
            <div className="space-y-5">
              {/* Avatar Card */}
              <div className="flex flex-col items-center text-center p-6 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-sm
                            hover:border-white/20 transition-all duration-300">
                <div className="relative">
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-white/30 via-white/20 to-white/5 
                                flex items-center justify-center border-2 border-white/40 mb-4
                                shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                    <span className="text-white font-bold text-4xl drop-shadow-[0_4px_15px_black]">
                      {(user.name?.charAt(0) || "U").toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2">
                    <span className={`flex h-5 w-5 rounded-full border-2 border-black/50
                      ${user.is_verified ? 'bg-emerald-500' : 'bg-yellow-500'}`}>
                      <span className={`animate-ping h-full w-full rounded-full 
                        ${user.is_verified ? 'bg-emerald-400' : 'bg-yellow-400'} opacity-75`}></span>
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-1">{user.name}</h3>
                <div className="mt-2">
                  {isEditing ? (
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="subadmin">SubAdmin</option>

                    </select>
                  ) : (
                    <span
                      className={`px-5 py-1.5 text-xs font-bold rounded-full border
        ${user.role === "admin"
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                          : "bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                        }`}
                    >
                      {user.role?.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="w-full mt-4 pt-4 border-t border-white/10">
                  <p className="text-white/40 text-xs">Member since</p>
                  <p className="text-white/80 text-sm">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : "N/A"}
                  </p>
                </div>
              </div>

              {/* Account Info Card */}
              <div className="p-5 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-sm
                            hover:border-white/20 transition-all duration-300">
                <h4 className="text-white/80 text-sm font-semibold mb-4 flex items-center gap-2">
                  <MdBadge className="text-white/50" size={16} />
                  Account Information
                </h4>
                <div className="space-y-4">

                  <div className="flex items-start gap-3 text-sm">
                    <MdPhone className="text-white/40 mt-0.5" size={16} />
                    <div className="flex-1">
                      <span className="text-white/40 text-xs">Mobile Number</span>
                      <p className="text-white text-sm">{user.mobile || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <MdDateRange className="text-white/40 mt-0.5" size={16} />
                    <div className="flex-1">
                      <span className="text-white/40 text-xs">Last Updated</span>
                      <p className="text-white/80 text-xs">
                        {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - details */}
            <div className="space-y-5">
              {/* Location Card */}
              <div className="p-5 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-sm
                            hover:border-white/20 transition-all duration-300">
                <h4 className="text-white/80 text-sm font-semibold mb-4 flex items-center gap-2">
                  <MdLocationOn className="text-white/50" size={16} />
                  Location & Address
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                      <span className="text-white/40 text-xs">Country</span>
                      <p className="text-white font-medium">
                        {user.country_name || "N/A"}
                        {user.country_code && <span className="text-white/40 ml-1">({user.country_code})</span>}
                      </p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                      <span className="text-white/40 text-xs">State</span>
                      <p className="text-white font-medium">{user.state || "N/A"}</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                      <span className="text-white/40 text-xs">City</span>
                      <p className="text-white font-medium">{user.city || "N/A"}</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                      <span className="text-white/40 text-xs">ZIP Code</span>
                      <p className="text-white font-medium">{user.zip || "N/A"}</p>
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <span className="text-white/40 text-xs block mb-2">Full Address</span>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {user.address || "No address provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Referral Card */}
              <div className="p-5 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-sm
                            hover:border-white/20 transition-all duration-300">
                <h4 className="text-white/80 text-sm font-semibold mb-4 flex items-center gap-2">
                  <MdShare className="text-white/50" size={16} />
                  Referral Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-white/5 to-transparent p-4 rounded-xl border border-white/10">
                    <span className="text-white/40 text-xs">Referral Code</span>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-white font-mono text-lg font-bold tracking-wider">
                        {user.myInviteCode || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-white/5 to-transparent p-4 rounded-xl border border-white/10">
                    <span className="text-white/40 text-xs">Total Referrals</span>
                    <div className="mt-2 flex items-center gap-2">
                      <MdPeople size={20} className="text-white/50" />
                      <span className="text-white text-2xl font-bold">
                        {user.referrals_count || 0}
                      </span>
                    </div>
                  </div>
                </div>
                {user.referred_by && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <span className="text-white/40 text-xs">Referred By</span>
                    <p className="text-white/80 text-sm mt-1 font-mono">{user.referred_by}</p>
                  </div>
                )}
              </div>

              {/* Credit Balance Card */}
              <div className="p-5 bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-amber-900/20 
                            rounded-2xl border border-amber-500/30 hover:border-amber-500/50 
                            transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl 
                              group-hover:bg-amber-500/30 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-amber-300 font-semibold flex items-center gap-2">
                      <MdCreditCard size={20} />
                      Credit Balance
                    </span>
                    <span className="text-xs text-amber-400/80 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                      Available
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-4xl font-bold text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                      {isEditing ? (
                        <input
                          type="number"
                          name="credit"
                          value={formData.credit}
                          onChange={handleChange}
                          className="w-full bg-black/50 border border-amber-500/30 rounded-lg px-3 py-2 text-amber-300"
                        />
                      ) : (
                        <span className="text-4xl font-bold text-amber-400">
                          ₹{(user.credit || 0).toLocaleString("en-IN")}
                        </span>
                      )}                    </span>
                    <span className="text-amber-400/60 text-sm">INR</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-amber-400/60 text-xs">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    Active balance
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isEditing && (
            <div className="mt-4">
              <label className="text-white/50 text-xs">New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white mt-1"
              />
            </div>
          )}

          {/* Additional Info Row */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
              <span className="text-white/40 text-xs">User ID</span>
              <p className="text-white/80 text-sm font-mono mt-1 break-all">{user._id}</p>
            </div>
            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
              <span className="text-white/40 text-xs">Account Type</span>
              <p className="text-white/80 text-sm mt-1 capitalize">{user.account_type || "Standard"}</p>
            </div>
            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
              <span className="text-white/40 text-xs">Last Active</span>
              <p className="text-white/80 text-sm mt-1">
                {user.last_login ? new Date(user.last_login).toLocaleString() : "Not available"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="relative z-10 p-6 border-t border-white/10 flex justify-between items-center bg-black/20">
          <div className="text-white/40 text-xs">
            <span className="px-3 py-1.5 bg-white/5 rounded-full">
              User since: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGoBack}
              className={buttonGradientClass}
            >
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
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={buttonGradientClass}
          >
            {isEditing ? "Cancel Edit" : "Edit User"}
          </button>

          {isEditing && (
            <button
              onClick={handleUpdate}
              disabled={updateLoading}
              className="px-4 py-2.5 bg-gradient-to-br from-emerald-500/20 to-emerald-900/30
               rounded-xl text-emerald-300 border border-emerald-500/30
               hover:border-emerald-500/50 transition"
            >
              {updateLoading ? "Saving..." : "Save Changes"}
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserDetailsPage;