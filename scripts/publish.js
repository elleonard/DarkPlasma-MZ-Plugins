const fs = require('fs');
const path = require('path');
const glob = require('glob');

const targetDir = process.argv[process.argv.length - 1];
if (!targetDir) process.exit(1);
if (!fs.statSync(targetDir).isDirectory()) {
  console.error(`${targetDir} is not directory`);
  process.exit(1);
}

glob.sync(path.join(__dirname, '..', '_dist', 'codes', '*.js')).forEach((file) => {
  const name = path.basename(file);

  console.log(`${file} to ${targetDir}`);

  fs.copyFileSync(file, path.join(targetDir, name));
});
