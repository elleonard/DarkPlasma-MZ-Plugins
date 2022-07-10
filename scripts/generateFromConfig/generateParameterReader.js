const path = require('path');
const prettier = require('prettier');
const { generateParser } = require('./generateParser');
const { SYMBOL_TYPE } = require('./parameterSymbolType');

const prettierConfig = path.resolve(__dirname, '..', '..', '.prettierrc');

function generateParameterReader(config, isTest, testConfig) {
  const parameters = configToParameters(config, SYMBOL_TYPE.PLUGIN_PARAMETERS);
  const testParameters = configToParameters(testConfig, SYMBOL_TYPE.TEST_PLUGIN_PARAMETERS);

  return prettier.resolveConfig(prettierConfig).then((options) => {
    options.parser = 'babel';

    const pluginParameterPath = isTest ? '../../../common/testPluginParameters' : '../../../common/pluginParameters';
    const code = `import { ${isTest ? `testPluginParameters,` : ``}pluginParameters } from '${pluginParameterPath}';
    
    export const settings = {
      ${parameters.map((parameter) => `${parameter.name}: ${parameter.parser}`).join(',\n')}
    };
    
    ${testParametersToCode(testParameters)}
    `;

    return prettier.format(isTest ? code + targetVersionCode(config) : code, options);
  });
}

function generateParameterReaderFunction(config) {
  const parameters = configToParameters(config, SYMBOL_TYPE.PLUGIN_PARAMETERS_OF);

  return prettier.resolveConfig(prettierConfig).then((options) => {
    options.parser = 'babel';

    const code = `import { pluginParametersOf } from '../../../common/pluginParametersOf';

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

function testParametersToCode(testParameters) {
  return testParameters.length > 0
    ? `export const testSettings = {
    ${testParameters.map((parameter) => `${parameter.name}: ${parameter.parser}`).join(',\n')}
  };`
    : '';
}

function targetVersionCode(config) {
  return `export const targetPluginVersion = "${config.histories[0].version}";`;
}

module.exports = {
  generateParameterReader,
  generateParameterReaderFunction
};
