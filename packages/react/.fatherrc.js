export default {
  target: "browser",
  cjs: { type: "rollup", lazy: false },
  // esm: { type: "rollup" },
  // umd: { globals: { Workbook: "Workbook" }, minFile: true },
  extractCSS: true,
  disableTypeCheck: false,
  // 这里添加 extraBabelPlugins 用于实现 babel-plugin-import
  extraBabelPlugins: [
    [
      "import",
      {
        libraryName: "antd",
        libraryDirectory: "es", // 或者 "lib"，看你希望用 ES 模块还是 CommonJS 模块
        // style: "css", // 如果需要 less 文件则设置为 true，并配置 less-loader
        // 自定义 style：生成"antd/es/select/style/index.css"
        style: (name) => `${name}/style/index.css`,
      },
      "antd",
    ],
  ],
};
