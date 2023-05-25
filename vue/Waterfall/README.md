# VUE 瀑布流组件
vue实现瀑布流组件
- `list`为列表数据，组件会自动设置每个列表项的位置。
- 组件的高度会自动设置为最高的一列的高度，如果需要滚动，需要自己设置外层容器的`overflow: auto;`

注意：
> - `list`**必须是响应式数据**，否则新增数据不会重新渲染
> - 如果传入的插槽内容中有 img 元素，由于需要等待加载img元素的宽高，img元素先加载的列表项会先渲染

# 属性

| 属性名 | 类型 | 说明 | 默认值 |
| ---  | ---  | --- | --- |
| list  | `any[]` | 列表数据，必须是响应式数据，否则不会重新渲染，仅会渲染初始值  |  -  |
| itemKey | `string` | 列表渲染的唯一key（会从列表数据中取该字段，如果列表中没有该字段，默认使用id） | id |
| count | `number` | 列数，默认4列 | 4 |
| gap | `number `| 列与列之间的间隙（包括上下间隙，单位px） | 10 |
| imgClassName | `string` | 列表项中的图片class类名，，目前仅支持图片宽度100%的情况，仅能有一个图片，默认会使用querySelector获取“img”元素 | - |
| wrapperWidth | `number` | 容器的宽度（单位px，如果需要其他单位的宽度，请使用wrapperStyle属性手动修改容器宽度），默认值为100% | 100% |
| wrapperClassName | `string` | 容器的class类名 | waterfall-container|
| itemClassName | `string` | 列表项的class类名 | waterfall-container-item |
| wrapperStyle | `CSSProperties` | 容器的style | - |
| itemStyle | `CSSProperties` | 列表项的style | - |

# 插槽

- default：默认插槽
- 作用域变量：
  - item：传入的列表项的数据
  - index：列表项的索引

## 使用示例：
常规使用：
```js
<script setup lang="ts">
  const list = ref([]) // 列表数据
</script>

<template>
  <Waterfall :list="list" itemKey="key">
    <template #default="{ item, index }">
      <div style="border:1px solid;padding: 12px;border-radius: 8px;">
        <img :src="item.imageUrl" />
        <div style="font-size: 20px; font-weight: bold">{{ item.title }}</div>
        <div>这是第{{ index }}个</div>
      </div>
    </template>
  </Waterfall>
</template>
```



