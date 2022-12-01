import axios from "axios";
import "dotenv/config";
import { createReadStream, writeFileSync } from "fs";
const _imgbb = require("imgbb-uploader");
const imgbb = _imgbb;
(async () => {
 const a = `var anime_info = ["89","2x2 = shinobuden","2x2-shinobuden"];`;

  const b = a.split("var anime_info = [")[1].split("];")[0].split(",");
  console.log(b[0].replace(/"/g, ""));
})();
