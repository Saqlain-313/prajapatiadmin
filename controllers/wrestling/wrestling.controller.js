const WrestlingMatch = require("../../models/WRESTLING/WrestlingMatch");
const axios = require("axios");
const FormData = require("form-data");

const uploadToImgbb = async (buffer) => {
  try {
    const form = new FormData();
    form.append("image", buffer.toString("base64"));
    form.append("key", process.env.IMGBB_API_KEY);

    const response = await axios.post(
      "https://api.imgbb.com/1/upload",
      form,
      {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
      }
    );

    return response.data.data.url;
  } catch (error) {
    console.log("IMGBB ERROR:", error.response?.data || error.message);
    throw new Error("Image upload failed");
  }
};

/* ================= SAFE JSON PARSER ================= */
const safeParse = (value) => {
  try {
    return JSON.parse(value || "[]");
  } catch {
    return [];
  }
};

/* ================= CREATE MATCH ================= */
const createWrestlingMatch = async (req, res) => {
  try {
    const {
      teamAName,
      teamBName,
      startTime,
      minbet,
      maxbet,
      betStatus,
      gameType,
    } = req.body;

    /* ================= VALIDATIONS ================= */
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

    if (Number(maxbet) < Number(minbet)) {
      return res.status(400).json({
        success: false,
        message: "maxbet cannot be less than minbet",
      });
    }

    /* ================= BET STATUS ================= */
    const validBetStatus = ["ACTIVE", "DEACTIVE"];
    const finalBetStatus = validBetStatus.includes(betStatus)
      ? betStatus
      : "ACTIVE";

    /* ================= GAME TYPE ================= */
    const validGameTypes = ["ODD", "TIED_MATCH"];
    let finalGameType = ["ODD"];

    if (gameType) {
      let parsed = [];

      if (Array.isArray(gameType)) {
        parsed = gameType;
      } else {
        try {
          parsed = JSON.parse(gameType);
        } catch {
          parsed = [gameType];
        }
      }

      finalGameType = parsed.filter((g) =>
        validGameTypes.includes(g)
      );

      if (finalGameType.length === 0) {
        finalGameType = ["ODD"];
      }
    }

    /* ================= SAFE PARSE ================= */
    const safeParse = (value) => {
      try {
        return JSON.parse(value || "[]");
      } catch {
        return [];
      }
    };

    const teamARates = safeParse(req.body.teamARates);
    const teamASizes = safeParse(req.body.teamASizes);
    const teamBRates = safeParse(req.body.teamBRates);
    const teamBSizes = safeParse(req.body.teamBSizes);

    const tieRates = safeParse(req.body.tieRates);   // ✅ NEW
    const tieSizes = safeParse(req.body.tieSizes);   // ✅ NEW

    /* ================= IMAGE ================= */
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadToImgbb(req.file.buffer);
    }

    if (req.body.img) {
      imageUrl = req.body.img;
    }

    /* ================= IDS ================= */
    const uniqueId = Date.now();
    const generateTid = () => Date.now() + Math.floor(Math.random() * 1000);

    const eventName = `${teamAName.trim()} vs ${teamBName.trim()}`;

    /* ================= BOX CREATOR ================= */
    const createBoxes = (rates = [], sizes = []) => {
      const backRate = Number(rates[0]) || 0;
      const layRate = Number(rates[1]) || 0;

      const backSize = Number(sizes[0]) || 0;
      const laySize = Number(sizes[1]) || 0;

      const box2Back = backRate > 0 ? +(backRate - 0.01).toFixed(2) : 0;
      const box1Back = box2Back > 0 ? +(box2Back - 0.01).toFixed(2) : 0;

      const box5Lay = layRate > 0 ? +(layRate + 0.01).toFixed(2) : 0;
      const box6Lay = box5Lay > 0 ? +(box5Lay + 0.01).toFixed(2) : 0;

      return [
        { boxId: 1, btype: "BACK", rate: box1Back, size: backSize },
        { boxId: 2, btype: "BACK", rate: box2Back, size: backSize },
        { boxId: 3, btype: "BACK", rate: backRate, size: backSize },

        { boxId: 4, btype: "LAY", rate: layRate, size: laySize },
        { boxId: 5, btype: "LAY", rate: box5Lay, size: laySize },
        { boxId: 6, btype: "LAY", rate: box6Lay, size: laySize },
      ];
    };

    /* ================= TEAMS ARRAY ================= */
    const teams = [
      {
        tid: generateTid(),
        tname: teamAName.trim(),
        side: "A",
        status: "ACTIVE",   // Team A active
        boxes: createBoxes(teamARates, teamASizes),
      },
      {
        tid: generateTid(),
        tname: teamBName.trim(),
        side: "B",
        status: "SUSPENDED",  // ✅ Team B auto suspend
        boxes: createBoxes(teamBRates, teamBSizes),
      },
    ];

    /* ================= ADD TIED MATCH MARKET ================= */
    if (finalGameType.includes("TIED_MATCH")) {
      teams.push({
        tid: generateTid(),
        tname: "Tied Match",
        side: "T",
        boxes: createBoxes(tieRates, tieSizes),
      });
    }

    /* ================= CREATE MATCH ================= */
    const match = await WrestlingMatch.create({
      mid: uniqueId,
      gmid: uniqueId,
      startTime: parsedStartTime,
      minbet: Number(minbet) || 0,
      maxbet: Number(maxbet) || 0,
      status: "PENDING",
      betStatus: finalBetStatus,
      img: imageUrl,
      gameType: finalGameType,
      eventName,
      teams,
    });

    return res.status(201).json({
      success: true,
      message: "Match created successfully",
      data: match,
    });

  } catch (err) {
    console.error("CREATE MATCH ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



// const createWrestlingMatch = async (req, res) => {
//   try {
//     const {
//       teamAName,
//       teamBName,
//       startTime,
//       minbet,
//       maxbet,
//       betStatus,
//     } = req.body;

//     /* ================= VALIDATIONS ================= */
//     if (!teamAName || !teamBName || !startTime) {
//       return res.status(400).json({
//         success: false,
//         message: "teamAName, teamBName and startTime are required",
//       });
//     }

//     const parsedStartTime = new Date(startTime);
//     if (isNaN(parsedStartTime.getTime())) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid startTime",
//       });
//     }

//     if (Number(maxbet) < Number(minbet)) {
//       return res.status(400).json({
//         success: false,
//         message: "maxbet cannot be less than minbet",
//       });
//     }

//     /* ================= VALIDATE BET STATUS ================= */
//     const validBetStatus = ["ACTIVE", "DEACTIVE"];
//     const finalBetStatus = validBetStatus.includes(betStatus)
//       ? betStatus
//       : "ACTIVE";

//     /* ================= SAFE PARSE FUNCTION ================= */
//     const safeParse = (value) => {
//       try {
//         return JSON.parse(value || "[]");
//       } catch {
//         return [];
//       }
//     };

//     /* ================= PARSE MARKET ARRAYS ================= */
//     const teamARates = safeParse(req.body.teamARates);
//     const teamASizes = safeParse(req.body.teamASizes);
//     const teamBRates = safeParse(req.body.teamBRates);
//     const teamBSizes = safeParse(req.body.teamBSizes);

//     /* ================= IMAGE LOGIC ================= */
//     let imageUrl = null;

//     if (req.file) {
//       imageUrl = await uploadToImgbb(req.file.buffer);
//     }

//     if (req.body.img) {
//       imageUrl = req.body.img;
//     }

//     /* ================= AUTO IDS ================= */
//     const uniqueId = Date.now();
//     const generateTid = () => Date.now() + Math.floor(Math.random() * 1000);

//     /* ================= AUTO EVENT NAME ================= */
//     const eventName = `${teamAName.trim()} vs ${teamBName.trim()}`;

//     /* ================= BOX CREATOR ================= */
//     const createBoxes = (rates = [], sizes = []) => {
//       const backRate = Number(rates[0]) || 0;
//       const layRate = Number(rates[1]) || 0;
//       const backSize = Number(sizes[0]) || 0;
//       const laySize = Number(sizes[1]) || 0;

//       // BACK ladder
//       const box2Back = backRate > 0 ? +(backRate - 0.01).toFixed(2) : 0;
//       const box1Back = box2Back > 0 ? +(box2Back - 0.01).toFixed(2) : 0;

//       // LAY ladder
//       const box5Lay = layRate > 0 ? +(layRate + 0.01).toFixed(2) : 0;
//       const box6Lay = box5Lay > 0 ? +(box5Lay + 0.01).toFixed(2) : 0;

//       return [
//         // BACK
//         { boxId: 1, btype: "BACK", rate: box1Back, size: backSize },
//         { boxId: 2, btype: "BACK", rate: box2Back, size: backSize },
//         { boxId: 3, btype: "BACK", rate: backRate, size: backSize },

//         // LAY
//         { boxId: 4, btype: "LAY", rate: layRate, size: laySize },
//         { boxId: 5, btype: "LAY", rate: box5Lay, size: laySize },
//         { boxId: 6, btype: "LAY", rate: box6Lay, size: laySize },
//       ];
//     };

//     /* ================= CREATE MATCH ================= */
//     const match = await WrestlingMatch.create({
//       mid: uniqueId,
//       gmid: uniqueId,
//       startTime: parsedStartTime,
//       minbet: Number(minbet) || 0,
//       maxbet: Number(maxbet) || 0,
//       status: "PENDING",
//       betStatus: finalBetStatus,
//       img: imageUrl,
//       gameType: "ODD",
//       eventName,

//       teams: [
//         {
//           tid: generateTid(),
//           tname: teamAName.trim(),
//           side: "A",
//           boxes: createBoxes(teamARates, teamASizes),
//         },
//         {
//           tid: generateTid(),
//           tname: teamBName.trim(),
//           side: "B",
//           boxes: createBoxes(teamBRates, teamBSizes),
//         },
//       ],
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Match created successfully",
//       data: match,
//     });
//   } catch (err) {
//     console.error("CREATE MATCH ERROR:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };



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
