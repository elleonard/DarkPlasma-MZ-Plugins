import path from 'path';
import { fileURLToPath } from 'url';

import { generateDirectory } from './generateDirectory.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const codeType = (() => {
  switch (process.argv[3]) {
    case 'e':
      return 'excludes';
    default:
      return 'codes';
  }
})();
const directoryPath = path.resolve(__dirname, '..', '..', 'src', codeType, process.argv[2]);

(async () => {
  try {
    await generateDirectory(directoryPath);
  } catch (e) {
    console.error(`[ERROR] ${directoryPath}`);
    console.error(e);
    console.error('');
  }
})();
