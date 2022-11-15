import config from "./config";
import getAllPages from "./lib/getAllpages";
import updateService from "./lib/updateService";
import logger from "./utils/logger.utils";
const args = process.argv.join(" ");

const main = async () => {
  const browser = await config.browser();
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  const database = config.database;

  if (args.toLowerCase().includes("allscraping")) {
    logger.info("All scraping started");
    getAllPages(page, database).then(() => {
      process.exit(0);
    });
  } else {
    updateService(page, database);
  }
};

main();
