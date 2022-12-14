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
  pageNumber: number | string
): Promise<boolean | string> => {
  const results = await scrapDirectory(page, pageNumber);

  if (results.length === 0) return "not found animes in this page";
  return new Promise(async (resolve, reject) => {
    for (const { anime, i } of results.map((anime, i) => ({ anime, i }))) {
      const exist = await service.getAnimeBySlug(anime?.slug!); //database.getAnimeById(animeData?.anime?.slug!);
      if (exist) {
        logger.info(`anime ${anime?.name} already exist`);
        if (i === results.length - 1) return resolve(true);

        continue;
      }

      const animeData = await scrapAnime(page, anime.url);
      if(anime.slug === "tegami-bachi") console.log({ animeData:!!animeData});
      if (!animeData) {
        logger.error(`anime ${anime.name} not found`);
        if (i === results.length - 1) return resolve(true);

        continue;
      }

      const animeKey = await service.saveAnime(animeData.anime); //database.saveAnime(animeData.anime);
      logger.info(`anime ${anime.name} saved`);
      writeFileSync(LastAnimeFile, JSON.stringify({ lastAnime: animeKey }));

      for (const { episode, j } of animeData.episodesList
        .reverse()
        .map((episode: any, j: any) => ({ episode, j }))) {
        const episodeData = await scrapEpisode(
          page,
          episode,
          animeData.anime.id
        );
        //await database.saveEpisode(episodeData, animeKey!);
        await service.saveEpisode(episodeData, animeKey!);
        logger.info(
          `${anime.name} episode ${episodeData.episodeNumber}/${animeData.episodesList.length} saved`
        );
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
