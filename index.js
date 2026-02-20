const WrestlingMatch = require("./models/WRESTLING/WrestlingMatch");

const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    /* =========================================
       JOIN MATCH ROOM
    ========================================= */
    socket.on("join-match", (mid) => {
      if (!mid) return;
      socket.join(String(mid));
      console.log(`📥 Joined match room: ${mid}`);
    });

    /* =========================================
       ADMIN UPDATE BOX (PATCH STYLE - FIXED)
    ========================================= */
    socket.on("admin:update-box", async (data) => {
      try {
        const { matchId, mid, tid, boxId, rate, size, timer } = data;

        if (!matchId || !mid || !tid || !boxId) return;

        const match = await WrestlingMatch.findById(matchId);
        if (!match) return;

        const team = match.teams.find(
          (t) => Number(t.tid) === Number(tid)
        );
        if (!team) return;

        // 🔓 Allow all valid boxes
        const box = team.boxes.find(
          (b) => Number(b.boxId) === Number(boxId)
        );
        if (!box) return;

        if (rate !== undefined && rate !== null) {
          box.rate = Number(rate);
        }

        if (size !== undefined && size !== null) {
          box.size = Number(size);
        }

        if (timer !== undefined && timer !== null) {
          box.timer = Number(timer);
        }

        await match.save();

        io.to(String(mid)).emit("box:update", {
          mid: String(mid),
          tid: Number(tid),
          boxId: Number(boxId),
          rate: box.rate,
          size: box.size,
          timer: box.timer,
        });

        console.log(
          `🔥 Box Updated → MID:${mid} TID:${tid} BOX:${boxId}`
        );

      } catch (err) {
        console.error("❌ admin:update-box error:", err.message);
      }
    });

    /* =========================================
       ADMIN UPDATE TEAM STATUS
    ========================================= */
    socket.on("admin:update-team-status", async (data) => {
      try {
        const { matchId, mid, tid, status } = data;

        if (!matchId || !mid || !tid) return;
        if (!["ACTIVE", "SUSPENDED"].includes(status)) return;

        const match = await WrestlingMatch.findById(matchId);
        if (!match) return;

        const team = match.teams.find(
          (t) => Number(t.tid) === Number(tid)
        );
        if (!team) return;

        team.status = status;

        await match.save();

        io.to(String(mid)).emit("team:status-update", {
          mid: String(mid),   // 🔥 Added for safety
          tid: Number(tid),
          status,
        });

        console.log(
          `🚦 Team ${tid} Status Updated → ${status}`
        );

      } catch (err) {
        console.error("❌ team status error:", err.message);
      }
    });

    /* =========================================
       DISCONNECT
    ========================================= */
    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
};

module.exports = initSocket;