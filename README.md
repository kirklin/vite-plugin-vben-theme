# @kirklin/vite-plugin-vben-theme

**English** | [中文](./README.zh_CN.md)

[![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![javascript_code style][code-style-image]][code-style-url]

[npm-image]: https://img.shields.io/npm/v/@kirklin/vite-plugin-vben-theme.svg
[npm-url]: https://npmjs.org/package/@kirklin/vite-plugin-vben-theme
[downloads-image]: https://img.shields.io/npm/dm/@kirklin/vite-plugin-vben-theme.svg
[downloads-url]: https://npmjs.org/package/@kirklin/vite-plugin-vben-theme
[code-style-image]: https://img.shields.io/badge/code__style-%40kirklin%2Feslint--config-brightgreen
[code-style-url]: https://github.com/kirklin/eslint-config/

Vite plugin for dynamically changing the theme color of the interface

After vite processes the css and dynamically analyzes the color value in the css text that matches the plug-in configuration, extract the specified color style code from all output css files. And create a `app-theme-style.css` file containing only color styles, dynamically insert it into the specified position (the bottom of the default body), and then replace the custom style/component library style color used with the new color, In order to achieve the purpose of dynamically changing the theme color of the project

### Install (pnpm or npm)

**vite version:** >=3.2.0

```
pnpm i @kirklin/vite-plugin-vben-theme -D
```

or

```
npm i @kirklin/vite-plugin-vben-theme -D
```

## Usage

- Config plugin in vite.config.ts. In this way, the required functions can be introduced as needed

```typescript
import { defineConfig, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';

import { viteThemePlugin, mixLighten, mixDarken, tinycolor } from '@kirklin/vite-plugin-vben-theme';

export default defineConfig({
  plugins: [
    vue(),
    viteThemePlugin({
      // Match the color to be modified
       colorVariables: [],
    }),
  ],
});
```

## Options

`viteThemePlugin(Options)`

**Options**

| param | type | default | desc |
| --- | --- | --- | --- |
| colorVariables | `string[]` | - | If css contains the color value in the array, css will be extracted |
| wrapperCssSelector | `string` | - | Universal outer selector. You can pass in'body' and other selectors to increase the level |
| resolveSelector | `(selector:string)=>string` | - | Custom selector conversion |
| customerExtractVariable | `(css:string)=>string` | - | Custom css matching color extraction logic |
| fileName | `string` | `app-theme-style.hash.css` | File name output after packaging |
| injectTo | `body` or `head` or `body-prepend` | `body` | The css loaded in the production environment is injected into the label body |


## License

MIT
