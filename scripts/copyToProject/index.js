const fs = require('fs');
const path = require('path');
const cpx = require('cpx');
const YAML = require('yaml');

const srcPluginDirs = fs.readdirSync(path.join(__dirname, '..', '..', '_dist'))
  .map(dir => path.join(__dirname, '..', '..', '_dist', dir, 'DarkPlasma_*.js'));
console.log(srcPluginDirs);
const isWatch = process.argv.some((n) => n === '-w');

function loadConfig(configPath) {
  return YAML.parse(fs.readFileSync(configPath, 'UTF-8'), { merge: true });
}

const configFilePath = path.resolve(__dirname, 'config.yml');
if (!fs.existsSync(configFilePath)) {
  const sampleFilePath = path.resolve(__dirname, 'config_sample.yml');
  fs.copyFileSync(sampleFilePath, configFilePath);
  console.log(`generate config from sample.`);
}
const config = loadConfig(configFilePath);
config.projectDirs
  .filter((dir) => fs.existsSync(dir))
  .map((projectDir) => path.resolve(projectDir))
  .forEach((projectDir) => {
    try {
      const distDir = path.join(projectDir, 'js', 'plugins');
      if (isWatch) {
        srcPluginDirs.forEach((srcPlugins) => cpx.watch(srcPlugins, distDir));
      } else {
        srcPluginDirs.forEach((srcPlugins) => cpx.copy(srcPlugins, distDir));
        console.log(`copy plugins to ${projectDir} done.`);
      }
    } catch (e) {
      console.error(e);
    }
  });
