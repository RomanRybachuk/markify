"use strict";

import "./scss/style.scss";

const loader = document.querySelector(".loader-window");
const links = document.querySelectorAll("a");

window.addEventListener("load", () => {
  loader.classList.add("hidden");
});

links.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const href = this.getAttribute("href");
    loader.classList.remove("hidden");

    setTimeout(() => {
      window.location.href = href;
    }, 200);
  });
});
