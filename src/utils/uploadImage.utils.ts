const _imgbb = require("imgbb");
const imgbb = _imgbb;
import "dotenv/config";
import logger from "./logger.utils";
const defaultImage = "https://i.ibb.co/1Tp6cTn/x1080.jpg";
const defaultBanner = "https://i.ibb.co/55sJ2XR/Banner.png";
const defaultCover = "https://i.ibb.co/3pWKyYf/cover.png";
const uploadImage = async (image: string, image2?: string, type?: any) => {
  logger.info("Uploading image to imgbb... " + image);
  logger.info("Uploading image to imgbb... " + image2);
  logger.info(process.env.IMGBB_API_KEY);
  try {
    const res = await new imgbb(image.trim())
      .setApiKey(process.env.IMGBB_API_KEY)
      .upload();

    return res.url;
  } catch (e) {
    logger.error(e);
    if (image2) {
      try {
        const res = await new imgbb(image2.trim())
          .setApiKey(process.env.IMGBB_API_KEY)
          .upload();
        return res.url;
      } catch (e) {
        logger.error("Error uploading image to imgbb... " + image);
      }
    }
    if (type === "cover") return defaultCover;

    if (type === "banner") return defaultBanner;

    return defaultImage;
  }
};

export default uploadImage;
