const codePath = path.resolve(__dirname, '..', 'src', 'codes').replaceAll('\\', '/');
const targets = await glob([`${codePath}/`]);

/**
 * ひとまず、全ビルドはcodesのみ対象とする
 */
const buildTargets = [...new Set(targets
  .filter(path => path.includes("src/codes"))
  .map(path => /src\/codes\/(.+)\/.*/.exec(path)[1]))];

const globPaths = await Promise.all(buildTargets
  .filter(target => fs.existsSync(`${codePath}/${target}/DarkPlasma_${target}.ts`))
  .map(target => {
    const targetPath = `${codePath}/${target}`;
    return [
      glob(`${targetPath}/_build/*_commands.js`),
      glob(`${targetPath}/_build/*_parameters.js`),
      glob(`${targetPath}/_build/*_parametersOf.js`),
    ];
  }).flat());

await Promise
  .all(globPaths.map(globPath => {
    /**
     * zxは:を含む文字列を展開する際に $'文字列' としてくるため、
     * 配列で渡して結合する
     */
    return $([`yarn tsc --declaration --allowJs --emitDeclarationOnly`, ` ${globPath[0]}`], '');
  }));
