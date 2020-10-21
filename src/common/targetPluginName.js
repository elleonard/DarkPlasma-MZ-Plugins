export const targetPluginName = document.currentScript.src.replace(/^.*\/(.*)_Test.js$/, function () {
  return arguments[1];
});
