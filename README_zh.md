# System UI

一个带有苹果 System OS 风格的 React 组件库。

## 灵感来源

本项目的灵感来自
[System UI](https://system-ui.com/)，这是一个受苹果启发的原生 CSS 库。

> System.css 是一个 CSS 库，用于构建类似于苹果 System
> OS（1984-1991年运行）的界面。从设计角度来看，从 System 1 到 System
> 6 并没有太大变化；但是这个库是基于 System
> 6 的，因为它是 MacOS 的最后一个单色版本。
>
> 幸运的是，这个库不使用任何 JavaScript，并且与您选择的任何前端框架兼容。大多数样式也可以被覆盖，以允许更深层次的定制。

我对这种复古的、带有苹果风格的设计风格有着深深的喜爱，并且长期以来一直有创建一个这种风格的组件库的想法。然而，这个想法一直没有实现。最近，我通过
[Muxi 团队](https://muxixyz.com/) 的一个项目任务，有机会将这个概念变为现实。

大部分设计基于 system.css。对于 system.css 中不存在的组件，我做了一些基本设计。如果有任何爱好者或设计师有建议，请随时在 Issues 部分提出。

## 项目结构

### 结构

本项目使用 React 和 TypeScript 构建，以 Vite 作为构建工具。我们使用 Storybook 进行组件开发和文档编写。项目结构如下：

```
system-ui/
├── .github/
│   └── workflows/ # CI/CD 工作流
├── .storybook/ # Storybook 配置
│   ├── main.ts
│   ├── preview.ts
│   └── vitest.setup.ts
├── src/
│   ├── assets/ # 静态资源
│   │   ├── fonts/
│   │   └── icon/
│   ├── components/ # React 组件
│   │   ├── Alert/
│   │   │   ├── Alert.scss
│   │   │   ├── Alert.stories.tsx
│   │   │   ├── Alert.tsx
│   │   │   └── index.ts
│   │   ├── Button/
│   │   ├── Checkbox/
│   │   ├── Input/
│   │   ├── Menu/
│   │   └── Tabs/
│   ├── stories/ # Storybook 生成的故事
│   │   ├── Configure.mdx
│   │   └── assets/
│   ├── styles/ # 全局样式
│   │   ├── _variables.scss
│   │   └── global.scss
│   ├── index.ts
│   └── vite-env.d.ts
├── eslint.config.js
├── package.json
├── tsconfig.build.json
├── tsconfig.json
├── vite.config.ts
└── vitest.workspace.ts
```

### 主要技术和库

- React
- TypeScript
- Vite
- Storybook
- SCSS
- ESLint & Prettier
- Vitest 用于测试

有关详细配置，请参阅 `package.json`、`vite.config.ts` 和 `.storybook/` 文件。

## 致谢

感谢 [Muxi 团队](https://muxixyz.com/) 提供机会，促使我开发这个项目。

感谢 [system.css](https://system-ui.com/) 提供设计灵感。

另请参阅：

[98.css](https://jdan.github.io/98.css/)

## 参考资料

https://developer.apple.com/design/human-interface-guidelines

https://sakofchit.github.io/system.css
