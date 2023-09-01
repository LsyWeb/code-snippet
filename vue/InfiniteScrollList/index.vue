<template>
  <div
    class="infinite-scroll-wrapper"
    :style="{
      width: wrapperWidth + 'px',
      height: wrapperHeight + 'px',
      ...wrapperStyle,
    }"
  >
    <div
      class="infinite-scroll-list"
      :class="{ horizontal: direction === 'horizontal' }"
    >
      <div
        class="infinite-scroll-list-item"
        v-for="item in renderList"
        :key="item[itemKey || 'id']"
        :style="{
          height: itemHeight + 'px',
          width: itemWidth + 'px',
          ...itemStyle,
        }"
      >
        <slot :item="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string,any>">
import { computed, withDefaults, defineProps, CSSProperties } from "vue";
type InfiniteScrollListProps = {
  /**
   * @description: 列表数据
   */
  // eslint-disable-next-line no-undef
  list: T[];
  /**
   * @description: 滚动方向
   */
  direction?: "vertical" | "horizontal";
  /**
   * @description: 最外层容器高度
   */
  wrapperWidth?: number;
  /**
   * @description: 最外层容器高度
   */
  wrapperHeight?: number;
  /**
   * @description: 最外层容器样式
   */
  wrapperStyle?: CSSProperties;
  /**
   * @description: 每一项的key，默认为id
   */
  itemKey?: string;
  /**
   * @description: 每一项的高度，默认为0，当direction为vertical时必填
   */
  itemHeight?: number;
  /**
   * @description: 每一项的宽度，默认为0，当direction为horizontal时必填
   */
  itemWidth?: number;
  /**
   * @description: 每一项的样式
   */
  itemStyle?: CSSProperties;
};

const props = withDefaults(defineProps<InfiniteScrollListProps>(), {
  direction: "vertical",
  itemKey: "id",
  itemHeight: 0,
  itemWidth: 0,
});

const scrollWrapperHeight = computed(
  () => -props.list.length * props.itemHeight + "px",
);
const scrollWrapperWidth = computed(
  () => -props.list.length * props.itemWidth + "px",
);

const renderList = computed(() => {
  if (props.direction === "vertical") {
    if (!props.wrapperHeight) {
      throw new Error("itemHeight is required");
    }
    if (!props.itemHeight) {
      throw new Error("itemHeight is required");
    }
    const num = props.wrapperHeight / props.itemHeight;
    const count = Math.ceil(num / props.list.length);
    const copyList = [];
    for (let i = 0; i < count; i++) {
      copyList.push(...props.list);
    }
    return [...props.list, ...copyList];
  } else {
    if (!props.wrapperWidth) {
      throw new Error("itemWidth is required");
    }
    if (!props.itemWidth) {
      throw new Error("itemWidth is required");
    }
    const num = props.wrapperWidth / props.itemWidth;
    const count = Math.ceil(num / props.list.length);
    const copyList = [];
    for (let i = 0; i <= count; i++) {
      copyList.push(...props.list);
    }
    return [...props.list, ...copyList];
  }
});
</script>

<style scoped>
.infinite-scroll-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.infinite-scroll-list {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  animation: scroll-vertical 10s linear infinite normal;
}

.infinite-scroll-list.horizontal {
  display: flex;
  animation: scroll-horizontal 10s linear infinite normal;
}

.infinite-scroll-list.horizontal .infinite-scroll-list-item {
  flex: 0 0 auto;
}

.infinite-scroll-wrapper:hover > .infinite-scroll-list {
  animation-play-state: paused;
}

@keyframes scroll-vertical {
  100% {
    top: v-bind(scrollWrapperHeight);
  }
}
@keyframes scroll-horizontal {
  100% {
    left: v-bind(scrollWrapperWidth);
  }
}
</style>
