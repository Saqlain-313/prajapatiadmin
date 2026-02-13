import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaCoins,
  FaArrowLeft,
  FaPlusCircle,
} from "react-icons/fa";

import {
  createWrestlingMatch,
  clearStatus,
} from "../store/reducer/wrestlingAdminSlice";

const CreateWrestlingMatch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector(
    (state) => state.wrestlingAdmin
  );

  const [teamAName, setTeamAName] = useState("");
  const [teamBName, setTeamBName] = useState("");
  const [matchDate, setMatchDate] = useState(null);
  const [time, setTime] = useState("");
  const [minbet, setMinbet] = useState("");
  const [maxbet, setMaxbet] = useState("");

  /* ================= TIME OPTIONS ================= */
  const timeOptions = [];

  if (matchDate) {
    const now = new Date();
    const roundedNow = new Date(now);
    const roundedMinutes = Math.ceil(now.getMinutes() / 5) * 5;

    if (roundedMinutes === 60) {
      roundedNow.setHours(now.getHours() + 1, 0, 0, 0);
    } else {
      roundedNow.setMinutes(roundedMinutes, 0, 0);
    }

    const isToday =
      new Date(matchDate).toDateString() === new Date().toDateString();

    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 5) {
        const slot = new Date(matchDate);
        slot.setHours(h, m, 0, 0);
        if (isToday && slot < roundedNow) continue;

        const hour12 = h % 12 === 0 ? 12 : h % 12;
        const ampm = h < 12 ? "AM" : "PM";

        timeOptions.push({
          label: `${hour12.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")} ${ampm}`,
          value: `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}`,
        });
      }
    }
  }

  /* ================= SUBMIT ================= */
  const submitHandler = (e) => {
    e.preventDefault();

    if (
      !teamAName ||
      !teamBName ||
      !matchDate ||
      !time ||
      minbet === "" ||
      maxbet === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    if (+maxbet < +minbet) {
      alert("Max bet cannot be less than Min bet");
      return;
    }

    const [hh, mm] = time.split(":").map(Number);
    const startTime = new Date(matchDate);
    startTime.setHours(hh, mm, 0, 0);

    dispatch(
      createWrestlingMatch({
        teamAName,
        teamBName,
        startTime,
        minbet: Number(minbet),
        maxbet: Number(maxbet),
      })
    );
  };

  useEffect(() => {
    if (success) {
      setTeamAName("");
      setTeamBName("");
      setMatchDate(null);
      setTime("");
      setMinbet("");
      setMaxbet("");

      const t = setTimeout(() => dispatch(clearStatus()), 1500);
      return () => clearTimeout(t);
    }
  }, [success, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* CARD */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black border border-gray-700/40 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <FaPlusCircle className="text-gray-300" />
              Create Wrestling Match
            </h1>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white font-semibold"
            >
              <FaArrowLeft /> Back
            </button>
          </div>

          {/* FORM */}
          <form
            onSubmit={submitHandler}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* TEAM A */}
            <div className="relative">
              <FaUsers className="absolute left-4 top-4 text-gray-400" />
              <input
                placeholder="Team A Name"
                value={teamAName}
                onChange={(e) => setTeamAName(e.target.value)}
                className="pl-12 w-full px-4 py-3 rounded-xl bg-black/60 border border-gray-700 text-white focus:ring-2 focus:ring-gray-600 outline-none"
              />
            </div>

            {/* TEAM B */}
            <div className="relative">
              <FaUsers className="absolute left-4 top-4 text-gray-400" />
              <input
                placeholder="Team B Name"
                value={teamBName}
                onChange={(e) => setTeamBName(e.target.value)}
                className="pl-12 w-full px-4 py-3 rounded-xl bg-black/60 border border-gray-700 text-white focus:ring-2 focus:ring-gray-600 outline-none"
              />
            </div>

            {/* DATE */}
            <div className="relative">
              <FaCalendarAlt className="absolute left-4 top-4 text-gray-400 z-10" />
              <DatePicker
                selected={matchDate}
                onChange={setMatchDate}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select Match Date"
                className="pl-12 w-full px-4 py-3 rounded-xl bg-black/60 border border-gray-700 text-white outline-none"
              />
            </div>

            {/* TIME */}
            <div className="relative">
              <FaClock className="absolute left-4 top-4 text-gray-400" />
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-12 w-full px-4 py-3 rounded-xl bg-black/60 border border-gray-700 text-white outline-none"
              >
                <option value="">Select Time</option>
                {timeOptions.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* MIN BET */}
            <div className="relative">
              <FaCoins className="absolute left-4 top-4 text-gray-300" />
              <input
                type="number"
                placeholder="Min Bet"
                value={minbet}
                onChange={(e) => setMinbet(e.target.value)}
                className="pl-12 w-full px-4 py-3 rounded-xl bg-black/60 border border-gray-700 text-white outline-none"
              />
            </div>

            {/* MAX BET */}
            <div className="relative">
              <FaCoins className="absolute left-4 top-4 text-gray-300" />
              <input
                type="number"
                placeholder="Max Bet"
                value={maxbet}
                onChange={(e) => setMaxbet(e.target.value)}
                className="pl-12 w-full px-4 py-3 rounded-xl bg-black/60 border border-gray-700 text-white outline-none"
              />
            </div>

            {/* BUTTON */}
            <div className="md:col-span-2">
              <button
                disabled={loading}
                className="
                  w-full mt-4
                  bg-gradient-to-r from-gray-700 to-gray-900
                  hover:from-gray-600 hover:to-black
                  text-white py-4 rounded-2xl
                  font-extrabold tracking-wide
                  shadow-xl disabled:opacity-50
                "
              >
                {loading ? "Creating Match..." : "🔥 Create Match"}
              </button>
            </div>
          </form>

          {error && (
            <p className="text-red-400 mt-6 text-center">{error}</p>
          )}
          {success && (
            <p className="text-emerald-400 mt-6 text-center font-bold">
              ✅ Match Created Successfully
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateWrestlingMatch;