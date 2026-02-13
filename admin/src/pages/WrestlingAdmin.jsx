import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMatch,
  closeMatch,
  openMatch,
  updateBoxFromSocket,
  updateTeamStatusFromSocket,
} from "../store/reducer/wrestlingAdminSlice";
import { getBetHistoryByMid } from "../store/reducer/wrestlingBetHistorySlice";

const socket = io("http://localhost:5200/", {
  transports: ["websocket"],
});

const WrestlingAdmin = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { match: MATCH, loading, status } = useSelector(
    (state) => state.wrestlingAdmin
  );
  const { bets } = useSelector(
    (state) => state.wrestlingBetHistory
  );

  const [tid, setTid] = useState("");
  const [boxId, setBoxId] = useState("");
  const [rate, setRate] = useState("");
  const [size, setSize] = useState("");
  const [timer, setTimer] = useState("");

  useEffect(() => {
    if (matchId) dispatch(fetchMatch(matchId));
  }, [matchId, dispatch]);

  const minRate = 1;
  const maxRate = 10;
  const step = 0.05;

  const handleIncreaseRate = () => {
    if (!MATCH || MATCH.status !== "OPEN") return;
    if (!tid || !boxId) return;

    const current = selectedBox?.rate ?? 1;
    const newRate = (parseFloat(current) + step).toFixed(2);

    if (parseFloat(newRate) <= maxRate) {
      socket.emit("admin:update-box", {
        matchId: MATCH._id,
        mid: MATCH.mid,
        tid,
        boxId,
        rate: Number(newRate),
        size: selectedBox?.size || 0,
        timer: selectedBox?.timer || 0,
      });
    }
  };

  const handleDecreaseRate = () => {
    if (!MATCH || MATCH.status !== "OPEN") return;
    if (!tid || !boxId) return;

    const current = selectedBox?.rate ?? 1;
    const newRate = (parseFloat(current) - step).toFixed(2);

    if (parseFloat(newRate) >= minRate) {
      socket.emit("admin:update-box", {
        matchId: MATCH._id,
        mid: MATCH.mid,
        tid,
        boxId,
        rate: Number(newRate),
        size: selectedBox?.size || 0,
        timer: selectedBox?.timer || 0,
      });
    }
  };

  useEffect(() => {
    if (MATCH?.mid) {
      dispatch(getBetHistoryByMid(MATCH.mid));
    }
  }, [MATCH?.mid, dispatch]);

  useEffect(() => {
    if (MATCH?.mid) {
      socket.emit("join-match", String(MATCH.mid));
    }
  }, [MATCH?.mid]);

  useEffect(() => {
    const boxHandler = (payload) => {
      dispatch(updateBoxFromSocket(payload));
    };

    const teamStatusHandler = (payload) => {
      dispatch(updateTeamStatusFromSocket(payload));
    };

    socket.on("box:update", boxHandler);
    socket.on("team:status-update", teamStatusHandler);

    return () => {
      socket.off("box:update", boxHandler);
      socket.off("team:status-update", teamStatusHandler);
    };
  }, [dispatch]);



  const exposureData = MATCH?.teams?.map((team) => {
    const teamBets = bets?.filter(
      (bet) => String(bet.teamTid) === String(team.tid)
    );

    let backTotal = 0;
    let layTotal = 0;

    teamBets?.forEach((bet) => {
      if (bet.boxId == 3) {
        backTotal += bet.stake;
      } else if (bet.boxId == 4) {
        layTotal += bet.stake;
      }
    });

    return {
      tid: team.tid,
      teamName: team.tname,
      backTotal,
      layTotal,
      profitSide:
        backTotal > layTotal
          ? "LAY side profit"
          : layTotal > backTotal
            ? "BACK side profit"
            : "Balanced",
    };
  });

  const handleUpdateBox = () => {
    if (!MATCH || MATCH.status !== "OPEN") return;
    if (!tid || !boxId || !rate) return;

    socket.emit("admin:update-box", {
      matchId: MATCH._id,
      mid: MATCH.mid,
      tid,
      boxId,
      rate: Number(rate),
      size: Number(size) || 0,
      timer: Number(timer) || 0,
    });

    setSize("");
    setTimer("");
  };

  const selectedTeam = MATCH?.teams?.find(
    (t) => String(t.tid) === String(tid)
  );

  const selectedBox = selectedTeam?.boxes?.find(
    (b) => String(b.boxId) === String(boxId)
  );

  useEffect(() => {
    if (selectedBox?.rate !== undefined) {
      setRate(Number(selectedBox.rate).toFixed(2));
    }
  }, [selectedBox?.rate]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ADMIN PANEL */}
        <div className="bg-gradient-to-br from-gray-900/90 to-black backdrop-blur-xl p-6 rounded-3xl border border-gray-700/40 shadow-2xl">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-200">
                Wrestling Control
              </h1>
              {MATCH && (
                <p className="text-sm text-gray-400 mt-1">
                  {MATCH.teams.map((t) => t.tname).join("  vs  ")}
                </p>
              )}
            </div>

            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 font-bold"
            >
              ⬅ Back
            </button>
          </div>
          {/* 🔥 MATCH IMAGE */}
          {MATCH?.img && (
            <div className="mb-6 rounded-2xl overflow-hidden border border-gray-700">
              <img
                src={
                  MATCH?.img
                    ? `${MATCH.img}`
                    : "https://via.placeholder.com/800x300?text=Wrestling+Match"
                }
                alt="Match"
                className="w-full h-52 object-cover"
              />
            </div>
          )}

          {/* STATUS */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            {MATCH && (
              <span
                className={`px-4 py-1 rounded-full text-xs font-bold ${MATCH.status === "OPEN"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-red-500/20 text-red-400"
                  }`}
              >
                {MATCH.status}
              </span>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => MATCH?._id && dispatch(openMatch(MATCH._id))}
                disabled={MATCH?.status === "OPEN"}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 font-bold"
              >
                OPEN
              </button>

              <button
                onClick={() => MATCH?._id && dispatch(closeMatch(MATCH._id))}
                disabled={MATCH?.status === "CLOSED"}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 font-bold"
              >
                CLOSE
              </button>
            </div>
          </div>

          {/* SELECT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={tid}
              onChange={(e) => setTid(e.target.value)}
              className="p-3 rounded-xl bg-black border border-gray-700"
            >
              <option value="">Select Team</option>
              {MATCH?.teams?.map((t) => (
                <option key={t.tid} value={t.tid}>
                  {t.tname}
                </option>
              ))}
            </select>

            <select
              value={boxId}
              onChange={(e) => setBoxId(e.target.value)}
              className="p-3 rounded-xl bg-black border border-gray-700"
            >
              <option value="">Select Box</option>
              {selectedTeam?.boxes?.map((b) => (
                <option key={b.boxId} value={b.boxId}>
                  {b.boxId == 3
                    ? "Back"
                    : b.boxId == 4
                      ? "Lay"
                      : `Box ${b.boxId}`}
                </option>
              ))}
            </select>

          </div>


          {/* INPUTS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">

            {/* RATE DROPDOWN */}
            <div className="flex items-center gap-2">

              {/* ➖ Minus Button */}
              <button
                type="button"
                onClick={handleDecreaseRate}
                className="px-3 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold"
              >
                -
              </button>

              {/* 🔽 Dropdown */}
              <select
                value={selectedBox?.rate?.toFixed(2) || ""}
                onChange={(e) => {
                  if (!MATCH || MATCH.status !== "OPEN") return;
                  if (!tid || !boxId) return;

                  socket.emit("admin:update-box", {
                    matchId: MATCH._id,
                    mid: MATCH.mid,
                    tid,
                    boxId,
                    rate: Number(e.target.value),
                    size: selectedBox?.size || 0,
                    timer: selectedBox?.timer || 0,
                  });
                }}
                className="p-3 rounded-xl bg-black border border-gray-700 text-white w-full"
              >
                <option value="">Select Rate</option>

                {[...Array(181)].map((_, i) => {
                  const value = (1 + i * 0.05).toFixed(2);
                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>

              {/* ➕ Plus Button */}
              <button
                type="button"
                onClick={handleIncreaseRate}
                className="px-3 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-bold"
              >
                +
              </button>

            </div>
            <input
              type="number"
              placeholder="Size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="p-3 rounded-xl bg-black border border-gray-700"
            />


          </div>

          <button
            onClick={handleUpdateBox}
            className="w-full mt-6 bg-gradient-to-br from-gray-700 to-black p-4 rounded-xl font-extrabold"
          >
            ⚡ UPDATE BOX
          </button>

          {/* TEAM STATUS BUTTON */}
          {selectedTeam && (
            <button
              onClick={() =>
                socket.emit("admin:update-team-status", {
                  matchId: MATCH._id,
                  mid: MATCH.mid,
                  tid: selectedTeam.tid,
                  status:
                    selectedTeam.status === "ACTIVE"
                      ? "SUSPENDED"
                      : "ACTIVE",
                })
              }
              className={`w-full mt-4 p-4 rounded-xl font-bold ${selectedTeam.status === "ACTIVE"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-emerald-600 hover:bg-emerald-700"
                }`}
            >
              {selectedTeam.status === "ACTIVE"
                ? "🚫 SUSPEND TEAM"
                : "✅ ACTIVATE TEAM"}
            </button>
          )}

          <p className="mt-4 text-center text-sm text-gray-400">
            {loading ? "⏳ Live syncing..." : status}
          </p>
        </div>

        {/* LIVE VIEW */}
        <div className="bg-gradient-to-br from-gray-100 to-white rounded-3xl overflow-hidden shadow-2xl">
          {MATCH && (
            <table className="hidden md:table w-full text-center text-black">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-3">Team</th>
                  <th>Back</th>
                  <th>Lay</th>
                </tr>
              </thead>
              <tbody>
                {MATCH.teams.map((t) => {
                  const back = t.boxes.find((b) => b.boxId == 3);
                  const lay = t.boxes.find((b) => b.boxId == 4);

                  return (
                    <tr key={t.tid} className="border-t">
                      <td className="font-bold py-3">
                        {t.tname}
                        {t.status === "SUSPENDED" && (
                          <span className="ml-2 text-red-500 text-xs">
                            (SUSPENDED)
                          </span>
                        )}
                      </td>
                      <td className="bg-emerald-600 text-white font-bold">
                        {back?.rate ?? "-"}
                      </td>
                      <td className="bg-red-600 text-white font-bold">
                        {lay?.rate ?? "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 🔥 EXPOSURE SUMMARY */}
      <div className="p-4 text-black bg-gray-200">
        <h2 className="font-bold mb-3">Exposure Summary</h2>

        {exposureData?.map((item) => (
          <div
            key={item.tid}
            className="flex justify-between mb-2 text-sm font-semibold"
          >
            <span>{item.teamName}</span>
            <span className="text-emerald-600">
              Back: ₹{item.backTotal}
            </span>
            <span className="text-red-600">
              Lay: ₹{item.layTotal}
            </span>
            <span className="text-blue-600">
              {item.profitSide}
            </span>
          </div>
        ))}
      </div>
      {/* 🔥 USER BET LIST */}
      <div className="p-4 text-black bg-white border-t">
        <h2 className="font-bold mb-3">User Bets</h2>

        <table className="w-full text-sm text-center">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2">User</th>
              <th>Team</th>
              <th>Type</th>
              <th>Stake</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {bets?.map((bet) => {
              const team = MATCH?.teams?.find(
                (t) => String(t.tid) === String(bet.teamTid)
              );

              return (
                <tr key={bet._id} className="border-t">
                  <td>{bet.user?.name || "N/A"}</td>
                  <td>{team?.tname}</td>
                  <td
                    className={
                      bet.boxId == 3
                        ? "text-emerald-600 font-bold"
                        : "text-red-600 font-bold"
                    }
                  >
                    {bet.boxId == 3 ? "BACK" : "LAY"}
                  </td>
                  <td>₹{bet.stake}</td>
                  <td>{Number(bet.rate).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default WrestlingAdmin;