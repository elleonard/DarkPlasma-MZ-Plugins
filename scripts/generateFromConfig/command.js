const path = require('path');
const glob = require('glob');
const chokidar = require('chokidar');

const { generateFromConfig } = require('./generateFromConfig');

const globPaths = [
  path.resolve(__dirname, '..', '..', 'src', 'codes', '**', 'config.yml'),
  path.resolve(__dirname, '..', '..', 'src', 'excludes', '**', 'config.yml'),
];
const isWatch = process.argv.some((n) => n === '-w');

(async () => {
  if (isWatch) {
    globPaths.forEach(globPath => {
      const watcher = chokidar.watch(globPath);
      watcher.on('add', (file) => generateFromConfig(file));
      watcher.on('change', (file) => generateFromConfig(file));
    });
  } else {
    const list = globPaths.map(globPath => glob.sync(globPath)).flat();
    for (let file of list) {
      try {
        await generateFromConfig(file);
      } catch (e) {
        console.error(`[ERROR] ${file}`);
        console.error(e);
        console.error('');
      }
    }
  }
})();
