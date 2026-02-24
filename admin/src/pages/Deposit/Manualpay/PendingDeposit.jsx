import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MdAttachMoney,
  MdPhone,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import { FiAlertCircle } from "react-icons/fi";
import {
  getDeposits,
  updateDepositStatus,
} from "../../../store/reducer/depositSlice";

/* ===============================
   STYLES
=============================== */

const gradientCardClass =
  "relative bg-gradient-to-br from-[#0B0D10] via-[#15181E] to-[#070809] \
   border border-white/10 rounded-3xl shadow-[0_30px_60px_-15px_black] \
   backdrop-blur-xl";

const inputStyleClasses =
  "w-full px-4 py-2 bg-black/50 border border-white/10 rounded-xl text-white text-sm \
   placeholder-white/30 focus:border-white/40 outline-none transition-all duration-300";

/* ===============================
   COMPONENT
=============================== */

const PendingDeposit = () => {
  const dispatch = useDispatch();
  const [remarks, setRemarks] = useState({});

  const {
    deposits = [],
    loading = false,
    error = null,
    updateLoading = false,
  } = useSelector((state) => state.deposits || {});

  /* ===============================
     FETCH PENDING
  =============================== */
  useEffect(() => {
    dispatch(getDeposits("pending"));
  }, [dispatch]);

  /* ===============================
     FORMAT AMOUNT
  =============================== */
  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);

  /* ===============================
     TOTAL PENDING AMOUNT
  =============================== */
  const totalAmount = useMemo(() => {
    return deposits.reduce((sum, d) => sum + (d.amount || 0), 0);
  }, [deposits]);

  /* ===============================
     APPROVE / REJECT
  =============================== */
  const handleUpdate = (id, status) => {
    dispatch(
      updateDepositStatus({
        id,
        status,
        remark: remarks[id] || "",
      })
    )
      .unwrap()
      .then(() => {
        dispatch(getDeposits("pending"));
      });
  };

  return (
    <div className="min-h-screen bg-black p-6">

      {/* HEADER */}
      <div className={`${gradientCardClass} p-6 mb-6`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <MdAttachMoney size={26} className="text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">
                Pending Deposits
              </h1>
              <p className="text-white/40 text-sm">
                {deposits.length} pending requests
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-white/40 text-sm">Total Amount</p>
            <p className="text-amber-400 font-bold text-lg">
              {formatAmount(totalAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-white/50 py-10">
          Loading pending deposits...
        </div>
      )}

      {/* ERROR */}
      {error && !loading && (
        <div className={`${gradientCardClass} p-8 text-center`}>
          <FiAlertCircle size={36} className="text-red-400 mx-auto mb-3" />
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => dispatch(getDeposits("pending"))}
            className="mt-4 px-4 py-2 bg-white/10 rounded-lg text-white text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* TABLE */}
      {!loading && deposits.length > 0 && (
        <div className={`${gradientCardClass} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/40 border-b border-white/10">
                <tr>
                  <th className="p-4 text-left text-white/60">User UID</th>
                  <th className="p-4 text-left text-white/60">Mobile</th>
                  <th className="p-4 text-left text-white/60">Amount</th>
                  <th className="p-4 text-left text-white/60">UTR</th>
                  <th className="p-4 text-left text-white/60">Method</th>
                  <th className="p-4 text-left text-white/60">User Remark</th>
                  <th className="p-4 text-left text-white/60">Admin Remark</th>
                  <th className="p-4 text-left text-white/60">Created</th>
                  <th className="p-4 text-left text-white/60">Action</th>
                </tr>
              </thead>

              <tbody>
                {deposits.map((d) => (
                  <tr
                    key={d._id}
                    className="border-t border-white/5 hover:bg-white/5"
                  >
                    <td className="p-4 text-white font-medium">
                      {d.userUid || "N/A"}
                    </td>

                    <td className="p-4 text-white/70 flex items-center gap-1">
                      <MdPhone size={12} />
                      {d.mobile || d.user?.mobile || "N/A"}
                    </td>

                    <td className="p-4 font-bold text-amber-400">
                      {formatAmount(d.amount)}
                    </td>

                    <td className="p-4 text-white/70">
                      {d.utr || "-"}
                    </td>

                    <td className="p-4 text-white/70 capitalize">
                      {d.paymentMethod}
                    </td>

                    <td className="p-4 text-white/60">
                      {d.remark || "-"}
                    </td>

                    <td className="p-4">
                      <input
                        type="text"
                        placeholder="Enter admin remark"
                        className={inputStyleClasses}
                        value={remarks[d._id] || ""}
                        onChange={(e) =>
                          setRemarks({
                            ...remarks,
                            [d._id]: e.target.value,
                          })
                        }
                      />
                    </td>

                    <td className="p-4 text-white/50">
                      {new Date(d.createdAt).toLocaleString()}
                    </td>

                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => handleUpdate(d._id, "approved")}
                        disabled={updateLoading}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg flex items-center gap-1"
                      >
                        <MdCheckCircle size={14} />
                        Approve
                      </button>

                      <button
                        onClick={() => handleUpdate(d._id, "rejected")}
                        disabled={updateLoading}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg flex items-center gap-1"
                      >
                        <MdCancel size={14} />
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EMPTY */}
      {!loading && deposits.length === 0 && (
        <div className="text-center text-white/40 py-12">
          No pending deposit requests found
        </div>
      )}
    </div>
  );
};

export default PendingDeposit;