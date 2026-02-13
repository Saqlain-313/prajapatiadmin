const express = require("express");
const router = express.Router();
const {
  setReferralCommission,
  getReferralCommissions,
  updateReferralCommission,
  deleteReferralCommission,
} = require("../controllers/referralSettingController");

router.post("/referral-setting", setReferralCommission);

router.get("/getreferral-setting", getReferralCommissions);

router.put("/updatereferral-setting", updateReferralCommission);

router.delete("/deletereferral-setting/:level", deleteReferralCommission);

module.exports = router;