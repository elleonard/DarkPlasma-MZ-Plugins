const path = require('path');
const prettier = require('prettier');
const { generateParser } = require('./generateParser');

const prettierConfig = path.resolve(__dirname, '..', '..', '.prettierrc');

function generateParameterReader(config, isTest, testConfig) {
  const parameters = configToParameters(config, false);
  const testParameters = configToParameters(testConfig, true);

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

function configToParameters(config, forTest) {
  return config && config.parameters
    ? config.parameters
        .filter((parameter) => !parameter.dummy)
        .map((parameter) => {
          return {
            name: parameter.param,
            parser: generateParser(config, parameter, forTest),
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
};
