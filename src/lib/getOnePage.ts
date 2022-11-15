import scrapDirectory from "./scrapDirectory";
import scrapAnime from "./scrapAnime";
import scrapEpisode from "./scrapEpisode";
import logger from "../utils/logger.utils";
import sleep from "../utils/sleep.utils";

const getOnePage = async (
  page: any,
  pageNumber: number | string,
  database: any,
  verificarDatabase?: boolean,
  
): Promise<boolean | string> => {
  const results = await scrapDirectory(page, pageNumber);

  if (results.length === 0) return "not found animes in this page";
  return new Promise(async (resolve, reject) => {
    for (const { anime, i } of results.map((anime, i) => ({ anime, i }))) {
      const animeData = await scrapAnime(page, anime.url);
      if (verificarDatabase) {
        const exist = await database.getAnimeById(animeData?.anime?.id!);
        if (exist.length > 0) {
          logger.info(`anime ${animeData?.anime?.title} already exist`);
          if (i === results.length - 1) return resolve(true);

          continue;
        }
      }
      if (!animeData) return resolve(false);
      const animeKey = await database.saveAnime(animeData.anime);
      logger.info(`anime ${anime.name} saved`);

      for (const { episode, j } of animeData.episodesList.map(
        (episode: any, j: any) => ({ episode, j })
      )) {
        const episodeData = await scrapEpisode(page, episode);
        await database.saveEpisode(episodeData, animeKey!);

        if (
          i === results.length - 1 &&
          j === animeData.episodesList.length - 1
        ) {
          logger.info(`page ${pageNumber} saved`);
          return resolve(true);
        }
        sleep(500);
      }
      sleep(1000);
    }
  });
};

export default getOnePage;
