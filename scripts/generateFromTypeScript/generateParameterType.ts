import { PluginConfigSchema, PluginParameterSchema } from "../../modules/config/configSchema.js";
import path from 'path';
import * as prettier from 'prettier';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prettierConfig = path.resolve(__dirname, '..', '..', '.prettierrc');

export async function generateParameterType(config: PluginConfigSchema, pluginId: string) {
  let result = "";
  if (config.structures) {
    result += config.structures.map((structure) => {
      return `export type ${structTypeName(pluginId, structure.name)} = {
        ${structure.params.map(param => `${param.param}: ${paramToType(pluginId, param)}`).join(';\n')};
      }`;
    }).join('\n');
    result += '\n';
  }

  if (config.parameters && config.parameters.length > 0) {
    result += `export namespace settings {
      ${config.parameters.filter(param => param.type !== "dummy").map(param => `const ${param.param}: ${paramToType(pluginId, param)}`).join(';\n')};
    }`;
  }
  return prettier.resolveConfig(prettierConfig).then((options) => {
    if (!options) {
      throw new Error('prettier設定ファイルがありません');
    }
    options.parser = 'typescript';

    return prettier.format(result, options);
  });
}

export function structTypeName(pluginId: string, structName: string) {
  return `${pluginId}_${structName}`;
}

export function paramToType(pluginId: string, param: PluginParameterSchema): string {
  switch (param.type) {
    case "actor":
    case "animation":
    case "armor":
    case "class":
    case "common_event":
    case "enemy":
    case "icon":
    case "item":
    case "number":
    case "skill":
    case "state":
    case "switch":
    case "tileset":
    case "troop":
    case "variable":
    case "weapon":
      return "number";
    case "actor[]":
    case "animation[]":
    case "armor[]":
    case "class[]":
    case "common_event[]":
    case "enemy[]":
    case "icon[]":
    case "item[]":
    case "number[]":
    case "skill[]":
    case "state[]":
    case "switch[]":
    case "tileset[]":
    case "troop[]":
    case "variable[]":
    case "weapon[]":
      return "number[]";
    case "boolean":
      return "boolean";
    case "boolean[]":
      return "boolean[]";
    case "color":
      return "string|number";
    case "select":
      if (param.options[0].value === undefined) {
        return "string";
      }
      return typeof param.options[0].value;
    case "color[]":
    case "select[]":
      return "(string|number)[]";
    case "file":
    case "multiline_string":
    case "string":
        return "string";
    case "file[]":
    case "multiline_string[]":
    case "string[]":
      return "string[]";
    case "struct":
      return structTypeName(pluginId, param.struct);
    case "struct[]":
      return `${structTypeName(pluginId, param.struct)}[]`;
    case "dummy":
      throw new Error("ダミーパラメータの型は存在しません。");
  }
}
