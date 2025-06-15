import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createBooleanParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/",
    version: "1.0.0",
    description: "",
  }
];

const parameters: PluginParameterSchema[] = [
  createBooleanParam("showHelpWindow", {
    text: "ヘルプウィンドウを表示",
    default: true,
  }),
];

export const config = new ConfigDefinitionBuilder(
  "DevidePartyScene",
  2025,
  "パーティ分割シーン"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withBaseDependency({
    name: "DarkPlasma_ConcurrentParty",
    version: "1.0.0",
  })
  .withHelp(dedent`パーティを分割するシーンを提供します。`)
  .build();
