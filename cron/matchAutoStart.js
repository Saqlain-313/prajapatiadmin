const cron = require("node-cron");
const WrestlingMatch = require("../models/WRESTLING/WrestlingMatch");

const startMatchCron = () => {
  // Har 10 second me check karega
  cron.schedule("*/10 * * * * *", async () => {
    try {
      const now = new Date();

      const matches = await WrestlingMatch.find({
        status: "PENDING",
        startTime: { $lte: now },
      });

      if (matches.length > 0) {
        for (let match of matches) {
          match.status = "OPEN";
          await match.save();

          console.log(`Match ${match.mid} auto OPEN ho gaya`);
        }
      }
    } catch (err) {
      console.error("Auto Start Cron Error:", err.message);
    }
  });

  console.log("Match Auto Start Cron Running...");
};

module.exports = startMatchCron;