const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const mkdirp = require('mkdirp');
const { generateHeader } = require('./generateHeader');
const { generateParameterReader, generateParameterReaderFunction } = require('./generateParameterReader');
const { generatePluginCommand } = require('./generatePluginCommand');

async function generateFromConfig(file) {
  const config = loadConfig(file);
  const distDir = path.resolve(file, '..', '_build');
  mkdirp.sync(distDir);

  for (let key of Object.keys(config)) {
    const currentConfig = config[key];
    fs.writeFileSync(path.resolve(distDir, `${key}_header.js`), generateHeader(currentConfig));
    if (!key.endsWith('_Test')) {
      const parameterReader = await generateParameterReader(currentConfig);
      fs.writeFileSync(path.resolve(distDir, `${key}_parameters.js`), parameterReader);
      const parameterReaderFunction = await generateParameterReaderFunction(currentConfig);
      fs.writeFileSync(path.resolve(distDir, `${key}_parametersOf.js`), parameterReaderFunction);
      const pluginCommands = await generatePluginCommand(currentConfig);
      fs.writeFileSync(path.resolve(distDir, `${key}_commands.js`), pluginCommands);
      /**
       * テストプラグインがいる場合、パラメータをコピーする
       */
      const testDir = path.resolve(file, '..', '..', '..', 'tests', `${key.slice(key.indexOf('_') + 1)}_Test`);
      const testDistDir = path.resolve(testDir, '_build');
      if (fs.existsSync(testDir)) {
        const testConfig = loadConfig(path.resolve(testDir, 'config.yml'))[`${key}_Test`];
        const testParameterReader = await generateParameterReader(currentConfig, true, testConfig);
        mkdirp.sync(testDistDir);
        fs.writeFileSync(path.resolve(testDistDir, `${key}_Test_parameters.js`), testParameterReader);
      }
    }
  }

  console.log(`build config: ${file}`);
  console.log('');
}

function loadConfig(configPath) {
  return YAML.parse(fs.readFileSync(configPath, 'UTF-8'), { merge: true });
}

module.exports = {
  generateFromConfig,
};
