<template>
  <view class="scrollable-tab-container">
    <scroll-view 
      class="tab-scroll-view" 
      scroll-x="true" 
      show-scrollbar="false"
      :scroll-left="scrollLeft"
      scroll-with-animation="true"
    >
      <view class="tab-item-container">
        <view 
          v-for="(item, index) in tabs" 
          :key="index" 
          :id="`tab-item-${index}`"
          class="tab-item" 
          :class="{ active: currentIndex === index }"
          @tap="changeTab(index)"
        >
          <text class="tab-text">{{ item }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'ScrollableTab',
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      scrollLeft: 0
    };
  },
  watch: {
    currentIndex(newIndex) {
      this.$nextTick(() => {
        this.centerTab(newIndex);
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.tabs.length > 0) {
        this.centerTab(this.currentIndex);
      }
    });
  },
  methods: {
    changeTab(index) {
      this.$emit('change', index);
      this.centerTab(index);
    },
    centerTab(index) {
      const query = uni.createSelectorQuery().in(this);
      query.select('.tab-scroll-view').boundingClientRect();
      query.selectAll('.tab-item').boundingClientRect();
      query.exec(res => {
        if (res[0] && res[1] && res[1].length > index) {
            const containerWidth = res[0].width;
            const tabRects = res[1];
            const activeTabRect = tabRects[index];

            let offsetLeft = 0;
            for (let i = 0; i < index; i++) {
                offsetLeft += tabRects[i].width;
            }

            const targetScrollLeft = offsetLeft + (activeTabRect.width - containerWidth) / 2;
            this.scrollLeft = Math.max(0, targetScrollLeft);
        }
      });
    }
  }
};
</script>

<style>
.scrollable-tab-container {
  width: 100%;
  background-color: #000000;
  padding: 10rpx 0;
}

.tab-scroll-view {
  width: 100%;
  white-space: nowrap;
}

.tab-item-container {
  display: inline-flex;
  flex-direction: row;
  padding: 0 20rpx;
  min-width: 100%;
}

.tab-item {
  padding: 10px 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  white-space: nowrap;
  position: relative;
}

.tab-text {
  color: #ffffff;
  font-size: 28rpx;
}

.tab-item.active .tab-text {
  color: #ffffff;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 26px;
  height: 3px;
  background-color: #D8D8D8;
}
</style>