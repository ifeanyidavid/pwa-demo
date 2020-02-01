const fs = require("fs");
const path = require("path");
const config = require("../config/constants");
const logger = require("../utils/logger");
const FILE_PATH = path.resolve(
  __dirname,
  `../../${config.BUILD_DESTINATION}/sw.js`
);
const DESTINATION_PATH = path.resolve(
  __dirname,
  `../../${config.BUILD_DESTINATION}/sw.js`
);
const HASH = `${config.APP_SCOPE_NAME}-` + Date.now();

logger.info("[sw] build with", HASH);
let fileData = fs.readFileSync(FILE_PATH, "utf8");

logger.info("[sw] replace {{cache}}");
fileData = fileData.replace("{{cache}}", HASH);


try {
  logger.info("[sw] write file", DESTINATION_PATH);
  fs.writeFileSync(DESTINATION_PATH, fileData, "utf8");
} catch (error) {
  logger.error(error);
}
