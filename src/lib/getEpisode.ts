import {
  saveEpisode,
  getEpisodeById,
  getAnimeById,
  saveAnime,
} from "../db/database";
import scrapEpisode from "./scrapEpisode";
import scrapAnime from "./scrapAnime";
import logger from "../utils/logger.utils";
import config from "../config";

const getEpisode = async (
  browser: any,
  Anime: string,
  Episode: string
): Promise<any> => {
  const anime = await getAnimeById(Anime);
  if (anime.length === 0) {
    const animeData = await scrapAnime(
      browser,
      `${config.PAGE_URL}/anime/${Anime}`
    );
    const animeKey = await saveAnime(animeData?.anime!);
    logger.info(`anime ${animeData?.anime?.title} saved`);
    for (const { episode, j } of animeData?.episodesList.map(
      (episode: any, j: any) => ({ episode, j })
    )) {
      const episodeData = await scrapEpisode(browser, episode);
      await saveEpisode(episodeData, animeKey!);
      logger.info(`episode ${episodeData.episode} saved`);
      if (j === animeData?.episodesList.length - 1) {
        logger.info(`anime ${animeData?.anime?.title} saved`);
        return;
      }
    }
  }
  const episode = await getEpisodeById(Anime, parseInt(Episode));
  if (episode) return;
  const episodeData = await scrapEpisode(
    browser,
    `${config.PAGE_URL}/ver/${Episode}`
  );
  await saveEpisode(episodeData, anime[0].key);
  logger.info(`episode ${episodeData.episode} saved`);
  return;
};

export default getEpisode;
