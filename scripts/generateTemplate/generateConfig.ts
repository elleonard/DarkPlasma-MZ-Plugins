import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import * as ejs from 'ejs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const templatePath = path.resolve(__dirname, '..', '..', 'src', 'templates', 'configTs.ejs');
const tsconfigTemplatePath = path.resolve(__dirname, '..', '..', 'tsconfig_template.json');

export async function generateConfig(destDir: string) {
  console.log(destDir);
  fs.open(path.resolve(destDir, 'config', 'config.ts'), 'wx', (err, fd) => {
    if (err) {
      if (err.code === 'EEXIST') {
        console.error('plugin already exists!');
        return;
      }
      throw err;
    }
    ejs.renderFile(
      templatePath,
      {
        pluginName: `${path.basename(destDir)}`,
        license: /excludes/.test(destDir) ? 'No License' : 'MIT',
        year: new Date().getFullYear(),
      },
      {},
      (err, str) => {
        if (err) {
          throw err;
        } else {
          fs.write(fd, str, null, 'utf-8', (err) => {
            if (err) {
              throw err;
            } else {
              console.log(`generate config file done.: ${destDir}${path.sep}config${path.sep}config.ts`);
            }
          });
        }
      }
    );
    const pluginDir = path.resolve(destDir, 'plugin');
    const declarationFile = path.resolve(destDir, 'plugin', `${path.basename(destDir)}.d.ts`);
    fse.ensureFile(declarationFile, (err) => {
      if (err) console.error(`generate declaration failed.`);
      fse.appendFile(declarationFile, `/// <reference path="${pathToTypings(pluginDir)}/rmmz.d.ts" />`);
    });
    const tsFile = path.resolve(destDir, 'plugin', `DarkPlasma_${path.basename(destDir)}.ts`);
    fse.ensureFile(tsFile, (err) => {
      if (err) console.error(`generate ts failed.`);
      fse.appendFile(tsFile, `/// <reference path="./${path.basename(destDir)}.d.ts" />`);
    });
    fs.copyFileSync(tsconfigTemplatePath, `${destDir}/plugin/tsconfig.json`);
  });
}

const typingsPath = path.resolve(__dirname, '..', '..', 'src', 'typings');

function pathToTypings(destDir: string) {
  return `${path.relative(destDir, typingsPath)}`.replaceAll('\\', '/');
}
