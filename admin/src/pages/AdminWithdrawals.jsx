// src/pages/AdminWithdrawals.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  clearWithdrawalState,
} from "../store/reducer/withdrawalReducer";

const AdminWithdrawals = () => {
  const dispatch = useDispatch();
  const { withdrawals = [], loading, error, successMessage } = useSelector(
    (state) => state.withdrawal
  );

  const [rejectId, setRejectId] = useState(null);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    dispatch(getAllWithdrawals());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setRejectId(null);
      setRemark("");
      dispatch(clearWithdrawalState());
    }
  }, [successMessage, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6 text-white">
      <h1 className="text-3xl font-extrabold mb-6">
        💸 Withdrawals
      </h1>

      {loading && <p className="text-gray-400">⏳ Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {/* TABLE */}
      <div className="overflow-x-auto bg-gradient-to-br from-gray-900/80 to-black rounded-2xl border border-gray-700/40 shadow-xl">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="bg-black text-gray-400 uppercase">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((w) => (
              <tr
                key={w._id}
                className="border-t border-gray-800 hover:bg-gray-800/40 transition"
              >
                <td className="px-4 py-3 font-semibold">
                  {w.user?.uid || "-"}
                </td>
                <td className="px-4 py-3">
                  {w.user?.mobile || "-"}
                </td>
                <td className="px-4 py-3 font-bold text-amber-400">
                  ₹{w.amount}
                </td>
                <td
                  className={`px-4 py-3 capitalize font-semibold ${
                    w.status === "approved"
                      ? "text-emerald-400"
                      : w.status === "rejected"
                      ? "text-red-400"
                      : "text-amber-400"
                  }`}
                >
                  {w.status}
                </td>
                <td className="px-4 py-3 space-x-2">
                  {w.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          dispatch(approveWithdrawal(w._id))
                        }
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-bold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectId(w._id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-white font-bold"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {!loading && withdrawals.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-10 text-center text-gray-400"
                >
                  No withdrawals found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= REJECT MODAL ================= */}
      {rejectId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl w-full max-w-md border border-gray-700/40 shadow-2xl">
            <h2 className="text-xl font-extrabold mb-4 text-white">
              ❌ Reject Withdrawal
            </h2>

            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter rejection reason"
              className="w-full p-3 bg-black border border-gray-700 rounded-xl text-sm text-white mb-4 outline-none focus:ring-2 focus:ring-gray-600"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectId(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  dispatch(rejectWithdrawal({ id: rejectId, remark }))
                }
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawals;