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


const router = express.Router();

/* ================= MATCH ================= */

// 🔐 CREATE MATCH
router.post(
  "/create-match",
  verifyAdminKeyQuery,
  createWrestlingMatch
);

// 🔐 GET ALL MATCHES
router.get(
  "/matches",
  verifyAdminKeyQuery,
  getAllWrestlingMatches
);

// 🔐 GET OPEN MATCH
router.get(
  "/match/:id",
  verifyAdminKeyQuery,
  getWrestlingMatchById
);

// 🔐 GET CLOSED MATCH
router.get(
  "/match/:id/closed",
  verifyAdminKeyQuery,
  getClosedWrestlingMatchById
);

// 🔐 CLOSE MATCH
router.put(
  "/match/:id/close",
  verifyAdminKeyQuery,
  closeWrestlingMatch
);

// 🔐 OPEN MATCH
router.put(
  "/match/:id/open",
  verifyAdminKeyQuery,
  openWrestlingMatch
);

router.patch(
  "/match/:matchId/team/:tid/box/:boxId",
  verifyAdminKeyQuery,
  updateWrestlingBox
);

router.patch(
  "/wrestling/update-status/:matchId",
  verifyAdminKeyQuery,
  updateWrestlingMatchStatus
);


module.exports = router;
