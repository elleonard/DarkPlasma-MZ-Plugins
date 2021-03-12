const path = require('path');
const prettier = require('prettier');
const { PluginParameter } = require('./generateHeader');

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

function generateParser(config, parameter, forTest) {
  let parser = 'TODO';
  switch (parameter.type) {
    case 'string':
    case 'multiline_string':
    case 'file':
      parser = stringParser(parameter, forTest);
      break;
    case 'number':
    case 'actor':
    case 'class':
    case 'enemy':
    case 'skill':
    case 'item':
    case 'weapon':
    case 'armor':
    case 'animation':
    case 'state':
    case 'switch':
    case 'variable':
    case 'common_event':
      parser = numberParser(parameter, forTest);
      break;
    case 'boolean':
      parser = booleanParser(parameter, forTest);
      break;
    case 'select':
      if (parameter.options[0].value || Number.isFinite(parameter.options[0].value)) {
        parser = numberParser(parameter, forTest);
      } else {
        parser = stringParser(parameter, forTest);
      }
      break;
    default:
      // structure or array
      if (parameter.type.endsWith('[]')) {
        parser = arrayParser(config, parameter, forTest);
        break;
      }
      parser = structParser(config, parameter, forTest);
      break;
  }
  return parser;
}

function stringParser(parameter, forTest) {
  const default_ = parameter.default ? (parameter.default.ja ? parameter.default.ja : parameter.default) : '';
  return `String(${parameterSymbol(parameter, forTest)} || '${default_}')`;
}

function numberParser(parameter, forTest) {
  return `Number(${parameterSymbol(parameter, forTest)} || ${parameter.default ? parameter.default : 0})`;
}

function booleanParser(parameter, forTest) {
  return `String(${parameterSymbol(parameter, forTest)} || ${parameter.default}) === 'true'`;
}

function arrayParser(config, parameter, forTest) {
  const parameterObject = new PluginParameter(parameter);
  const subParameter = {
    type: parameterObject.baseType(),
    symbol: 'e',
  };
  if (parameter.options) {
    subParameter.options = parameter.options;
  }
  const default_ = parameter.default ? parameterObject.defaultText('ja', true).replace(/\\/g, '') : '[]';
  return `JSON.parse(${parameterSymbol(parameter, forTest)} || '${default_}').map(${subParameter.symbol} => {
    return ${generateParser(config, subParameter, forTest)};
  })`;
}

function structParser(config, parameter, forTest) {
  const structure = config.structures[parameter.type];
  if (!structure) throw `unknown structure: ${parameter.type}`;
  const parameterObject = new PluginParameter(parameter);
  const default_ = parameter.default ? parameterObject.defaultText('ja', true).replace(/\\/g, '') : '{}';
  return `((parameter) => {
    const parsed = JSON.parse(parameter);
    return {
      ${structure
        .map((subParameter) => {
          subParameter.symbol = `parsed.${subParameter.param}`;
          return `${subParameter.param}: ${generateParser(config, subParameter, forTest)}`;
        })
        .join(',\n')}};
  })(${parameterSymbol(parameter, forTest)} || '${default_}')`;
}

function parameterSymbol(parameter, forTest) {
  return parameter.symbol ? parameter.symbol : `${forTest ? `testPlugin` : `plugin`}Parameters.${parameter.param}`;
}

module.exports = {
  generateParameterReader,
};
