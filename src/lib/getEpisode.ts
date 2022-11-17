import scrapEpisode from "./scrapEpisode";
import scrapAnime from "./scrapAnime";
import logger from "../utils/logger.utils";
import config from "../config";
//import sleep from "../utils/sleep.utils";

const getEpisode = async (
  page: any,
  Anime: string,
  Episode: string,
  database: any
): Promise<any> => {
  const anime = await database.getAnimeById(Anime);
  if (anime.length === 0) {
    const animeData = await scrapAnime(
      page,
      `${config.PAGE_URL}/anime/${Anime}`
    );
    const LastAnime = await database.getLastAnime();
    const id = LastAnime ? LastAnime.id+1 : 0;

    const animeKey = await database.saveAnime({...animeData?.anime!, id});
    logger.info(`anime ${animeData?.anime?.title} saved`);
    for (const { episode, j } of animeData?.episodesList.map(
      (episode: any, j: any) => ({ episode, j })
    )) {
      const episodeData = await scrapEpisode(page, episode);
      await database.saveEpisode(episodeData, animeKey!);
      logger.info(`episode ${episodeData.episode} saved`);
      if (j === animeData?.episodesList.length - 1) {
        logger.info(`anime ${animeData?.anime?.title} saved`);
        return;
      }
      //sleep(1000);
    }
  }
  const episode = await database.getEpisodeById(Anime, parseInt(Episode));
  if (episode) return;
  const episodeData = await scrapEpisode(
    page,
    `${config.PAGE_URL}/ver/${Episode}`
  );
  await database.saveEpisode(episodeData, anime[0].key);
  logger.info(`episode ${episodeData.episode} saved`);
  return;
};

export default getEpisode;
