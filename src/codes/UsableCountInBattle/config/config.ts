import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/09/17",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "UsableCountInBattle",
  2025,
  "戦闘中一定回数のみ使えるスキル/アイテム"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`戦闘中に一定回数のみ使えるスキル/アイテムを実現します。

      <usableCountInBattle:1>
      とメモ欄に記述すると、そのスキルやアイテムは
      戦闘中に1回までしか使えなくなります。

      <usableCountInBattle:v[1]>
      のように、回数を変数で指定できます。`)
  .build();
