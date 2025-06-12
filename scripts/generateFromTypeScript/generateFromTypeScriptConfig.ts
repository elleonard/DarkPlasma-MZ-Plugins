import { fileURLToPath } from 'url';
import createJITI, { JITI } from 'jiti';
import path from 'path';
import fs from 'fs';
import { mkdirp } from 'mkdirp';
import { pluginConfigSchema, PluginConfigSchema } from '../../modules/config/configSchema.js';
import { generateHeader } from './generateHeader.js';
import { generateParameterReader, generateParameterReaderFunction } from './generateParameterReader.js';
import { generateParameterType } from './generateParameterType.js';
import { generatePluginCommand } from './generatePluginCommand.js';
import { generateCommandType } from './generateCommandType.js';
import { generateVersion, generateVersionType } from './generateVersion.js';

export async function generateFromTypeScriptConfig(file: string) {
  const config = parseConfig(file);
  if (config.draft) {
    return;
  }
  const distDir = path.resolve(file, '..', '_build');
  mkdirp.sync(distDir);

  fs.writeFileSync(path.resolve(distDir, `${config.name}_header.js`), generateHeader(config));

  const pluginName = config.name.replace(`DarkPlasma_`, '');
  const parameterReader = await generateParameterReader(config, distDir);
  fs.writeFileSync(path.resolve(distDir, `${config.name}_parameters.js`), parameterReader);
  const parameterReaderFunction = await generateParameterReaderFunction(config, distDir);
  fs.writeFileSync(path.resolve(distDir, `${config.name}_parametersOf.js`), parameterReaderFunction);
  const parameterType = await generateParameterType(config, pluginName);
  fs.writeFileSync(path.resolve(distDir, `${config.name}_parameters.d.ts`), parameterType);
  const parameterOfType = await generateParameterType(config, pluginName, `settingsOf${pluginName}`);
  fs.writeFileSync(path.resolve(distDir, `${config.name}_parametersOf.d.ts`), parameterOfType);
  const pluginCommands = await generatePluginCommand(config);
  fs.writeFileSync(path.resolve(distDir, `${config.name}_commands.js`), pluginCommands);
  const commandType = await generateCommandType(config, pluginName);
  fs.writeFileSync(path.resolve(distDir, `${config.name}_commands.d.ts`), commandType);
  fs.writeFileSync(path.resolve(distDir, `${config.name}_version.ts`), generateVersion(config));
  fs.writeFileSync(path.resolve(distDir, `${config.name}_version.d.ts`), generateVersionType(config));

  console.log(`build config: ${file}`);
  console.log('');
}

function parseConfig(filepath: string): PluginConfigSchema {
  const jiti: JITI = createJITI(fileURLToPath(import.meta.url));
  const data = jiti(path.resolve(filepath));

  return pluginConfigSchema.parse(data.config);
}