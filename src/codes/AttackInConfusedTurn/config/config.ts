import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/08/05",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "AttackInConfusedTurn",
  2026,
  "混乱系ステートを付加されたターンにも攻撃する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`バトラーが混乱系のステート（敵を攻撃、誰かを攻撃、味方を攻撃）を
    付加されたターンにも攻撃するようになります。`)
  .build();
