const axios = require("axios");
const FormData = require("form-data");

const uploadToImgbb = async (buffer) => {
  const formData = new FormData();
  formData.append("image", buffer.toString("base64"));

  const res = await axios.post(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
    formData,
    {
      headers: formData.getHeaders(), // 🔥 VERY IMPORTANT
    }
  );

  return {
    url: res.data.data.url,
    delete_url: res.data.data.delete_url,
  };
};

module.exports = uploadToImgbb;
