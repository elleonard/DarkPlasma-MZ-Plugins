const { PluginParameter } = require('./generateHeader');

function generateParser(config, parameter, symbolType) {
  let parser = 'TODO';
  switch (parameter.type) {
    case 'string':
    case 'multiline_string':
    case 'file':
      parser = stringParser(parameter, symbolType);
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
      parser = numberParser(parameter, symbolType);
      break;
    case 'boolean':
      parser = booleanParser(parameter, symbolType);
      break;
    case 'select':
      if (parameter.options[0].value !== undefined && Number.isFinite(parameter.options[0].value)) {
        parser = numberParser(parameter, symbolType);
      } else {
        parser = stringParser(parameter, symbolType);
      }
      break;
    default:
      // structure or array
      if (parameter.type.endsWith('[]')) {
        parser = arrayParser(config, parameter, symbolType);
        break;
      }
      parser = structParser(config, parameter, symbolType);
      break;
  }
  return parser;
}

function stringParser(parameter, symbolType) {
  const default_ = parameter.default ? (parameter.default.ja ? parameter.default.ja : parameter.default) : '';
  return `String(${parameterSymbol(parameter, symbolType)} || '${default_}')`;
}

function numberParser(parameter, symbolType) {
  return `Number(${parameterSymbol(parameter, symbolType)} || ${parameter.default ? parameter.default : 0})`;
}

function booleanParser(parameter, symbolType) {
  return `String(${parameterSymbol(parameter, symbolType)} || ${parameter.default}) === 'true'`;
}

function arrayParser(config, parameter, symbolType) {
  const parameterObject = new PluginParameter(parameter);
  const subParameter = {
    type: parameterObject.baseType(),
    symbol: 'e',
  };
  if (parameter.options) {
    subParameter.options = parameter.options;
  }
  const default_ = parameter.default ? parameterObject.defaultText('ja', true).replace(/\\/g, '') : '[]';
  return `JSON.parse(${parameterSymbol(parameter, symbolType)} || '${default_}').map(${subParameter.symbol} => {
    return ${generateParser(config, subParameter, symbolType)};
  })`;
}

function structParser(config, parameter, symbolType) {
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
          return `${subParameter.param}: ${generateParser(config, subParameter, symbolType)}`;
        })
        .join(',\n')}};
  })(${parameterSymbol(parameter, symbolType)} || '${default_}')`;
}

function parameterSymbol(parameter, symbolType) {
  const objectName = symbolType;
  return parameter.symbol ? parameter.symbol : `${objectName}.${parameter.param || parameter.arg}`;
}

module.exports = {
  generateParser,
};
