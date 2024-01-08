import fs from 'fs';

import { generateConfig } from './generateConfig.js';

export async function generateDirectory(destDir: string) {
  fs.mkdir(`${destDir}/config`, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Directory created.: ${destDir}/config`);
    fs.mkdir(`${destDir}/plugin`, (err) => {
      if (err) {
        throw err;
      }
      console.log(`Directory created.: ${destDir}/plugin`);
      generateConfig(destDir);
    });
  });
}
