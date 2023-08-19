const path = require('path');
const prettier = require('prettier');
const { generateParser } = require('./generateParser');
const { SYMBOL_TYPE } = require('./parameterSymbolType');

const prettierConfig = path.resolve(__dirname, '..', '..', '.prettierrc');
const pluginParametersDir = path.resolve(__dirname, '..', '..', 'src', 'common', 'pluginParameters');
const pluginParametersOfDir = path.resolve(__dirname, '..', '..', 'src', 'common', 'pluginParametersOf');

function generateParameterReader(config, destDir) {
  const parameters = configToParameters(config, SYMBOL_TYPE.PLUGIN_PARAMETERS);

  return prettier.resolveConfig(prettierConfig).then((options) => {
    options.parser = 'babel';

    const pluginParameterPath = path.relative(destDir, pluginParametersDir).replaceAll('\\', '/');
    const code = `import { pluginParameters } from '${pluginParameterPath}';
    
    export const settings = {
      ${parameters.map((parameter) => `${parameter.name}: ${parameter.parser}`).join(',\n')}
    };
    `;

    return prettier.format(code, options);
  });
}

function generateParameterReaderFunction(config, destDir) {
  const parameters = configToParameters(config, SYMBOL_TYPE.PLUGIN_PARAMETERS_OF);

  return prettier.resolveConfig(prettierConfig).then((options) => {
    options.parser = 'babel';

    const code = `import { pluginParametersOf } from '${path.relative(destDir, pluginParametersOfDir).replaceAll('\\', '/')}';

    export const settingsOf${config.name.replace(/^DarkPlasma_/, "")} = ((pluginName) => {
      return {
        ${parameters.map((parameter) => `${parameter.name}: ${parameter.parser}`).join(',\n')}
      };
    })("${config.name}");
    `;

    return prettier.format(code, options);
  });
}

function configToParameters(config, symbolType) {
  return config && config.parameters
    ? config.parameters
        .filter((parameter) => !parameter.dummy)
        .map((parameter) => {
          return {
            name: parameter.param,
            parser: generateParser(config, parameter, symbolType),
          };
        })
    : [];
}

module.exports = {
  generateParameterReader,
  generateParameterReaderFunction
};
