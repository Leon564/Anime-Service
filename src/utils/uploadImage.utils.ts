const _imgbb = require("imgbb");
const imgbb = _imgbb;
import "dotenv/config";
import logger from "./logger.utils";
const defaultImage = "https://i.ibb.co/1Tp6cTn/x1080.jpg";
const uploadImage = async (image: string) => {
  logger.info("Uploading image to imgbb...");
  logger.info("Image URL: " + image);
  try {
    const res = await new imgbb(image)
      .setApiKey(process.env.IMGBB_API_KEY)
      .upload();

    return res.url;
  } catch (e) {
    logger.error(e);
    return defaultImage;
  }
};

export default uploadImage;
