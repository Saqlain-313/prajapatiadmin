const express = require("express");
const {
  createWrestlingMatch,
  getWrestlingMatchById,
  getClosedWrestlingMatchById,
  closeWrestlingMatch,
  openWrestlingMatch,
  updateWrestlingBox,
  getAllWrestlingMatches,
  updateWrestlingMatchStatus
} = require("../../controllers/wrestling/wrestling.controller");

const verifyAdminKeyQuery = require("../../utils/verifyAdminKeyQuery");
const upload = require("../../middlewares/upload");

const router = express.Router();

/* ================= MATCH ================= */

router.post(
  "/wrestling/create-match",
  verifyAdminKeyQuery,
  upload.single("img"), 
  createWrestlingMatch
);


// 🔐 GET ALL MATCHES
router.get(
  "/wrestling/matches",
  verifyAdminKeyQuery,
  getAllWrestlingMatches
);

// 🔐 GET OPEN MATCH
router.get(
  "/wrestling/match/:id",
  verifyAdminKeyQuery,
  getWrestlingMatchById
);

// 🔐 GET CLOSED MATCH
router.get(
  "/wrestling/match/:id/closed",
  verifyAdminKeyQuery,
  getClosedWrestlingMatchById
);

// 🔐 CLOSE MATCH
router.put(
  "/wrestling/match/:id/close",
  verifyAdminKeyQuery,
  closeWrestlingMatch
);

// 🔐 OPEN MATCH
router.put(
  "/wrestling/match/:id/open",
  verifyAdminKeyQuery,
  openWrestlingMatch
);

router.patch(
  "/wrestling/match/:matchId/team/:tid/box/:boxId",
  verifyAdminKeyQuery,
  updateWrestlingBox
);

router.patch(
  "/wrestling/wrestling/update-status/:matchId",
  verifyAdminKeyQuery,
  updateWrestlingMatchStatus
);


module.exports = router;
