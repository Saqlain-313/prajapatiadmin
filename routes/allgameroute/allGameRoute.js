const express = require("express");
const { launchGame, transferBalance, getgamedetails } = require("../../controllers/allgamecontroller/allGameController");
const protect = require("../../middlewares/authMiddleware");


const router = express.Router();

router.post("/get/game", protect, launchGame);
router.get("/balance/transfer", protect, transferBalance);
router.post("/get/all-game", protect, getgamedetails);

// Export the router
module.exports = router;
