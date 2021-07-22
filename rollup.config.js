import path from 'path';
import glob from 'glob';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import applyTemplate from './extensions/rollup/rollup-apply-template';

const targetJsList = [
  glob.sync(path.join(__dirname, 'src', 'codes', '*', 'DarkPlasma*.js')),
  glob.sync(path.join(__dirname, 'src', 'excludes', '*', 'DarkPlasma*.js')),
  glob.sync(path.join(__dirname, 'src', 'tests', '*', `DarkPlasma*_Test.js`)),
].flat();

const config = targetJsList.map((input) => {
  const name = path.basename(input, '.js');
  const dir = path.dirname(input).split('/').slice(-2)[0];
  return {
    input,
    output: {
      file: `_dist/${dir}/${name}.js`,
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
