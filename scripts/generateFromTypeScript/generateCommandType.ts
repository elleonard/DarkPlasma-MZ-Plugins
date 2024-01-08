import path from 'path';
import * as prettier from 'prettier';
import { fileURLToPath } from 'url';
import { PluginConfigSchema } from "../../modules/config/configSchema.js";
import { paramToType, structTypeName } from './generateParameterType.js';
import { commandNameToSymbol } from './generatePluginCommand.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prettierConfig = path.resolve(__dirname, '..', '..', '.prettierrc');

export async function generateCommandType(config: PluginConfigSchema, pluginId: string) {
  let result = "";
  if (config.commands?.length > 0) {
    config.commands.forEach(command => {
      if (config.structures) {
        result += config.structures.map((structure) => {
          return `export type ${structTypeName(pluginId, structure.name)} = {
            ${structure.params.map(param => `${param.param}: ${paramToType(pluginId, param)}`).join(';\n')};
          }`;
        }).join('\n');
        result += '\n';
      }
      if (command.args?.length > 0) {
        const argsTypeName = `CommandArgs_${pluginId}_${commandNameToSymbol(command.command)}`;
        result += `export type ${argsTypeName} = {`
        command.args.forEach(arg => {
          if (arg.type !== "dummy") {
            result += `${arg.param}: ${paramToType(pluginId, arg)};`;
          }
        });
        result += `};\n`;
        result += `export function parseArgs_${commandNameToSymbol(command.command)}(args: any): ${argsTypeName};\n`;
      }
      result += `export const command_${commandNameToSymbol(command.command)}: "${command.command}";\n`;
    });
  }
  return prettier.resolveConfig(prettierConfig).then((options) => {
    if (!options) {
      throw new Error('prettier設定ファイルがありません');
    }
    options.parser = 'typescript';

    return prettier.format(result, options);
  });
}
