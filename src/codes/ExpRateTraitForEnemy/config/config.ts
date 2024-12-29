import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/12/29",
    version: "1.0.0",
    description: "公開",
  }
];

export const config = new ConfigDefinitionBuilder(
  "ExpRateTraitForEnemy",
  2024,
  "敵キャラ用 経験値倍率特徴"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueTraitId",
    version: "1.0.2",
  })
  .withHelp(dedent`敵キャラ用の経験値倍率特徴を設定します。
    
    この特徴を持つ敵キャラは倒された場合に
    自身の経験値を倍率にしたがって変動させます。
    
    <expRateForEnemy:150>
    例えば、こう記述すると経験値が1.5倍になります。
    
    戦闘不能になっても解除されないステートにこの特徴を追加して、
    付加されている間に倒すと経験値が増加するステートを作成できます。`)
  .build();
