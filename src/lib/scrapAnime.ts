import { load } from "cheerio";
import Anime from "../types/anime.type";
import removeAccents from "../utils/removeAccents";
import config from "../config";
import jikanMoe from "./jikanMoe";

const scrap = async (
  page: any,
  url: string
): Promise<{ anime: Anime; episodesList: [] | any } | null> => {
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  const html = await page.content();
  const $ = load(html);

  const anime: Anime = <Anime>{};

  anime.slug = page.url().split("/").pop()!;
  anime.title = $("h1.Title").text();
  anime.lowerTitle = anime.title.toLowerCase();
  anime.alternativeTitles = <any[]>[];
  anime.lowerAlternativeTitles = <any[]>[];
  const AlternativeTitles = $("span.TxtAlt");

  AlternativeTitles.each((i, el) => {
    const titleAlt = removeAccents($(el).text())
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/ /g, "%20");

    if (titleAlt === "" || titleAlt === "%20") return;

    anime.lowerAlternativeTitles[<any>titleAlt] = true;
  });
  anime.alternativeTitles = AlternativeTitles.map((i, el) => {
    return $(el).text();
  }).get();

  anime.type = $("span.Type").text();
  anime.status = $("p.AnmStts").text();
  anime.rating = $("span#votes_prmd").text();
  anime.votes = parseInt($("span#votes_nmbr").text());
  anime.cover = `${config.PAGE_URL}${$("div.AnimeCover div figure img").attr(
    "src"
  )!}`;

  anime.related = <any[]>[];

  $("ul.ListAnmRel li").each((i, el) => {
      const id = $(el).find("a").attr("href")?.split("/").pop();
      const title = $(el).find("a").text();
      const type =$(el).text().split('(')[1].split(')')[0];
      const visible= true;
      anime.related.push({id,title,type,visible});
  });
  
  anime.banner = `${config.PAGE_URL}${$("div.Bg")
    .attr("style")
    ?.split("(")[1]
    .split(")")[0]!}`;

  const genres = $("nav.Nvgnrs a");
  anime.genres = genres
    .map((i, el) => {
      return $(el).text();
    })
    .get();

  anime.lowerGenres = <any[]>[];
  genres.each((i, el) => {
    anime.lowerGenres[<any>removeAccents($(el).text()).toLocaleLowerCase()] = true;
  });

  anime.sinopsis = $("div.Description p").text();
  anime.views = 0;
  anime.date = Date.now();
  anime.updated = Date.now();
  anime.visible = true;
  const scripts = $("script")
    .toArray()
    .find((el: any) => {
      return el.children[0]?.data?.includes("var episodes");
    });
  if (!scripts) return null;
  const epsList = $(scripts)
    .text()
    .match(/var episodes = (.*);/)![0]
    .split(" = ")[1]
    .slice(0, -1);

  const episodesList = JSON.parse(epsList).map((e: any) => {
    return `${config.PAGE_URL}/ver/${anime.slug}-${e.toString().split(",")[0]}`;
  });
  if (!anime.title || anime.title == "") return null;
  const animeInfo = await jikanMoe.getAnimeInfo(anime.title);
  if(animeInfo){
    anime.mal_id = animeInfo.mal_id;
    anime.aired = animeInfo.aired;
    anime.year = animeInfo.year;
    anime.duration = animeInfo.duration;
    anime.trailer = animeInfo.trailer;
    anime.images = animeInfo.images;
  }

  return { anime, episodesList };
};

export default scrap;
