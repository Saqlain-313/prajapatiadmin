import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBets, settleBet } from "../store/reducer/wrestlingBetAdminSlice";

const AdminWrestlingPendingPage = () => {
  const dispatch = useDispatch();
  const { bets } = useSelector((s) => s.wrestlingBetAdmin);

  useEffect(() => {
    dispatch(getAllBets());
  }, [dispatch]);

  const pendingBets = bets.filter((b) => !b.settled);

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h2 className="text-2xl mb-6 font-bold">
        Pending Bets
      </h2>

      <table className="w-full border border-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th>User</th>
            <th>Mobile</th>
            <th>Team</th>
            <th>Type</th>
            <th>Stake</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {pendingBets.map((bet) => (
            <tr key={bet._id} className="text-center border-t">
              <td>{bet.user?._id}</td>
              <td>{bet.user?.mobile}</td>
              <td>{bet.teamName}</td>
              <td>{bet.btype}</td>
              <td>₹ {bet.stake}</td>

              <td className="space-x-2">
                <button
                  onClick={() =>
                    dispatch(settleBet({ id: bet._id, result: "WON" }))
                  }
                  className="bg-green-600 px-3 py-1 rounded"
                >
                  WON
                </button>

                <button
                  onClick={() =>
                    dispatch(settleBet({ id: bet._id, result: "LOST" }))
                  }
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  LOST
                </button>

                <button
                  onClick={() =>
                    dispatch(settleBet({ id: bet._id, result: "CANCELLED" }))
                  }
                  className="bg-yellow-600 px-3 py-1 rounded"
                >
                  CANCEL
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminWrestlingPendingPage;