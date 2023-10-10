# 全屏

## 使用方法

```js
import FullScreen from "./fullScreen.js";
const fullScreen = new FullScreen(document.getElementById("xxx"));

btn.onclick = () => {
  fullScreen.toggle();
};
```

## 事件监听

```js
import FullScreen from "./fullScreen.js";
const fullScreen = new FullScreen(document.getElementById("xxx"), {
  onEnter() {
    console.log("进入全屏");
  },
  onExit() {
    console.log("退出全屏");
  },
  onChange() {
    console.log("全屏切换事件");
  },
});

btn.onclick = () => {
  fullScreen.toggle();
};
```

## 参数列表

| 参数                  | 介绍                                 | 默认值        |
| --------------------- | ------------------------------------ | ------------- |
| el（第一个参数）      | 需要全屏的那个 dom 元素 （必穿参数） | 无            |
| options（第二个参数） | 事件传递                             | {} （空对象） |

### options 属性

| 属性     | 介绍         | 默认值 |
| -------- | ------------ | ------ |
| onChange | 全屏切换事件 | 无     |
| onEnter  | 进入全屏事件 | 无     |
| onExit   | 退出全屏事件 | 无     |

## 实例方法

| 方法名 | 介绍     |
| ------ | -------- |
| toggle | 全屏切换 |
| enter  | 进入全屏 |
| exit   | 退出全屏 |
