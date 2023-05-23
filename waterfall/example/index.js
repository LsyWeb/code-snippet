import Waterfall from "../core/waterfall.js";

const w = new Waterfall({
  $el: document.querySelector(".list"),
  count: 4,
  gap: 10
});
w.init();