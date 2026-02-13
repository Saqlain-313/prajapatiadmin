const WrestlingMatch = require("../../models/WRESTLING/WrestlingMatch");



const createWrestlingMatch = async (req, res) => {
  try {
    const { teamAName, teamBName, startTime, minbet, maxbet } = req.body;

    if (!teamAName || !teamBName || !startTime) {
      return res.status(400).json({
        success: false,
        message: "teamAName, teamBName and startTime are required",
      });
    }

    const parsedStartTime = new Date(startTime);
    if (isNaN(parsedStartTime.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid startTime",
      });
    }


    if (maxbet < minbet) {
      return res.status(400).json({
        success: false,
        message: "maxbet cannot be less than minbet",
      });
    }

    const now = Date.now();

    const createBoxes = () => [
      { boxId: 1, btype: "BACK", rate: 0, size: 0 },
      { boxId: 2, btype: "BACK", rate: 0, size: 0 },
      { boxId: 3, btype: "BACK", rate: 0, size: 0 },
      { boxId: 4, btype: "LAY", rate: 0, size: 0 },
      { boxId: 5, btype: "LAY", rate: 0, size: 0 },
      { boxId: 6, btype: "LAY", rate: 0, size: 0 },
    ];

    const match = await WrestlingMatch.create({
      mid: now,
      gmid: now,
      startTime: parsedStartTime,
      minbet:Number(minbet) || 0,
      maxbet:Number(maxbet) || 0,
      status: "PENDING",
      teams: [
        { tid: 1, tname: teamAName.trim(), side: "A", boxes: createBoxes() },
        { tid: 2, tname: teamBName.trim(), side: "B", boxes: createBoxes() },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Match created",
      data: {
        matchId: match._id,
        mid: match.mid,
        minbet: match.minbet,
        maxbet: match.maxbet,
        startTime: match.startTime,
        status: match.status,
      },
    });
  } catch (err) {
    console.error("CREATE MATCH ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




const getWrestlingMatchById = async (req, res) => {
  try {

    const match = await WrestlingMatch.findById(req.params.id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    if (match.status === "CLOSED") {
      return res.status(403).json({
        success: false,
        message: "Match is closed",
      });
    }

    res.json({ success: true, data: match });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const getClosedWrestlingMatchById = async (req, res) => {
  try {


    const match = await WrestlingMatch.findById(req.params.id);
    if (!match || match.status == "CLOSED") {
      return res.status(404).json({
        success: false,
        message: "Closed match not found",
      });
    }

    res.json({ success: true, data: match });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const closeWrestlingMatch = async (req, res) => {
  try {

    const match = await WrestlingMatch.findById(req.params.id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    if (match.status === "CLOSED") {
      return res.status(400).json({
        success: false,
        message: "Match already closed",
      });
    }

    match.status = "CLOSED";
    await match.save();

    res.json({
      success: true,
      message: "Match closed successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const openWrestlingMatch = async (req, res) => {
  try {

    const match = await WrestlingMatch.findById(req.params.id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    match.status = "OPEN";
    await match.save();

    res.json({
      success: true,
      message: "Match opened successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateWrestlingBox = async (req, res) => {
  try {
    const { matchId, tid, boxId } = req.params;
    const { rate, size } = req.body;

    // 🔒 allow only box 2 or 3
    if (![2, 3].includes(Number(boxId))) {
      return res.status(400).json({
        status: false,
        message: "Only boxId 2 or 3 allowed",
      });
    }

    const match = await WrestlingMatch.findById(matchId);
    if (!match) {
      return res.status(404).json({
        status: false,
        message: "Match not found",
      });
    }

    const team = match.teams.find(
      (t) => Number(t.tid) === Number(tid)
    );
    if (!team) {
      return res.status(404).json({
        status: false,
        message: "Team not found",
      });
    }

    const box = team.boxes.find(
      (b) => Number(b.boxId) === Number(boxId)
    );
    if (!box) {
      return res.status(404).json({
        status: false,
        message: "Box not found",
      });
    }

    /* ===== PATCH LOGIC ===== */
    if (rate !== undefined && rate !== null) {
      box.rate = Number(rate);
    }

    if (size !== undefined && size !== null) {
      box.size = Number(size);
    }

    await match.save();

    return res.json({
      status: true,
      message: "Box updated successfully",
      data: {
        tid,
        boxId,
        rate: box.rate,
        size: box.size,
      },
    });

  } catch (error) {
    console.error("❌ Update Box Error:", error.message);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};


const getAllWrestlingMatches = async (req, res) => {
  try {
    const matches = await WrestlingMatch.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (err) {
    console.error("❌ Get All Matches Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const updateWrestlingMatchStatus = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { status } = req.body;

    const allowedStatus = ["PENDING", "OPEN", "CLOSED"];

    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed: PENDING, OPEN, CLOSED",
      });
    }

    const match = await WrestlingMatch.findById(matchId);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    if (match.status === status) {
      return res.status(400).json({
        success: false,
        message: `Match already in ${status} state`,
      });
    }

    match.status = status;
    await match.save();

    return res.json({
      success: true,
      message: `Match status updated to ${status}`,
      data: {
        matchId: match._id,
        status: match.status,
      },
    });
  } catch (error) {
    console.error("❌ Update Match Status Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};




module.exports = {
  createWrestlingMatch,
  getWrestlingMatchById,
  getClosedWrestlingMatchById,
  closeWrestlingMatch,
  openWrestlingMatch,
  updateWrestlingBox,
  getAllWrestlingMatches,
  updateWrestlingMatchStatus

};
