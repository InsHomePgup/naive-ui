# 在表单中使用

```html
<n-form :model="model" :rules="rules">
  <n-form-item path="tags" :label="false">
    <n-dynamic-tags v-model:value="model.tags" />
  </n-form-item>
</n-form>
```

```js
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup () {
    return {
      model: ref({
        tags: ['教师', '程序员']
      }),
      rules: {
        tags: {
          trigger: ['change'],
          validator (rule, value) {
            if (value.length >= 5) return new Error('不得超过四个标签')
            return true
          }
        }
      }
    }
  }
})
```
