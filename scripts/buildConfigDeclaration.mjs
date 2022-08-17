await $`git fetch origin release`;

/**
 * releaseブランチの最新コミットのコメントから、最後にビルドされたmasterのコミットIDを取得する
 */
const lastBuildCommit = await $`git log --first-parent origin/release --pretty=oneline -n 1 | awk \"{print $2}\"`;

/**
 * 差分検出
 */
const diffFiles = await $`git --no-pager diff ${lastBuildCommit.stdout.trim()} HEAD --name-only`;

/**
 * ひとまず、全ビルドはcodesのみ対象とする
 */
const buildTargets = [...new Set(diffFiles.stdout.split('\n')
  .filter(path => path.startsWith("src/codes"))
  .map(path => /^src\/codes\/(.+)\/.*/.exec(path)[1]))];

const globPaths = await Promise.all(buildTargets.map(target => {
  return [
    glob(`./src/codes/${target}/_build/*_commands.js`),
    glob(`./src/codes/${target}/_build/*_parameters.js`),
    glob(`./src/codes/${target}/_build/*_parametersOf.js`),
  ];
}).flat());

await Promise
  .all(globPaths.map(globPath => {
    return $`yarn tsc --declaration --allowJs --emitDeclarationOnly ${globPath}`;
  }));
