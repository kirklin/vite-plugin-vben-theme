// 常量，全局变量。
export const THEME_FIELD = "__VITE_THEME__";
export const THEME_STYLE_TAG_ID = "__VITE_PLUGIN_THEME__";
export const DARK_THEME_STYLE_TAG_ID = "__VITE_PLUGIN_DARK_THEME__";
export const ANTD_DARK_THEME_LINK_ID = "__VITE_PLUGIN_THEME-ANTD_DARK_THEME_LINK__";

// 配置和选项的接口和类型
export interface ColorPluginOptions {
  colorVariables: string[];
  wrapperCssSelector?: string;
  resolveSelector?: (selector: string) => string;
  fileName?: string;
  inline?: boolean;
  injectTo?: InjectTo;
}

export interface GlobalConfig {
  replaceStyleVariables: ({ colorVariables }: { colorVariables: string[] }) => void;
  colorVariables: string[];
  defaultOptions: ColorPluginOptions;
  appended?: boolean;
  styleIdMap?: Map<string, string>;
  styleRenderQueueMap?: Map<string, string>;
}

export type InjectTo = "head" | "body" | "body-prepend";

// 挂载到window对象中，用于全局访问。
declare global {
  interface Window {
    [THEME_FIELD]: GlobalConfig;
  }
}

// 定义变量
declare const __COLOR_PLUGIN_OPTIONS__: ColorPluginOptions;
declare const __COLOR_PLUGIN_OUTPUT_FILE_NAME__: string;
declare const __ANTD_DARK_PLUGIN_OUTPUT_FILE_NAME__: string;
declare const __ANTD_DARK_PLUGIN_LOAD_LINK__: boolean;
declare const __ANTD_DARK_PLUGIN_EXTRACT_CSS__: boolean;
declare const __PROD__: boolean;

// 赋值常量和变量
const colorPluginOutputFileName = __COLOR_PLUGIN_OUTPUT_FILE_NAME__;
const isProd = __PROD__;
const colorPluginOptions = __COLOR_PLUGIN_OPTIONS__;

// 从选项中获取injectTo，防抖函数。
const injectTo = colorPluginOptions.injectTo;
const debounceThemeRender = debounce(200, renderTheme);

export let darkCssIsReady = false;

// 初始化全局配置。
(() => {
  if (!window[THEME_FIELD]) {
    window[THEME_FIELD] = {
      styleIdMap: new Map(),
      styleRenderQueueMap: new Map(),
    } as any;
  }
  setGlobalOption("replaceStyleVariables", replaceStyleVariables);
  if (!getGlobalOption("defaultOptions")) {
    setGlobalOption("defaultOptions", colorPluginOptions);
  }
})();

// 添加CSS到渲染队列中，等待渲染。
export function addCssToQueue(id: string, css: string) {
  const styleIdMap = getGlobalOption("styleIdMap")!;

  if (!styleIdMap.get(id)) {
    window[THEME_FIELD].styleRenderQueueMap!.set(id, css);
    debounceThemeRender();
  }
}

// 渲染主题
function renderTheme() {
  const variables = getGlobalOption("colorVariables")!;
  if (!variables) {
    return;
  }
  const styleRenderQueueMap = getGlobalOption("styleRenderQueueMap")!;

  const styleDom = getStyleDom(THEME_STYLE_TAG_ID);
  let html = styleDom.innerHTML;
  for (const [id, css] of styleRenderQueueMap.entries()) {
    html += css;
    window[THEME_FIELD].styleRenderQueueMap!.delete(id);
    window[THEME_FIELD].styleIdMap!.set(id, css);
  }
  replaceCssColors(html, variables).then((processCss) => {
    appendCssToDom(styleDom, processCss, injectTo);
  });
}

// 替换CSS中的颜色变量，可传入自定义CSS处理函数。
export async function replaceStyleVariables(
  { colorVariables, customCssHandler }: { colorVariables: string[]; customCssHandler?: (css: string) => string },
) {
  setGlobalOption("colorVariables", colorVariables);
  const styleIdMap = getGlobalOption("styleIdMap")!;
  const styleRenderQueueMap = getGlobalOption("styleRenderQueueMap")!;
  if (!isProd) {
    for (const [id, css] of styleIdMap.entries()) {
      styleRenderQueueMap.set(id, css);
    }
    renderTheme();
  } else {
    const cssText = await fetchCssModule(colorPluginOutputFileName);
    const styleDom = getStyleDom(THEME_STYLE_TAG_ID);
    const processCss = await replaceCssColors(cssText, colorVariables, customCssHandler);
    appendCssToDom(styleDom, processCss, injectTo);
  }
}

// 加载深色主题CSS。
export async function loadDarkThemeCss() {
  const isLoadLink = __ANTD_DARK_PLUGIN_LOAD_LINK__;
  const extractCSS = __ANTD_DARK_PLUGIN_EXTRACT_CSS__;
  if (darkCssIsReady || !extractCSS) {
    return;
  }
  if (isLoadLink) {
    const linkTag = document.getElementById(ANTD_DARK_THEME_LINK_ID);
    if (linkTag) {
      linkTag.removeAttribute("disabled");
      linkTag.setAttribute("rel", "stylesheet");
    }
  } else {
    const cssText = await fetchCssModule(__ANTD_DARK_PLUGIN_OUTPUT_FILE_NAME__);
    const styleDom = getStyleDom(DARK_THEME_STYLE_TAG_ID);
    appendCssToDom(styleDom, cssText, injectTo);
  }
  darkCssIsReady = true;
}

// 用给定颜色数组来替换CSS中的颜色变量。
export async function replaceCssColors(
  css: string,
  colors: string[],
  customCssHandler?: (css: string) => string,
) {
  let retCss: string = css;
  const defaultOptions = getGlobalOption("defaultOptions");
  const colorVariables = defaultOptions ? defaultOptions.colorVariables || [] : [];

  colorVariables.forEach((color, index) => {
    const reg = new RegExp(
        `${color.replace(/,/g, ",\\s*").replace(/\s/g, "").replace("(", "\\(").replace(")", "\\)")
        }([\\da-f]{2})?(\\b|\\)|,|\\s)?`,
        "ig",
    );
    retCss = retCss.replace(reg, `${colors[index]}$1$2`).replace("$1$2", "");
    if (customCssHandler && typeof customCssHandler === "function") {
      retCss = customCssHandler(retCss) || retCss;
    }
  });
  return retCss;
}

// 设置全局属性。
export function setGlobalOption<T extends keyof GlobalConfig = any>(
  key: T,
  value: GlobalConfig[T],
) {
  window[THEME_FIELD][key] = value;
}

// 获取全局属性。
export function getGlobalOption<T extends keyof GlobalConfig = any>(key: T): GlobalConfig[T] {
  return window[THEME_FIELD][key];
}

// 获取或创建样式标签。
export function getStyleDom(id: string) {
  let style = document.getElementById(id);
  if (!style) {
    style = document.createElement("style");
    style.setAttribute("id", id);
  }
  return style;
}

// 在指定位置追加样式标签。
export async function appendCssToDom(
  styleDom: HTMLElement,
  cssText: string,
  appendTo: InjectTo = "body",
) {
  styleDom.innerHTML = cssText;
  if (appendTo === "head") {
    document.head.appendChild(styleDom);
  } else if (appendTo === "body") {
    document.body.appendChild(styleDom);
  } else if (appendTo === "body-prepend") {
    const firstChildren = document.body.firstChild;
    document.body.insertBefore(styleDom, firstChildren);
  }
}

// 加载CSS文件。
function fetchCssModule(fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const appended = getGlobalOption("appended");
    if (appended) {
      setGlobalOption("appended", false);
      resolve("");
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(xhr.status);
        }
      }
    };
    xhr.onerror = function (e) {
      reject(e);
    };
    xhr.ontimeout = function (e) {
      reject(e);
    };
    xhr.open("GET", fileName, true);
    xhr.send();
  });
}
// 防抖
function debounce(duration: number, fn: (...arg: any[]) => any) {
  let timer = -1;
  return function (this: unknown, ...args: any[]) {
    if (timer > -1) {
      clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      fn.bind(this)(...args);
      timer = -1;
    }, duration);
  };
}
