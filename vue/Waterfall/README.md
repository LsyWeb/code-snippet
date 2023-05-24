# VUE 瀑布流插件

使用示例：
> list为列表数据

```js
<Waterfall :list="list" >
  <template #default="{ item, index }">
    <div style="border:1px solid;padding: 12px;border-radius: 8px;">
      <img :src="item.imageUrl" />
      <div style="font-size: 20px; font-weight: bold">{{ item.title }}</div>
      <div>这是第{{ index }}个</div>
    </div>
  </template>
</Waterfall>
```
