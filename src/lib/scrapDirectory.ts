import { load } from "cheerio";
import config from "../config";

const scrapDirectory = async (
  page: any,
  pageNumber: number | string
): Promise<any[]> => {
  const pageUrl = encodeURI(`${config.PAGE_URL}/browse?page=${pageNumber}`);
  await page.goto(pageUrl, {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  const html = await page.content();
  const $ = load(html);

  const animeList = $("ul.ListAnimes li a")
    .map((i, el) => {
      const url = `${config.PAGE_URL}${$(el).attr("href")}`;
      const name = $(el).find("h3.Title").text();
      if (name)
        return {
          name,
          url,
        };
    })
    .get()
    .reverse();

  return animeList;
};

export default scrapDirectory;
