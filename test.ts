import scrapAnime from "./src/lib/scrapAnime";
import config from "./src/config";
import { writeFileSync } from "fs";

(async () => {
  const browser = await config.browser();
  const page = await browser.newPage();

  const anime = await scrapAnime(page,"https://www3.animeflv.net/anime/boku-no-hero-academia-6th-season");
  console.log(anime);
  console.log(anime?.anime?.related);
  writeFileSync("anime.json", JSON.stringify(anime, null, 2));
  browser.close();
})();