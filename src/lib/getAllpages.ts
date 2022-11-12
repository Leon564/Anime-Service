import getOnePage from "./getOnePage";
import { load } from "cheerio";
import { existsSync, writeFileSync, readFileSync, unlinkSync } from "fs";
import { join } from "path";
import logger from "../utils/logger.utils";
import config from "../config";
const FILE_PATH = join(__dirname, "..", "data", "AllScrapProgress.json");
const FinishFile = join(__dirname, "..", "data", "Scrap_Complete.json");

const getAllPages = async (browser: any): Promise<any> => {
  if (existsSync(FinishFile)) {
    logger.info("Scraping is already complete");
    logger.info(
      "If you want to scrap again, delete the file Scrap_Complete.json in the data folder"
    );
    return;
  }
  try {
    if (!existsSync(FILE_PATH)) {
      const page = await browser.newPage();
      const pageUrl = encodeURI(`${config.PAGE_URL}/browse`);
      await page.goto(pageUrl, { waitUntil: "domcontentloaded" });
      const html = await page.content();
      const $ = load(html);
      const pagesFound = parseInt($("ul.pagination li").last().prev().text());
      writeFileSync(FILE_PATH, JSON.stringify({ pages: pagesFound }));
      page.close();
    }

    let pages = JSON.parse(readFileSync(FILE_PATH).toString()).pages;
    if (pages === 0) return [];

    let verif = true;
    //cicle through all pages in reverse order
    return new Promise(async (resolve, reject) => {
      for (let i = pages; i > 0; i--) {
        logger.info(`Scraping page ${i} of ${pages}`);
        await getOnePage(browser, i, verif);
        verif = false;
        writeFileSync(FILE_PATH, JSON.stringify({ pages: i - 1 }));
        if (i === 1) {
          console.log("No more anime to scrap");
          unlinkSync(FILE_PATH);
          writeFileSync(FinishFile, JSON.stringify({ pages: 0 }));
          resolve(true);
        }
      }
    });
  } catch (e) {
    logger.error(e);
  }
};

export default getAllPages;
