# umi-electron-javascript

### 一个基于umijs + electron + javascript的模板

## 主要特性
- 支持整个应用的热重载
- 依赖升级至umi3.2.1,
- 默认安装的是@umijs/preset-react 插件集，可根据自身需要安装

## 项目结构

```ssh
.
|-- build
|   |-- icon.icns                         // 打包后程序图标 MacOS
|   |-- icon.ico                          // 打包后程序图标 Windows
|   |-- webpack.base.config.js            // electron-webpack 基础配置
|   |-- webpack.main.config.js            // electron-webpack 开发配置
|   `-- webpack.main.prod.config.js       // electron-webpack 正式配置
|-- dist                                  // 项目编译输出目录
|   |-- main                              // 主程序编译目录
|   `-- renderer                          // 页面编译目录
|-- release                               // 打包输出目录
|-- src                                   // 开发目录
|   |-- main                              // 主程序目录
|   |   `-- main.js                       // 主程序入口
|   `-- renderer                          // React项目页面
|       |-- assets
|       |   `-- yay.jpg
|       |-- config
|       |   |-- config.js                 // umijs配置
|       |   `-- webpack.config.js         // umijs-webpack配置
|       |-- models
|       |   `-- global.js
|       |-- pages
|           `-- index.js
|       |-- public
|           `-- renderer.js               // 如果需要引用node的api，需要在这个js里面提前引入
|       `-- global.js
|-- package.json                          // 项目依赖以及打包配置
`-- README.md                             // 项目说明文档
```

## 环境搭建
### 安装

然后通过yarn下载依赖

```javascript
  $ yarn
```

### 开发

首先通过以下命令启动渲染进程(默认端口：8000)

```javascript
  $ yarn start:renderer
```

然后启动主进程

```javascript
  $ yarn start:main
```

### 如何使用node的api

需要在 src/renderer/public/renderer.js中引入相关的api才可以

### 打包

```javascript
  $ npm run pack  // 打包macOS
  $ npm run exe   // 打包windows
```

如果想把代码打包成一个dmg文件或者zip文件，可以执行以下命令

```javascript
  $ npm run dist
```

### 打包配置说明 [`package.json`](./package.json)

[electron-builder-参数参考](https://www.electron.build/configuration/configuration) 

[category-Mac分类参考](https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8)

```js
{
  ...
  "build": {
    "productName": "LittleStrong",// 程序名称
    "files": [ // 需要打包的文件
      "dist/",
      "node_modules/",
      "package.json"
    ],
    "mac": { // 打包mac版本
      "category": "your.app.category.type", // mac app分类 
      "target": [ // 打包类型
        "dmg",
        "zip"
      ]
    },
    "win": { // 打包windows版本
      "target": [ // 打包类型
        "nsis"
      ]
    },
    "nsis": {
      "oneClick": false,
      "perMachine": true,
      "allowToChangeInstallationDirectory": true
    },
    "directories": { // 打包后输出目录
      "output": "release"
    },
    "appId": "com.cn.littlestrong.demo", // appstore包名
    "asar": false //  是否加密处理
  },
}
```
