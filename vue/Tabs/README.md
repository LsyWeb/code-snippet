# Tabs 标签页

小程序中使用的标签页组件，支持自定义 tab 的内容，支持自定义 tab 的样式

> css 使用了 unocss，如不用可自行修改为自己的 css

## 功能点

- 支持自定义 tab 的内容
- 标签页的数量不受限制
- 大于 5 个时会滚动，并且点击标签页会自动滚动到中间

## 组件属性
| Prop 名称         | 类型           | 描述               | 默认值       |
|-------------------|----------------|--------------------|--------------|
| tabkey            | `string`       | 当前激活的tab      | `undefined`  |
| items             | `TabItem[]`    | tab列表            | `[]`         |
| lineColor         | `string`       | 线条颜色           | `undefined`  |
| lineStyle         | `CSSProperties`| 线条style          | `undefined`  |
| activeTabColor    | `string`       | 激活tab颜色        | `undefined`  |
| activeTabStyle    | `CSSProperties`| 激活tab style       | `undefined`  |
| labelStyle        | `CSSProperties`| 标签style          | `undefined`  |
| wrapperStyle      | `CSSProperties`| 包裹器style        | `undefined`  |

### TabItem 类型表格

| 属性名 | 类型     | 描述   |
|--------|----------|--------|
| key    | `string` | 唯一key |
| label  | `string` | 标签名  |

## 自定义内容（slot）

```js
  <Tabs v-model:tabkey="tabActivityKey" :items="tabList" >
    <template #label="{ item, index }">
      <view class="">{{ item.label }}</view>
    </template>
  </Tabs>
```

| 名称  | 类型   | 说明            |
| ----- | ------ | --------------- |
| item  | object | 当前 tab 的数据 |
| index | number | 当前 tab 的索引 |

## 自定义样式

```vue
<Tabs
  v-model:tabkey="tabActivityKey"
  :items="tabList"
  :wrapper-style="{ background: '#f40' }"
  :active-tab-style="{ color: '#FF6C00' }"
  line-color="#000"
>
    <template #label="{ item, index }">
      <view class="">{{ item.label }}</view>
    </template>
    <template #tab="{ item, index }">
      <view class="">{{ item.label }}</view>
    </template>
  </Tabs>
```
