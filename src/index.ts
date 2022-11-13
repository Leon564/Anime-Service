import config from "./config";
import getAllPages from "./lib/getAllpages";
import updateService from "./lib/updateService";
const args = process.argv.join(" ");

const main = async () => {
  const browser = await config.browser();
  const page = await browser.newPage();
  if (args.toLowerCase().includes("allscraping")) {
    getAllPages(page).then(() => {
      process.exit(0);
    });
  } else {
    updateService(page);
  }
};

main();
