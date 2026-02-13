import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBetHistory } from "../store/reducer/wrestlingBetHistorySlice";

const AdminWrestlingBetHistoryPage = () => {
  const dispatch = useDispatch();
  const { bets, loading } = useSelector(
    (state) => state.wrestlingBetHistory
  );

  const [openMid, setOpenMid] = useState(null);

  useEffect(() => {
    dispatch(getAllBetHistory());
  }, [dispatch]);

  // ✅ Group Bets By Match
  const groupedBets = useMemo(() => {
    const map = {};

    bets.forEach((bet) => {
      const mid = bet.match?.mid;
      if (!mid) return;

      if (!map[mid]) {
        map[mid] = {
          mid,
          teams: bet.match.teams,
          bets: [],
        };
      }

      map[mid].bets.push(bet);
    });

    return Object.values(map);
  }, [bets]);

  const toggleTable = (mid) => {
    setOpenMid(openMid === mid ? null : mid);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">
        Loading Bet History...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-10 py-10">
      <h1 className="text-4xl font-extrabold mb-12 text-center tracking-wide">
        Wrestling Admin Bet History
      </h1>

      {groupedBets.map((game) => {
        // ✅ Admin Profit / Loss Calculation (Only Settled Bets)
        const adminSummary = game.bets.reduce(
          (acc, bet) => {
            if (!bet.settled) return acc;

            if (bet.btype === "BACK") {
              if (bet.result === "WON") {
                acc.loss += bet.profit; // admin loss
              } else if (bet.result === "LOST") {
                acc.profit += bet.stake; // admin profit
              }
            }

            if (bet.btype === "LAY") {
              if (bet.result === "WON") {
                acc.profit += bet.liability; // admin profit
              } else if (bet.result === "LOST") {
                acc.loss += bet.profit; // admin loss
              }
            }

            return acc;
          },
          { profit: 0, loss: 0 }
        );

        const netAdmin = adminSummary.profit - adminSummary.loss;

        return (
          <div
            key={game.mid}
            className="mb-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-700"
          >
            {/* 🔥 HEADER */}
            <div
              onClick={() => toggleTable(game.mid)}
              className="cursor-pointer bg-gradient-to-r from-gray-800 to-gray-700 p-6 flex justify-between items-center hover:scale-[1.01] transition"
            >
              <div>
                <h2 className="text-2xl font-bold text-yellow-400">
                  Game ID: {game.mid}
                </h2>

                <p className="text-lg text-gray-300 mt-1">
                  {game.teams.map((t) => t.tname).join(" vs ")}
                </p>

                {/* 🔥 ADMIN SUMMARY */}
                <div className="flex gap-8 mt-4 text-base font-semibold">
                  <span className="text-green-400">
                    Admin Profit: ₹ {adminSummary.profit}
                  </span>

                  <span className="text-red-400">
                    Admin Loss: ₹ {adminSummary.loss}
                  </span>

                  <span
                    className={`text-xl ${
                      netAdmin >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    Net: ₹ {netAdmin}
                  </span>
                </div>
              </div>

              <div className="text-4xl font-bold">
                {openMid === game.mid ? "−" : "+"}
              </div>
            </div>

            {/* 🔥 COLLAPSIBLE TABLE */}
            <div
              className={`transition-all duration-500 ${
                openMid === game.mid
                  ? "max-h-[2000px] p-6"
                  : "max-h-0 overflow-hidden"
              } bg-gray-950`}
            >
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full text-base text-center">
                  <thead className="bg-gray-800 text-gray-300 uppercase tracking-wider">
                    <tr>
                      <th className="py-4">User ID</th>
                      <th className="py-4">Mobile</th>
                      <th className="py-4">Team</th>
                      <th className="py-4">Type</th>
                      <th className="py-4">Rate</th>
                      <th className="py-4">Stake</th>
                      <th className="py-4">Profit</th>
                      <th className="py-4">Liability</th>
                      <th className="py-4">Result</th>
                      <th className="py-4">Status</th>
                      <th className="py-4">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {game.bets.map((bet) => (
                      <tr
                        key={bet._id}
                        className="border-t border-gray-800 hover:bg-gray-900 transition"
                      >
                        <td className="py-4 text-yellow-400 font-semibold">
                          {bet.user?.uid}
                        </td>

                        <td className="py-4">
                          {bet.user?.mobile}
                        </td>

                        <td className="py-4 font-medium">
                          {bet.teamName}
                        </td>

                        <td
                          className={`py-4 font-bold ${
                            bet.btype === "BACK"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {bet.btype}
                        </td>

                        <td className="py-4">
                          {bet.rate?.toFixed(2)}
                        </td>

                        <td className="py-4 font-semibold">
                          ₹ {bet.stake}
                        </td>

                        <td className="py-4 text-green-400 font-semibold">
                          ₹ {bet.profit}
                        </td>

                        <td className="py-4 text-red-400 font-semibold">
                          ₹ {bet.liability}
                        </td>

                        <td
                          className={`py-4 font-bold ${
                            bet.result === "WON"
                              ? "text-green-400"
                              : bet.result === "LOST"
                              ? "text-red-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {bet.result}
                        </td>

                        <td
                          className={`py-4 font-semibold ${
                            bet.settled
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {bet.settled ? "Settled" : "Pending"}
                        </td>

                        <td className="py-4 text-sm text-gray-400">
                          {new Date(
                            bet.createdAt
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminWrestlingBetHistoryPage;