const express = require("express");
const router = express.Router();
const {
  setReferralCommission,
  getReferralCommissions,
  updateReferralCommission,
  deleteReferralCommission,
} = require("../controllers/referralSettingController");

router.post("/referral/referral-setting", setReferralCommission);

router.get("/referral/getreferral-setting", getReferralCommissions);

router.put("/referral/updatereferral-setting", updateReferralCommission);

router.delete("/referral/deletereferral-setting/:level", deleteReferralCommission);

module.exports = router;