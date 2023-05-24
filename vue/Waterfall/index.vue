<template>
  <div
    id="waterfall-container"
    :class="wrapperClassName || 'waterfall-container'"
    :style="{
      position: 'relative',
      width: wrapperWidth ? wrapperWidth + 'px' : '100%',
      ...wrapperStyle,
    }"
    ref="waterfall"
  >
    <div
      :class="itemStyle || 'item'"
      v-for="(item, index) in list"
      :key="item[itemKey]"
      :style="itemStyle"
      v-update-position="(el: HTMLElement) => updatePosition(el)"
    >
      <slot :item="item" :index="index"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CSSProperties, defineProps, reactive, ref, withDefaults } from "vue";

type WaterfallProps = {
  list: any[];
  itemKey?: string;
  wrapperWidth?: number;
  wrapperClassName?: string;
  itemClassName?: string;
  wrapperStyle?: CSSProperties;
  itemStyle?: CSSProperties;
  count?: number;
  gap?: number;
};

type State = {
  columnWidth: number;
  columnHeights: number[];
};

const props = withDefaults(defineProps<WaterfallProps>(), {
  itemKey: "id",
  count: 4,
  gap: 10,
});

const state = reactive<State>({
  columnWidth: 0,
  columnHeights: new Array(props.count).fill(0),
});

const waterfall = ref<HTMLElement | null>(null);

const setColumnWidth = (el: HTMLElement) => {
  const wrapperWidth = props.wrapperWidth || el?.clientWidth; // 获取容器宽度
  const containerWidth = wrapperWidth - (props.count - 1) * props.gap; // 计算最终容器宽度
  state.columnWidth = containerWidth / props.count; // 计算列宽度
  return state.columnWidth;
};

const getMinItemHeight = () => {
  const index = state.columnHeights.indexOf(Math.min(...state.columnHeights));
  return { index, height: state.columnHeights[index] };
};

const getMaxItemHeight = () => {
  const index = state.columnHeights.indexOf(Math.max(...state.columnHeights));
  return { index, height: state.columnHeights[index] };
};

// 自定义指令-更新位置
const vUpdatePosition = {
  mounted(el: HTMLElement, binding: any) {
    const callback = binding.value;
    callback(el);
  },
};

const setItemStyle = (el: HTMLElement) => {
  const itemHeight =
    (el.clientHeight * state.columnWidth) / el.clientWidth + props.gap;

  let { height: minHeight, index: minIndex } = getMinItemHeight(); //找到最小高度的列
  el.style.top = minHeight + "px";
  el.style.height = itemHeight + "px";
  el.style.left = minIndex * (state.columnWidth + props.gap) + "px";

  state.columnHeights[minIndex] += itemHeight;
  el.style.visibility = "visible";
};

const setImgStyle = (img: HTMLImageElement) => {
  const imgHeight =
    (img.clientHeight * state.columnWidth) / img.clientWidth + props.gap;
  img.style.height = imgHeight + "px";
  img.style.width = "100%";
};

const setWrapperHeight = () => {
  const { height: maxHeight } = getMaxItemHeight();
  if (waterfall.value) waterfall.value.style.height = maxHeight + "px";
};

const updatePosition = (el: HTMLElement) => {
  const containerElement = document.querySelector("#waterfall-container");
  setColumnWidth(containerElement as HTMLElement);

  el.style.width = state.columnWidth + "px"; // 设置宽度

  const img = el.querySelector("img");
  if (!img) {
    setItemStyle(el);
    setWrapperHeight();
    return;
  }
  if (img?.complete) {
    // 如果图片已经加载完成
    setImgStyle(img); // 设置图片样式
    setItemStyle(el);
    setWrapperHeight();
  } else {
    // 如果图片未加载完成
    img?.addEventListener("load", () => {
      setImgStyle(img);
      setItemStyle(el);
      setWrapperHeight();
    });
  }
};
</script>

<style scoped>
.waterfall-container {
  width: 100%;
}
.waterfall-container .item {
  transition: all 0.3s;
  position: absolute;
  visibility: hidden;
}
</style>
