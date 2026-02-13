const axios = require("axios");

const verifyAdminKeyRemote = async (adminKey) => {
  try {
    const response = await axios.post(
      process.env.SUPER_ADMIN_VERIFY_URL,
      { adminKey }
    );

    return response.data?.status === true;
  } catch (err) {
    return false;
  }
};

module.exports = verifyAdminKeyRemote;
