import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MdAttachMoney,
  MdCheckCircle,
  MdCancel,
  MdPending,
  MdPerson,
  MdPhone,
  MdComment,
  MdWarning,
  MdClose,
  MdOpenWith,
  
} from "react-icons/md";
import { FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";
import {
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  clearWithdrawalState,
} from "../store/reducer/withdrawalReducer";

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

const approveButtonClass =
  "flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 \
   rounded-xl text-emerald-300 font-medium text-sm border border-emerald-500/30 \
   shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(16,185,129,0.1)] \
   hover:from-emerald-500/30 hover:to-emerald-900/40 hover:border-emerald-500/50 \
   hover:text-emerald-200 hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(16,185,129,0.25)] \
   transition-all duration-300";

const rejectButtonClass =
  "flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-red-500/20 to-red-900/30 \
   rounded-xl text-red-300 font-medium text-sm border border-red-500/30 \
   shadow-[0_10px_20px_-10px_black,0_0_15px_rgba(239,68,68,0.1)] \
   hover:from-red-500/30 hover:to-red-900/40 hover:border-red-500/50 \
   hover:text-red-200 hover:shadow-[0_15px_30px_-10px_black,0_0_25px_rgba(239,68,68,0.25)] \
   transition-all duration-300";

const inputStyleClasses =
  "w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white text-sm \
   placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 \
   outline-none transition-all duration-300 backdrop-blur-md \
   shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] focus:shadow-[0_0_25px_rgba(255,255,255,0.1),inset_0_2px_8px_rgba(0,0,0,0.6)]";

const statusBadgeClass = {
  approved: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
  rejected: "bg-red-500/20 text-red-300 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
  pending: "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
};

/* --------------------------------------------------------
   CONFIRMATION POPUP — are you sure? (Approve/Reject)
-------------------------------------------------------- */
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = "approve", remark, onRemarkChange }) => {
  if (!isOpen) return null;

  const isApprove = type === "approve";
  const icon = isApprove ? (
    <FiCheckCircle className="text-emerald-400" size={32} />
  ) : (
    <FiXCircle className="text-red-400" size={32} />
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
              ${isApprove 
                ? "bg-emerald-500/20 border border-emerald-500/50" 
                : "bg-red-500/20 border border-red-500/50"}`}>
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
            {title || (isApprove ? "Approve Withdrawal" : "Reject Withdrawal")}
          </h3>
          
          <p className="text-white/60 text-sm mb-4">
            {message || (isApprove 
              ? "Are you sure you want to approve this withdrawal request? This action cannot be undone."
              : "Are you sure you want to reject this withdrawal request? This action cannot be undone.")}
          </p>

          {/* Rejection reason field - only for reject */}
          {!isApprove && (
            <div className="mb-5">
              <label className="block text-white/70 text-xs font-medium mb-2 flex items-center gap-1">
                <MdComment size={14} />
                Rejection Reason
              </label>
              <textarea
                value={remark || ""}
                onChange={(e) => onRemarkChange?.(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows="3"
                className={`${inputStyleClasses} resize-none`}
              />
            </div>
          )}

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
              disabled={!isApprove && !remark?.trim()}
              className={`${isApprove ? approveButtonClass : rejectButtonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isApprove ? (
                <>
                  <MdCheckCircle size={16} />
                  Confirm Approve
                </>
              ) : (
                <>
                  <MdCancel size={16} />
                  Confirm Reject
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------
   TOAST CONFIG — consistent dark theme
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
   MAIN COMPONENT — Admin Withdrawals
-------------------------------------------------------- */
const AdminWithdrawals = () => {
  const dispatch = useDispatch();
  const { withdrawals = [], loading, error, successMessage } = useSelector(
    (state) => state.withdrawal
  );

  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    id: null,
    type: "approve",
  });
  const [rejectRemark, setRejectRemark] = useState("");

  useEffect(() => {
    dispatch(getAllWithdrawals()).then((res) => {
      if (res?.payload?.message) {
        showToast(res.payload.message, "info");
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setConfirmation({ isOpen: false, id: null, type: "approve" });
      setRejectRemark("");
      dispatch(clearWithdrawalState());
      showToast(successMessage, "success");
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error]);

  const handleApproveClick = (id) => {
    setConfirmation({
      isOpen: true,
      id,
      type: "approve",
    });
  };

  const handleRejectClick = (id) => {
    setConfirmation({
      isOpen: true,
      id,
      type: "reject",
    });
  };

  const handleConfirmAction = () => {
    const { id, type } = confirmation;
    if (type === "approve") {
      dispatch(approveWithdrawal(id));
    } else {
      dispatch(rejectWithdrawal({ id, remark: rejectRemark }));
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405] p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className={`${gradientCardClass} p-5 md:p-6 mb-6`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/5 
                          flex items-center justify-center border border-white/30
                          shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <MdOpenWith size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_5px_black]">
                Withdrawal Requests
              </h1>
              <p className="text-white/40 text-sm mt-0.5 flex items-center gap-2">
                <span>{withdrawals.length} total</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="text-amber-400">
                  {withdrawals.filter(w => w.status === "pending").length} pending
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
          <p className="text-white/50 text-sm">Loading withdrawal requests...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className={`${gradientCardClass} p-8 text-center`}>
          <FiAlertCircle size={40} className="text-red-400 mx-auto mb-3" />
          <p className="text-red-300 font-medium">{error}</p>
          <button 
            onClick={() => dispatch(getAllWithdrawals())}
            className="mt-4 px-5 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-white/80 text-sm border border-white/20"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Withdrawals Table */}
      {!loading && withdrawals.length > 0 && (
        <div className={`${gradientCardClass} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/40 border-b border-white/10">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr
                    key={w._id}
                    className="border-t border-white/5 hover:bg-white/5 transition-all duration-200 group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 
                                      flex items-center justify-center border border-white/20
                                      shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                          <span className="text-white font-bold text-sm">
                            {(w.user?.uid?.charAt(0) || "U").toUpperCase()}
                          </span>
                        </div>
                        <div className="font-semibold text-white group-hover:text-white/90">
                          {w.user?.uid || "N/A"}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 text-white/80">
                        <MdPhone size={12} className="text-white/40" />
                        <span className="text-sm">{w.user?.mobile || "N/A"}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                        {formatAmount(w.amount)}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1.5 text-xs font-bold rounded-full border capitalize
                          ${statusBadgeClass[w.status] || statusBadgeClass.pending}`}
                      >
                        {w.status}
                      </span>
                    </td>

                    <td className="p-4">
                      {w.status === "pending" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveClick(w._id)}
                            className={approveButtonClass}
                          >
                            <MdCheckCircle size={16} />
                            Approve
                          </button>

                          <button
                            onClick={() => handleRejectClick(w._id)}
                            className={rejectButtonClass}
                          >
                            <MdCancel size={16} />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-white/40 text-sm italic flex items-center gap-1">
                          {w.status === "approved" ? (
                            <>
                              <MdCheckCircle size={14} className="text-emerald-400/60" />
                              Approved
                            </>
                          ) : (
                            <>
                              <MdCancel size={14} className="text-red-400/60" />
                              Rejected
                            </>
                          )}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && withdrawals.length === 0 && (
        <div className={`${gradientCardClass} p-12 text-center`}>
          <MdOpenWith size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/50 text-lg font-medium">No withdrawal requests found</p>
          <p className="text-white/30 text-sm mt-1">New withdrawal requests will appear here</p>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={() => {
          setConfirmation({ ...confirmation, isOpen: false });
          setRejectRemark("");
        }}
        onConfirm={handleConfirmAction}
        type={confirmation.type}
        title={confirmation.type === "approve" ? "Approve Withdrawal" : "Reject Withdrawal"}
        message={
          confirmation.type === "approve"
            ? "Are you sure you want to approve this withdrawal request? The amount will be processed."
            : "Are you sure you want to reject this withdrawal request? The user will be notified with the reason."
        }
        remark={rejectRemark}
        onRemarkChange={setRejectRemark}
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

export default AdminWithdrawals;