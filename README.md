# ProcureSellManage

[**React Native**](https://reactnative.dev) 项目，使用 [`@react-native-community/cli`](https://github.com/react-native-community/cli) 启动。，用于管理货物信息和处理相关任务。

## 主要插件与依赖

以下是该项目所使用的主要插件与依赖：

### 1. **核心依赖**

- **`@react-navigation/native`** - 用于实现 React Native 应用中的导航。
- **`@react-navigation/bottom-tabs`** - 用于实现底部导航栏。
- **`@react-navigation/native-stack`** - 用于实现堆栈式导航。
- **`@react-native-picker/picker`** - 用于创建选择器（Picker）组件。
- **`@react-native-vector-icons`** - 用于使用各种矢量图标，支持常见的图标库（如 AntDesign）。
- **`@realm/react`** & **`realm`** - 用于在 React Native 中处理数据库（Realm 数据库）。
- **`react-native-fs`** - 用于文件系统操作，如读取和写入文件。
- **`react-native-picker-select`** - 另一个用于创建选择器（Picker）组件的库，提供更丰富的功能。
- **`react-native-safe-area-context`** - 用于确保组件在屏幕的安全区域内显示，避免被刘海屏、圆角等遮挡。
- **`react-native-screens`** - 提供优化的屏幕切换和导航功能。

### 2. **开发依赖**

- **`@babel/core`**、**`@babel/preset-env`**、**`@babel/runtime`** - 用于编译和转译 JavaScript 代码，支持最新的 ES 语法。
- **`@react-native-community/cli`** - 用于 React Native 项目的命令行工具。
- **`@react-native/eslint-config`** - 用于在开发过程中进行代码检查，确保代码质量。
- **`jest`** - 用于 React Native 项目的单元测试和自动化测试。
- **`prettier`** - 用于格式化代码，确保代码风格的一致性。
- **`typescript`** - 提供 TypeScript 支持，让开发者能够使用静态类型检查和更强的代码补全功能。

### 3. **其他工具与支持库**

- **`eslint`** - JavaScript 代码质量检查工具，确保代码的规范性。
- **`react-test-renderer`** - 用于 React 组件的快照测试。
- **`@types`** - TypeScript 类型定义，提供类型支持，使开发更加便捷。

## 项目截图

- **首页**：

<img src=".\README.assets\Screenshot_2025-02-01-15-25-39-65_e196c049ed23442.jpg" alt="Screenshot_2025-02-01-15-25-39-65_e196c049ed23442" style="zoom:25%;" />

- **仓库管理页**：

<img src=".\README.assets\Screenshot_2025-02-01-15-25-54-65_e196c049ed23442.jpg" alt="Screenshot_2025-02-01-15-25-54-65_e196c049ed23442" style="zoom:25%;" />

- **库存管理页**：

<img src=".\README.assets\Screenshot_2025-02-01-15-25-58-33_e196c049ed23442.jpg" alt="Screenshot_2025-02-01-15-25-58-33_e196c049ed23442" style="zoom:25%;" />





## 使用方法

> **注意**：在继续之前，请确保您已完成 [设置您的开发环境](https://reactnative.dev/docs/set-up-your-environment) 的指南。

### 第一步：启动 Metro

首先，您需要运行 **Metro**，这是 React Native 的 JavaScript 构建工具。

要启动 Metro 开发服务器，请在 React Native 项目的根目录下运行以下命令：

```sh
# 使用 npm
npm start

# 或者使用 Yarn
yarn start
```

### 第二步：构建并运行应用程序

Metro 启动后，打开一个新的终端窗口/面板，并使用以下命令之一构建并运行您的 Android 或 iOS 应用：

#### Android

```sh
# 使用 npm
npm run android

# 或者使用 Yarn
yarn android
```

#### iOS

对于 iOS，记得安装 CocoaPods 依赖项（这只需要在首次克隆项目或更新本地依赖后运行）。

第一次创建新项目时，运行 Ruby bundler 来安装 CocoaPods：

```sh
bundle install
```

然后，每次更新本地依赖项时，运行：

```sh
bundle exec pod install
```

有关更多信息，请访问 [CocoaPods 入门指南](https://guides.cocoapods.org/using/getting-started.html)。

```sh
# 使用 npm
npm run ios

# 或者使用 Yarn
yarn ios
```

如果一切设置正确，您应该会看到您的新应用程序在 Android 模拟器、iOS 模拟器或连接的设备上运行。

这是运行应用的一种方式，您也可以直接从 Android Studio 或 Xcode 构建它。

### 第三步：修改您的应用程序

现在您已经成功运行了应用程序，让我们进行修改吧！

打开 `App.tsx` 文件，在您喜欢的文本编辑器中进行修改。当您保存时，您的应用会自动更新并反映这些修改 —— 这由 [Fast Refresh](https://reactnative.dev/docs/fast-refresh) 提供支持。

当您想强制重新加载应用程序时，例如重置应用的状态，您可以执行完全重载：

- **Android**：按两次 <kbd>R</kbd> 键或从 **开发菜单** 中选择 **"重新加载"**，该菜单可以通过 <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) 或 <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS) 访问。
- **iOS**：在 iOS 模拟器中按 <kbd>R</kbd> 键。
