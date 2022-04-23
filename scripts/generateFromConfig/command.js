const path = require('path');
const glob = require('glob');
const chokidar = require('chokidar');

const { generateFromConfig } = require('./generateFromConfig');

const globPaths = [
  path.resolve(__dirname, '..', '..', 'src', 'codes', '**', 'config.yml'),
  path.resolve(__dirname, '..', '..', 'src', 'excludes', '**', 'config.yml'),
  path.resolve(__dirname, '..', '..', 'src', 'tests', '**', 'config.yml'),
];
const isWatch = process.argv.some((n) => n === '-w');
const targetDir = (() => {
  const index = process.argv.findIndex((n) => n === '-f');
  const dir = process.argv.some((n) => n === '-e') ? 'excludes' : 'codes';
  return index >= 0 ? path.resolve(__dirname, '..', '..', 'src', dir, process.argv[index + 1], 'config.yml') : null;
})();

async function generate(file) {
  try {
    await generateFromConfig(file);
  } catch (e) {
    console.error(`[ERROR] ${file}`);
    console.error(e);
    console.error('');
    process.exit(1);
  }
}

(async () => {
  if (isWatch) {
    globPaths.forEach((globPath) => {
      const watcher = chokidar.watch(globPath);
      watcher.on('add', (file) => generateFromConfig(file));
      watcher.on('change', (file) => generateFromConfig(file));
    });
  } else {
    if (targetDir) {
      await generate(targetDir);
    } else {
      const list = globPaths.map((globPath) => glob.sync(globPath)).flat();
      for (let file of list) {
        await generate(file);
      }
    }
  }
})();
