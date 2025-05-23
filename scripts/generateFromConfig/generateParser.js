import { PluginParameter } from './generateHeader.js';

export const TYPE_CATEGORIES = {
  STRING: "string",
  NUMBER: "number",
  BOOLEAN: "boolean",
  ARRAY: "array",
  STRUCT: "struct",
  COLOR: "color",
  LOCATION: "location",
};

export function toJsTypeCategory(parameter) {
  switch (parameter.type) {
    case 'string':
    case 'multiline_string':
    case 'file':
      return TYPE_CATEGORIES.STRING;
    case 'number':
    case 'actor':
    case 'class':
    case 'enemy':
    case 'troop':
    case 'skill':
    case 'item':
    case 'weapon':
    case 'armor':
    case 'animation':
    case 'state':
    case 'switch':
    case 'variable':
    case 'common_event':
    case 'icon':
    case 'map':
      return TYPE_CATEGORIES.NUMBER;
    case 'boolean':
      return TYPE_CATEGORIES.BOOLEAN;
    case 'select':
      if (parameter.options[0].value !== undefined && Number.isFinite(parameter.options[0].value)) {
        return TYPE_CATEGORIES.NUMBER;
      } else {
        return TYPE_CATEGORIES.STRING;
      }
    case 'color': // #始まりの16進数を許可する
      return TYPE_CATEGORIES.COLOR;
    case 'location':
      return TYPE_CATEGORIES.LOCATION;
    default:
      // structure or array
      if (parameter.type.endsWith('[]')) {
        return TYPE_CATEGORIES.ARRAY;
      }
      return TYPE_CATEGORIES.STRUCT;
  }
}

export function generateParser(config, parameter, symbolType) {
  let parser = 'TODO';
  switch (toJsTypeCategory(parameter)) {
    case TYPE_CATEGORIES.STRING:
      parser = stringParser(parameter, symbolType);
      break;
    case TYPE_CATEGORIES.NUMBER:
      parser = numberParser(parameter, symbolType);
      break;
    case TYPE_CATEGORIES.BOOLEAN:
      parser = booleanParser(parameter, symbolType);
      break;
    case TYPE_CATEGORIES.COLOR:
      parser = colorParser(parameter, symbolType);
      break;
    case TYPE_CATEGORIES.LOCATION:
      parser = locationParser(parameter, symbolType);
    case TYPE_CATEGORIES.ARRAY:
      parser = arrayParser(config, parameter, symbolType);
      break;
    case TYPE_CATEGORIES.STRUCT:
      parser = structParser(config, parameter, symbolType);
      break;
  }
  return parser;
}

function stringParser(parameter, symbolType) {
  const default_ = parameter.default ? (parameter.default.ja ? parameter.default.ja : parameter.default) : '';
  return `String(${parameterSymbol(parameter, symbolType)} || \`${default_.replace(/\n/g, '\\n')}\`)`;
}

function numberParser(parameter, symbolType) {
  return `Number(${parameterSymbol(parameter, symbolType)} || ${parameter.default ? parameter.default : 0})`;
}

function booleanParser(parameter, symbolType) {
  return `String(${parameterSymbol(parameter, symbolType)} || ${parameter.default}) === 'true'`;
}

function colorParser(parameter, symbolType) {
  return `${parameterSymbol(parameter, symbolType)}?.startsWith("#") ? String(${parameterSymbol(parameter, symbolType)}) : ${numberParser(parameter, symbolType)}`;
}

function locationParser(parameter, symbolType) {
  return `(() => {
  const parsed = JSON.parse(${parameterSymbol(parameter, symbolType)});
  return {
    mapId: Number(parsed.mapId),
    x: Number(parsed.x),
    y: Number(parsed.y),
  };
})()`;
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
  const default_ = parameter.default
    ? parameterObject.defaultText('ja', true)
        .replace(/\n/g, '\\n')
    : '[]';
  return `JSON.parse(${parameterSymbol(parameter, symbolType)} || '${default_}').map(${subParameter.symbol} => {
    return ${generateParser(config, subParameter, symbolType)};
  })`;
}

function structParser(config, parameter, symbolType) {
  const structure = config.structures[parameter.type];
  if (!structure) throw `unknown structure: ${parameter.type}`;
  const parameterObject = new PluginParameter(parameter);
  const default_ = parameter.default
    ? parameterObject.defaultText('ja', true)
        .replace(/\n/g, '\\n')
    : '{}';
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
