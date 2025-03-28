import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import * as mkdirp from 'mkdirp';
import { generateHeader } from './generateHeader.js';
import { generateParameterReader, generateParameterReaderFunction } from './generateParameterReader.js';
import { generatePluginCommand } from './generatePluginCommand.js';
import { generateParameterType } from './generateParameterType.js';
import { generateCommandType } from './generateCommandType.js';
import { generateVersion, generateVersionType } from './generateVersion.js';

export async function generateFromConfig(file) {
  const config = loadConfig(file);
  const distDir = path.resolve(file, '..', '_build');
  mkdirp.sync(distDir);

  for (let key of Object.keys(config)) {
    const currentConfig = config[key];
    const pluginName = key.replace(`DarkPlasma_`, '');
    fs.writeFileSync(path.resolve(distDir, `${key}_header.js`), generateHeader(currentConfig));
    const parameterReader = await generateParameterReader(currentConfig, distDir);
    fs.writeFileSync(path.resolve(distDir, `${key}_parameters.js`), parameterReader);
    const parameterReaderFunction = await generateParameterReaderFunction(currentConfig, distDir);
    fs.writeFileSync(path.resolve(distDir, `${key}_parametersOf.js`), parameterReaderFunction);
    const pluginCommands = await generatePluginCommand(currentConfig, distDir);
    fs.writeFileSync(path.resolve(distDir, `${key}_commands.js`), pluginCommands);
    const parameterType = await generateParameterType(currentConfig, pluginName);
    fs.writeFileSync(path.resolve(distDir, `${key}_parameters.d.ts`), parameterType);
    const parameterOfType = await generateParameterType(currentConfig, pluginName, `settingsOf${pluginName}`);
    fs.writeFileSync(path.resolve(distDir, `${key}_parametersOf.d.ts`), parameterOfType);
    const commandType = await generateCommandType(currentConfig, pluginName);
    fs.writeFileSync(path.resolve(distDir, `${key}_commands.d.ts`), commandType);
    fs.writeFileSync(path.resolve(distDir, `${key}_version.js`), generateVersion(currentConfig));
    fs.writeFileSync(path.resolve(distDir, `${key}_version.d.ts`), generateVersionType(currentConfig));
  }

  console.log(`build config: ${file}`);
  console.log('');
}

function loadConfig(configPath) {
  return YAML.parse(fs.readFileSync(configPath, 'UTF-8'), { merge: true });
}
