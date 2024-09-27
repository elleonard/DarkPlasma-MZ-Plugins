const pluginName = argv._[0];
const exclude = argv._.length > 0 && argv._.includes('e');
await $`yarn node --no-warnings=ExperimentalWarning --loader ts-node/esm ./scripts/generateTemplate/index.ts ${pluginName} ${exclude ? "e" : ""}`
