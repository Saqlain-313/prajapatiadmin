import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBets,
  settleBet,
  disqualifyBet,
} from "../store/reducer/wrestlingBetAdminSlice";
import {
  MdSearch,
  MdRefresh,
  MdClose,
  MdCheckCircle,
  MdCancel,
  MdSportsKabaddi,
} from "react-icons/md";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const AdminWrestlingPendingPage = () => {
  const dispatch = useDispatch();
  const { bets, loading, error } = useSelector((s) => s.wrestlingBetAdmin);

  const [searchQuery, setSearchQuery] = useState("");
  const [settlementPopup, setSettlementPopup] = useState({
    isOpen: false,
    eventName: null,
    action: null,
  });

  // selectedOutcome now holds { team, otype } e.g. { team: "vikram", otype: "back" }
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [settlementLoading, setSettlementLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllBets());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error, { id: error });
  }, [error]);

  /**
   * Build per-team data: { team, back: { amount, users[] }, lay: { amount, users[] } }
   * Each team shows as one card with both BACK and LAY selectable inside it.
   */
  const teamOtypeOptions = useMemo(() => {
    if (!settlementPopup.eventName || !bets.length) return [];

    const map = {}; // key: teamName
    bets.forEach((bet) => {
      if (bet.eventName !== settlementPopup.eventName) return;
      if (!bet.teamName || !bet.otype) return;

      if (!map[bet.teamName]) {
        map[bet.teamName] = {
          team: bet.teamName,
          back: { amount: 0, users: [] },
          lay: { amount: 0, users: [] },
        };
      }
      const mobile = bet.userId?.mobile || "Unknown";
      if (bet.otype === "back") {
        map[bet.teamName].back.amount += bet.betAmount;
        if (!map[bet.teamName].back.users.includes(mobile))
          map[bet.teamName].back.users.push(mobile);
      } else if (bet.otype === "lay") {
        map[bet.teamName].lay.amount += bet.betAmount;
        if (!map[bet.teamName].lay.users.includes(mobile))
          map[bet.teamName].lay.users.push(mobile);
      }
    });

    return Object.values(map).sort((a, b) => a.team.localeCompare(b.team));
  }, [bets, settlementPopup.eventName]);

  const handleSettleBet = async () => {
    if (!selectedOutcome) {
      toast.error("Please select an outcome");
      return;
    }
    const { team, otype } = selectedOutcome;
    setSettlementLoading(true);
    try {
      await dispatch(
        settleBet({
          eventName: settlementPopup.eventName,
          winner: team,
          otype,
        })
      ).unwrap();
      toast.success(
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-emerald-400" />
          <span>Settled: {team} ({otype.toUpperCase()})</span>
        </div>,
        { id: `settle_${team}_${otype}` }
      );
      dispatch(getAllBets());
      closePopup();
    } catch (err) {
      toast.error(
        <div className="flex items-center gap-2">
          <FaTimesCircle className="text-red-400" />
          <span>{err}</span>
        </div>
      );
    } finally {
      setSettlementLoading(false);
    }
  };

  const handleDisqualifyBet = async () => {
    if (!selectedOutcome) {
      toast.error("Please select an outcome");
      return;
    }
    const { team, otype } = selectedOutcome;
    setSettlementLoading(true);
    try {
      await dispatch(
        disqualifyBet({
          eventName: settlementPopup.eventName,
          teamName: team,
          otype,
        })
      ).unwrap();
      toast.success(
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-emerald-400" />
          <span>Disqualified: {team} ({otype.toUpperCase()})</span>
        </div>,
        { id: `dq_${team}_${otype}` }
      );
      dispatch(getAllBets());
      closePopup();
    } catch (err) {
      toast.error(
        <div className="flex items-center gap-2">
          <FaTimesCircle className="text-red-400" />
          <span>{err}</span>
        </div>
      );
    } finally {
      setSettlementLoading(false);
    }
  };

  const closePopup = () => {
    setSettlementPopup({ isOpen: false, eventName: null, action: null });
    setSelectedOutcome(null);
  };

  const pendingBets = useMemo(
    () => bets.filter((b) => b.status === 0),
    [bets]
  );

  const filteredBets = useMemo(() => {
    if (!searchQuery) return pendingBets;
    const q = searchQuery.toLowerCase();
    return pendingBets.filter(
      (b) =>
        b.userId?.mobile?.toLowerCase().includes(q) ||
        b.teamName?.toLowerCase().includes(q) ||
        b.eventName?.toLowerCase().includes(q)
    );
  }, [pendingBets, searchQuery]);

  const totalStake = useMemo(
    () => filteredBets.reduce((sum, bet) => sum + bet.betAmount, 0),
    [filteredBets]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 text-white">
      {/* Animated background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header with Stats */}
      <div className="relative mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
              <MdSportsKabaddi className="text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Wrestling Settlement
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage pending bets & settlements
              </p>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
              <input
                type="search"
                placeholder="Search by user, team or event..."
                className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => dispatch(getAllBets())}
              className="px-4 py-2.5 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800 rounded-xl border border-gray-700 transition-all group"
            >
              <MdRefresh className="text-xl group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-800 p-4">
            <p className="text-gray-500 text-sm">Total Pending Bets</p>
            <p className="text-2xl font-bold text-white">{pendingBets.length}</p>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-800 p-4">
            <p className="text-gray-500 text-sm">Total Stake Amount</p>
            <p className="text-2xl font-bold text-emerald-400">
              ₹{totalStake.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-800 p-4">
            <p className="text-gray-500 text-sm">Unique Events</p>
            <p className="text-2xl font-bold text-white">
              {new Set(pendingBets.map((b) => b.eventName)).size}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="relative bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-800">
                <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Event
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Team
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Stake
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredBets.map((bet, index) => (
                <tr
                  key={bet._id}
                  className="hover:bg-gray-800/30 transition-colors group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="p-4">
                    <div className="font-medium text-white">{bet.eventName}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-xs font-bold">
                        {bet.userId?.mobile?.slice(0, 2) || "U"}
                      </div>
                      <span className="text-gray-300">{bet.userId?.mobile}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-gray-800 rounded-full text-sm font-medium text-white">
                      {bet.teamName}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        bet.otype === "lay"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {bet.otype.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-mono font-bold text-emerald-400">
                      ₹{bet.betAmount.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 transition-opacity">
                      <button
                        onClick={() =>
                          setSettlementPopup({
                            isOpen: true,
                            eventName: bet.eventName,
                            action: "settle",
                          })
                        }
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-lg text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-105 flex items-center gap-1"
                      >
                        <MdCheckCircle className="text-sm" />
                        Settle
                      </button>
                      <button
                        onClick={() =>
                          setSettlementPopup({
                            isOpen: true,
                            eventName: bet.eventName,
                            action: "disqualify",
                          })
                        }
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-lg text-xs font-semibold shadow-lg shadow-red-500/20 transition-all transform hover:scale-105 flex items-center gap-1"
                      >
                        <MdCancel className="text-sm" />
                        DQ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBets.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-20">🎯</div>
            <p className="text-gray-500 text-lg">No pending bets found</p>
            <p className="text-gray-600 text-sm mt-2">
              Try adjusting your search or refresh the list
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
            <p className="text-gray-500 mt-4">Loading bets...</p>
          </div>
        )}
      </div>

      {/* Settlement / DQ Popup */}
      {settlementPopup.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closePopup}
          ></div>

          <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-700 animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-xl ${
                    settlementPopup.action === "settle"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {settlementPopup.action === "settle" ? (
                    <MdCheckCircle className="text-2xl" />
                  ) : (
                    <MdCancel className="text-2xl" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {settlementPopup.action === "settle"
                      ? "Settle Event"
                      : "Disqualify Event"}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {settlementPopup.eventName}
                  </p>
                </div>
              </div>
              <button
                onClick={closePopup}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <MdClose className="text-xl text-gray-400" />
              </button>
            </div>

            {/* Warning for disqualify */}
            {settlementPopup.action === "disqualify" && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <FaExclamationTriangle className="text-red-400 text-xl flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">
                  Disqualifying will mark all matching bets as void. This action
                  cannot be undone.
                </p>
              </div>
            )}

            {/* Outcome selection — team + otype combos */}
            <div className="space-y-3 mb-8 max-h-72 overflow-y-auto custom-scrollbar">
              <p className="text-sm font-medium text-gray-400 mb-3">
                Select team &amp; bet type:
              </p>

              {teamOtypeOptions.map((option) => {
                const selectedBack =
                  selectedOutcome?.team === option.team &&
                  selectedOutcome?.otype === "back";
                const selectedLay =
                  selectedOutcome?.team === option.team &&
                  selectedOutcome?.otype === "lay";

                return (
                  <div
                    key={option.team}
                    className={`rounded-xl border-2 p-4 transition-all
                      ${
                        selectedBack || selectedLay
                          ? selectedBack
                            ? "border-emerald-500 bg-emerald-500/5"
                            : "border-red-500 bg-red-500/5"
                          : "border-gray-700 bg-gray-800/50"
                      }`}
                  >
                    {/* Team name */}
                    <p className="font-semibold text-white mb-3">{option.team}</p>

                    {/* Back & Lay buttons side by side */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* BACK button */}
                      <button
                        onClick={() =>
                          setSelectedOutcome({ team: option.team, otype: "back" })
                        }
                        className={`rounded-lg p-3 border-2 transition-all text-left
                          ${
                            selectedBack
                              ? "border-emerald-500 bg-emerald-500/20"
                              : "border-gray-600 bg-gray-900/50 hover:border-emerald-500/50 hover:bg-emerald-500/5"
                          }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-emerald-400">BACK</span>
                          {selectedBack && (
                            <MdCheckCircle className="text-emerald-400 text-sm" />
                          )}
                        </div>
                        <p className="text-sm font-bold text-emerald-400">
                          ₹{option.back.amount.toLocaleString()}
                        </p>
                        
                        {option.back.users.length === 0 && (
                          <p className="text-xs text-gray-600 mt-1">No bets</p>
                        )}
                      </button>

                      {/* LAY button */}
                      <button
                        onClick={() =>
                          setSelectedOutcome({ team: option.team, otype: "lay" })
                        }
                        className={`rounded-lg p-3 border-2 transition-all text-left
                          ${
                            selectedLay
                              ? "border-red-500 bg-red-500/20"
                              : "border-gray-600 bg-gray-900/50 hover:border-red-500/50 hover:bg-red-500/5"
                          }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-red-400">LAY</span>
                          {selectedLay && (
                            <MdCheckCircle className="text-red-400 text-sm" />
                          )}
                        </div>
                        <p className="text-sm font-bold text-red-400">
                          ₹{option.lay.amount.toLocaleString()}
                        </p>
                        {option.lay.users.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {option.lay.users.map((u, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-gray-800 border border-gray-700 rounded px-1.5 py-0.5 text-gray-400"
                              >
                                {u}
                              </span>
                            ))}
                          </div>
                        )}
                        {option.lay.users.length === 0 && (
                          <p className="text-xs text-gray-600 mt-1">No bets</p>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}

              {teamOtypeOptions.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  No options found for this event.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={closePopup}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={
                  settlementPopup.action === "settle"
                    ? handleSettleBet
                    : handleDisqualifyBet
                }
                disabled={!selectedOutcome || settlementLoading}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                  settlementPopup.action === "settle"
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400"
                    : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400"
                }`}
              >
                {settlementLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWrestlingPendingPage;