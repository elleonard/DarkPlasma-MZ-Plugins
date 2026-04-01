import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/04/02",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "FitBattlebackToScreen",
  2026,
  "戦闘背景を画面の大きさに合わせる"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`戦闘背景を画面の大きさに合わせて拡大します。`)
  .build();
