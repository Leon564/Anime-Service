import getOnePage from "./getOnePage";
import { load } from "cheerio";
import { existsSync, writeFileSync, readFileSync, unlinkSync } from "fs";
import { join } from "path";
import logger from "../utils/logger.utils";
import config from "../config";
//import sleep from "../utils/sleep.utils";
const FILE_PATH = join(__dirname, "..", "data", "AllScrapProgress.json");
const FinishFile = join(__dirname, "..", "data", "Scrap_Complete.json");

const getAllPages = async (page: any, database:any): Promise<any> => {
  if (existsSync(FinishFile)) {
    logger.info("Scraping is already complete");
    logger.info(
      "If you want to scrap again, delete the file Scrap_Complete.json in the data folder"
    );
    return;
  }
  try {
    if (!existsSync(FILE_PATH)) {
      const pageUrl = encodeURI(`${config.PAGE_URL}/browse`);
      await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 0 });
      const html = await page.content();
      const $ = load(html);
      const pagesFound = parseInt($("ul.pagination li").last().prev().text());
      writeFileSync(FILE_PATH, JSON.stringify({ pages: pagesFound }));   
    }

    database.deleteLastAnime();
    let pages = JSON.parse(readFileSync(FILE_PATH).toString()).pages;
    if (pages === 0) return [];

    let verif = true;
    return new Promise(async (resolve, reject) => {
      for (let i = pages; i > 0; i--) {
        logger.info(`Scraping page ${i} of ${pages}`);
        await getOnePage(page, i, database, verif);
        verif = false;
        writeFileSync(FILE_PATH, JSON.stringify({ pages: i - 1 }));
        if (i === 1) {
          console.log("No more anime to scrap");
          unlinkSync(FILE_PATH);
          writeFileSync(FinishFile, JSON.stringify({ pages: 0 }));
          resolve(true);
        }
        //sleep(1000);
      }
    });
  } catch (e) {
    logger.error(e);
  }
};

export default getAllPages;
