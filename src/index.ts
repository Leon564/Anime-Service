import config from "./config";
import getAllPages from "./lib/getAllpages";
import updateService from "./lib/updateService";
import logger from "./utils/logger.utils";
import { join } from "path";
import { unlinkSync, existsSync } from "fs";
const args = process.argv.join(" ");
const AllScrapProgress = join(__dirname, "data", "AllScrapProgress.json");
const Scrap_Complete = join(__dirname, "data", "Scrap_Complete.json");

const main = async () => {
  const browser = await config.browser();
  const page = await browser.newPage();
  const database = config.database;
  if (args.toLowerCase().includes("allscraping")) {
    if (args.toLowerCase().includes("--restart")) {
      await database.clearDatabase();
      if (existsSync(AllScrapProgress)) unlinkSync(AllScrapProgress);
      if (existsSync(Scrap_Complete)) unlinkSync(Scrap_Complete);
    }

    logger.info("All scraping started");
    getAllPages(page, database).then(() => {
      process.exit(0);
    });
  } else {
    updateService(page, database);
  }
};

main();
