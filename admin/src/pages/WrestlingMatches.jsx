import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllMatches,
  closeMatch,
  openMatch,
} from "../store/reducer/wrestlingAdminSlice";

/* =========================
   COUNTDOWN HELPER (SAFE)
========================= */
const getCountdown = (startTime) => {
  if (!startTime) return "N/A";

  const diff = new Date(startTime).getTime() - Date.now();
  if (diff <= 0) return "Starting...";

  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  return `${mins}m ${secs}s`;
};

const WrestlingMatches = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { matches = [], loading, status } = useSelector(
    (state) => state.wrestlingAdmin
  );

  /* ⏱ Force re-render every second for countdown */
  const [, tick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => tick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  /* 📥 Initial fetch */
  useEffect(() => {
    dispatch(fetchAllMatches());
  }, [dispatch]);

  /* =========================
     ACTION HANDLERS
  ========================= */
  const handleCloseMatch = async (id) => {
    await dispatch(closeMatch(id));
    dispatch(fetchAllMatches());
  };

  const handleOpenMatch = async (id) => {
    await dispatch(openMatch(id));
    dispatch(fetchAllMatches());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            🤼 Wrestling Matches
          </h1>
          <p className="text-sm text-gray-400">
            Admin control panel
          </p>
        </div>

        {status && (
          <p className="mb-4 text-sm text-gray-300">
            {status}
          </p>
        )}

        {loading && (
          <p className="text-white animate-pulse">
            ⏳ Loading matches...
          </p>
        )}

        {/* MATCH CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {matches.map((match) => {
            const hasStartTime = Boolean(match.startTime);
            const startAt = hasStartTime ? new Date(match.startTime) : null;

            return (
              <div
                key={match._id}
                className="
                  bg-gradient-to-br from-gray-800/80 to-black
                  backdrop-blur-xl border border-gray-700/40
                  rounded-2xl p-5 shadow-xl hover:shadow-2xl transition
                "
              >
                {/* TOP BAR */}
                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      match.status === "OPEN"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : match.status === "PENDING"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {match.status}
                  </span>

                  <span className="text-xs text-gray-400">
                    MID: {match.mid}
                  </span>
                </div>

                {/* TEAMS */}
                <h2 className="text-lg text-gray-100 font-semibold mb-3">
                  {match.teams?.[0]?.tname || "Team A"}{" "}
                  <span className="text-red-500">🆚</span>{" "}
                  {match.teams?.[1]?.tname || "Team B"}
                </h2>

                {/* TIME INFO */}
                <div className="mb-3 text-sm text-gray-300 space-y-1">
                  <p>
                    🕒 Start Time:{" "}
                    <span className="font-semibold">
                      {hasStartTime
                        ? startAt.toLocaleString("en-IN")
                        : "Not set"}
                    </span>
                  </p>

                  {match.status === "PENDING" && hasStartTime && (
                    <p className="text-amber-400 font-semibold">
                      ⏳ Starts in: {getCountdown(match.startTime)}
                    </p>
                  )}

                  {match.status === "OPEN" && (
                    <p className="text-emerald-400 font-semibold">
                      🟢 Match Live
                    </p>
                  )}
                </div>

                {/* DETAILS */}
                <div className="text-sm text-gray-300 space-y-1">
                  <p>💰 Min: ₹{match.minbet}</p>
                  <p>💸 Max: ₹{match.maxbet}</p>
                </div>

                {/* ACTIONS */}
                <div className="mt-5 space-y-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/wrestling/${match._id}`)
                    }
                    className="
                      w-full bg-gray-700 hover:bg-gray-600
                      py-2.5 rounded-xl text-sm font-bold text-white
                    "
                  >
                    👁 View Match
                  </button>

                  {match.status === "OPEN" && (
                    <button
                      onClick={() => handleCloseMatch(match._id)}
                      className="
                        w-full bg-red-600 hover:bg-red-700
                        py-2.5 rounded-xl text-sm font-bold text-white
                      "
                    >
                      🔒 Close Match
                    </button>
                  )}

                  {match.status === "CLOSED" && (
                    <button
                      onClick={() => handleOpenMatch(match._id)}
                      className="
                        w-full bg-emerald-600 hover:bg-emerald-700
                        py-2.5 rounded-xl text-sm font-bold text-white
                      "
                    >
                      🔓 Re-Open Match
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* EMPTY STATE */}
        {!loading && matches.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No matches found
          </p>
        )}
      </div>
    </div>
  );
};

export default WrestlingMatches;