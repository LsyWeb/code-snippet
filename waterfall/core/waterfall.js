import { debounce } from "./help.js";
/**
 * 瀑布流
 * @param {Object} options
 * @param {HTMLElement} options.$el 父容器
 * @param {Number} options.count 列数
 * @param {Number} options.gap 间距
 * @param {Number} options.complete 列的宽度
 */
export default class Waterfall {
  constructor(options) {
    this.$el = null; // 父容器
    this.count = 4; // 列数
    this.gap = 10; // 间距
    Object.assign(this, options);
    this.width = 0; // 列的宽度
    this.items = []; // 子元素集合
    this.H = []; // 存储每列的高度方便计算
    this.flag = null; // 虚拟节点集合
    this.init();
  }
  #resize() {
    debounce(() => {
     this.rerender();
    }, 300).call(this);
  }

  init() {
    this.items = Array.from(this.$el.children);
    this.reset();
    this.render();
    window.addEventListener("resize", this.#resize.bind(this));
  }

  reset() {
    this.flag = document.createDocumentFragment();
    const containerWidth = this.$el.clientWidth - (this.count - 1) * this.gap;
    this.width = containerWidth / this.count;
    this.H = new Array(this.count).fill(0);
    this.$el.innerHTML = "";
  }

  rerender() {
    this.items = Array.from(this.$el.children);
    this.reset();
    this.render();
  }

  render() {
    const { width, items, flag, H, gap } = this;
    items.forEach((item) => {
      item.style.width = width + "px";
      item.style.position = "absolute";
      let img = item.querySelector("img");
      if (img.complete) {
        let tag = H.indexOf(Math.min(...H));
        item.style.left = tag * (width + gap) + "px";
        item.style.top = H[tag] + "px";
        H[tag] += (img.height * width) / img.width + gap;
        flag.appendChild(item);
      } else {
        img.addEventListener("load", () => {
          let tag = H.indexOf(Math.min(...H));
          item.style.left = tag * (width + gap) + "px";
          item.style.top = H[tag] + "px";
          H[tag] += (img.height * width) / img.width + gap;
          flag.appendChild(item);
          this.$el.append(flag);
        });
      }
    });
    this.$el.append(flag);
  }
}
