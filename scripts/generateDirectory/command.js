const path = require('path');
const glob = require('glob');

const { generateDirectory } = require('./generateDirectory');

const directoryPath = path.resolve(__dirname, '..', '..', 'src', process.argv[3] === 'e' ? 'excludes' : 'codes', process.argv[2]);

(async () => {
  try {
    await generateDirectory(directoryPath);
  } catch (e) {
    console.error(`[ERROR] ${directoryPath}`);
    console.error(e);
    console.error('');
  }
})();
