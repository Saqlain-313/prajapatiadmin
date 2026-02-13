const WrestlingMatch = require("./models/WRESTLING/WrestlingMatch");

const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    /* ===== JOIN MATCH ROOM ===== */
    socket.on("join-match", (mid) => {
      if (!mid) return;
      socket.join(String(mid));
      console.log(`📥 Joined match room: ${mid}`);
    });

    /* =====================================================
       ADMIN UPDATE BOX (PATCH STYLE)
    ===================================================== */
    socket.on("admin:update-box", async (data) => {
      try {
        const { matchId, mid, tid, boxId, rate, size } = data;

        // 🔒 Only boxId 2 or 3 allowed
        if (![3, 4].includes(Number(boxId))) return;

        const match = await WrestlingMatch.findById(matchId);
        if (!match) return;

        const team = match.teams.find(
          (t) => Number(t.tid) === Number(tid)
        );
        if (!team) return;

        const box = team.boxes.find(
          (b) => Number(b.boxId) === Number(boxId)
        );
        if (!box) return;

        /* ===== PATCH LOGIC ===== */
        if (rate !== undefined && rate !== null) {
          box.rate = Number(rate);
        }

        if (size !== undefined && size !== null) {
          box.size = Number(size);
        }

        await match.save();

        io.to(String(mid)).emit("box:update", {
          tid,
          boxId,
          rate: box.rate,
          size: box.size,
        });

        console.log("🔥 Box patched & broadcasted");

      } catch (err) {
        console.error("❌ Socket error:", err.message);
      }
    });

    /* =====================================================
       ✅ ADMIN UPDATE TEAM STATUS (NEW)
    ===================================================== */
    socket.on("admin:update-team-status", async (data) => {
      try {
        const { matchId, mid, tid, status } = data;

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
          tid,
          status,
        });

        console.log(`🚦 Team ${tid} status updated → ${status}`);

      } catch (err) {
        console.error("❌ Team status socket error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
};

module.exports = initSocket;