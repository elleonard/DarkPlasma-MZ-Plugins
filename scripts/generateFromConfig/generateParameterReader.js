const path = require('path');
const prettier = require('prettier');
const { PluginParameter } = require('./generateHeader');

const prettierConfig = path.resolve(__dirname, '..', '..', '.prettierrc');

function generateParameterReader(config, isTest) {
  const parameters = config.parameters
    ? config.parameters
        .filter((parameter) => !parameter.dummy)
        .map((parameter) => {
          return {
            name: parameter.param,
            parser: generateParser(config, parameter),
          };
        })
    : [];

  return prettier.resolveConfig(prettierConfig).then((options) => {
    options.parser = 'babel';

    const pluginParameterPath = isTest ? '../../../common/testPluginParameters' : '../../../common/pluginParameters';
    const code = `import { pluginParameters } from '${pluginParameterPath}';
    
    export const settings = {
      ${parameters.map((parameter) => `${parameter.name}: ${parameter.parser}`).join(',\n')}
    };`;

    return prettier.format(isTest ? code + targetVersionCode(config) : code, options);
  });
}

function targetVersionCode(config) {
  return `export const targetPluginVersion = "${config.histories[0].version}";`;
}

function generateParser(config, parameter) {
  let parser = 'TODO';
  switch (parameter.type) {
    case 'string':
    case 'multiline_string':
    case 'file':
      parser = stringParser(parameter);
      break;
    case 'number':
    case 'actor':
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
      parser = numberParser(parameter);
      break;
    case 'boolean':
      parser = booleanParser(parameter);
      break;
    case 'select':
      if (parameter.options[0].value || Number.isFinite(parameter.options[0].value)) {
        parser = numberParser(parameter);
      } else {
        parser = stringParser(parameter);
      }
      break;
    default:
      // structure or array
      if (parameter.type.endsWith('[]')) {
        parser = arrayParser(config, parameter);
        break;
      }
      parser = structParser(config, parameter);
      break;
  }
  return parser;
}

function stringParser(parameter) {
  const default_ = parameter.default ? (parameter.default.ja ? parameter.default.ja : parameter.default) : '';
  return `String(${parameterSymbol(parameter)} || '${default_}')`;
}

function numberParser(parameter) {
  return `Number(${parameterSymbol(parameter)} || ${parameter.default ? parameter.default : 0})`;
}

function booleanParser(parameter) {
  return `String(${parameterSymbol(parameter)} || ${parameter.default}) === 'true'`;
}

function arrayParser(config, parameter) {
  const parameterObject = new PluginParameter(parameter);
  const subParameter = {
    type: parameterObject.baseType(),
    symbol: 'e',
  };
  if (parameter.options) {
    subParameter.options = parameter.options;
  }
  const default_ = parameter.default ? parameterObject.defaultText('ja', true).replace(/\\/g, '') : '[]';
  return `JSON.parse(${parameterSymbol(parameter)} || '${default_}').map(${subParameter.symbol} => {
    return ${generateParser(config, subParameter)};
  })`;
}

function structParser(config, parameter) {
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
          return `${subParameter.param}: ${generateParser(config, subParameter)}`;
        })
        .join(',\n')}};
  })(${parameterSymbol(parameter)} || '${default_}')`;
}

function parameterSymbol(parameter) {
  return parameter.symbol ? parameter.symbol : `pluginParameters.${parameter.param}`;
}

module.exports = {
  generateParameterReader,
};
