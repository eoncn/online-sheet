<p align="center">
  <img align="center" src="logo.png" width="150px" height="150px" />
</p>
<h1 align="center">FortuneSheet</h1>
<p align="center">FortuneSheet is a drop-in javascript spreadsheet library that provides rich features like Excel and Google Sheets</p>

<div align="center">

[![CircleCI Status](https://circleci.com/gh/ruilisi/online-sheet.svg?style=shield)](https://circleci.com/gh/ruilisi/online-sheet)
[![Known Vulnerabilities](https://snyk.io/test/github/ruilisi/online-sheet/badge.svg)](https://snyk.io/test/github/ruilisi/online-sheet)
[![Build with father](https://img.shields.io/badge/build%20with-father-028fe4.svg)](https://github.com/umijs/father/)
[![xiemala](https://img.shields.io/badge/maintained%20by-xiemala-cc00ff.svg)](https://xiemala.com/)

</div>


[简体中文](./README) | English 

## Purpose

The goal of `FortuneSheet` is to make a feature-rich, easy-to-configure online spreadsheet that you can use out-of-the-box.

This project is originated from [Luckysheet](https://github.com/mengshukeji/Luckysheet) and has inherited many code from it. Lots of efforts have done to translate the whole project to typescript (still in progress), and solved problems in the design of the original project.

We aim to make FortuneSheet powerful yet easy to maintain.

## Communication
* [Discord](https://discord.gg/vHGwMB77w5) English community 
* [QQ](https://jq.qq.com/?_wv=1027&k=iHaSN47J) Chinese community
* [Xiemala](https://xiemala.com/s/ctJmUn)

## Live demo
> Note: Some part of Storybook is outdated

Take a look at the live demo at [online-sheet-demo](https://ruilisi.github.io/online-sheet-demo/).

<p>
  <img align="center" src="screenshot.png" width="400px" />
</p>

## Attention
Before stable release of 1.0, input data structure and APIs may change during development. If you encounter errors after upgrading a version, check [Changelog](./CHANGELOG.md) and [Migration Guide](#migrating-data-from-luckysheet).

## Improvements to Luckysheet

- Written fully in typescript.
- You can now use `import` / `require` to use the library.
  ```js
  import { Workbook } from '@online-sheet/react'
  ```
- Multiple instance on the same page is supported.
- Dropped `jQuery` dependency, uses native `React` / `Vue` + `immer` to manage the dom and state.
- Changed to a forked [handsontable/formula-parser](https://github.com/handsontable/formula-parser) to handle formula calculations.
- Optimized the dom structure.
- Replaced icons from `iconfont` with SVGs, as `iconfont` icons are inconvenient to update for other maintainers.
- No visible elements is created outside container.
- Never stores data in the `window` object.

## Features

- Data structure is mostly compatible with Luckysheet (see [Migration Guide](#migrating-data-from-luckysheet)).
- **Formatting**: style, text alignment and rotation, text truncation, overflow, automatic line wrapping, multiple data types, cell segmentation style, hyperlink
- **Cells**: multiple selection, borders, fill, merge cells
- **Row & column**: insert, delete, hide, sort and filter rows or columns
- **Operation**: copy, paste, cut, hot keys
- **Formulas & Functions**: Built-in formulas
- **Import/export Excel**: [plugin](https://github.com/corbe30/fortuneexcel) for .xlsx import and export
- **Additional features**: supports images, comments, data verification and custom tools

## Roadmap
- ✅ Support cooperative editing with backend storage.
- ✅ Support undo/redo.
- ✅ Mobile adaption.
- ✅ Expose APIs.
- ✅ Add tests.
- More basic features:
  - ✅ fill handle
  - ✅fonts
  - ✅ format painter
  - ✅ comments
  - ✅ insert images
  - ✅ more toolbar buttons
- ✅ [Excel import and export plugin](https://github.com/corbe30/fortuneexcel)
- Support Vue
- More features:
  - ✅ sort
  - ✅ filter
  - ✅ hooks
  - ✅ conditional formatting
  - ✅ drag and drop
  - ✅ find and replace
  - ✅ data verification
  - ✅ freeze
  - ✅ hide, and split text
  - location
- More advanced features:
  - ✅ screenshots
  - pivot tables
  - charts
  

## Documentation
> Note: Some topics in documentation is outdated

See detailed documentation at [online-sheet-doc](https://ruilisi.github.io/online-sheet-docs/).

## Get started (react)

### Download and install the library

<details open>
<summary>Using npm</summary>

```shell
npm install @online-sheet/react
```
</details>

<details>
<summary>Using pnpm</summary>

```shell
pnpm install @online-sheet/react
```
</details>

<details>
<summary>Using yarn</summary>

```shell
yarn add @online-sheet/react
```
</details>

### Create an HTML placeholder
```html
<style>
  html, body, #root {
    width: 100%;
    height: 100%;
  }
</style>
<div id="root"></div>
```

**NOTE**: `width` and `height` doesn't have to be 100%, but should at least have a value. If set to `auto`, table area may not show.

### Render the sheet

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Workbook } from "@online-sheet/react";
import "@online-sheet/react/dist/index.css"

ReactDOM.render(
  <Workbook data={[{ name: "Sheet1" }]} />,
  document.getElementById('root')
);
```

### Backend storage and collabration

Each time a user operates on the sheet, an array of `Op` will be emiited through `onOp` callback. An op describes how to modify the current data to reach the new data after the user's operation. For example, here is an op when user sets the cell font to be bold on cell A2.

```json
[
    {
        "op": "replace",
        "index": "0",
        "path": ["data", 1, 0, "bl"],
        "value": 1
    }
]
```

The op is useful for database modification and syncing state in online collabration.

A working example with `Express` (backend server) and `MongoDB` (data persistence) is avaiable in `backend-demo` folder.

Run it with `node index.js` and visit [Collabration example](https://ruilisi.github.io/online-sheet-demo/?path=/story/collabration--example) (initialize data by visiting http://localhost:8081/init)

For detailed doc about `Op`, refer to [online-sheet-doc](./docs/guide/op.md)

## Migrating data from Luckysheet
The overall data structure of FortuneSheet is the same as Luckysheet, with some naming differences:

1. sheet.index -> sheet.id
2. sheet.calcChain[].id -> sheet.calcChain[].id

## Contributing
Expected workflow is: Fork -> Patch -> Push -> Pull Request

Please make sure to read the [Contributing Guide](./docs/guide/contribute.md) before making a pull request.


## Development
### Installation
```shell
yarn
```

### Development
```shell
yarn dev
```

### Packaging
```shell
yarn build
```

## License
This project is licensed under the MIT License. See [MIT](http://opensource.org/licenses/MIT) for the full license text.
