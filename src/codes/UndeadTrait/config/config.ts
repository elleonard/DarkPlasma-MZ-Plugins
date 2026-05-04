import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/05/04",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "UndeadTrait",
  2026,
  "回復・即死を反転する特徴"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueTraitDataId",
    version: "1.0.2",
    order: 'after',
  })
  .withHelp(dedent`各種回復や即死を反転する特徴特殊フラグを提供します。
    
    <reverseHpRecover>
    得られるHP回復をダメージに変換します。
    以下が反転の対象です。
    - ダメージタイプ「HP回復」による回復
    - 使用効果「HP回復」による回復
    - ターン終了時の「HP再生率」による回復・ダメージ
    
    <reverseMpRecover>
    得られるMP回復をMPダメージに変換します。
    以下が反転の対象です。
    - ダメージタイプ「MP回復」による回復
    - 使用効果「MP回復」による回復
    - ターン終了時の「MP再生率」による回復・ダメージ

    <reverseHpDrain>
    ダメージタイプ「HP吸収」を受ける際の回復・ダメージを反転します。

    <reverseMpDrain>
    ダメージタイプ「MP吸収」を受ける際の回復・ダメージを反転します。
    
    <reverseDeathState>
    戦闘不能を直接付加される場合、
    戦闘不能にならずにHPを全回復します。
    
    <antiReverse>
    この行動は、反転特徴を無視します。`)
  .build();
