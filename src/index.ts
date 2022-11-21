import config from "./config";
import getAllPages from "./lib/getAllpages";
import updateService from "./lib/updateService";
import logger from "./utils/logger.utils";
import { join } from "path";
import { unlinkSync, existsSync } from "fs";
const args = process.argv.join(" ");
const AllScrapProgress = join(__dirname, "data", "AllScrapProgress.json");
const Scrap_Complete = join(__dirname, "data", "Scrap_Complete.json");
const LastAnimeFile = join(__dirname, "data", "LastAnime.json");

const main = async () => {
  const browser = await config.browser();
  const page = await browser.newPage();

  process.stdout.write("\u001b[2J\u001b[0;0H");
  if (args.toLowerCase().includes("allscraping")) {
    if (args.toLowerCase().includes("--restart")) {
      if (existsSync(AllScrapProgress)) unlinkSync(AllScrapProgress);
      if (existsSync(Scrap_Complete)) unlinkSync(Scrap_Complete);
      if (existsSync(LastAnimeFile)) unlinkSync(LastAnimeFile);
    }

    logger.info("All scraping started");
    getAllPages(page).then(() => {
      process.exit(0);
    });
  } else {
    updateService(page);
  }
};

main();
