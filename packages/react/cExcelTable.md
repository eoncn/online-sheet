# CExcelTable 使用文档

## 概述
`CExcelTable` 是一个基于 `@jadinec/react-sheet` 的类 Excel 表格组件，提供类似 Excel 的编辑体验。它支持复杂的数据编辑场景，包括数据联动、下拉选择、数据校验等功能。

## 主要特性
1. **Excel 风格的编辑体验**
   - 单元格编辑
   - 复制/粘贴
   - 插入/删除行
   - 列宽调整

2. **高级功能**
   - 下拉选择（支持异步加载选项）
   - 数据联动（字段变化自动更新相关字段）
   - 数据校验（必填项、数字格式、小数位数）
   - 错误高亮显示

3. **自定义扩展**
   - 自定义单元格编辑权限
   - 自定义保存逻辑
   - 自定义联动规则

## 使用示例

### 基本使用
```jsx
import CExcelTable from './CExcelTable';
const columns = [
  {
    title: '物料名称',
    dataIndex: 'materialName',
    valueType: 'select',
    fieldProps: {
      showInExcel: true, // 是否在表格中显示，默认false
      required: true, // 全列是否必填，可通过`skipRequiredCheck`排除指定的行为非必填。
      excelWidth: 150, // 列宽
      editDisable: false, // 是否禁止编辑，默认false
      // 下拉选择相关
      options: [], // 静态下拉选项，selectCallBack可异步获取，这里设置为[]
      selectCallBack: async (rowData) => {
       // 异步获取下拉选项，rowData为当前行数据
       return []; // 返回格式: [{label, value, extra?}]
      },
      selectedIdKey: 'materialId', // 选中后设置到行数据的字段（用于存储value）
      selectedOtherKeys: ['unit'], // 选中后从extra对像中提取并设置到行数据的字段
      clearRelationKeys: ['specification'], // 当下拉选择后需要清空的字段
      useInputValue: true, // 是否将输入的值作为下拉选项(允许用户输入)，默认值false
      decimalNum: 2, // 小数位数（用于校验），设置为0时表示整数
      isBigint: true, // 是否为数字（用于校验）
      // 其他配置...
    }
  },
  // 其他列...
];
const dataSource = [
  { id: '1', materialName: '物料1', ... },
  // 其他数据...
];
function App() {
  const handleSave = async (data) => {
    // 处理保存逻辑
    console.log('保存的数据:', data);
    return { success: true };
  };
  return (
    <CExcelTable
      supportDependencyCallBack
      columns={columns} // 表格列配置，主要联动在这里配置
      dataSource={dataSource}
      onSave={handleSave}
      dependencyOrderKeys={['materialName']} // 多个单元格的key同时被修改时，按依赖顺序的字段名数组的先后顺序触发联动
      cellEditable={(row: number, column: number) => {
        // 控制单元格是否可编辑
        return true; // 默认所有单元格可编辑
      }}
      onEditRow={(key: string, data: any, isBat: boolean):Record<string, any> => {
        // 自定义单元格数据编辑后逻辑，data中的数据修改后会更新到表格中
        return data; // 返回修改后的行数据
      }}
      skipRequiredCheck={(key: string, data: any):boolean => {
        // 跳过必填项检查(小概率会用到该函数)
        return false; // 默认不跳过
      }}
      otherList={}  // 新版本不用设置otherList了
      // 其他配置...
    />
  );
}
```
### 属性说明
| 属性名 | 类型 | 说明 | 默认值 |
|--------|------|------|--------|
| columns | ProColumns[] | 表格列配置，详见Antd ProTable的columns配置 | 必填 |
| dataSource | any[] | 表格数据源 | 必填 |
| decimalNum | number | 小数位数（用于金额等字段校验） | 3 |
| addDataSource | any[] | 新增的数据 | - |
| otherList | object | 提供下拉选项等需要的数据，如物料列表、单位列表等 | - |
| onClose | () => void | 关闭表格时的回调 | - |
| onChange | (data: any[], changeKey?: string) => any[] | 数据变化时的回调 | - |
| onSave | (data: any[]) => Promise<any> | 保存数据时的回调，返回Promise | - |
| cellEditable | (row: number, column: number) => boolean | 判断单元格是否可编辑 | 默认可编辑 |
| supportDependencyCallBack | boolean | 是否支持依赖回调（用于复杂联动） | false |
| onDeleteRow | (id: string) => void | 删除行时的回调 | - |
| onEditRow | (key: string, data: any, isBat: boolean) => Record<string, any> | 编辑行时的回调 | - |
| skipRequiredCheck | (key: string, data: any) => boolean | 跳过必填项检查的条件 | - |
| dependencyOrderKeys | string[] | 依赖顺序的字段名数组（用于指定联动字段的顺序） | [] |
| hiddenHeader | boolean | 是否隐藏头部工具栏 | false |
| isMergeTitle | boolean | 是否有合并标题 | false |
| hiddenDelete | boolean | 是否隐藏删除按钮（在右键菜单中） | false |
### 列配置（columns）特殊字段说明
在columns中，可以通过`fieldProps`配置表格特有的属性：
```js
{
  title: '物料名称',
  dataIndex: 'materialName',
  valueType: 'select', // 设置为下拉选择
  fieldProps: {
    showInExcel: true, // 是否在表格中显示
    required: true, // 是否必填
    excelWidth: 150, // 列宽
    editDisable: false, // 是否禁止编辑
    // 下拉选择相关
    options: [], // 静态下拉选项
    selectCallBack: async (rowData) => { 
      // 异步获取下拉选项，rowData为当前行数据
      return []; // 返回格式: [{label, value, extra?}]
    },
    selectedIdKey: 'materialId', // 选中后设置到行数据的字段（用于存储value）
    selectedOtherKeys: ['unit'], // 选中后从extra中提取并设置到行数据的字段
    clearRelationKeys: ['specification'], // 当下拉选择后需要清空的字段
    useInputValue: true, // 是否将输入的值作为下拉选项（允许用户输入）
    decimalNum: 2, // 小数位数（用于校验）
    isBigint: true, // 是否为整数（用于校验）
  }
}
```
## 事件回调
1. **onSave**：保存数据时触发
    - 参数：修改后的数据列表（新增、修改、删除后的数据）
    - 返回Promise，可以返回错误信息（格式：`{ msg: string }` 或 `{ msg: Array<{id, msg}> }`），用于标记错误行
2. **onChange**：数据变化时触发（每编辑一个单元格都可能触发）（当`supportDependencyCallBack=true`时不再触发该事件）
    - 参数：变化的数据行数组，变化的关键字段名
3. **onEditRow**：自定义行数据编辑时触发（当`supportDependencyCallBack=true`时有效），一般定义了columns联通，就不用处理该事件了
    - 参数：`key`（变化的字段名）, `data`（当前行数据）, `isBat`（是否批量修改）
    - 返回值：返回修改后的行数据（用于更新）
4. **onDeleteRow**：行删除时触发
    - 参数：被删除行的id

## 数据校验

### 校验规则

- 必填项校验：

  ```js
  fieldProps: { required: true }
  ```

- 数字格式校验：

  ```js
  fieldProps: { isBigint: true }
  ```

- 小数位数校验：

  ```js
  fieldProps: { decimalNum: 2 }
  ```

- 桩号格式校验：

  自动应用于 “开始桩号” 和 “结束桩号” 列  
  校验不通过时，对应单元格会显示红色边框。

---
## 注意事项
### 数据源要求

- 每行数据必须包含 `id` 字段

- 新增数据可使用临时 `id`（如 `'new' + Guid()`）

### 下拉选项

- 异步选项通过 `selectCallBack` 实现

- 选项格式：

  ```js
  [{ label, value, extra? }]
  ```

### 性能优化

- 避免在每次渲染时创建新的 `columns` 或 `dataSource`

- 大数据量时考虑分页或虚拟滚动

### 错误处理

- 保存时返回错误格式：

  ```js
  { msg: string }
  
  // 或
  
  { msg: Array<{ id, msg }> }
  ```

- 错误行会自动高亮显示

---
## 高级用法
### 复杂联动示例
例如：选择“单位工程”后，需要清空“工程类型”并重新加载其选项，同时可能影响其他字段。
1. 在“单位工程”列的配置中设置：
```js
{
  title: '单位工程',
  dataIndex: 'unitEngineeringName',
  valueType: 'select',
  fieldProps: {
    clearRelationKeys: ['engineeringTypeName','engineeringTypeId'], // 选择后清空工程类型
    selectCallBack: async (rowData) => {
      // 根据条件获取单位工程选项
      return await fetchUnitList(rowData);
    },
    selectedIdKey: 'unitEngineeringId', // 选中项的ID存入行数据        
    selectedOtherKeys: ['engineeringCategate'] // 将选中项的extra.engineeringCategate存入行数据
  }
}
```
2. 在“工程类型”列的配置中，根据单位工程ID过滤选项：
```js
{
  title: '工程类型',
  dataIndex: 'engineeringTypeName',
  valueType: 'select',
  fieldProps: {
    options: engineeringTypeOptions,
    selectCallBack: (rowData) => {
      // 根据单位工程ID过滤选项
      return engineeringTypeOptions.filter(opt => {
          // 只显示与当前单位工程相关的工程类型，按单位工程的extra.engineeringCategate过滤
          return opt.extra.includes(rowData.engineeringCategate);
      });
    },
    // 不允许非列表中的输入值，用户输入的值与列表中的完全匹配才有效。
    useInputValue: false
  }
}
```
3. 在表格属性中设置依赖顺序（如果需要）：
```jsx
<CExcelTable
  dependencyOrderKeys={['unitEngineeringName', 'engineeringTypeName']}
  // ...其他属性
/>
```
## 样式定制

可通过修改以下 CSS 文件定制样式：

- `index.css`：组件主要样式

- `@jadinec/react-sheet/dist/index.css`：基础表格样式

---

## 常见问题

**Q: 下拉选项不更新怎么办？**

A: 确保在 `options` 或 `selectCallBack`至少一处提供最新的选项数据，并详细检查 `selectCallBack` 是否正确实现。

**Q: 如何实现自定义保存逻辑？**

A: 使用 `onSave` 属性传入自定义保存函数，该函数应返回 Promise。

**Q: 如何控制单元格编辑权限？**

A: 使用 `cellEditable` 属性：

```jsx
cellEditable={(row, column) => {
  // 返回 true/false 控制是否可编辑
}}
```

---

## 源码说明

### 主要文件结构

- `CExcelTable.tsx`：组件主文件

- `index.css`：组件样式

- `fn.ts`：工具函数

### 核心功能模块

- 数据初始化：`initTableData()`

- 数据联动：`onEditRowBefore()`

- 变更处理：`handleChange()`

- 保存校验：`handleSave()`

---
