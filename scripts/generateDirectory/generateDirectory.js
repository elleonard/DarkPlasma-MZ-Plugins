const fs = require('fs');
const path = require('path');

const { generateConfig } = require('../generateConfig/generateConfig');

async function generateDirectory(destDir) {
  fs.mkdir(destDir, { recursive: true }, err => {
    if (err) {
      throw err;
    }
    console.log(`Directory created.: ${destDir}`);
    generateConfig(destDir);
  });
}

module.exports = {
  generateDirectory,
};
