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
  approved:
    "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
};

const SuccessDeposit = () => {
  const dispatch = useDispatch();

  const { deposits, loading, error } = useSelector(
    (state) => state.deposits
  );

  // 🔥 Fetch only approved deposits
  useEffect(() => {
    dispatch(getDeposits("approved"));
  }, [dispatch]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  return (
    <div className={`${gradientCardClass} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-black/40 border-b border-white/10">
            <tr>
              <th className="px-4 py-3 text-left text-white/60">User UID</th>
              <th className="px-4 py-3 text-left text-white/60">Mobile</th>
              <th className="px-4 py-3 text-left text-white/60">Amount</th>
              <th className="px-4 py-3 text-left text-white/60">UTR</th>
              <th className="px-4 py-3 text-left text-white/60">Method</th>
              <th className="px-4 py-3 text-left text-white/60">Status</th>
              <th className="px-4 py-3 text-left text-white/60">Remark</th>
              <th className="px-4 py-3 text-left text-white/60">Admin Remark</th>
              <th className="px-4 py-3 text-left text-white/60">Approved At</th>
              <th className="px-4 py-3 text-left text-white/60">Rejected At</th>
              <th className="px-4 py-3 text-left text-white/60">Created At</th>
            </tr>
          </thead>

          <tbody>
            {deposits.map((d) => (
              <tr
                key={d._id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-4 py-3 text-white font-medium">
                  {d.userUid || "N/A"}
                </td>

                <td className="px-4 py-3 text-white/70">
                  {d.mobile || d.user?.mobile}
                </td>

                <td className="px-4 py-3 text-amber-400 font-bold">
                  {formatAmount(d.amount)}
                </td>

                <td className="px-4 py-3 text-white/70">
                  {d.utr || "N/A"}
                </td>

                <td className="px-4 py-3 text-white/70 capitalize">
                  {d.paymentMethod}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full border capitalize ${statusBadgeClass.approved}`}
                  >
                    {d.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-white/60">
                  {d.remark || "-"}
                </td>

                <td className="px-4 py-3 text-white/60">
                  {d.adminRemark || "-"}
                </td>

                <td className="px-4 py-3 text-white/50">
                  {d.approvedAt
                    ? new Date(d.approvedAt).toLocaleString()
                    : "-"}
                </td>

                <td className="px-4 py-3 text-white/50">
                  {d.rejectedAt
                    ? new Date(d.rejectedAt).toLocaleString()
                    : "-"}
                </td>

                <td className="px-4 py-3 text-white/50">
                  {new Date(d.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuccessDeposit;