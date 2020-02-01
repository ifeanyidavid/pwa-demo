const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const logger = require("../utils/logger");
const config = require("../config/constants");

const options = [
  {
    from: path.resolve(__dirname, `../../${config.APP_DESTINATION}/index.html`),
    to: path.resolve(__dirname, `../../${config.BUILD_DESTINATION}/`)
  },
  {
    from: path.resolve(
      __dirname,
      `../../${config.APP_DESTINATION}/manifest.json`
    ),
    to: path.resolve(__dirname, `../../${config.BUILD_DESTINATION}/`)
  },
  {
    from: path.resolve(__dirname, `../../${config.APP_DESTINATION}/sw.js`),
    to: path.resolve(__dirname, `../../${config.BUILD_DESTINATION}/`)
  },
  {
    from: path.resolve(__dirname, `../../${config.ASSET_PATH}`),
    to: path.resolve(__dirname, `../../${config.BUILD_DESTINATION}/`)
  }
];

const copy = (from, to) => {
  const args = ["-v"];

  if (!fs.existsSync(to)) {
    fs.mkdirSync(to);
  }

  if (fs.lstatSync(from).isDirectory()) {
    args.push("-r");
  }

  exec(`cp ${args.join(" ")} ${from} ${to}`, (err, stdout) => {
    if (err) {
      logger.error("[copy-assets] error", err);
      return;
    }

    logger.info(stdout);
  });
};

options.forEach(entry => copy(entry.from, entry.to));
