const path = require('path');
const prettier = require('prettier');
const { paramToType, structTypeName } = require('./generateParameterType');
const prettierConfig = path.resolve(__dirname, '..', '..', '.prettierrc');

function generateCommandType(config, pluginId) {
  let result = "";
  if (config.commands?.length > 0) {
    config.commands.forEach(command => {
      const args = {};
      if (config.structures) {
        result += Object.entries(config.structures).map(([name, structure]) => {
          return `export type ${structTypeName(pluginId, name)} = {
            ${structure.map(param => `${param.param}: ${paramToType(pluginId, param)}`).join(';\n')};
          }`;
        }).join('\n');
        result += '\n';
      }
      if (command.args?.length > 0) {
        const argsTypeName = `CommandArgs_${pluginId}_${command.command}`;
        result += `export type ${argsTypeName} = {`
        command.args.forEach(arg => {
          args[arg.arg] = paramToType(pluginId, arg);
          result += `${arg.arg}: ${paramToType(pluginId, arg)};`;
        });
        result += `};\n`;
        result += `export function parseArgs_${command.command}(args: any): ${argsTypeName};\n`;
      }
      result += `export const command_${command.command}: "${command.command}";\n`;
    });
  }
  return prettier.resolveConfig(prettierConfig).then((options) => {
    options.parser = 'typescript';

    return prettier.format(result, options);
  });
}

module.exports = {
  generateCommandType
};
