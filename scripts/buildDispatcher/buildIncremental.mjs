await $`git fetch origin release`;

/**
 * releaseブランチの最新コミットのコメントから、最後にビルドされたmasterのコミットIDを取得する
 */
const lastBuildCommit = await $`git log --first-parent origin/release --pretty=oneline -n 1`;

/**
 * 差分検出
 */
const diffFiles = await $`git --no-pager diff ${lastBuildCommit.stdout.trim().split(" ")[1]} HEAD --name-only`;

/**
 * ひとまず、インクリメンタルビルドはcodesのみ対象とする
 */
const configBuildTargets = await glob('./src/codes/*');
const configPaths = await Promise.all(configBuildTargets
  .filter(target => fs.existsSync(`./src/codes/${target}/DarkPlasma_${target}.ts`))
  .map(target => {
    return [
      glob(`./src/codes/${target}/_build/*_commands.js`),
      glob(`./src/codes/${target}/_build/*_parameters.js`),
      glob(`./src/codes/${target}/_build/*_parametersOf.js`),
    ];
  }).flat());

await Promise
  .all(configPaths.map(globPath => {
    return $`yarn tsc --declaration --allowJs --emitDeclarationOnly ${globPath}`;
  }));


const buildTargets = [...new Set(diffFiles.stdout.split('\n')
  .filter(path => path.startsWith("src/codes"))
  .map(path => /^src\/codes\/(.+)\/.*/.exec(path)[1]))];
for (let target of buildTargets) {
  const targetPath = `./src/codes/${target}`;
  if (fs.existsSync(`./${targetPath}/DarkPlasma_${target}.ts`)) {
    fs.copyFileSync('./tsconfig_template.json', `${targetPath}/tsconfig.json`);
    await $`yarn tsc -b ${targetPath}`;
    await $`yarn prettier ${targetPath}/DarkPlasma_${target}.js`;
  }
  await $`yarn rollup -c  --environment TARGET:${target} ${argv.exclude ? "-e" : ""}`;
  await $`yarn build:format`;
  await $`yarn build:copy`;
};
