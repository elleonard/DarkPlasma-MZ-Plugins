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
const codePath = path.resolve(__dirname, '..', '..', 'src', 'codes').replaceAll('\\', '/');
const configTargets = await glob([`${codePath}/`]);
const configBuildTargets = [...new Set(configTargets
  .filter(path => /src\/codes\/.+\/config\.yml$/.test(path))
  .map(path => /src\/codes\/(.+)\/config\.yml$/.exec(path)[1]))];

const configPaths = await Promise.all(configBuildTargets
  .filter(target => fs.existsSync(`${codePath}/${target}/DarkPlasma_${target}.ts`))
  .map(target => {
    return [
      glob(`${codePath}/${target}/_build/*_commands.js`),
      //glob(`${codePath}/${target}/_build/*_parameters.js`),
      glob(`${codePath}/${target}/_build/*_parametersOf.js`),
    ];
  }).flat());

/**
 * 負荷対策でチャンクに分割して実行する
 */
let sliceOffset = 0;
const chunkSize = 50;
let chunk = configPaths.slice(sliceOffset, chunkSize);
await $`echo "build config target:${configPaths.length} chunk size:${chunkSize}"`
while(chunk.length > 0) {
  await Promise
    .all(chunk.map(globPath => {
      return $([`yarn tsc --declaration --allowJs --emitDeclarationOnly`, ` ${globPath}`], '');
    }));
  sliceOffset += chunkSize;
  chunk = configPaths.slice(sliceOffset, chunkSize + sliceOffset);
};

const buildTargets = [...new Set(diffFiles.stdout.split('\n')
  .filter(path => path.startsWith("src/codes"))
  .map(path => /^src\/codes\/(.+)\/.*/.exec(path)[1]))];

for (let target of buildTargets) {
  const targetPath = `${codePath}/${target}`;
  if (fs.existsSync(`${targetPath}/DarkPlasma_${target}.ts`)) {
    fs.copyFileSync('./tsconfig_template.json', `${targetPath}/tsconfig.json`);
    await $([`yarn tsc -b`, ` ${targetPath}`], '');
    await $([`yarn prettier`, ` ${targetPath}/DarkPlasma_${target}.js`], '');
  }
  await $`yarn rollup -c  --environment TARGET:${target} ${argv.exclude ? "-e" : ""}`;
  await $`yarn build:format`;
  await $`yarn build:copy`;
};
