const fs = require("fs");
const config = require("../config/constants");
const logger = require("../utils/logger");
const version = require("./package.json").version;
const FILE_PATH = config.FILE_PATH;
const DESTINATION_PATH = config.DESTINATION_PATH;
const minify = require("html-minifier").minify;

logger.info("Reading file to be minified...");
let fileData = fs.readFileSync(FILE_PATH, "utf8");
let size = fileData.length;

logger.info("Minifying...");
fileData = minify(fileData, {
  removeComments: true,
  minifyCSS: true,
  minifyJS: true,
  collapseWhitespace: true,
  preserveLineBreaks: false
});

fileData = fileData.replace("{{ version }}", version);

logger.info(
  "Writing out minified file",
  DESTINATION_PATH,
  ((1 - fileData.length / size) * 100).toFixed(2)
);
fs.writeFileSync(DESTINATION_PATH, fileData, "utf8");
