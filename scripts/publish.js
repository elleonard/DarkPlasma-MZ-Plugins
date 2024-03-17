import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetDir = process.argv[process.argv.length - 1];
if (!targetDir) process.exit(1);
if (!fs.statSync(targetDir).isDirectory()) {
  console.error(`${targetDir} is not directory`);
  process.exit(1);
}

globSync(path.join(__dirname, '..', '_dist', 'codes', '*.js')).forEach((file) => {
  const name = path.basename(file);

  console.log(`${file} to ${targetDir}`);

  fs.copyFileSync(file, path.join(targetDir, name));
});

/**
 * ちょっと雑な対応だが、消したいファイルをここに書いてコミットすると消せる
 */
const removeFiles = [];
removeFiles.forEach(file => {
  fs.unlink(path.join(targetDir, file), err => {
    if (err) {
      console.log(`${file} not found.`);
    } else {
      console.log(`delete ${file}.`);
    }
  });
});
