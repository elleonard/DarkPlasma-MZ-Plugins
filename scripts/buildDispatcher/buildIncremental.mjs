await $`git fetch origin release`;

/**
 * releaseブランチの最新コミットのコメントから、最後にビルドされたmasterのコミットIDを取得する
 */
const commitId = await (async () => {
  let result = '';
  let head = 'origin/release';
  while(!/^[0-9a-z]+$/.test(result)) {
    const commit = await $`git log --first-parent ${head} --pretty=oneline -n 1`;
    result = commit.stdout.trim().split(" ")[1];
    head+='~';
  }
  return result;
})();

/**
 * 差分検出
 * @type string[]
 */
const diffFiles = await $`git --no-pager diff ${commitId} HEAD --name-only`;

/**
 * ひとまず、インクリメンタルビルドはcodesのみ対象とする
 */
const codePath = path.resolve(__dirname, '..', '..', 'src', 'codes').replaceAll('\\', '/');

/**
 * @type string[]
 */
const buildTargets = [...new Set(diffFiles.stdout.split('\n')
  .filter(path => path.startsWith("src/codes") && fs.existsSync(path))
  .map(path => /^src\/codes\/([^\/]+)\/.*/.exec(path)[1]))];

/**
 * _parametersOf.js の型定義を作る
 */
{
  /**
   * @type string[]
   */
  const configPaths = await Promise.all(buildTargets
    .filter(target => fs.existsSync(`${codePath}/${target}/DarkPlasma_${target}.ts`))
    .map(target => {
      return glob(`${codePath}/${target}/_build/*_parametersOf.js`);
    }).concat(
      buildTargets
        .filter(target => fs.existsSync(`${codePath}/${target}/config/config.ts`))
        .map(target => {
          return glob(`${codePath}/${target}/config/_build/*_parametersOf.js`);
        })
    ).flat());

  /**
   * 負荷対策でチャンクに分割して実行する
   */
  let sliceOffset = 0;
  const chunkSize = 50;
  let chunk = configPaths.slice(sliceOffset, chunkSize);
  await $`echo "build config target:${configPaths.length} chunk size:${chunkSize}"`
  while (chunk.length > 0) {
    await Promise
      .all(chunk.map(globPath => {
        console.log(`target config:${globPath}`);
        return $([`yarn tsc --declaration --allowJs --emitDeclarationOnly`, ` ${globPath}`], '');
      }));
    sliceOffset += chunkSize;
    chunk = configPaths.slice(sliceOffset, chunkSize + sliceOffset);
  };
}

for (let target of buildTargets) {
  const targetPath = (() => {
    if (fs.existsSync(`${codePath}/${target}/DarkPlasma_${target}.ts`)) {
      return `${codePath}/${target}`;
    } else if (fs.existsSync(`${codePath}/${target}/plugin/DarkPlasma_${target}.ts`)) {
      return `${codePath}/${target}/plugin`;
    }
    return undefined;
  })();
  if (targetPath) {
    fs.copyFileSync('./tsconfig-for-plugin.json', `${targetPath}/tsconfig.json`);
    await $([`yarn tsc -b`, ` ${targetPath}`], '');
    await $([`yarn prettier`, ` ${targetPath}/DarkPlasma_${target}.js`], '');
  }
  await $`yarn rollup -c  --environment TARGET:${target} ${argv.exclude ? "-e" : ""}`;
};

if (buildTargets.length > 0) {
  await $`yarn build:format`;
  await $`yarn build:copy`;
}
