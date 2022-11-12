import { load } from "cheerio";
import { upperCaseFirst } from "../utils/upperCaseFirst.utils";
import Episode from "../types/episode.type";
import Server from "../types/server.type";

const scrap = async (browser: any, url: string): Promise<Episode> => {
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  const html = await page.content();
  const $ = load(html);

  const title = $("h1.Title").text();
  const subtitle = $("h2.SubTitle").text();
  const episode = parseInt(page.url().split("-").pop()!);
  const id = page.url().split("/").pop()!;
  const servers: Server[] = <Server[]>$("div.DwsldCnTbl a")
    .map((i, el) => {
      const link = $(el).attr("href");
      let server = upperCaseFirst(<string>link?.split("//")[1].split(".")[0]);
      if (link?.includes("zippyshare")) server = "Zippyshare";
      return {
        id: i,
        title: server,
        url: link,
      };
    })
    .get();

  page.close();

  return {
    episode,
    id,
    title,
    subtitle,
    servers,
    date: Date.now(),
  };
};

export default scrap;
