<template>
  <div ref="root" class="text-ellipsis-wrapper">
    {{ expanded ? props.content : text }}
    <span class="text-ellipsis-action" v-if="hasAction" @click="onClickAction">
      {{ actionText }}
    </span>
  </div>
</template>

<script setup lang="ts">
import {
  defineProps,
  withDefaults,
  defineExpose,
  defineEmits,
  onMounted,
  computed,
  ref,
} from "vue";

export type TextEllipsisProps = {
  /**
   * @description 展示的文本
   */
  content: string;
  /**
   * @description 文本行高，单位px，默认为 24px（16px * 1.5）
   */
  lineHeight?: number;
  /**
   * @description 展示的行数，默认为1
   */
  rows?: number;
  /**
   * @description 展开操作的文案，默认为"展开"
   */
  expandText?: string;
  /**
   * @description 收起操作的文案，默认为"收起"
   */
  collapseText?: string;
  /**
   * @description 省略号的文本内容，默认为"..."
   */
  dots?: string;
};

export type TextEllipsisExpose = {
  toogle: (collapse?: boolean) => void;
};

const props = withDefaults(defineProps<TextEllipsisProps>(), {
  content: "",
  rows: 1,
  expandText: "展开",
  collapseText: "收起",
  dots: "...",
  lineHeight: 24,
});

const text = ref<string>("");

const expanded = ref<boolean>(false);

const hasAction = ref<boolean>(false);

const root = ref<HTMLElement>();

// 操作按钮文本展示
const actionText = computed(() =>
  expanded.value ? props.collapseText : props.expandText,
);

// px转换为数字 例如：'12px' => 12
const pxToNum = (value: string | null) => {
  if (!value) return 0;
  const match = value.match(/^\d*(\.\d*)?/);
  return match ? Number(match[0]) : 0;
};

// 计算文本省略
const calcEllipsised = () => {
  // 克隆一份容器，并离屏渲染到页面中
  const cloneContainer = () => {
    if (!root.value) return;

    const originStyle = window.getComputedStyle(root.value);
    const container = document.createElement("div");
    const styleNames: string[] = Array.prototype.slice.apply(originStyle);
    styleNames.forEach((name) => {
      container.style.setProperty(name, originStyle.getPropertyValue(name));
    });
    // 离屏渲染
    container.style.position = "fixed";
    container.style.zIndex = "-9999";
    container.style.top = "-9999px";
    container.style.height = "auto";
    container.style.minHeight = "auto";
    container.style.maxHeight = "auto";
    // 该功能必须要求有全局行高（外层组件有设置过lineHeight），否则无法计算，以下是兼容处理
    container.style.lineHeight = props.lineHeight + "px";

    container.innerText = props.content;
    document.body.appendChild(container);
    return container;
  };

  const calcEllipsisText = (container: HTMLDivElement, maxHeight: number) => {
    const { content, dots } = props;
    const end = content.length;

    const calcEllipse = () => {
      // 计算前后内容
      const tail = (left: number, right: number): string => {
        if (right - left <= 1) {
          return content.slice(0, left) + dots;
        }

        const middle = Math.round((left + right) / 2);

        // 设置拦截位置
        container.innerText =
          content.slice(0, middle) + dots + actionText.value;
        // 拦截后的高度仍然与要求的高度不匹配
        if (container.offsetHeight > maxHeight) {
          return tail(left, middle);
        }

        return tail(middle, right);
      };

      container.innerText = tail(0, end);
    };
    calcEllipse();
    return container.innerText;
  };

  const container = cloneContainer();
  if (!container) return;
  const { paddingBottom, paddingTop, lineHeight } = container.style;
  const maxHeight = Math.ceil(
    (Number(props.rows) + 0.5) * pxToNum(lineHeight) +
      pxToNum(paddingTop) +
      pxToNum(paddingBottom),
  );

  if (maxHeight < container.offsetHeight) {
    hasAction.value = true;

    text.value = calcEllipsisText(container, maxHeight);
  } else {
    hasAction.value = false;
    text.value = props.content;
  }

  document.body.removeChild(container);
};

const toogle = (collapse?: boolean) => {
  if (collapse === undefined) {
    expanded.value = !expanded.value;
    return;
  }
  expanded.value = collapse;
};

const emit = defineEmits<{
  (event: "onClickAction", e: Event): void;
}>();

const onClickAction = (e: Event) => {
  emit("onClickAction", e);
  toogle();
};

onMounted(calcEllipsised);

defineExpose<TextEllipsisExpose>({
  toogle,
});
</script>

<style scoped>
.text-ellipsis-action {
  color: #1890ff;
  cursor: pointer;
}
</style>
