// 引数
// target: 対象となるプラグイン名
// ts: true or false
// exclude: true or false
// configOnly: true or false
// noFinalize: true or false

const target = argv.target;
const path = argv.exclude ? `./src/excludes/${target}` : `./src/codes/${target}`;

await $`yarn node ./scripts/generateFromConfig -f ${target} ${argv.exclude ? "-e" : ""}`;
if (!argv.js) {
  //await $`yarn tsc --declaration --allowJs --emitDeclarationOnly ${path}/_build/DarkPlasma_${target}_parameters.js`;
  await $`yarn tsc --declaration --allowJs --emitDeclarationOnly ${path}/_build/DarkPlasma_${target}_parametersOf.js`;
  await $`yarn tsc --declaration --allowJs --emitDeclarationOnly ${path}/_build/DarkPlasma_${target}_commands.js`;
  if (!argv.configOnly) {
    fs.copyFileSync('./tsconfig_template.json', `${path}/tsconfig.json`);
    await $`yarn tsc -b ${path}`;
    await $`yarn prettier ${path}/DarkPlasma_${target}.js`
  }
}

if (!argv.configOnly) {
  await $`yarn rollup -c  --environment TARGET:${target} ${argv.exclude ? "-e" : ""}`;
  if (!argv.noFinalize) {
    await $`yarn build:format`;
    await $`yarn build:copy`;
  }
}
