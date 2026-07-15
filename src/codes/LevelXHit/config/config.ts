import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/07/15",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "LevelXHit",
  2026,
  "レベルが特定数値の倍数の対象にのみ必中する命中タイプ"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueHitType",
    version: "1.0.0",
  })
  .withHelp(dedent`スキル・アイテムの命中タイプに
    レベルが特定の数値の倍数の対象にのみ必中 を追加します。

    対象スキル・アイテムのメモ欄に以下のように記述します。
    <levelXHit:3>
    レベルが3の倍数の対象に必中し、
    それ以外の対象には命中しない命中タイプになります。
    
    この命中タイプは、対象がレベルを持たない場合には命中しません。
    敵キャラは本来レベルを持ちませんが、
    敵キャラにレベルを持たせるプラグインを使うことで
    敵キャラに対しても有効にすることができます。`)
  .build();
