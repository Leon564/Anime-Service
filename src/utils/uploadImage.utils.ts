const _imgbb = require("imgbb");
const imgbb = _imgbb;
import "dotenv/config";

const uploadImage = async (image: string) => {
  const res = await new imgbb(
    "https://www3.animeflv.net/uploads/animes/covers/3691.jpg"
  )
    .setApiKey(process.env.IMGBB_API_KEY)
    .upload();

  return res.url;
};

export default uploadImage;
