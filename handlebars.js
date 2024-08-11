const Handlebars = require("handlebars");
const path = require("path");

Handlebars.registerHelper("src", function (source) {
  return path.resolve(__dirname, "src", source);
});

module.exports = Handlebars;
