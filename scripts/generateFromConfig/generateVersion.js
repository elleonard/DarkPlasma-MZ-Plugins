export function generateVersion(config) {
  return `export const versionOf${config.name} = '${config.histories[0].version}'`;
}

export function generateVersionType(config) {
  return `export const versionOf${config.name}: string;`;
}
