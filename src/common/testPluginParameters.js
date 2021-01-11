import { pluginName } from './pluginName';
import { targetPluginName } from './targetPluginName';

export const pluginParameters = PluginManager.parameters(targetPluginName);
export const testPluginParameters = PluginManager.parameters(pluginName);
