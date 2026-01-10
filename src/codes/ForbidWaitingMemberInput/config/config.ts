import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/01/10",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "ForbidWaitingMemberInput",
  2026,
  "待機メンバーの行動入力を禁止する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`待機メンバーの行動入力を禁止します。`)
  .build();
