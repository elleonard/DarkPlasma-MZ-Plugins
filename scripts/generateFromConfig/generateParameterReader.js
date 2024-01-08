import path from 'path';
import prettier from 'prettier';
import { fileURLToPath } from 'url';
import { generateParser } from './generateParser.js';
import { SYMBOL_TYPE } from './parameterSymbolType.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const prettierConfig = path.resolve(__dirname, '..', '..', '.prettierrc');
const pluginParametersDir = path.resolve(__dirname, '..', '..', 'src', 'common', 'pluginParameters');
const pluginParametersOfDir = path.resolve(__dirname, '..', '..', 'src', 'common', 'pluginParametersOf');

export async function generateParameterReader(config, destDir) {
  const parameters = configToParameters(config, SYMBOL_TYPE.PLUGIN_PARAMETERS);

  return prettier.resolveConfig(prettierConfig).then((options) => {
    options.parser = 'babel';

    const pluginParameterPath = path.relative(destDir, pluginParametersDir).replaceAll('\\', '/');
    const code = `import { pluginParameters } from '${pluginParameterPath}';
    
    export const settings = {
      ${parameters.map((parameter) => `${parameter.name}: ${parameter.parser}`).join(',\n')}
    };
    `;

    return prettier.format(code, options).then(r => escapeBackslashQuote(r));
  });
}

export async function generateParameterReaderFunction(config, destDir) {
  const parameters = configToParameters(config, SYMBOL_TYPE.PLUGIN_PARAMETERS_OF);

  return prettier.resolveConfig(prettierConfig).then((options) => {
    options.parser = 'babel';

    const code = `import { pluginParametersOf } from '${path.relative(destDir, pluginParametersOfDir).replaceAll('\\', '/')}';

    export const settingsOf${config.name.replace(/^DarkPlasma_/, "")} = ((pluginName) => {
      return {
        ${parameters.map((parameter) => `${parameter.name}: ${parameter.parser}`).join(',\n')}
      };
    })("${config.name}");
    `;

    return prettier.format(code, options).then(r => escapeBackslashQuote(r));
  });
}

function configToParameters(config, symbolType) {
  return config && config.parameters
    ? config.parameters
        .filter((parameter) => !parameter.dummy)
        .map((parameter) => {
          return {
            name: parameter.param,
            parser: generateParser(config, parameter, symbolType),
          };
        })
    : [];
}

/**
 * prettierが勝手にバックスラッシュを消してしまうため、苦肉の策として
 */
function escapeBackslashQuote(string) {
  return string.replace(/\\"/g, '\\\\"');
}
