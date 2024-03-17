import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import applyTemplate from './extensions/rollup/rollup-apply-template';

const targetJsList = (() => {
  const targetFile = (() => {
    const plugin = process.env.TARGET;
    const dir = process.argv.some((n) => n === '-e') ? 'excludes' : 'codes';
    const versionIndex = process.argv.findIndex(n => n === '-V');
    const versionDir = versionIndex >= 0 ? `/v${process.argv[versionIndex+1]}` : "";
    const configTsPath = path.join(__dirname, 'src', dir, `${plugin}${versionDir}`, 'config', 'config.ts');
    const pluginDir = fs.existsSync(configTsPath) ? '/plugin' : '';
    return plugin
      ? globSync(path.join(__dirname, 'src', dir, `${plugin}${versionDir}${pluginDir}`, 'DarkPlasma*.js').replace(/\\/g, "/"))
      : null;
  })();
  return targetFile
    ? [targetFile].flat()
    : [
        globSync(path.join(__dirname, 'src', 'codes', '*', 'DarkPlasma*.js')),
        globSync(path.join(__dirname, 'src', 'codes', '*', 'config', 'DarkPlasma*.js')),
        globSync(path.join(__dirname, 'src', 'excludes', '*', 'DarkPlasma*.js')),
      ].flat();
})();

const config = targetJsList.map((input) => {
  const name = path.basename(input, '.js');
  /**
   * src/codes/プラグイン名 -> _dist/codes
   * src/excludes/プラグイン名/(DarkPlasma_*.js|plugin/DarkPlasma_*.js) -> _dist/excludes
   * src/excludes/(グループ名)/プラグイン名/(DarkPlasma_*.js|plugin/DarkPlasma_*.js) -> _dist/(グループ名)
   */
  const inputDirName = path.dirname(input).replace(/\//g, "/");
  const dir = (() => {
    if (/\/src\/codes/.test(inputDirName)) {
      return "codes";
    }
    const match = /\/src\/excludes\/(.+?)\/(.+)(\/plugin)?/.exec(inputDirName);
    if (match) {
      return match[1];
    }
    return "excludes";
  })();
  const versionIndex = process.argv.findIndex(n => n === '-V');
  const versionDir = versionIndex >= 0 ? `/v${process.argv[versionIndex+1]}` : "";
  return {
    input,
    output: {
      file: `_dist/${dir}${versionDir}/${name}.js`,
      format: 'iife',
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      applyTemplate({
        template: path.resolve(__dirname, 'src', 'templates', 'plugin.ejs'),
      }),
    ],
    external: ['fs'],
  };
});

export default config;
