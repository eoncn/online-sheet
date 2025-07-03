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
      showInExcel: true, // 是否在表格中显示
      required: true, // 是否必填
      excelWidth: 150, // 列宽
      editDisable: false, // 是否禁止编辑
      // 下拉选择相关
      options: [], // 静态下拉选项，selectCallBack可异步获取，这里设置为[]
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
### 事件回调
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
### 数据校验
组件内置了以下校验：
1. **必填项校验**：配置`fieldProps.required=true`的列，在保存时会检查是否填写。
2. **桩号格式校验**：如果列标题为“开始桩号”或“结束桩号”，则校验格式（正则：`/^([0-9A-Z]{0,5}[A-Z])([0-9]{1,8})\+(([0-9]{3})(\.[0-9]{1,3})?)$/`）。
3. **数字格式校验**：配置`fieldProps.isBigint=true`的列，会校验是否为数字。
4. **小数位数校验**：配置`fieldProps.decimalNum`的列，会校验小数位数。
   校验不通过时，会在对应单元格显示红色边框，并弹出错误提示。
### 注意事项
1. **数据源要求**：每行数据必须包含`id`字段（新增数据可使用临时id，如`'new'+Guid`）。
2. **异步下拉选项**：如果需要异步加载下拉选项，在列配置中设置`selectCallBack`函数，该函数返回一个选项数组或Promise。
3. **联动处理**：当需要根据一个字段的值改变其他字段时，使用`selectedIdKey`，`selectedOtherKeys`和`clearRelationKeys`配置使用。如果配置不出来，请配合使用`onEditRow`回调。
4. **依赖顺序**：当多个字段联动有顺序要求时，使用`dependencyOrderKeys`指定顺序，主要用于同时粘贴一行的多个字段时，触发需要有先后顺序。
5. **性能**：表格在数据量大时可能会有性能问题，建议分页或虚拟滚动（当前代码未实现，可自行扩展）。
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
      return engineeringTypeOptions.filter(opt => 
        opt.extra.unitId === rowData.unitEngineeringId
      );
    },
    // 允许选择输入值，这里用户输入于单元格的数据会出现在下拉选项中，可以选择
    useInputValue: true
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
## 常见问题
1. **下拉选项不更新**：确保`selectCallBack`函数正确返回，并且使用了`selectedOtherKeys`等配置将需要的数据存入行数据，以便其他下拉选项可以依赖这些数据。
2. **数据保存时校验不通过**：检查错误提示，修改对应单元格的数据格式。注意必填项、数字格式和桩号格式。
3. **无法删除行**：检查是否设置了`hiddenDelete=true`，或者右键菜单中“删除行”是否被禁用。
4. **联动未触发**：检查`supportDependencyCallBack`是否设置为true，以及`onEditRow`回调是否正确处理了数据更新。
## 内部方法说明
- `initTableData`：初始化表格数据，设置下拉选项等。
- `handleChange`：处理表格数据变化，触发联动。
- `handleSave`：处理保存逻辑，执行校验并调用`onSave`。
- `updateTableData`：更新单个单元格的数据。
- `updateSelectOption`：更新下拉选项。
## 样式
组件自带样式文件`index.css`，可根据需要调整。
---
