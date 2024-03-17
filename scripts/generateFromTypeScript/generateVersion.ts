import { PluginConfigSchema } from "../../modules/config/configSchema";

export function generateVersion(config: PluginConfigSchema) {
  return `export const versionOf${config.name} = '${config.histories.find(history => history.version)?.version}'`
}

export function generateVersionType(config: PluginConfigSchema) {
  return `export const versionOf${config.name}: string;`;
}
