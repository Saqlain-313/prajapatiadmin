import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBetHistory } from "../store/reducer/wrestlingBetHistorySlice";

const AdminWrestlingBetHistoryPage = () => {
  const dispatch = useDispatch();
  const { bets, loading } = useSelector(
    (state) => state.wrestlingBetHistory
  );

  useEffect(() => {
    dispatch(getAllBetHistory());
  }, [dispatch]);

  if (loading)
    return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6">
        Admin Wrestling Bet History
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 text-sm">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3">User ID</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Team</th>
              <th className="p-3">Type</th>
              <th className="p-3">Rate</th>
              <th className="p-3">Stake</th>
              <th className="p-3">Profit</th>
              <th className="p-3">Liability</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {bets.map((bet) => (
              <tr
                key={bet._id}
                className="text-center border-t border-gray-700 hover:bg-gray-900"
              >
                {/* User Details */}
                <td className="p-3 text-yellow-400">
                  {bet.user?.uid}
                </td>

                <td className="p-3">
                  {bet.user?.mobile}
                </td>

                {/* Bet Details */}
                <td className="p-3">
                  {bet.teamName}
                </td>

                <td
                  className={`p-3 font-bold ${
                    bet.btype === "BACK"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {bet.btype}
                </td>

                <td className="p-3">
                  {bet.rate?.toFixed(2)}
                </td>

                <td className="p-3 font-semibold">
                  ₹ {bet.stake}
                </td>

                <td className="p-3 text-green-400">
                  ₹ {bet.profit}
                </td>

                <td className="p-3 text-red-400">
                  ₹ {bet.liability}
                </td>



                <td className="p-3">
                  {new Date(bet.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminWrestlingBetHistoryPage;