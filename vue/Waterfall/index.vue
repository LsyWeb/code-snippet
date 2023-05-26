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
      :class="itemClassName || 'waterfall-container-item'"
      v-for="(item, index) in list"
      :key="item[itemKey]"
      :style="{ ...itemStyle, position: 'absolute' }"
      v-update-position="(el: HTMLElement) => updatePosition(el)"
    >
      <slot :item="item" :index="index"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CSSProperties,
  computed,
  defineProps,
  onMounted,
  reactive,
  ref,
  watch,
  withDefaults,
} from "vue";

type WaterfallProps = {
  /**
   * @description 列表数据
   */
  list: any[];
  /**
   * @description 列表渲染的唯一key（会从列表数据中取该字段，如果列表中没有该字段，默认使用id）
   * @default id
   */
  itemKey?: string;
  /**
   * @description 列数，默认4列
   * @default 4
   */
  count?: number;
  /**
   * @description 列与列之间的间隙（包括上下间隙，单位px）
   * @default 10
   */
  gap?: number;
  /**
   * @description 列表项中的图片class类名，目前仅支持图片宽度100%的情况，仅能有一个图片，默认会使用querySelector获取“img”元素
   */
  imgClassName?: string;
  /**
   * @description 容器的宽度（单位px，如果需要其他单位的宽度，请使用wrapperStyle属性手动修改容器宽度），默认值为100%
   * @default 100%
   */
  wrapperWidth?: number;
  /**
   * @description 容器的class类名
   * @default waterfall-container
   */
  wrapperClassName?: string;
  /**
   * @description 列表项的class类名
   * @default waterfall-container-item
   */
  itemClassName?: string;
  /**
   * @description 容器的style
   */
  wrapperStyle?: CSSProperties;
  /**
   * @description 列表项的style
   */
  itemStyle?: CSSProperties;
};

type State = {
  /**
   * @description 列宽度
   */
  columnWidth: number;
  /**
   * @description 每一列的高度
   */
  columnHeights: number[];
};

const props = withDefaults(defineProps<WaterfallProps>(), {
  itemKey: "id",
  count: 4,
  gap: 10,
});

const count = computed(() => props.count <= 0 ? 0 : props.count);

const state = reactive<State>({
  columnWidth: 0,
  columnHeights: new Array(count.value).fill(0),
});

const waterfall = ref<HTMLElement | null>(null); // 瀑布流容器

/**
 * @description 更新列宽度
 * @param el HTMLElement 列表项元素
 */
const setColumnWidth = (el: HTMLElement) => {
  const wrapperWidth = props.wrapperWidth || el?.clientWidth; // 获取容器宽度
  const containerWidth = wrapperWidth - (count.value - 1) * props.gap; // 计算最终容器宽度
  state.columnWidth = containerWidth / count.value; // 计算列宽度
};

/**
 * @description 获取最小高度的列
 */
const getMinItemHeight = () => {
  const index = state.columnHeights.indexOf(Math.min(...state.columnHeights));
  return { index, height: state.columnHeights[index] };
};
/**
 * @description 获取最大高度的列
 */
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
  updateMounted(el: HTMLElement, binding: any) {
    const callback = binding.value;
    callback(el);
  },
};

/**
 * @description 设置列表项样式
 * @param el HTMLElement 列表项元素
 */
const setItemStyle = (el: HTMLElement) => {
  el.style.width = state.columnWidth + "px"; // 设置列宽度
  const itemHeight = (el.clientHeight * state.columnWidth) / el.clientWidth; // 计算元素高度

  let { height: minHeight, index: minIndex } = getMinItemHeight(); //找到最小高度的列
  el.style.top = minHeight + "px";
  el.style.left = minIndex * (state.columnWidth + props.gap) + "px";

  state.columnHeights[minIndex] += itemHeight + props.gap;
  el.style.visibility = "visible";
};

/**
 * @description 设置图片样式
 * @param img HTMLImageElement 图片元素
 */
const setImgStyle = (img: HTMLImageElement) => {
  img.style.width = "100%";
};

/**
 * @description 设置容器高度
 */
const setWrapperHeight = () => {
  const { height: maxHeight } = getMaxItemHeight();
  if (waterfall.value) waterfall.value.style.height = maxHeight + "px";
};

/**
 * @description 更新位置
 * @param el HTMLElement 列表项元素
 */
const updatePosition = (el: HTMLElement) => {
  const img = el.querySelector(props.imgClassName || "img");
  if (!img || !(img instanceof HTMLImageElement)) {
    // 如果没有图片
    setItemStyle(el);
    setWrapperHeight();
  } else {
    // 如果有图片
    if (img?.complete) {
      // 如果图片已经加载完成
      setImgStyle(img); // 设置图片样式
      setItemStyle(el);
      setWrapperHeight();
    } else {
      // 如果图片未加载完成
      img?.addEventListener("load", async () => {
        setImgStyle(img);
        setItemStyle(el);
        setWrapperHeight();
      });
    }
  }
};

onMounted(() => {
  setColumnWidth(waterfall.value as HTMLElement);
});

/**
 * @description 重置
 */
const reset = () => {
  state.columnHeights = new Array(count.value).fill(0);
  setColumnWidth(waterfall.value as HTMLElement);
};

/**
 * @description 重新渲染
 */
const rerender = () => {
  reset();
  const containerElement = waterfall.value;
  const items = [...(containerElement?.children as any)];
  items?.forEach((item) => {
    updatePosition(item as HTMLElement);
  });
};

watch(
  () => count.value,
  () => {
    rerender();
  },
);
</script>

<style scoped>
.waterfall-container {
  width: 100%;
}
.waterfall-container .waterfall-container-item {
  transition-duration: 0.3s;
  transition-property: left, top ;
  overflow: auto;
  visibility: hidden;
}
</style>
