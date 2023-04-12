import { ref } from "vue";
const vw = ref(document.documentElement.clientWidth);
const vh = ref(document.documentElement.clientWidth);

export default function () {
  document.addEventListener("resize", () => {
    vw.value = document.documentElement.clientWidth;
    vh.value = document.documentElement.clientHeight;
  });
  return {
    vw,
    vh,
  };
}
