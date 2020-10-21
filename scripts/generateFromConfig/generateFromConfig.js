const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const mkdirp = require('mkdirp');
const { generateHeader } = require('./generateHeader');
const { generateParameterReader } = require('./generateParameterReader');

async function generateFromConfig(file) {
  const config = loadConfig(file);
  const distDir = path.resolve(file, '..', '_build');
  mkdirp.sync(distDir);

  for (let key of Object.keys(config)) {
    const currentConfig = config[key];
    fs.writeFileSync(path.resolve(distDir, `${key}_header.js`), generateHeader(currentConfig));
    if (!key.endsWith('_Test')) {
      const parameterReader = await generateParameterReader(currentConfig);
      const testParameterReader = await generateParameterReader(currentConfig, true);
      fs.writeFileSync(path.resolve(distDir, `${key}_parameters.js`), parameterReader);
      /**
       * テストプラグインがいる場合、パラメータをコピーする
       */
      const testDir = path.resolve(file, '..', '..', '..', 'tests', `${key.slice(key.indexOf('_') + 1)}_Test`);
      const testDistDir = path.resolve(testDir, '_build');
      if (fs.existsSync(testDir)) {
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
