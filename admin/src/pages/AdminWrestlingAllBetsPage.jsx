import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBets } from "../store/reducer/wrestlingBetAdminSlice";

const AdminWrestlingAllBetsPage = () => {
  const dispatch = useDispatch();
  const { bets, loading } = useSelector(
    (s) => s.wrestlingBetAdmin
  );

  useEffect(() => {
    dispatch(getAllBets());
  }, [dispatch]);

  if (loading)
    return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6">
        All Wrestling Bets
      </h2>

      <table className="w-full border border-gray-700 text-sm">
        <thead className="bg-gray-800">
          <tr>
            <th>User ID</th>
            <th>Mobile</th>
            <th>Team</th>
            <th>Type</th>
            <th>Stake</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {bets.map((bet) => (
            <tr key={bet._id} className="border-t text-center">
              <td>{bet.user?._id}</td>
              <td>{bet.user?.mobile}</td>
              <td>{bet.teamName}</td>
              <td>{bet.btype}</td>
              <td>₹ {bet.stake}</td>
              <td>{bet.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminWrestlingAllBetsPage;