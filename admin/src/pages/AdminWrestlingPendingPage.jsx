import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBets,
  settleBet,
  disqualifyBet,
} from "../store/reducer/wrestlingBetAdminSlice";
import { MdSearch, MdRefresh } from "react-icons/md";
import { toast } from "react-hot-toast";

const AdminWrestlingPendingPage = () => {
  const dispatch = useDispatch();
  const { bets, loading, error } = useSelector(
    (s) => s.wrestlingBetAdmin
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [settlementPopup, setSettlementPopup] = useState({
    isOpen: false,
    eventName: null,
    team: null,
    type: null,
    action: null,
  });

  const [settlementLoading, setSettlementLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllBets());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  /* ----------------------------------------
     SETTLE
  ---------------------------------------- */
  const handleSettleBet = async () => {
    const { eventName, team, type } = settlementPopup;

    if (!eventName || !team || !type) {
      toast.error("Missing settlement data");
      return;
    }

    setSettlementLoading(true);

    try {
      await dispatch(
        settleBet({
          eventName,
          winner: team,
          otype: type,
        })
      ).unwrap();

      toast.success(
        `Settled: ${team} (${type.toUpperCase()})`
      );

      dispatch(getAllBets());
      closePopup();
    } catch (err) {
      toast.error(err);
    } finally {
      setSettlementLoading(false);
    }
  };


  const handleDisqualifyBet = async () => {
    const { eventName, team, type } = settlementPopup;

    if (!eventName || !team || !type) {
      toast.error("Missing disqualification data");
      return;
    }

    setSettlementLoading(true);

    try {
      await dispatch(
        disqualifyBet({
          eventName,
          winner: team,
          otype: type,
        })
      ).unwrap();

      toast.success(
        `Disqualified: ${team} (${type.toUpperCase()})`
      );

      dispatch(getAllBets());
      closePopup();
    } catch (err) {
      toast.error(err);
    } finally {
      setSettlementLoading(false);
    }
  };

  const closePopup = () => {
    setSettlementPopup({
      isOpen: false,
      eventName: null,
      team: null,
      type: null,
      action: null,
    });
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

  return (
    <div className="min-h-screen bg-black p-6 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Wrestling Pending Bets
        </h1>

        <div className="flex gap-3">
          <input
            type="search"
            placeholder="Search..."
            className="px-4 py-2 bg-gray-900 rounded-lg border border-gray-700"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
          />

          <button
            onClick={() => dispatch(getAllBets())}
            className="px-4 py-2 bg-gray-800 rounded-lg"
          >
            <MdRefresh />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border border-gray-800 rounded-xl">
        <table className="w-full">
          <thead className="bg-gray-900 text-sm">
            <tr>
              <th className="p-3 text-left">Event</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Team</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Stake</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredBets.map((bet) => (
              <tr
                key={bet._id}
                className="border-t border-gray-800"
              >
                <td className="p-3">{bet.eventName}</td>
                <td className="p-3">
                  {bet.userId?.mobile}
                </td>
                <td className="p-3">{bet.teamName}</td>
                <td className="p-3 uppercase">
                  {bet.otype}
                </td>
                <td className="p-3 text-yellow-400">
                  ₹{bet.betAmount}
                </td>

                <td className="p-3">
                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        setSettlementPopup({
                          isOpen: true,
                          eventName: bet.eventName,
                          team: bet.teamName,
                          type: bet.otype,
                          action: "settle",
                        })
                      }
                      className="px-3 py-1 bg-emerald-600 rounded text-xs"
                    >
                      Settle
                    </button>

                    <button
                      onClick={() =>
                        setSettlementPopup({
                          isOpen: true,
                          eventName: bet.eventName,
                          team: bet.teamName,
                          type: bet.otype,
                          action: "disqualify",
                        })
                      }
                      className="px-3 py-1 bg-red-600 rounded text-xs"
                    >
                      DQ
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* POPUP */}
      {settlementPopup.isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-xl w-80">
            <h2 className="text-lg font-semibold mb-4">
              Confirm {settlementPopup.action}
            </h2>

            <p className="text-sm mb-4">
              {settlementPopup.team} (
              {settlementPopup.type})
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={closePopup}
                className="px-3 py-1 bg-gray-700 rounded"
              >
                Cancel
              </button>

              <button
                onClick={
                  settlementPopup.action === "settle"
                    ? handleSettleBet
                    : handleDisqualifyBet
                }
                disabled={settlementLoading}
                className="px-3 py-1 bg-blue-600 rounded"
              >
                {settlementLoading
                  ? "Processing..."
                  : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <p className="mt-4 text-gray-400">
          Loading...
        </p>
      )}
    </div>
  );
};

export default AdminWrestlingPendingPage;