import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllDeposits,
  updateDepositStatus,
  clearDepositStatus,
} from "../store/reducer/depositAdminSlice";

const AdminDeposits = () => {
  const dispatch = useDispatch();
  const { deposits = [], loading, success, error } = useSelector(
    (state) => state.adminDeposits
  );

  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    dispatch(getAllDeposits());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setRemarks({});
      dispatch(clearDepositStatus());
    }
  }, [success, dispatch]);

  const handleAction = (id, status) => {
    dispatch(
      updateDepositStatus({
        id,
        status,
        remark: remarks[id] || "",
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6 text-white">
      <h1 className="text-3xl font-extrabold mb-6">
        💰 Deposit Requests
      </h1>

      {loading && <p className="text-gray-400">⏳ Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {/* TABLE */}
      <div className="overflow-x-auto bg-gradient-to-br from-gray-900/80 to-black rounded-2xl border border-gray-700/40 shadow-xl">
        <table className="w-full text-sm">
          <thead className="bg-black text-gray-400 uppercase">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Remark</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {deposits.map((d) => (
              <tr
                key={d._id}
                className="border-t border-gray-800 hover:bg-gray-800/40 transition"
              >
                <td className="p-3">
                  <div className="font-semibold">
                    {d.user?.uid || "-"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {d.user?.mobile || "-"}
                  </div>
                </td>

                <td className="p-3 font-bold text-amber-400">
                  ₹{d.amount}
                </td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      d.status === "approved"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : d.status === "rejected"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>

                <td className="p-3">
                  <input
                    type="text"
                    placeholder="Admin remark"
                    className="
                      w-full px-3 py-2 rounded-xl
                      bg-black border border-gray-700
                      text-white text-sm
                      outline-none focus:ring-2 focus:ring-gray-600
                      disabled:opacity-40
                    "
                    value={remarks[d._id] || ""}
                    onChange={(e) =>
                      setRemarks({
                        ...remarks,
                        [d._id]: e.target.value,
                      })
                    }
                    disabled={d.status !== "pending"}
                  />
                </td>

                <td className="p-3 flex gap-2">
                  {d.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleAction(d._id, "approved")
                        }
                        className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-white"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          handleAction(d._id, "rejected")
                        }
                        className="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-white"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {!loading && deposits.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-10 text-center text-gray-400"
                >
                  No deposit requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDeposits;