export const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
  return arguments[1];
});
