import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/",
    version: "1.0.0",
    description: "",
  }
];

export const config = new ConfigDefinitionBuilder(
  "DevidePartyScene",
  2025,
  "パーティ分割シーン"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withDraft(true)
  .withBaseDependency({
    name: "DarkPlasma_ConcurrentParty",
    version: "1.0.0",
  })
  .withHelp(dedent`パーティを分割するシーンを提供します。`)
  .build();
