import { PluginConfigSchema, PluginParameterArraySchema, PluginParameterSchema, PluginParameterStructSchema } from "../../modules/config/configSchema.js";
import { createBooleanParam, createNumberParam, createSelectParam, createStringParam, createStructParam } from "../../modules/config/createParameter.js";

export function generateParser(config: PluginConfigSchema, parameter: PluginParameterSchema, objectName?: string): string {
  let parser = 'TODO';
  if (isArrayParameter(parameter)) {
    return arrayParser(config, parameter, objectName);
  }
  switch (parameter.type) {
    case 'string':
    case 'multiline_string':
    case 'file':
      return stringParser(parameter, objectName);
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
      return numberParser(parameter, objectName);
    case 'boolean':
      return booleanParser(parameter, objectName);
    case 'color': // #始まりの16進数を許可する
      return colorParser(parameter, objectName);
    case 'select':
      if (parameter.options[0].value !== undefined && Number.isFinite(parameter.options[0].value)) {
        return numberParser(parameter, objectName);
      } else {
        return stringParser(parameter, objectName);
      }
    case 'struct':
      return structParser(config, parameter, objectName);
  }
  return parser;
}

function isArrayParameter(parameter: PluginParameterSchema): parameter is PluginParameterArraySchema {
  return parameter.type.endsWith('[]');
}

function stringParser(parameter: PluginParameterSchema, objectName?: string) {
  const default_ = parameter.default ? (parameter.default.ja ? parameter.default.ja : parameter.default) : '';
  return `String(${parameterSymbol(parameter, objectName)} || \`${default_.replace(/\n/g, '\\n')}\`)`;
}

function numberParser(parameter: PluginParameterSchema, objectName?: string) {
  return `Number(${parameterSymbol(parameter, objectName)} || ${parameter.default ? parameter.default : 0})`;
}

function booleanParser(parameter: PluginParameterSchema, objectName?: string) {
  return `String(${parameterSymbol(parameter, objectName)} || ${parameter.default}) === 'true'`;
}

function colorParser(parameter: PluginParameterSchema, objectName?: string) {
  return `${parameterSymbol(parameter, objectName)}?.startsWith("#") ? String(${parameterSymbol(parameter, objectName)}) : ${numberParser(parameter, objectName)}`;
}

function arrayParser(
  config: PluginConfigSchema,
  parameter: PluginParameterArraySchema,
  objectName?: string
) {
  const subParameter = toSubParameter(config, parameter);
  return `${parameterSymbol(parameter, objectName)} ? JSON.parse(${parameterSymbol(parameter, objectName)}).map(${subParameter.param} => {
    return ${generateParser(config, subParameter, undefined)};
  }) : ${JSON.stringify(parameter.default)}`;
}

function toSubParameter(config: PluginConfigSchema, parameter: PluginParameterArraySchema): PluginParameterSchema {
  switch (parameter.type) {
    case 'string[]':
    case 'file[]':
    case 'multiline_string[]':
      return createStringParam("e", { text: "" });
    case 'number[]':
    case 'actor[]':
    case 'class[]':
    case 'armor[]':
    case 'animation[]':
    case 'color[]':
    case 'common_event[]':
    case 'enemy[]':
    case 'icon[]':
    case 'item[]':
    case 'skill[]':
    case 'state[]':
    case 'switch[]':
    case 'tileset[]':
    case 'troop[]':
    case 'variable[]':
    case 'weapon[]':
      return createNumberParam("e", { text: "" });
    case 'boolean[]':
      return createBooleanParam("e", { text: "", default: false });
    case 'select[]':
      return createSelectParam("e", {
        text: "",
        options: [],
        default: "",
      })
    case 'struct[]':
      return createStructParam("e", {
        struct: config.structures.find(struct => struct.name === parameter.struct)!,
        text: "",
      })
  }
}

function structParser(config: PluginConfigSchema, parameter: PluginParameterStructSchema, objectName?: string) {
  const structure = config.structures.find(struct => struct.name === parameter.struct);
  if (!structure) throw `unknown structure: ${parameter.struct}`;
  return `${parameterSymbol(parameter, objectName)} ? ((parameter) => {
    const parsed = JSON.parse(parameter);
    return {
      ${structure.params.map((subParameter) => {
        return `${subParameter.param}: ${generateParser(config, subParameter, `parsed`)}`;
      })
      .join(',\n')}};
  })(${parameterSymbol(parameter, objectName)}) : ${JSON.stringify(parameter.default)}`;
}

function parameterSymbol(parameter: PluginParameterSchema, objectName?: string) {
  return objectName ? `${objectName}.${parameter.param}` : parameter.param;
}

