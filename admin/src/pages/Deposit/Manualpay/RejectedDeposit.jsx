import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MdAttachMoney,
  MdPhone,
  MdComment,
} from "react-icons/md";
import { FiAlertCircle } from "react-icons/fi";
import {
  getDeposits,
} from "../../../store/reducer/depositSlice";

// Styles
const gradientCardClass =
  "relative bg-gradient-to-br from-[#0B0D10] via-[#15181E] to-[#070809] \
   border border-white/10 rounded-3xl shadow-[0_30px_60px_-15px_black,0_0_0_1px_rgba(255,255,255,0.02)] \
   backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:shadow-[0_35px_70px_-15px_black,0_0_30px_rgba(255,255,255,0.15)] \
   before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none";

const inputStyleClasses =
  "w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white text-sm \
   placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 \
   outline-none transition-all duration-300 backdrop-blur-md \
   shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] focus:shadow-[0_0_25px_rgba(255,255,255,0.1),inset_0_2px_8px_rgba(0,0,0,0.6)] \
   disabled:opacity-50 disabled:cursor-not-allowed";

const statusBadgeClass = {
  rejected:
    "bg-red-500/20 text-red-300 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
};

const SuccessDeposit = () => {
  const dispatch = useDispatch();

  const { deposits, loading, error } = useSelector(
    (state) => state.deposits
  );

  // 🔥 Fetch only rejected deposits
  useEffect(() => {
    dispatch(getDeposits("rejected"));
  }, [dispatch]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0C0F] to-[#030405] p-4 md:p-6 lg:p-8">

      {/* Header */}
      <div className={`${gradientCardClass} p-5 md:p-6 mb-6`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/5 
                          flex items-center justify-center border border-white/30
                          shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <MdAttachMoney size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                rejected Deposits
              </h1>
              <p className="text-white/40 text-sm mt-0.5">
                {deposits.length} rejected
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
          <p className="text-white/50 text-sm">
            Loading rejected deposits...
          </p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className={`${gradientCardClass} p-8 text-center`}>
          <FiAlertCircle size={40} className="text-red-400 mx-auto mb-3" />
          <p className="text-red-300 font-medium">{error}</p>
          <button
            onClick={() => dispatch(getDeposits("rejected"))}
            className="mt-4 px-5 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-white/80 text-sm border border-white/20"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && deposits.length > 0 && (
        <div className={`${gradientCardClass} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/40 border-b border-white/10">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/60 uppercase">
                    User
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/60 uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/60 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/60 uppercase">
                    Admin Remark
                  </th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((d) => (
                  <tr
                    key={d._id}
                    className="border-t border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-white">
                        {d.user?.uid || "N/A"}
                      </div>
                      <div className="text-xs text-white/40 flex items-center gap-1">
                        <MdPhone size={10} />
                        {d.user?.mobile || "N/A"}
                      </div>
                    </td>

                    <td className="p-4 font-bold text-amber-400">
                      {formatAmount(d.amount)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1.5 text-xs font-bold rounded-full border capitalize
                          ${statusBadgeClass.rejected}`}
                      >
                        rejected
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="relative">
                        <MdComment
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                          size={16}
                        />
                        <input
                          type="text"
                          className={`${inputStyleClasses} pl-9`}
                          value={d.remark || ""}
                          readOnly
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && deposits.length === 0 && (
        <div className={`${gradientCardClass} p-12 text-center`}>
          <MdAttachMoney size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/50 text-lg font-medium">
            No rejected deposit requests found
          </p>
        </div>
      )}
    </div>
  );
};

export default SuccessDeposit;