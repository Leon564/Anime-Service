import { load } from "cheerio";
import config from "../config";

const scrapDirectory = async (
  browser: any,
  pageNumber: number | string
): Promise<any[]> => {
  const page = await browser.newPage();
  const pageUrl = encodeURI(`${config.PAGE_URL}/browse?page=${pageNumber}`);
  await page.goto(pageUrl, {
    waitUntil: "domcontentloaded",
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

  page.close();
  return animeList;
};

export default scrapDirectory;
