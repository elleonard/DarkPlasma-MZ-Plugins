import * as fs from 'fs';
import * as path from 'path';
import * as chokidar from 'chokidar';
import * as YAML from 'yaml';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const srcPluginDirsRelative = fs.readdirSync(path.join(__dirname, '..', '..', '_dist'));
console.log(srcPluginDirsRelative);
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
      if (isWatch) {
        srcPluginDirsRelative.forEach((dir) => {
          const srcDir = path.join(__dirname, '..', '..', '_dist', dir);
          const distDir = dir === 'codes' || dir === 'excludes'
            ? path.join(projectDir, 'js', 'plugins')
            : path.join(projectDir, 'js', 'plugins', dir);
          fs.mkdirSync(distDir, { recursive: true });
          const copy = (from) => {
            const pluginName = path.basename(from);
            const to = path.join(distDir, pluginName);
            fs.copyFileSync(from, to);
            console.log(`copy plugin ${pluginName} to ${projectDir} done.`);
          };
          chokidar.watch(srcDir.replaceAll('\\', '/'), { ignoreInitial: true })
            .on('add', copy)
            .on('change', copy);
        });
      } else {
        srcPluginDirsRelative.forEach((dir) => {
          const srcPlugins = path.join(__dirname, '..', '..', '_dist', dir, 'DarkPlasma_*.js');
          const distDir = dir === 'codes' || dir === 'excludes'
            ? path.join(projectDir, 'js', 'plugins')
            : path.join(projectDir, 'js', 'plugins', dir);
          fs.mkdirSync(distDir, { recursive: true });
          fs.glob(srcPlugins, (err, matches) => {
            if (err) {
              throw err;
            }
            matches.forEach(src => fs.copyFileSync(src, path.join(distDir, path.basename(src))));
          });
        });
        console.log(`copy plugins to ${projectDir} done.`);
      }
    } catch (e) {
      console.error(e);
    }
  });
