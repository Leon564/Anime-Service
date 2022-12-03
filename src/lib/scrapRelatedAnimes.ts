import { load } from "cheerio";
import config from "../config";
import logger from "../utils/logger.utils";

const scrapRelatedAnimeCover = async (slug: string, page:any) => {
    try {
        await page.goto(`${config.PAGE_URL}/anime/${slug}`, {waitUntil: 'domcontentloaded'});
        const html = await page.content();
        const $ = load(html);
        const relatedCover = `${config.PAGE_URL}${$(
            "div.AnimeCover div figure img"
          ).attr("src")!}`;
        return relatedCover;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const scrapRelatedAnimes = async (page: any, related: any) => {
  return new Promise(async (resolve, reject) => {
    let _related: any[] = [];
    if (related.length === 0) resolve(_related);
    for (let i = 0; i < related.length; i++) {
        logger.info(`Scraping related anime ${i+1}/${related.length}`);
        const el = related[i];
        const cover = await scrapRelatedAnimeCover(el.slug,page );
        _related.push({
            slug: el.slug,
            title: el.title,
            type: el.type,
            visible: el.visible,
            cover: cover,
        });
        if (i === related.length - 1) resolve(_related);
    }
    });
};

export default scrapRelatedAnimes;


