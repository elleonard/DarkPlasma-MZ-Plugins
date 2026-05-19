export const pluginPath = (document.currentScript! as HTMLScriptElement).src.replace(/^.*js\/plugins\/(.*).js$/, function () {
  return arguments[1];
});
