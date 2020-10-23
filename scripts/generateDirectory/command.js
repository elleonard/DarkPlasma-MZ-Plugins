const path = require('path');
const glob = require('glob');

const { generateDirectory } = require('./generateDirectory');

const codeType = (() => {
  switch (process.argv[3]) {
    case 'e':
      return 'excludes';
    case 't':
      return 'tests';
    default:
      return 'codes';
  }
})();
const directoryPath = path.resolve(__dirname, '..', '..', 'src', codeType, process.argv[2]);
const testDirectoryPath = path.resolve(__dirname, '..', '..', 'src', 'tests', `${process.argv[2]}_Test`);

(async () => {
  try {
    await generateDirectory(directoryPath);
    if (codeType === 'codes') {
      await generateDirectory(testDirectoryPath);
    }
  } catch (e) {
    console.error(`[ERROR] ${directoryPath}`);
    console.error(e);
    console.error('');
  }
})();
