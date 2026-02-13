import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBets } from "../store/reducer/wrestlingBetAdminSlice";

const AdminWrestlingSettledPage = () => {
  const dispatch = useDispatch();
  const { bets } = useSelector(
    (s) => s.wrestlingBetAdmin
  );

  useEffect(() => {
    dispatch(getAllBets());
  }, [dispatch]);

  const settledBets = bets.filter((b) => b.settled);

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6">
        Settled Bets
      </h2>

      <table className="w-full border border-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th>User</th>
            <th>Mobile</th>
            <th>Team</th>
            <th>Stake</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {settledBets.map((bet) => (
            <tr key={bet._id} className="border-t text-center">
              <td>{bet.user?._id}</td>
              <td>{bet.user?.mobile}</td>
              <td>{bet.teamName}</td>
              <td>₹ {bet.stake}</td>
              <td className="font-bold">
                {bet.result}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminWrestlingSettledPage;