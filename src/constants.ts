import { normalizePath } from "vite";

// Define constant variables for theme client entry points
export const VITE_CLIENT_ENTRY = "/@vite/client";

export const VITE_PLUGIN_THEME_CLIENT_ENTRY = normalizePath("node_modules/@kirklin/vite-plugin-vben-theme/es/");

// Define constant variables for theme client public paths
export const CLIENT_PUBLIC_ABSOLUTE_PATH = normalizePath(`/${VITE_PLUGIN_THEME_CLIENT_ENTRY}/client.js`);

export const CLIENT_PUBLIC_PATH = normalizePath(`${VITE_PLUGIN_THEME_CLIENT_ENTRY}/client.js`);

// Define regular expressions
export const commentRE = /\\\\?n|\n|\\\\?r|\/\*[\s\S]+?\*\//g;

const cssLangs = "\\.(css|less|sass|scss|styl|stylus|postcss)($|\\?)";

export const colorRE = /#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})|rgba?\((.*),\s*(.*),\s*(.*)(?:,\s*(.*(?:.*)?))?\)/gi;

export const cssVariableString = "const css = \"";

export const cssBlockRE = /[^}]*\{[^{]*\}/g;

export const cssLangRE = new RegExp(cssLangs);
export const ruleRE = /(\w+-)*\w+:/;
export const cssValueRE = /(\s?[a-z0-9]+\s)*/;
export const safeEmptyRE = /\s?/;
export const importSafeRE = /(\s*!important)?/;

// Define constant variable for link id
export const linkID = "__VITE_PLUGIN_THEME-ANTD_DARK_THEME_LINK__";
