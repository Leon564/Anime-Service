import { load } from "cheerio";
import { upperCaseFirst } from "../utils/upperCaseFirst.utils";
import Episode from "../types/episode.type";
import Server from "../types/server.type";

const scrap = async (page: any, url: string): Promise<Episode> => {
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  const html = await page.content();
  const $ = load(html);

  const title = $("h1.Title").text();
  const episodeNumber = parseInt(page.url().split("-").pop()!);
  let servers: Server[] = [];
  const scripts = $("script")
    .toArray()
    .find((el: any) => {
      return el.children[0]?.data?.includes("var videos");
    });
  if (!scripts) servers = [];
  const serversScript = $(scripts)
    .text()
    .match(/var videos = (.*);/)![0]
    .split(" = ")[1]
    .slice(0, -1);

  const serversList = JSON.parse(serversScript);
  servers = [];
  if (serversList.SUB) {
    servers = serversList.SUB.map((el: any, i: any) => {
      return {
        id: i,
        title: el.title,
        url: el.url,
        code: el.code,
      };
    });
  }

  const downloadServers: Server[] = <Server[]>$("div.DwsldCnTbl a")
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

  return {
    episodeNumber,
    title,
    servers,
    downloadServers,
  };
};

export default scrap;
