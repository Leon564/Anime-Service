import scrapDirectory from "./scrapDirectory";
import scrapAnime from "./scrapAnime";
import scrapEpisode from "./scrapEpisode";
import logger from "../utils/logger.utils";
import { join } from "path";
import service from "../services/service";
import { writeFileSync } from "fs";
const LastAnimeFile = join(__dirname, "..", "data", "LastAnime.json");
//import sleep from "../utils/sleep.utils";

const getOnePage = async (
  page: any,
  pageNumber: number | string,
  verificarDatabase?: boolean
): Promise<boolean | string> => {
  const results = await scrapDirectory(page, pageNumber);

  if (results.length === 0) return "not found animes in this page";
  return new Promise(async (resolve, reject) => {
    for (const { anime, i } of results.map((anime, i) => ({ anime, i }))) {
      const animeData = await scrapAnime(page, anime.url);
      if (verificarDatabase) {
        const exist = await service.getAnimeBySlug(animeData?.anime?.slug!); //database.getAnimeById(animeData?.anime?.slug!);
        if (exist) {
          logger.info(`anime ${animeData?.anime?.title} already exist`);
          if (i === results.length - 1) return resolve(true);

          continue;
        }
      }
      if (!animeData) return resolve(false);

      const animeKey = await service.saveAnime(animeData.anime); //database.saveAnime(animeData.anime);
      logger.info(`anime ${anime.name} saved`);
      writeFileSync(LastAnimeFile, JSON.stringify({ lastAnime: animeKey }));

      for (const { episode, j } of animeData.episodesList
        .reverse()
        .map((episode: any, j: any) => ({ episode, j }))) {
        const episodeData = await scrapEpisode(page, episode);
        //await database.saveEpisode(episodeData, animeKey!);
        await service.saveEpisode(episodeData, animeKey!);
        logger.info(`${anime.name} episode ${episodeData.episodeNumber} saved`);
        if (
          i === results.length - 1 &&
          j === animeData.episodesList.length - 1
        ) {
          logger.info(`page ${pageNumber} saved`);
          return resolve(true);
        }
        //sleep(500);
      }
      //sleep(1000);
    }
  });
};

export default getOnePage;
