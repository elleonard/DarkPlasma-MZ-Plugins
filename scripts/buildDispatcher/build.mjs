// 引数
// target: 対象となるプラグイン名
// js: true or false
// exclude: true or false
// configOnly: true or false
// noFinalize: true or false

import * as fs from 'fs';

const target = argv.target;
const pluginTitle = target.split("/").slice(-1)[0];
const path = argv.exclude ? `./src/excludes/${target}` : `./src/codes/${target}`;

let tsPath = path;
let configPath = path;
/**
 * build config
 */
if (fs.existsSync(`${path}/config/config.ts`)) {
  tsPath = `${tsPath}/plugin`;
  configPath = `${configPath}/config`;
  await $`yarn ts-node --esm ./scripts/generateFromTypeScript/index.ts -f ${target} ${argv.exclude ? "-e" : ""}`;
} else {
  await $`yarn node ./scripts/generateFromConfig -f ${target} ${argv.exclude ? "-e" : ""}`;
}

/**
 * compile typescript
 */
if (!argv.js) {
  await $`yarn tsc --declaration --allowJs --emitDeclarationOnly ${configPath}/_build/DarkPlasma_${pluginTitle}_parametersOf.js`;
  if (!argv.configOnly) {
    fs.copyFileSync('./tsconfig-for-plugin.json', `${path}/tsconfig.json`);
    await $`yarn tsc -b ${tsPath}`;
    await $`yarn prettier ${tsPath}/DarkPlasma_${pluginTitle}.js`
  }
}

/**
 * rollup
 */
if (!argv.configOnly) {
  await $`yarn rollup -c  --environment TARGET:${target} ${argv.exclude ? "-e" : ""}`;
  if (!argv.noFinalize) {
    await $`yarn build:format`;
    await $`yarn build:copy`;
  }
}
