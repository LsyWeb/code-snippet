<script setup lang="ts">
import { useSystem } from '@/store/system'
import { CSSProperties, onMounted, reactive, ref, useSlots, withDefaults } from 'vue'
import { getCurrentInstance } from 'vue'

type TabItem = {
  /** 唯一key */
  key: string
  /** 标签名 */
  label: string
}

const props = withDefaults(
  defineProps<{
    /** 当前激活的tab */
    tabkey?: string
    /** tab列表 */
    items?: TabItem[]
    /** 线条颜色 */
    lineColor?: string
    /** 线条style */
    lineStyle?: CSSProperties
    /** 激活tab颜色 */
    activeTabColor?: string
    /** 激活tab style */
    activeTabStyle?: CSSProperties
    /** 标签style */
    labelStyle?: CSSProperties
    /** 包裹器style */
    wrapperStyle?: CSSProperties
  }>(),
  {
    items: () => [],
  }
)

const emit = defineEmits(['update:tabkey'])

const slots = useSlots()

const system = useSystem()

const instance = getCurrentInstance()

const query = uni.createSelectorQuery().in(instance!.proxy)

const scrollLeft = ref(0)

const scrollInfo = reactive({
  /** 上次滚动的scrollLeft */
  prevDistance: 0,
  /** 屏幕一半宽度 */
  screenHalfwidth: system.systemInfo.windowWidth / 2,
  /** 子元素距离左边的距离 */
  subLeft: 0,
  /** 子元素一半宽度 */
  subHalfWidth: 0,
})

const lineLeft = ref(0)

const scrollWidth = ref(0)

const moveTo = () => {
  // 需要滚动的距离
  let needScroll = scrollInfo.subLeft - scrollInfo.screenHalfwidth + scrollInfo.subHalfWidth
  let left = needScroll + scrollInfo.prevDistance
  if (left < 0) {
    left = 0
  }
  scrollLeft.value = left
}

const onScroll = (e: any) => {
  scrollInfo.prevDistance = e.detail.scrollLeft
}

const getRect = (key: string) => {
  const itemDom = query.select(`#${key}`)
  itemDom
    .boundingClientRect((data: any) => {
      const itemLeft = data.left
      const itemWidth = data.width

      scrollInfo.subLeft = itemLeft
      scrollInfo.subHalfWidth = itemWidth / 2
      lineLeft.value = itemLeft + itemWidth / 2 + scrollInfo.prevDistance
      moveTo()
    })
    .exec()
}

const onClick = (key: string) => {
  if (key === props.tabkey) {
    return
  }

  getRect(key)
  emit('update:tabkey', key)
}

onMounted(() => {
  const wrapperDom = query.select('#scroll')

  wrapperDom
    .scrollOffset((data: any) => {
      scrollWidth.value = data.scrollWidth
    })
    .exec()

  getRect(props.tabkey as string)
})
</script>

<template>
  <scroll-view
    id="scroll"
    class="whitespace-nowrap w-full h-80"
    :style="{ ...props.wrapperStyle }"
    :scroll-with-animation="true"
    :enable-flex="true"
    :scroll-x="true"
    :scroll-left="scrollLeft"
    @scroll="onScroll"
  >
    <view class="flex flex-nowrap position-relative w-full h-full items-center">
      <template v-for="(item, index) in items" :key="item.key">
        <view
          class="p-2 text-28 flex justify-center"
          :class="[
            props.items?.length < 5 ? 'flex-1' : 'flex-[1_0_auto]',
            props.tabkey === item.key ? 'color-blue-5' : '',
          ]"
          :id="item.key"
          :style="{
            color: props.tabkey === item.key ? props.activeTabColor : '',
            ...(props.tabkey === item.key ? activeTabStyle : props.labelStyle),
          }"
          @click="() => onClick(item.key)"
        >
          <template v-if="slots.label">
            <slot name="label" :item="item" :index="index"></slot>
          </template>
          <template v-else>{{ item.label }}</template>
        </view>
      </template>
      <view
        class="w-80 h-6 bg-blue-5 position-absolute transition-duration-300 bottom-0 rounded-[6]"
        :style="{
          backgroundColor: props.lineColor,
          ...lineStyle,
          transform: `translateX(${lineLeft}px) translateX(-50%)`,
        }"
      ></view>
    </view>
  </scroll-view>
</template>
