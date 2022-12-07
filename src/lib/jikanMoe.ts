import axios from "axios";
import detectLanguaje from "../utils/detectLanguaje";
class jikanMoe {
  getAnimeInfo = async (name: string) => {
    const q = detectLanguaje(name) === "es" ? name.split(" ")[0] : name;
    const info = await axios.get(
      `https://api.jikan.moe/v4/anime?q=${q}`
    );
    if (info.data.data.length === 0) return null;
    const anime = info.data.data.find((item: any) => {
      for (let i = 0; i < item.titles.length; i++) {
        const element = item.titles[i];
        if (element.title.toLowerCase() === name.toLowerCase()) return true;
      }
      return false;
    });
    console.log(anime);

    return anime || null;
  };
}
export default new jikanMoe();
