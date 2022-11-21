import cron from "node-cron";
import logger from "../utils/logger.utils";
import checkEpisodeUpdates from "./checkEpisodeUpdates";
import getEpisode from "./getEpisode";

const updateService = async (page: any): Promise<void> => {
  logger.info("update service started");

  const task = cron.schedule("*/5 * * * *", async () => {
    logger.info("Checking for new episodes");

    const episodes = await checkEpisodeUpdates(page);
    if (episodes.length > 0) {
      logger.info("New episodes found");
      for (const { slug, episode } of episodes) {
        await getEpisode(page, slug, episode);
      }
    }
  });
  task.start();
};

export default updateService;
