import scrapAnime from "./src/lib/scrapAnime";
import config from "./src/config";

config.browser().then(async (browser) => {
    const page = await browser.newPage();
    const anime = await scrapAnime(page, "https://www3.animeflv.net/anime/phi-brain-kami-no-puzzle-iii" );
    console.log(anime);
    await browser.close();
});