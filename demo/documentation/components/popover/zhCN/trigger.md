# 触发方式
```html
<n-popover placement="bottom" trigger="hover" style="margin-right: 12px;">
  <template v-slot:activator>
    <n-button>悬浮</n-button>
  </template>
  <span>
    I wish they all could be California girls
  </span>
</n-popover>
<n-popover :show="showPopover" placement="bottom" trigger="manual">
  <template v-slot:activator>
    <n-button @click="showPopover = !showPopover">
      手动
    </n-button>
  </template>
  <span>
    I wish they all could be California girls
  </span>
</n-popover>
<n-popover placement="bottom" trigger="click" style="margin-right: 12px;">
  <template v-slot:activator>
    <n-button>
      点击
    </n-button>
  </template>
  <span>
    I wish they all could be California girls
  </span>
</n-popover>
```
```js
export default {
  data() {
    return {
      showPopover: false
    }
  }
}
```
```css
.n-button {
  margin: 0 12px 8px 0;
}
```