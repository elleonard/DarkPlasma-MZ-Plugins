const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');

const templatePath = path.resolve(__dirname, '..', '..', 'src', 'templates', 'config.ejs');

async function generateConfig(destDir) {
  fs.open(path.resolve(destDir, 'config.yml'), 'wx', (err, fd) => {
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
        pluginName: `DarkPlasma_${path.basename(destDir)}`,
        license: /excludes/.test(destDir) ? 'No License' : 'MIT',
        year: new Date().getFullYear(),
      },
      {},
      (err, str) => {
        if (err) {
          throw err;
        } else {
          fs.write(fd, str, 'utf-8', (err) => {
            if (err) {
              throw err;
            } else {
              console.log(`generate config file done.: ${destDir}${path.sep}config.yml`);
            }
          });
        }
      }
    );
    fs.ensureFile(path.resolve(destDir, `DarkPlasma_${path.basename(destDir)}.js`));
  });
}

module.exports = {
  generateConfig,
};
