import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/07/26",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "HealOnBattleStartTrait",
  2025,
  "戦闘開始時に回復する特徴"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueTraitId",
    version: "1.0.2",
    order: 'after',
  })
  .withHelp(dedent`戦闘開始時に回復する特徴を設定できます。
    
    <healHpOnBattleStart:x>
    戦闘開始時にHPをx％回復する

    <healMpOnBattleStart:x>
    戦闘開始時にMPをx％回復する

    <healTpOnBattleStart:x>
    戦闘開始時にTPをx％回復する
    
    これらの特徴を複数所持する場合、効果値は加算されます。`)
  .build();
