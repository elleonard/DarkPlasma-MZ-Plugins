/*const globPaths = [
  path.resolve(__dirname, '..', '..', 'src', 'codes', '**', '_build', '*'),
  path.resolve(__dirname, '..', '..', 'src', 'excludes', '**', '_build', '*'),
];*/
const globPaths = [
  await glob('./src/**/_build/*_commands.js'),
  await glob('./src/**/_build/*_parameters.js'),
  await glob('./src/**/_build/*_parametersOf.js'),
].flat();


await Promise
  .all(globPaths.map(globPath => {
    return $`yarn tsc --declaration --allowJs --emitDeclarationOnly ${globPath}`;
  }));

//await $`yarn tsc --declaration --allowJs --emitDeclarationOnly ${await glob('./src/**/_build/*.js')}`