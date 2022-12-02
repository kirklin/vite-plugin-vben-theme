# @kirklin/vite-plugin-vben-theme

**中文** | [English](./README.md)

[![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![javascript_code style][code-style-image]][code-style-url]

[npm-image]: https://img.shields.io/npm/v/@kirklin/vite-plugin-vben-theme.svg
[npm-url]: https://npmjs.org/package/@kirklin/vite-plugin-vben-theme
[downloads-image]: https://img.shields.io/npm/dm/@kirklin/vite-plugin-vben-theme.svg
[downloads-url]: https://npmjs.org/package/@kirklin/vite-plugin-vben-theme
[code-style-image]: https://img.shields.io/badge/code__style-%40kirklin%2Feslint--config-brightgreen
[code-style-url]: https://github.com/kirklin/eslint-config/

用于动态更改界面主题色的 vite 插件。

在 vite 处理 css 后,动态解析 css 文本内符合插件配置的颜色值的时候,从所有输出的 css 文件提取指定的颜色样式代码。并创建一个仅包含颜色样式的`app-theme-style.css`文件，动态插入到指定的位置(默认 body 底部),然后将所使用的自定义样式/组件库样式颜色替换为新的颜色,以达到动态更改项目主题色的目的

### 安装 (pnpm or npm)

**vite version:** >=3.2.0

```
pnpm i @kirklin/vite-plugin-vben-theme -D
```

或者

```
npm i @kirklin/vite-plugin-vben-theme -D
```

## 使用

- 在 `vite.config.ts` 中配置,该方式可以按需引入需要的功能即可

```ts
import { defineConfig, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';

import { viteThemePlugin, mixLighten, mixDarken, tinycolor } from '@kirklin/vite-plugin-vben-theme';

export default defineConfig({
  plugins: [
    vue(),
    viteThemePlugin({
      // 匹配需要修改的颜色
       colorVariables: [],
    });
  ],
});
```

## 参数说明

`viteThemePlugin(Options)`

**Options**

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| colorVariables | `string[]` | - | 如果 css 内包含在该数组内的颜色值，则会抽取出 css |
| wrapperCssSelector | `string` | - | 通用外层选择器。可以传入 'body'等用用选择器来提高层级 |
| resolveSelector | `(selector:string)=>string` | - | 自定义选择器转换 |
| customerExtractVariable | `(css:string)=>string` | - | 自定义 css 匹配颜色抽取逻辑 |
| fileName | `string` | `app-theme-style.hash.css` | 打包后输出的文件名 |
| injectTo | `body`或`head`或`body-prepend` | `body` | 生产环境加载的 css 注入到那个标签体 |

## License

MIT
