import axios from "axios";
import detectLanguaje from "../utils/detectLanguaje";
class jikanMoe {
  getAnimeInfo = async (name: string) => {
    const q = detectLanguaje(name) === "es" ? name.split(" ")[0] : name;
    const info = await axios.get(
      `https://api.jikan.moe/v4/anime?q=${q}&limit=5`
    );
    if (info.data.data.length === 0) return null;
    const anime = info.data.data.find(
      (item: any) => item.title.toLowerCase() === name.toLowerCase()
    );
    return anime || info.data.data[0];
  };
}
export default new jikanMoe();
