import { load } from "cheerio";
import config from "../config";

const scrapHomePage = async (browser: any): Promise<any[]> => {
  const page = await browser.newPage();
  const pageUrl = encodeURI(`${config.PAGE_URL}`);
  await page.goto(pageUrl, {
    waitUntil: "domcontentloaded",
  });

  const html = await page.content();
  const $ = load(html);

  const animeList = $("ul.ListEpisodios li a")
    .map((i, el) => {
      const href = $(el).attr("href");
      const url = `${config.PAGE_URL}${href}`;
      const id = href?.split("/")[2];
      const episode = id?.split("-").pop();
      const animeId = id?.split("-")?.slice(0, -1).join("-");
      const name = $(el).find("strong.Title").text();
      if (name)
        return {
          name,
          id,
          episode,
          animeId,
          url,
        };
    })
    .get()
    .reverse();

  page.close();
  return animeList;
};

export default scrapHomePage;
