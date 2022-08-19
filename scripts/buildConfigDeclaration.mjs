const targets = await glob(["./src/codes"]);
/**
 * ひとまず、全ビルドはcodesのみ対象とする
 */
const buildTargets = [...new Set(targets
  .filter(path => path.startsWith("src/codes"))
  .map(path => /^src\/codes\/(.+)\/.*/.exec(path)[1]))];

const globPaths = await Promise.all(buildTargets
  .filter(target => fs.existsSync(`./src/codes/${target}/DarkPlasma_${target}.ts`))
  .map(target => {
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
