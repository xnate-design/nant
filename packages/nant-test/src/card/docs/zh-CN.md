# Card 卡片

卡片组件

## 介绍

单元格为列表中的单个展示项。

## 引入

``` shell
import { Cell } from '@nant/react-ui';
```


## 代码演示

### 基础用法

Cell 可以单独使用，也可以与 Cell.Group 搭配使用，Cell.Group 可以为 Cell 提供上下外边框。

```tsx
import React from 'react'
import { Cell } from 'react-vant'

export default () => {
  return (
    <Cell.Group>
      <Cell title='单元格' value='内容' />
      <Cell title='单元格' value='内容' label='描述信息' />
    </Cell.Group>
  )
}
```
