import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MdCancel,
  MdPhone,
  MdOpenWith,
} from "react-icons/md";
import { FiAlertCircle } from "react-icons/fi";
import {
  getAllWithdrawals,
} from "../../store/reducer/withdrawalReducer";

// Styles
const gradientCardClass =
  "relative bg-gradient-to-br from-[#0B0D10] via-[#15181E] to-[#070809] \
   border border-white/10 rounded-3xl shadow-[0_30px_60px_-15px_black,0_0_0_1px_rgba(255,255,255,0.02)] \
   backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:shadow-[0_35px_70px_-15px_black,0_0_30px_rgba(255,255,255,0.15)] \
   before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none";

const statusBadgeClass = {
  approved: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
  rejected: "bg-red-500/20 text-red-300 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
  pending: "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
};

const AdminRejectedWithdrawals = () => {
  const dispatch = useDispatch();
  const { withdrawals = [], loading, error } = useSelector(
    (state) => state.withdrawal
  );

  useEffect(() => {
    dispatch(getAllWithdrawals());
  }, [dispatch]);

  // Filter only rejected withdrawals
  const rejectedWithdrawals = withdrawals.filter((w) => w.status === "rejected");

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
                Rejected Withdrawal Requests
              </h1>
              <p className="text-white/40 text-sm mt-0.5 flex items-center gap-2">
                <span>{rejectedWithdrawals.length} rejected</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
          <p className="text-white/50 text-sm">Loading rejected withdrawal requests...</p>
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

      {/* Rejected Withdrawals Table */}
      {!loading && rejectedWithdrawals.length > 0 && (
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
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody>
                {rejectedWithdrawals.map((w) => (
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
                          ${statusBadgeClass[w.status] || statusBadgeClass.rejected}`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-white/60 text-sm italic flex items-center gap-1">
                        <MdCancel size={14} className="text-red-400/60" />
                        {w.remark || "No reason provided"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && rejectedWithdrawals.length === 0 && (
        <div className={`${gradientCardClass} p-12 text-center`}>
          <MdOpenWith size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/50 text-lg font-medium">No rejected withdrawal requests found</p>
          <p className="text-white/30 text-sm mt-1">Rejected requests will appear here</p>
        </div>
      )}

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

export default AdminRejectedWithdrawals;