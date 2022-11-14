import puppeteer from "puppeteer-extra";
import { executablePath } from "puppeteer";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import "dotenv/config";
import * as db from "./db/database";

export default {
  PAGE_URL: process.env.PAGE_URL,
  database: db,
  browser: async () => {
    puppeteer.use(StealthPlugin());
    puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

    const browser = await puppeteer.launch({
      headless: true,
      ignoreDefaultArgs: ["--disable-extensions"],
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        `--window-size=1280,720`,
      ],
      executablePath: executablePath(),
    });
    return browser;
  },
};
