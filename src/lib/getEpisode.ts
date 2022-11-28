import scrapEpisode from "./scrapEpisode";
import scrapAnime from "./scrapAnime";
import logger from "../utils/logger.utils";
import config from "../config";
import service from "../services/service";
//import sleep from "../utils/sleep.utils";

const getEpisode = async (
  page: any,
  Anime: string,
  Episode: string
): Promise<any> => {
  const anime = await service.getAnimeBySlug(Anime);
  if (!anime) {
    const animeData = await scrapAnime(
      page,
      `${config.PAGE_URL}/anime/${Anime}`
    );

    const animeKey = await service.saveAnime(animeData?.anime!);
    logger.info(`anime ${animeData?.anime?.title} saved`);
    for (const { episode, j } of animeData?.episodesList
      .reverse()
      .map((episode: any, j: any) => ({ episode, j }))) {
      const episodeData = await scrapEpisode(page, episode, anime.id);
      await service.saveEpisode(episodeData, animeKey!);

      logger.info(`episode ${episodeData.episodeNumber} saved`);
      if (j === animeData?.episodesList.length - 1) {
        logger.info(
          `all espisodes of the anime ${animeData?.anime?.title} saved`
        );
        return;
      }
      //sleep(1000);
    }
  }

  const episode = await service.getEpisodeBySlug(Anime, parseInt(Episode));
  if (episode) return;
  const episodeData = await scrapEpisode(
    page,
    `${config.PAGE_URL}/ver/${Episode}`,
    anime.id

  );

  await service.saveEpisode(episodeData, anime[0].key);
  logger.info(`episode ${episodeData.episodeNumber} saved`);
  return;
};

export default getEpisode;
