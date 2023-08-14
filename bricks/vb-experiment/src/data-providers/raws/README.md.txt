# __PROJECT_NAME__

## 准备

```bash
yarn
```

## 开发

打开两个终端，分别运行 `yarn start` 和 `yarn serve`。

然后浏览器打开 http://localhost:8081__PROJECT_HOMEPAGE__

提示：
- 运行 `yarn serve` 时按需使用 `--subdir` 和 `--server` 等参数。
- 也可以选择只使用一个终端运行 `yarn dev`，此时需要把 `yarn serve` 相关的参数定义在 `package.json` 文件中。

## 离线开发

修改 `dev.config.mjs`，取消注释 `mock` 一节的代码，参考对 `GET /api/auth/login` 接口，对其他远端接口进行 mock。
