# Tabs 标签页

小程序中使用的标签页组件，支持自定义 tab 的内容，支持自定义 tab 的样式

> css 使用了 unocss，如不用可自行修改为自己的 css

## 功能点
- 支持自定义 tab 的内容
- 标签页的数量不受限制
- 大于 5 个时会滚动，并且点击标签页会自动滚动到中间


## 自定义内容（slot）
```js
  <Tabs v-model:tabkey="tabActivityKey" :items="tabList" >
    <template #label="{ item, index }">
      <view class="">{{ item.label }}</view>
    </template>
  </Tabs>
```
