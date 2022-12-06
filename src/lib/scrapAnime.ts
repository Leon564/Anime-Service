import { load } from "cheerio";
import Anime from "../types/anime.type";
//import removeAccents from "../utils/removeAccents";
import config from "../config";
import jikanMoe from "./jikanMoe";
//import sleep from "../utils/sleep.utils";
//import uploadImage from "../utils/uploadImage.utils";
import logger from "../utils/logger.utils";
import scrapRelatedAnimes from "./scrapRelatedAnimes";

const scrap = async (
  page: any,
  url: string
): Promise<{
  anime: Anime;
  episodesList: [] | any;
} | null> => {
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  const html = await page.content();
  const $ = load(html);

  const anime: Anime = <Anime>{};

  anime.slug = page.url().split("/").pop()!;
  anime.title = $("h1.Title").text();

  anime.language = "Subtitled";
  if (anime.title.toLocaleLowerCase().includes("latino")) {
    anime.language = "Latino";
  }

  anime.alternativeTitles = <any[]>[];

  const AlternativeTitles = $("span.TxtAlt");
  const extraInfo = await jikanMoe.getAnimeInfo(anime.title);

  anime.alternativeTitles = AlternativeTitles.map((i, el) => {
    return $(el).text();
  }).get();

  anime.type = $("span.Type").text();

  const cover = `${config.PAGE_URL}${$("div.AnimeCover div figure img").attr(
    "src"
  )!}`;

  anime.cover = cover; //await uploadImage(cover,extraInfo?.images?.jpg?.large_image_url, "cover");

  anime.related = <any[]>[];
  let _related: any[] = [];
  $("ul.ListAnmRel li").each((i, el) => {
    const slug = $(el).find("a").attr("href")?.split("/").pop();
    const title = $(el).find("a").text();
    const type = $(el).text().split("(")[1].split(")")[0];
    const visible = true;
    _related.push({ slug, title, type, visible });
  });

  /*
  const related = new Promise(async (resolve, reject) => {
    logger.info(`Scraping related anime ${_related.length}`);
    let _related2: any[] = [];
    if (_related.length === 0) resolve(_related2);
    for (let i = 0; i < _related.length; i++) {
      setTimeout(async () => {
        const el = _related[i];
        logger.info(`Scraping related anime ${i + 1}/${_related.length}`);
        const animeInfo = await jikanMoe.getAnimeInfo(el.title);
        _related2.push({
          slug: el.slug,
          title: el.title,
          type: el.type,
          visible: el.visible,
          cover: animeInfo?.images?.jpg?.large_image_url,
        });
        if (i === _related.length - 1) resolve(_related2);
      }, 1000 * i);
    }
  });
  */

  //console.log(related);
  const banner = `${config.PAGE_URL}${$("div.Bg")
    .attr("style")
    ?.split("(")[1]
    .split(")")[0]!}`;

  anime.banner = banner.includes("banners/3690.jpg")
    ? extraInfo?.images?.jpg?.large_image_url
    : banner; //await uploadImage(banner, extraInfo?.images?.jpg?.large_image_url, "banner");
  if (!anime.banner) anime.banner = "https://i.ibb.co/55sJ2XR/Banner.png";
  const genres = $("nav.Nvgnrs a");
  anime.genres = genres
    .map((i, el) => {
      return $(el).text();
    })
    .get();

  anime.synopsis = $("div.Description p").text();

  const scripts = $("script")
    .toArray()
    .find((el: any) => {
      return el.children[0]?.data?.includes("var episodes");
    });
  if (!scripts) return null;

  anime.id = await (await page.evaluate("anime_info"))[0];

  const episodesList = await (
    await page.evaluate("episodes")
  ).map(([number, id]: any) => {
    return `${config.PAGE_URL}/ver/${anime.slug}-${number}`;
  });

  const related = await scrapRelatedAnimes(page, _related);
  anime.related = <any[]>await related;

  if (!anime.title || anime.title == "") return null;

  return { anime, episodesList };
};

export default scrap;
