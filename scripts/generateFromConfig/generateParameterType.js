const path = require('path');
const prettier = require('prettier');
const prettierConfig = path.resolve(__dirname, '..', '..', '.prettierrc');

const { toJsTypeCategory, TYPE_CATEGORIES } = require("./generateParser");

function generateParameterType(config, pluginId) {
  let result = "";
  if (config.structures) {
    result += Object.entries(config.structures).map(([name, structure]) => {
      return `export type ${structTypeName(pluginId, name)} = {
        ${structure.map(param => `${param.param}: ${paramToType(pluginId, param)}`).join(';\n')};
      }`;
    }).join('\n');
    result += '\n';
  }

  if (config.parameters && config.parameters.length > 0) {
    result += `export namespace settings {
      ${config.parameters.filter(param => !param.dummy).map(param => `const ${param.param}: ${paramToType(pluginId, param)}`).join(';\n')};
    }`;
  }
  return prettier.resolveConfig(prettierConfig).then((options) => {
    options.parser = 'typescript';

    return prettier.format(result, options);
  });
}

function structTypeName(pluginId, structName) {
  return `${pluginId}_${structName}`;
}

function paramToType(pluginId, param) {
  const typeCategory = toJsTypeCategory(param);
  switch (typeCategory) {
    case TYPE_CATEGORIES.NUMBER:
    case TYPE_CATEGORIES.STRING:
    case TYPE_CATEGORIES.BOOLEAN:
      return typeCategory;
    case TYPE_CATEGORIES.COLOR:
      return "string|number";
    case TYPE_CATEGORIES.ARRAY:
      const arrayOf = {
        type: param.type.replace('[]', ''),
        options: param.options,
      };
      return `${paramToType(pluginId, arrayOf)}[]`;
    case TYPE_CATEGORIES.STRUCT:
      return structTypeName(pluginId, param.type);
  }
  return "";
}

module.exports = {
  generateParameterType,
  paramToType,
  structTypeName,
};
