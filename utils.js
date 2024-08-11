const fs = require("fs");
const path = require("path");

function readFileContent(source) {
  try {
    return fs.readFileSync(path.resolve(__dirname, source), "utf8");
  } catch (error) {}
}

module.exports.readFileContent = readFileContent;
