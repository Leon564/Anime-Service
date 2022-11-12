import cron from "node-cron";
import logger from "../utils/logger.utils";
import checkEpisodeUpdates from "./checkEpisodeUpdates";
import getEpisode from "./getEpisode";

const updateService = async (browser: any): Promise<void> => {
  logger.info("update service started");

  const task = cron.schedule("*/5 * * * *", async () => {
    logger.info("Checking for new episodes");

    const episodes = await checkEpisodeUpdates(browser);
    if (episodes.length > 0) {
      logger.info("New episodes found");
      for (const { animeId, episode } of episodes) {
        await getEpisode(browser, animeId, episode);
      }
    }
  });
  task.start();
};

export default updateService;
