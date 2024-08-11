const Handlebars = require("handlebars");
const path = require("path");

Handlebars.registerHelper("src", function (source) {
  return path.resolve(__dirname, "src", source);
});

Handlebars.registerHelper("nav_link_active", function (page, context) {
  return context.data.root.page === page ? "active" : "";
});

module.exports = Handlebars;
