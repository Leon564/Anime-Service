import scrapHomePage from "./scrapHomePage";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import logger from "../utils/logger.utils";
const FILE_PATH = join(__dirname, "..", "data", "episodes.json");

const checkEpisodeUpdates = async (browser: any): Promise<any[]> => {
  const animes = await scrapHomePage(browser);
  if (existsSync(FILE_PATH)) {
    const episodes = JSON.parse(readFileSync(FILE_PATH, "utf-8"));
    if (JSON.stringify(episodes) === JSON.stringify(animes)) {
      logger.info("No new episodes");
      return [];
    }
  }
  writeFileSync(FILE_PATH, JSON.stringify(animes));
  return animes;
};

export default checkEpisodeUpdates;
