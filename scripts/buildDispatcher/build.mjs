// 引数
// target: 対象となるプラグイン名
// js: true or false
// exclude: true or false
// configOnly: true or false
// noFinalize: true or false

import * as fs from 'fs';
import { globSync } from 'glob';

/**
 * 共通ファイルのbuild
 */
await $`yarn tsc -b ./src/common`;

const target = argv.target;
if (!target) {
  const prefix = argv.exclude ? "src/excludes" : "src/codes";
  const targets = (argv.exclude ? globSync(`./src/excludes/**/DarkPlasma_*.ts`) : globSync(`./src/codes/**/DarkPlasma_*.ts`))
    .filter(path => !path.includes("_build"))
    .map(path => {
      path = path.replace(/\\/g, "/");
      console.log(path);
      const match = new RegExp(`${prefix}/(.+)/DarkPlasma_.+\.ts`).exec(path);
      if (!match) {
        return "";
      }
      return match[1].replace(/\/plugin/,"");
    });
  console.log(targets);
  await Promise.all(
    targets.map(target => $([`yarn build:config --target`, ` ${target}${argv.exclude ? " --exclude" : ""}`], ''))
  );
  process.exit(0);
}

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
  await $`yarn tsx ./scripts/generateFromTypeScript/index.ts -f ${target} ${argv.exclude ? "-e" : ""}`;
} else {
  await $`yarn node ./scripts/generateFromConfig -f ${target} ${argv.exclude ? "-e" : ""}`;
}

/**
 * compile typescript
 */
if (!argv.js) {
  //await $`yarn tsc --declaration --allowJs --emitDeclarationOnly ${configPath}/_build/DarkPlasma_${pluginTitle}_parametersOf.js`;
  if (!argv.configOnly) {
    fs.copyFileSync('./tsconfig-for-plugin.json', `${tsPath}/tsconfig.json`);
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
