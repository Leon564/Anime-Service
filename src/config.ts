import puppeteer from "puppeteer-extra";
import { executablePath } from "puppeteer";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import "dotenv/config";

export default {
  PAGE_URL: process.env.PAGE_URL,  
  apiUrl: process.env.API_URL,
  browser: async () => {
    puppeteer.use(StealthPlugin());
    puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

    const browser = await puppeteer.launch({
      headless: false,
      ignoreDefaultArgs: ["--disable-extensions"],
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        //"--single-process", // <- this one doesn't works in Windows
        "--disable-gpu",
      ],
      executablePath: executablePath(),
    });
    return browser;
  },
};
