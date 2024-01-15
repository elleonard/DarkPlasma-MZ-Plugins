import path from 'path';
import * as prettier from 'prettier';
import { fileURLToPath } from 'url';
import { PluginConfigSchema } from '../../modules/config/configSchema.js';
import { generateParser } from './generateParser.js';
import { SYMBOL_TYPE } from './parameterSymbolType.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const prettierConfig = path.resolve(__dirname, '..', '..', '.prettierrc');

export async function generatePluginCommand(config: PluginConfigSchema) {
  return prettier.resolveConfig(prettierConfig).then((options) => {
    if (!options) {
      throw new Error('prettier設定ファイルがありません');
    }
    options.parser = 'babel';
    const commands = configToCommands(config);
    const code = commands
      .filter((command) => command.args.length > 0)
      .map((command) => {
        return `export function parseArgs_${commandNameToSymbol(command.name)}(args) {
        return {
          ${command.args.map((arg) => `${arg.name}: ${arg.parser}`).join(',\n')}
        };
      }`;
      }).concat(commands
        .map(command => `export const command_${commandNameToSymbol(command.name)} = "${command.name}";`)
      )
      .join('\n\n');
    return prettier.format(code, options);
  });
}

function configToCommands(config: PluginConfigSchema) {
  return config && config.commands
    ? config.commands.map((command) => {
        return {
          name: command.command,
          args: command.args
            ? command.args.map((arg) => {
                return {
                  name: arg.param,
                  parser: generateParser(config, arg, SYMBOL_TYPE.ARGS),
                };
              })
            : [],
        };
      })
    : [];
}

/**
 * コマンド名をシンボルとして有効な形に変換する
 * （含まれるスペースを除去してその後の文字を大文字にする）
 */
export function commandNameToSymbol(commandName: string) {
  return commandName.replace(/ ([a-z])/g, (m) => m.toUpperCase().trim());
}
