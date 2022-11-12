import config from "./config";
import getAllPages from "./lib/getAllpages";
import updateService from "./lib/updateService";
const args = process.argv.join(" ");

const main = async () => {
  const browser = await config.browser();
  if (args.toLowerCase().includes("allscraping")) {
    getAllPages(browser).then(() => {
      browser.close();
      process.exit(0);
    });
  } else {
    updateService(browser);
  }
};

main();
